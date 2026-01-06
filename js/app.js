// Main Application JavaScript

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
	if (document.getElementById("booksGrid")) {
		loadBooks();
		// Show support popup on home page
		checkAndShowSupportPopup();
	}

	if (document.getElementById("bookDetails")) {
		loadBookDetails();
	}

	initializeAudioPlayer();
});

// Check and show support popup (once per week)
function checkAndShowSupportPopup() {
	const lastShown = localStorage.getItem("supportPopupLastShown");
	const now = new Date().getTime();
	const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

	// Show popup if never shown or if a week has passed
	if (!lastShown || now - parseInt(lastShown) >= oneWeek) {
		// Small delay to ensure page is fully loaded
		setTimeout(() => {
			const modal = new bootstrap.Modal(
				document.getElementById("supportModal")
			);
			modal.show();
			// Update last shown time
			localStorage.setItem("supportPopupLastShown", now.toString());
		}, 1000);
	}
}

// Load books on home page
function loadBooks() {
	const grid = document.getElementById("booksGrid");
	if (!grid) return;

	grid.innerHTML =
		'<div class="col-12"><div class="loading-spinner"><div class="spinner-border text-light" role="status"></div></div></div>';

	setTimeout(() => {
		grid.innerHTML = "";
		CONFIG.books.forEach((book) => {
			const col = document.createElement("div");
			col.className = "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2";

			const bookCard = document.createElement("div");
			bookCard.className = "book-card";
			bookCard.onclick = () => goToBookDetails(book.id);

			bookCard.innerHTML = `
                <div class="glass-card">
                    <img src="${book.coverUrl}" alt="${book.name}" class="book-cover" 
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpath fill=%22%23fff%22 d=%22M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z%22/%3E%3C/svg%3E'">
                    <div class="book-title">${book.name}</div>
                </div>
            `;

			col.appendChild(bookCard);
			grid.appendChild(col);
		});

		// Show download app button after books are loaded
		const downloadSection = document.getElementById("downloadAppSection");
		if (downloadSection) {
			downloadSection.style.display = "block";
		}
	}, 500);
}

// Navigate to book details
function goToBookDetails(bookId) {
	window.location.href = `book-details.html?id=${bookId}`;
}

// Load book details page
function loadBookDetails() {
	const urlParams = new URLSearchParams(window.location.search);
	const bookId = parseInt(urlParams.get("id"));

	if (!bookId) {
		window.location.href = "index.html";
		return;
	}

	const book = CONFIG.books.find((b) => b.id === bookId);
	if (!book) {
		window.location.href = "index.html";
		return;
	}

	// Update page title
	document.querySelector("h1").textContent = book.name;

	// Set book data for other functions
	window.currentBook = book;
}

// Store audio files globally for filtering
let allAudioFiles = [];

// Load audio list
async function loadAudioList() {
	const container = document.getElementById("audioList");
	if (!container || !window.currentBook) return;

	container.innerHTML =
		'<div class="loading-spinner"><div class="spinner-border text-light" role="status"></div></div>';

	try {
		const baseUrl = window.currentBook.baseUrl;
		const files = await fetchMediaFiles(baseUrl, [".mp3"]);

		// Store files globally
		allAudioFiles = files;

		if (files.length === 0) {
			container.innerHTML =
				'<div class="empty-state"><i class="bi bi-music-note"></i><p>No audio files found</p></div>';
			return;
		}

		// Render files
		renderAudioList(files);
	} catch (error) {
		container.innerHTML = `<div class="error-message">Error loading audio files: ${error.message}</div>`;
	}
}

