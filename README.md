# Evolve Books Website

A modern, responsive web application built with pure HTML, CSS, JavaScript, and Bootstrap. Features a glassy, modern design with minimal styling.

## Features

- **Home Page**: Grid display of all Evolve books with cover images
- **Book Details**: Access to PDFs, Audio files, and Video files for each book
- **Audio Player**: Built-in audio player with progress tracking
- **Video Player**: HTML5 video player for video files
- **PDF Viewer**: Embedded PDF viewer for book PDFs
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Glassy Modern UI**: Beautiful glassmorphism design with smooth animations

## File Structure

```
website/
├── index.html              # Home page with book grid
├── book-details.html       # Book details page
├── audio-list.html         # Audio files list page
├── video-list.html         # Video files list page
├── video-player.html       # Video player page
├── pdf-viewer.html         # PDF viewer page
├── css/
│   └── style.css          # Main stylesheet with glassy design
├── js/
│   ├── config.js          # Configuration and book data
│   ├── app.js             # Main application logic
│   └── book-details.js    # Book details page logic
└── README.md              # This file
```

## Usage

1. Open `index.html` in a web browser
2. Click on any book to view its details
3. Access PDFs, Audio files, and Videos from the book details page
4. Use the audio player to play audio files
5. Watch videos in the video player
6. View PDFs in the embedded PDF viewer

## Configuration

Edit `js/config.js` to:
- Change the base storage URL
- Add or modify book information
- Update book cover URLs

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling with glassmorphism effects
- **JavaScript (ES6+)**: Functionality
- **Bootstrap 5.3.2**: Responsive grid and components
- **Bootstrap Icons**: Icon library

## Design Features

- Glassmorphism UI with backdrop blur effects
- Smooth animations and transitions
- Gradient backgrounds
- Responsive grid layouts
- Modern color scheme
- Minimal and clean interface

## Notes

- The application fetches media files from the configured storage URL
- It attempts to read `files.txt` first, then falls back to HTML directory parsing
- Audio player is fixed at the bottom of the page when playing
- All pages are responsive and work on various screen sizes

