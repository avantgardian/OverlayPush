# OverlayPush

A web application for capturing and displaying media through OBS, supporting images, GIFs, videos, audio, and YouTube videos.

## Features

- Real-time media display through WebSocket communication
- Support for multiple media types:
  - Images (JPG, PNG)
  - GIFs
  - Videos (MP4, WebM)
  - Audio (MP3, WAV)
  - YouTube videos (regular and shorts)
- Customizable display duration for each media type
- Smooth fade in/out transitions
- Automatic aspect ratio handling:
  - YouTube shorts display in 9:16 vertical format
  - Regular YouTube videos display in 16:9 horizontal format
  - Other media maintains original aspect ratio
- File upload support with automatic cleanup
- Modern, responsive design

## Setup

1. Clone the repository:
```bash
git clone https://github.com/avantgardian/OverlayPush.git
cd OverlayPush
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open the following URLs in your browser:
   - Control Panel: `http://localhost:3000/control.html`
   - Capture Page: `http://localhost:3000/`

5. In OBS:
   - Add a new Browser Source
   - Set the URL to `http://localhost:3000/`
   - Set the width and height to match your desired display size
   - Enable "Control audio via OBS" if you want to control audio through OBS

## Usage

### Control Panel
- Use the file input to select media files
- Enter a custom duration (in seconds) for the media display
- Click "Show Media" to display the selected media
- Click "Clear" to remove the current media

### Supported Media Types
- Images: JPG, PNG
- GIFs: Animated GIFs with customizable duration
- Videos: MP4, WebM (plays for video length or specified duration)
- Audio: MP3, WAV (plays for audio length or specified duration)
- YouTube Videos:
  - Regular videos (16:9 aspect ratio)
  - Shorts (9:16 aspect ratio)
  - Supports both `youtube.com/watch?v=...` and `youtube.com/shorts/...` URLs

### Default Durations
- GIFs: 10 seconds (customizable)
- Videos: Full video length (customizable)
- Audio: Full audio length (customizable)
- YouTube Shorts: 60 seconds (customizable)

## Technical Details

- Built with Node.js and Express
- Uses WebSocket for real-time communication
- Implements proper file cleanup for uploaded media
- Handles media aspect ratios automatically
- Supports smooth fade transitions for all media types

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 