// Render audio list
function renderAudioList(files) {
	const container = document.getElementById("audioList");
	if (!container) return;

	if (files.length === 0) {
		container.innerHTML =
			'<div class="empty-state"><i class="bi bi-music-note"></i><p>No audio files found</p></div>';
		return;
	}

	container.innerHTML = "";
	files.forEach((file, index) => {
		const item = document.createElement("div");
		item.className = "audio-item glass-card p-3 mb-3";
		item.onclick = () => playAudio(file.url, file.name);

		item.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-music-note-beamed me-3 fs-4"></i>
                <div class="flex-grow-1">
                    <div class="text-white fw-medium">${file.name}</div>
                </div>
                <i class="bi bi-play-circle fs-4"></i>
            </div>
        `;

		container.appendChild(item);
	});
}

// Filter audio list
function filterAudioList() {
	const searchInput = document.getElementById("audioSearchInput");

	const searchTerm = searchInput.value.toLowerCase().trim();

	if (searchTerm === "") {
		renderAudioList(allAudioFiles);
		return;
	}

	const filtered = allAudioFiles.filter((file) =>
		file.name.toLowerCase().includes(searchTerm)
	);

	renderAudioList(filtered);
}

// Store video files globally for filtering
let allVideoFiles = {
	regular: [],
	documentary: [],
};

// Load video list
async function loadVideoList() {
	const container = document.getElementById("videoList");
	if (!container || !window.currentBook) return;

	container.innerHTML =
		'<div class="loading-spinner"><div class="spinner-border text-light" role="status"></div></div>';

	try {
		const baseUrl = window.currentBook.baseUrl;
		const files = await fetchMediaFiles(baseUrl, [".mp4", ".webm"]);

		// Filter out Documentary folder files
		const regularVideos = files.filter(
			(f) => !f.url.includes("/Documentary/")
		);

		// Get Documentary files separately
		const docFiles = await fetchMediaFiles(baseUrl + "/Documentary", [
			".mp4",
			".webm",
		]);

		// Store files globally
		allVideoFiles.regular = regularVideos;
		allVideoFiles.documentary = docFiles;

		// Render videos
		renderVideoList(regularVideos, docFiles);
	} catch (error) {
		container.innerHTML = `<div class="error-message">Error loading video files: ${error.message}</div>`;
	}
}

// Render video list
function renderVideoList(regularVideos, docFiles) {
	const container = document.getElementById("videoList");
	if (!container) return;

	container.innerHTML = "";

	// Documentary section
	if (docFiles.length > 0) {
		const docSection = document.createElement("div");
		docSection.className = "mb-5";
		docSection.innerHTML = `
            <h3 class="section-title">Documentary</h3>
            <div class="row g-4" id="documentaryVideos"></div>
        `;
		container.appendChild(docSection);

		const docGrid = document.getElementById("documentaryVideos");
		docFiles.forEach((file) => {
			const col = createVideoCard(file);
			docGrid.appendChild(col);
		});
	}

	// Regular videos section
	if (regularVideos.length > 0) {
		const videoSection = document.createElement("div");
		videoSection.innerHTML = `
            <h3 class="section-title">Videos</h3>
            <div class="row g-4" id="regularVideos"></div>
        `;
		container.appendChild(videoSection);

		const videoGrid = document.getElementById("regularVideos");
		regularVideos.forEach((file) => {
			const col = createVideoCard(file);
			videoGrid.appendChild(col);
		});
	}

	if (regularVideos.length === 0 && docFiles.length === 0) {
		container.innerHTML =
			'<div class="empty-state"><i class="bi bi-camera-video"></i><p>No video files found</p></div>';
	}
}

// Filter video list
function filterVideoList() {
	const searchInput = document.getElementById("videoSearchInput");

	const searchTerm = searchInput.value.toLowerCase().trim();

	if (searchTerm === "") {
		renderVideoList(allVideoFiles.regular, allVideoFiles.documentary);
		return;
	}

	const filteredRegular = allVideoFiles.regular.filter((file) =>
		file.name.toLowerCase().includes(searchTerm)
	);

	const filteredDoc = allVideoFiles.documentary.filter((file) =>
		file.name.toLowerCase().includes(searchTerm)
	);

	renderVideoList(filteredRegular, filteredDoc);
}

// Create video card
function createVideoCard(file) {
	const col = document.createElement("div");
	col.className = "col-12 col-md-6 col-lg-4";

	const videoItem = document.createElement("div");
	videoItem.className = "video-grid-item";
	videoItem.onclick = () => playVideo(file.url, file.name);

	const cardDiv = document.createElement("div");
	cardDiv.className = "glass-card";

	// Thumbnail container with relative positioning
	const thumbContainer = document.createElement("div");
	thumbContainer.className = "video-thumbnail-container";

	// Fallback icon container (always shown to avoid downloading video)
	const fallbackDiv = document.createElement("div");
	fallbackDiv.className = "video-thumbnail-fallback";
	fallbackDiv.style.cssText =
		"position: absolute; top: 0; left: 0; width: 100%; height: 100%; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.05); display: flex;";
	fallbackDiv.innerHTML =
		'<i class="bi bi-camera-video fs-1" style="color: rgba(0, 0, 0, 0.3);"></i>';

	// Play button overlay
	const playOverlay = document.createElement("div");
	playOverlay.className = "video-play-overlay";
	playOverlay.innerHTML = '<i class="bi bi-play-circle-fill"></i>';

	// Note: We don't generate thumbnails from video to avoid downloading full videos
	// If thumbnail images are available separately, they can be added here
	// For now, we only show the fallback icon

	thumbContainer.appendChild(fallbackDiv);
	thumbContainer.appendChild(playOverlay);

	// Video title
	const titleDiv = document.createElement("div");
	titleDiv.className = "p-3";
	titleDiv.innerHTML = `<div class="text-white fw-medium">${file.name}</div>`;

	cardDiv.appendChild(thumbContainer);
	cardDiv.appendChild(titleDiv);
	videoItem.appendChild(cardDiv);
	col.appendChild(videoItem);

	return col;
}

// Helper function to normalize URL and avoid duplication
function normalizeUrl(baseUrl, href) {
	// Remove trailing slash from baseUrl
	const cleanBaseUrl = baseUrl.replace(/\/$/, "");

	// If href starts with /, it's absolute - use it as is (relative to domain root)
	if (href.startsWith("/")) {
		// Extract domain from baseUrl
		const urlObj = new URL(baseUrl);
		return `${urlObj.origin}${href}`;
	}

	// If href starts with http, it's a full URL
	if (href.startsWith("http://") || href.startsWith("https://")) {
		return href;
	}

	// Relative URL - clean it up
	let cleanHref = href.replace(/^\.\//, "").replace(/^\.\.\//, "");

	// Get the last part of baseUrl (folder name)
	const baseUrlParts = cleanBaseUrl.split("/");
	const lastPart = decodeURIComponent(baseUrlParts[baseUrlParts.length - 1]);

	// If href starts with the same folder name, remove it to avoid duplication
	// e.g., if baseUrl ends with "Audio" and href is "Audio/file.mp3", use "file.mp3"
	if (cleanHref.startsWith(lastPart + "/") || cleanHref === lastPart) {
		cleanHref = cleanHref.replace(
			new RegExp(
				"^" + lastPart.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/?"
			),
			""
		);
	}

	// Construct final URL
	return cleanHref ? `${cleanBaseUrl}/${cleanHref}` : cleanBaseUrl;
}

// Fetch media files from directory
async function fetchMediaFiles(baseUrl, extensions) {
	try {
		// Normalize baseUrl - remove trailing slash
		const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

		// Try to fetch files.txt first
		const filesTxtUrl = `${normalizedBaseUrl}/files.txt`;
		try {
			const response = await fetch(filesTxtUrl);
			if (response.ok) {
				const text = await response.text();
				const files = parseFilesTxt(
					text,
					normalizedBaseUrl,
					extensions
				);
				if (files.length > 0) return files;
			}
		} catch (e) {
			// Continue to HTML parsing
		}

		// Parse HTML directory listing
		const response = await fetch(normalizedBaseUrl);
		if (!response.ok) throw new Error("Failed to fetch directory");

		const html = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");

		const files = [];
		const links = doc.querySelectorAll("a[href]");

		links.forEach((link) => {
			const href = link.getAttribute("href");
			if (
				!href ||
				href === "../" ||
				href === "/" ||
				href.startsWith("../")
			)
				return;

			// Remove trailing slash for file name extraction
			const fileName = decodeURIComponent(href.replace(/\/$/, ""));
			const hasExtension = extensions.some((ext) =>
				fileName.toLowerCase().endsWith(ext)
			);

			if (hasExtension) {
				const fileUrl = normalizeUrl(normalizedBaseUrl, href);
				files.push({
					name: fileName,
					url: fileUrl,
				});
			}
		});

		return files.sort((a, b) => a.name.localeCompare(b.name));
	} catch (error) {
		console.error("Error fetching media files:", error);
		throw error;
	}
}

// Parse files.txt content
function parseFilesTxt(content, baseUrl, extensions) {
	const lines = content
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l);
	const files = [];

	// Normalize baseUrl - remove trailing slash
	const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

	lines.forEach((line) => {
		const fileName = line.trim();
		if (!fileName) return;

		const hasExtension = extensions.some((ext) =>
			fileName.toLowerCase().endsWith(ext)
		);
		if (hasExtension) {
			// Use normalizeUrl to avoid duplication if fileName contains path
			const fileUrl = normalizeUrl(normalizedBaseUrl, fileName);
			// Extract just the filename for display
			const displayName = fileName.split("/").pop();
			files.push({
				name: displayName,
				url: fileUrl,
			});
		}
	});

	return files;
}

// Audio Player
let currentAudio = null;
let audioPlayer = null;

function initializeAudioPlayer() {
	audioPlayer = new Audio();
	audioPlayer.addEventListener("timeupdate", updateAudioProgress);
	audioPlayer.addEventListener("loadedmetadata", () => {
		updateAudioDuration();
	});
	audioPlayer.addEventListener("ended", () => {
		resetAudioPlayer();
	});

	document
		.getElementById("audioPlayPause")
		?.addEventListener("click", toggleAudioPlayPause);
	document
		.getElementById("audioClose")
		?.addEventListener("click", closeAudioPlayer);
}

function playAudio(url, title) {
	if (currentAudio && currentAudio.url === url) {
		toggleAudioPlayPause();
		return;
	}

	currentAudio = { url, title };
	audioPlayer.src = url;
	audioPlayer.load();

	document.getElementById("audioTitle").textContent = title;
	document.getElementById("audioPlayerContainer").classList.remove("d-none");

	audioPlayer
		.play()
		.then(() => {
			// Change icon to pause when audio starts playing
			document.querySelector("#audioPlayPause i").className =
				"bi bi-pause-fill fs-4";
		})
		.catch((err) => {
			console.error("Error playing audio:", err);
		});
}

function toggleAudioPlayPause() {
	if (audioPlayer.paused) {
		audioPlayer.play();
		document.querySelector("#audioPlayPause i").className =
			"bi bi-pause-fill fs-4";
	} else {
		audioPlayer.pause();
		document.querySelector("#audioPlayPause i").className =
			"bi bi-play-fill fs-4";
	}
}

function updateAudioProgress() {
	if (!audioPlayer.duration) return;

	const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
	document.getElementById("audioProgress").style.width = `${progress}%`;
	document.getElementById("audioCurrentTime").textContent = formatTime(
		audioPlayer.currentTime
	);
}

function updateAudioDuration() {
	document.getElementById("audioDuration").textContent = formatTime(
		audioPlayer.duration
	);
}

function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function resetAudioPlayer() {
	audioPlayer.pause();
	audioPlayer.currentTime = 0;
	document.querySelector("#audioPlayPause i").className =
		"bi bi-play-fill fs-4";
}

function closeAudioPlayer() {
	resetAudioPlayer();
	document.getElementById("audioPlayerContainer").classList.add("d-none");
	currentAudio = null;
}

// Video Player
function playVideo(url, title) {
	const urlParams = new URLSearchParams(window.location.search);
	const bookId = urlParams.get('bookId') || (window.currentBook ? window.currentBook.id : '');
	const bookIdParam = bookId ? `&bookId=${bookId}` : '';
	window.location.href = `video-player.html?url=${encodeURIComponent(
		url
	)}&title=${encodeURIComponent(title)}${bookIdParam}`;
}
