const mediaContainer = document.getElementById('media-container');
let ws = null;
let currentAudio = null;
let clearTimeout = null;

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

function showMedia(url, duration) {
    clearMedia();
    const mediaElement = document.createElement(url.endsWith('.gif') ? 'img' : 'video');
    
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
    
    mediaContainer.appendChild(mediaElement);
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
    if (clearTimeout) {
        clearTimeout(clearTimeout);
    }
    clearTimeout = setTimeout(() => {
        fadeOutAndClear();
    }, duration - 500); // Start fade out 500ms before clearing
}

function fadeOutAndClear() {
    const mediaElements = mediaContainer.querySelectorAll('img, video');
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
    if (clearTimeout) {
        clearTimeout(clearTimeout);
        clearTimeout = null;
    }
}

// Connect to WebSocket server when page loads
connectWebSocket(); 