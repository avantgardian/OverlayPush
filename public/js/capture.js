const mediaContainer = document.getElementById('media-container');
let ws = null;
let currentAudio = null;

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
            showMedia(data.url);
            break;
        case 'audio':
            playAudio(data.url);
            break;
        case 'clear':
            clearAll();
            break;
    }
}

function showMedia(url) {
    clearMedia();
    const mediaElement = document.createElement(url.endsWith('.gif') ? 'img' : 'video');
    mediaElement.src = url;
    
    if (mediaElement.tagName === 'VIDEO') {
        mediaElement.autoplay = true;
        mediaElement.loop = true;
        mediaElement.muted = true;
    }
    
    mediaContainer.appendChild(mediaElement);
}

function playAudio(url) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    currentAudio = new Audio(url);
    currentAudio.play();
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
}

// Connect to WebSocket server when page loads
connectWebSocket(); 