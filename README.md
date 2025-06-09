# Overlay Push

A web application that allows you to trigger media events (GIFs, videos, sounds) on a blank page that can be captured in OBS.

## Project Structure

```
overlay-push/
├── public/           # Client-side files
│   ├── js/          # JavaScript files
│   │   ├── capture.js
│   │   └── control.js
│   ├── index.html   # Blank page for OBS capture
│   └── control.html # Control panel
├── src/             # Server-side code
│   └── server.js    # WebSocket server
├── package.json
└── README.md
```

## Setup

1. Install Node.js if you haven't already (https://nodejs.org/)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Usage

1. Open `http://localhost:3000` in your browser - this is the blank page you'll capture in OBS
2. Open `http://localhost:3000/control.html` in another browser window - this is your control panel
3. In OBS, add a new Browser Source and set the URL to `http://localhost:3000`
4. Use the control panel to:
   - Enter URLs for GIFs or videos to display
   - Enter URLs for audio to play
   - Upload local media files
   - Clear all media from the display

## Features

- Real-time media triggering
- Support for GIFs, videos, and audio
- Local file upload support
- Automatic reconnection if connection is lost
- Clean, modern interface
- Transparent background for OBS capture

## Notes

- The blank page has a transparent background, making it perfect for OBS capture
- Videos are automatically muted and set to loop
- Audio can be played independently of visual media
- The control panel shows connection status
- All media is centered and scaled appropriately on the display page 