const mediaContainer = document.getElementById('media-container');
let ws = null;
let currentAudio = null;
let fadeTimeout = null;

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleMediaEvent(data);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
        setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function handleMediaEvent(data) {
    switch (data.type) {
        case 'media':
            showMedia(data.url, data.duration);
            break;
        case 'audio':
            playAudio(data.url, data.duration);
            break;
        case 'clear':
            clearAll();
            break;
    }
}

function getYouTubeEmbedUrl(url) {
    // Handle YouTube shorts
    if (url.includes('youtube.com/shorts/')) {
        const videoId = url.split('/shorts/')[1].split('?')[0];
        return {
            url: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=0&controls=0`,
            isShort: true
        };
    }
    // Handle regular YouTube videos
    else if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return {
            url: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=0&controls=0`,
            isShort: false
        };
    }
    return { url, isShort: false };
}

function showMedia(url, duration) {
    clearMedia();
    let mediaElement;

    if (url.includes('youtube.com')) {
        // Create iframe for YouTube videos
        mediaElement = document.createElement('iframe');
        const { url: embedUrl, isShort } = getYouTubeEmbedUrl(url);
        mediaElement.src = embedUrl;
        mediaElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        mediaElement.allowFullscreen = true;
        mediaElement.frameBorder = '0';
        
        // Add class based on video type
        if (isShort) {
            mediaElement.classList.add('youtube-short');
        } else {
            mediaElement.classList.add('youtube-video');
        }
        
        // YouTube videos typically have a fixed duration
        if (duration === 0) {
            // Default duration for YouTube videos (most shorts are around 30-60 seconds)
            setClearTimeout(60 * 1000);
        } else {
            setClearTimeout(duration * 1000);
        }
    } else {
        // Handle regular media files
        mediaElement = document.createElement(url.endsWith('.gif') ? 'img' : 'video');
        
        // Set up load event before setting src
        mediaElement.onload = () => {
            // Trigger fade in after the element is loaded
            requestAnimationFrame(() => {
                mediaElement.classList.add('fade-in');
            });
        };
        
        mediaElement.src = url;
        
        if (mediaElement.tagName === 'VIDEO') {
            mediaElement.autoplay = true;
            mediaElement.loop = false;
            mediaElement.muted = true;

            // If duration is 0, use video length
            if (duration === 0) {
                mediaElement.onloadedmetadata = () => {
                    setClearTimeout(mediaElement.duration * 1000);
                };
            } else {
                setClearTimeout(duration * 1000);
            }
        } else {
            // For GIFs, use specified duration or default to 10 seconds
            setClearTimeout((duration || 10) * 1000);
        }
    }
    
    mediaContainer.appendChild(mediaElement);
    
    // For YouTube videos, we need to trigger fade-in after a short delay
    if (url.includes('youtube.com')) {
        setTimeout(() => {
            mediaElement.classList.add('fade-in');
        }, 100);
    }
}

function playAudio(url, duration) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    currentAudio = new Audio(url);
    
    // If duration is 0, use audio length
    if (duration === 0) {
        currentAudio.onloadedmetadata = () => {
            setClearTimeout(currentAudio.duration * 1000);
        };
    } else {
        setClearTimeout(duration * 1000);
    }
    
    currentAudio.play();
}

function setClearTimeout(duration) {
    if (fadeTimeout) {
        clearTimeout(fadeTimeout);
    }
    fadeTimeout = setTimeout(() => {
        fadeOutAndClear();
    }, duration - 500); // Start fade out 500ms before clearing
}

function fadeOutAndClear() {
    const mediaElements = mediaContainer.querySelectorAll('img, video, iframe');
    mediaElements.forEach(element => {
        element.classList.remove('fade-in');
        element.classList.add('fade-out');
    });

    // Wait for fade out animation to complete before clearing
    setTimeout(clearAll, 500);
}

function clearMedia() {
    while (mediaContainer.firstChild) {
        mediaContainer.removeChild(mediaContainer.firstChild);
    }
}

function clearAll() {
    clearMedia();
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (fadeTimeout) {
        clearTimeout(fadeTimeout);
        fadeTimeout = null;
    }
}

// Connect to WebSocket server when page loads
connectWebSocket(); 