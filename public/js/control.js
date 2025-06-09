let ws = null;
const statusElement = document.getElementById('status');

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        statusElement.textContent = 'Connected';
        statusElement.className = 'status connected';
    };

    ws.onclose = () => {
        statusElement.textContent = 'Disconnected';
        statusElement.className = 'status disconnected';
        setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
    };
}

function sendMessage(type, url) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type, url }));
    } else {
        alert('Not connected to server. Please wait for connection.');
    }
}

function triggerMedia() {
    const url = document.getElementById('mediaUrl').value.trim();
    if (url) {
        sendMessage('media', url);
    } else {
        alert('Please enter a media URL');
    }
}

function triggerAudio() {
    const url = document.getElementById('audioUrl').value.trim();
    if (url) {
        sendMessage('audio', url);
    } else {
        alert('Please enter an audio URL');
    }
}

async function uploadAndTrigger() {
    const fileInput = document.getElementById('mediaFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64Data = e.target.result;
            
            // Upload file to server
            const response = await fetch('/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: base64Data,
                    type: file.type
                })
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const type = file.type.startsWith('audio/') ? 'audio' : 'media';
            sendMessage(type, data.url);
        };
        reader.readAsDataURL(file);
    } catch (error) {
        alert('Failed to upload file: ' + error.message);
    }
}

function clearMedia() {
    sendMessage('clear', null);
}

// Connect to WebSocket server when page loads
connectWebSocket(); 