# Spotify Clone

A responsive Spotify-inspired music player built with HTML, CSS, and vanilla JavaScript. The project plays local MP3 files, displays album artwork, and provides a modern playback interface.

## Features

- Responsive Spotify-style dark interface
- Local playlist with album covers
- Play, pause, previous, and next controls
- Shuffle mode
- Repeat off, repeat-all, and repeat-one modes
- Playback progress and duration display
- Volume slider
- Mute and unmute control with volume restoration
- Dynamic track duration loading from MP3 metadata
- Offline banner and online reconnection toast
- Visible audio loading and playback error messages
- Keyboard-friendly controls and accessible labels
- Custom favicon using the Spotify logo asset

## Preview

Add a screenshot of the application here:

```md
![Spotify Clone preview](screenshots/preview.png)
```

## Run locally

This project does not require a build tool or dependency installation.

1. Clone or download the repository.
2. Open `index.html` in a modern browser.
3. Select a track from the playlist or use the player controls.

For the most reliable local-audio behavior, serve the folder with a local web server:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Project structure

```text
Spotify-clone/
├── covers/                         # Album cover images
├── icons/                          # Player and network status icons
├── songs/                          # Local MP3 files
├── bg.jpg                          # Background asset
├── index.html                      # Application markup
├── script.js                       # Playlist and audio behavior
├── style.css                       # Responsive styling
├── logo.png                        # Brand logo and favicon
└── README.md
```

## Controls

| Control | Action |
| --- | --- |
| Play/Pause | Start or pause the current track |
| Previous | Go to the previous track |
| Next | Play the next track |
| Shuffle | Randomize the next track |
| Repeat | Cycle through off, repeat all, and repeat one |
| Progress bar | Seek within the current track |
| Volume slider | Adjust playback volume |
| Volume icon | Mute or restore the previous volume |

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Audio API
- Local MP3 and image assets

## Deploy to GitHub Pages

1. Push the project to a public GitHub repository.
2. Open the repository **Settings** page.
3. Select **Pages**.
4. Choose **Deploy from a branch**.
5. Select the main branch and the root folder.
6. Save the settings and wait for GitHub Pages to publish the site.

Because the project uses relative asset paths, keep the `songs`, `covers`, and `icons` folders in the same locations when deploying.

## Notes

- The music files are local assets and are not fetched from Spotify.
- Use only audio and image assets that you own or have permission to distribute in a public repository.
- The Login button is currently visual only and does not provide authentication.

## License

Add the license you want to use before publishing this project publicly. For example, you can add an `MIT` license file if you want others to reuse and modify the code.
