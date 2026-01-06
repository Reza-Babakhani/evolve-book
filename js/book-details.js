// Book Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadBookDetails();
});

function loadBookDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'));
    
    if (!bookId) {
        window.location.href = 'index.html';
        return;
    }
    
    const book = CONFIG.books.find(b => b.id === bookId);
    if (!book) {
        window.location.href = 'index.html';
        return;
    }
    
    window.currentBook = book;
    
    // Update title
    document.getElementById('bookTitle').textContent = book.name;
    
    // Update breadcrumb
    document.getElementById('breadcrumbBookName').textContent = book.name;
    
    // Load PDFs
    loadPDFs(book);
    
    // Load Audio and Video sections
    loadAudioSection(book);
    loadVideoSection(book);
}

function loadPDFs(book) {
    const container = document.getElementById('booksSection');
    const pdfs = [
        { title: "Student's Book", icon: "bi-book", url: `${book.baseUrl}/Student's Book.pdf` },
        { title: "Teacher's Edition", icon: "bi-mortarboard", url: `${book.baseUrl}/Teacher's Edition.pdf` },
        { title: "Workbook", icon: "bi-journal-text", url: `${book.baseUrl}/Workbook.pdf` },
        { title: "Video Resource Book", icon: "bi-camera-video", url: `${book.baseUrl}/Video Resource Book.pdf` }
    ];
    
    container.innerHTML = '';
    pdfs.forEach(pdf => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-3';
        
        const pdfCard = document.createElement('div');
        pdfCard.className = 'pdf-card';
        pdfCard.onclick = () => openPDF(pdf.url, pdf.title);
        
        pdfCard.innerHTML = `
            <div class="glass-card">
                <div class="d-flex align-items-center p-3">
                    <i class="${pdf.icon} me-3 fs-3"></i>
                    <div class="media-title">${pdf.title}</div>
                    <i class="bi bi-arrow-right ms-auto"></i>
                </div>
            </div>
        `;
        
        col.appendChild(pdfCard);
        container.appendChild(col);
    });
}

function loadAudioSection(book) {
    const container = document.getElementById('audioSection');
    
    const audioTypes = [
        { title: 'Audio Files', icon: 'bi-music-note-beamed', color: '#3b82f6', path: '/Audio' },
        { title: 'Workbook Audio', icon: 'bi-headphones', color: '#10b981', path: '/Workbook Audio' }
    ];
    
    container.innerHTML = '';
    audioTypes.forEach(type => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6';
        
        const mediaCard = document.createElement('div');
        mediaCard.className = 'media-card';
        mediaCard.onclick = () => goToAudioList(book.id, type.title, `${book.baseUrl}${type.path}`);
        
        mediaCard.innerHTML = `
            <div class="glass-card">
                <div class="d-flex align-items-center p-3">
                    <i class="${type.icon} me-3 fs-3" style="color: ${type.color};"></i>
                    <div class="media-title">${type.title}</div>
                    <i class="bi bi-arrow-right ms-auto"></i>
                </div>
            </div>
        `;
        
        col.appendChild(mediaCard);
        container.appendChild(col);
    });
}

function loadVideoSection(book) {
    const container = document.getElementById('videoSection');
    
    const mediaCard = document.createElement('div');
    mediaCard.className = 'media-card';
    mediaCard.onclick = () => goToVideoList(book.id, `${book.baseUrl}/Video`);
    
    mediaCard.innerHTML = `
        <div class="glass-card">
            <div class="d-flex align-items-center p-3">
                <i class="bi bi-camera-video me-3 fs-3" style="color: #ef4444;"></i>
                <div class="media-title">Video Files</div>
                <i class="bi bi-arrow-right ms-auto"></i>
            </div>
        </div>
    `;
    
    container.appendChild(mediaCard);
}

function openPDF(url, title) {
    const bookId = window.currentBook ? window.currentBook.id : '';
    window.location.href = `pdf-viewer.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&bookId=${bookId}`;
}

function goToAudioList(bookId, title, baseUrl) {
    window.location.href = `audio-list.html?bookId=${bookId}&title=${encodeURIComponent(title)}&baseUrl=${encodeURIComponent(baseUrl)}`;
}

function goToVideoList(bookId, baseUrl) {
    window.location.href = `video-list.html?bookId=${bookId}&baseUrl=${encodeURIComponent(baseUrl)}`;
}

