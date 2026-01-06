// PDF Viewer with PDF.js

let pdfDoc = null;
let baseScale = 1.0; // Base scale used for rendering
let zoomScale = 1.0; // Current zoom scale (applied via CSS transform)
let pagesContainer = null;
let initialDistance = 0;
let initialZoomScale = 1.0;

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Load PDF
function loadPDF() {
    const urlParams = new URLSearchParams(window.location.search);
    const pdfUrl = urlParams.get('url');
    const title = urlParams.get('title') || 'PDF Viewer';
    const bookId = urlParams.get('bookId');
    
    if (!pdfUrl) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('pdfTitle').textContent = title;
    document.title = title + ' - My Evolve';
    pagesContainer = document.getElementById('pdfPagesContainer');
    
    // Update breadcrumb
    if (bookId && typeof CONFIG !== 'undefined') {
        const book = CONFIG.books.find(b => b.id === parseInt(bookId));
        if (book) {
            const breadcrumbLink = document.getElementById('breadcrumbBookLink');
            const breadcrumbPdfName = document.getElementById('breadcrumbPdfName');
            if (breadcrumbLink) {
                breadcrumbLink.textContent = book.name;
                breadcrumbLink.href = `book-details.html?id=${book.id}`;
            }
            if (breadcrumbPdfName) {
                breadcrumbPdfName.textContent = title;
            }
        }
    } else {
        const breadcrumbPdfName = document.getElementById('breadcrumbPdfName');
        if (breadcrumbPdfName) {
            breadcrumbPdfName.textContent = title;
        }
    }
    
    // Show loading progress
    const loadingContainer = document.getElementById('pdfLoadingProgress');
    const progressBar = document.getElementById('pdfProgressBar');
    const loadingText = document.getElementById('pdfLoadingText');
    pagesContainer.style.display = 'none';
    loadingContainer.style.display = 'flex';
    loadingContainer.style.alignItems = 'center';
    loadingContainer.style.justifyContent = 'center';
    loadingContainer.style.minHeight = '400px';
    
    // Load PDF with progress tracking
    const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        verbosity: 0 // Suppress console messages
    });
    
    loadingTask.onProgress = function(progress) {
        if (progress.total > 0) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            progressBar.style.width = percent + '%';
            progressBar.textContent = percent + '%';
            loadingText.textContent = 'Loading PDF... ' + percent + '%';
        }
    };
    
    loadingTask.promise.then(function(pdf) {
        pdfDoc = pdf;
        const pageCount = pdf.numPages;
        document.getElementById('modalPageCount').textContent = pageCount;
        
        // Hide loading, show pages container
        loadingContainer.style.display = 'none';
        pagesContainer.style.display = 'block';
        
        // Initial zoom: fit to height on desktop, fit to width on mobile
        pdfDoc.getPage(1).then(function(page) {
            const container = document.getElementById('pdfCanvasContainer');
            const viewport = page.getViewport({ scale: 1.0 });
            
            // Check if mobile (screen width < 768px)
            const isMobile = window.innerWidth < 768;
            
            // Use setTimeout to ensure container dimensions are calculated
            setTimeout(function() {
                if (isMobile) {
                    // Mobile: fit to width
                    const containerWidth = container.clientWidth - 40;
                    if (containerWidth > 0) {
                        baseScale = containerWidth / viewport.width;
                    }
                } else {
                    // Desktop: fit to height (use window height minus navbar and padding)
                    const availableHeight = window.innerHeight - 100; // Account for navbar and padding
                    if (availableHeight > 0) {
                        baseScale = availableHeight / viewport.height;
                    }
                }
                
                // Reset zoom scale to 1.0 on initial load
                zoomScale = 1.0;
                renderAllPages();
            }, 100);
        });
    }).catch(function(error) {
        console.error('Error loading PDF:', error);
        loadingContainer.innerHTML = '<div class="error-message">Error loading PDF: ' + error.message + '</div>';
    });
}

// Render all pages
function renderAllPages(preserveScrollPosition = false) {
    const container = document.getElementById('pdfCanvasContainer');
    let savedScrollInfo = null;
    
    // If preserving scroll position, save current scroll info
    if (preserveScrollPosition && pagesContainer.children.length > 0) {
        const wrappers = pagesContainer.querySelectorAll('.pdf-page-wrapper');
        const currentScrollTop = container.scrollTop;
        
        // Find the page that contains the current scroll position
        let foundPage = null;
        let pageOffsetRatio = 0; // Ratio of offset to page height (0 to 1)
        
        // First, try to find page by scroll position
        for (let i = 0; i < wrappers.length; i++) {
            const wrapper = wrappers[i];
            const pageTop = wrapper.offsetTop;
            const pageHeight = wrapper.offsetHeight;
            const pageBottom = pageTop + pageHeight;
            
            if (currentScrollTop >= pageTop && currentScrollTop < pageBottom) {
                foundPage = parseInt(wrapper.dataset.pageNumber);
                if (!foundPage || isNaN(foundPage)) foundPage = i + 1;
                const offset = currentScrollTop - pageTop;
                pageOffsetRatio = pageHeight > 0 ? offset / pageHeight : 0;
                break;
            }
        }
        
        // If not found, find the first visible page
        if (!foundPage) {
            const containerRect = container.getBoundingClientRect();
            let maxVisible = 0;
            wrappers.forEach((wrapper) => {
                const rect = wrapper.getBoundingClientRect();
                const visibleTop = Math.max(rect.top, containerRect.top);
                const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                const visibleRatio = visibleHeight / rect.height;
                
                if (visibleRatio > maxVisible) {
                    maxVisible = visibleRatio;
                    foundPage = parseInt(wrapper.dataset.pageNumber);
                    if (!foundPage || isNaN(foundPage)) {
                        // Fallback: find by index
                        const index = Array.from(wrappers).indexOf(wrapper);
                        foundPage = index + 1;
                    }
                    const offset = container.scrollTop - wrapper.offsetTop;
                    pageOffsetRatio = wrapper.offsetHeight > 0 ? offset / wrapper.offsetHeight : 0;
                }
            });
        }
        
        if (foundPage) {
            savedScrollInfo = {
                page: foundPage,
                offsetRatio: Math.max(0, Math.min(1, pageOffsetRatio))
            };
        }
    }
    
    pagesContainer.innerHTML = '';
    
    // Render all pages sequentially - use Promise.all to ensure order
    const renderPromises = [];
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        renderPromises.push(
            new Promise((resolve) => {
                renderPage(pageNum, resolve);
            })
        );
    }
    
    // Wait for all pages to render, then restore scroll position
    Promise.all(renderPromises).then(() => {
        if (preserveScrollPosition && savedScrollInfo) {
            // Wait a bit more for layout to settle
            setTimeout(function() {
                const newWrappers = pagesContainer.querySelectorAll('.pdf-page-wrapper');
                // Find wrapper by page number, not index
                let targetWrapper = null;
                for (let i = 0; i < newWrappers.length; i++) {
                    const wrapper = newWrappers[i];
                    const pageNum = parseInt(wrapper.dataset.pageNumber);
                    if (pageNum === savedScrollInfo.page) {
                        targetWrapper = wrapper;
                        break;
                    }
                }
                
                // Fallback to index if page number not found
                if (!targetWrapper && newWrappers[savedScrollInfo.page - 1]) {
                    targetWrapper = newWrappers[savedScrollInfo.page - 1];
                }
                
                if (targetWrapper) {
                    // Calculate new scroll position based on saved offset ratio
                    const newPageHeight = targetWrapper.offsetHeight;
                    const newOffset = newPageHeight * savedScrollInfo.offsetRatio;
                    const newScrollTop = targetWrapper.offsetTop + newOffset;
                    container.scrollTop = Math.max(0, newScrollTop);
                }
            }, 150);
        }
    });
}

// Render a single page
function renderPage(pageNum, onComplete) {
    pdfDoc.getPage(pageNum).then(function(page) {
        const viewport = page.getViewport({ scale: baseScale });
        
        // Create wrapper div for the page
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'pdf-page-wrapper';
        pageWrapper.dataset.pageNumber = String(pageNum);
        // Set wrapper size based on canvas size and zoom scale
        pageWrapper.style.width = viewport.width + 'px';
        pageWrapper.style.height = (viewport.height * zoomScale) + 'px';
        pageWrapper.style.margin = '0 auto 20px auto';
        pageWrapper.style.display = 'flex';
        pageWrapper.style.justifyContent = 'center';
        pageWrapper.style.alignItems = 'flex-start';
        
        // Create canvas for this page
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.className = 'pdf-page-canvas';
        canvas.dataset.pageNumber = String(pageNum);
        canvas.style.cssText = 'display: block; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); background: #ffffff;';
        
        // Apply current zoom scale via CSS transform
        canvas.style.transform = `scale(${zoomScale})`;
        canvas.style.transformOrigin = 'top center';
        
        pageWrapper.appendChild(canvas);
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        renderTask.promise.then(function() {
            // Append wrapper to container in order
            pagesContainer.appendChild(pageWrapper);
            if (onComplete) onComplete();
        }).catch(function(error) {
            console.error('Error rendering page', pageNum, error);
            if (onComplete) onComplete();
        });
    }).catch(function(error) {
        console.error('Error loading page', pageNum, error);
        if (onComplete) onComplete();
    });
}

// Calculate distance between two touch points
function getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Update page wrapper sizes based on zoom scale
function updatePageWrapperSizes() {
    const wrappers = pagesContainer.querySelectorAll('.pdf-page-wrapper');
    wrappers.forEach(function(wrapper) {
        const canvas = wrapper.querySelector('.pdf-page-canvas');
        if (canvas) {
            const originalHeight = canvas.height;
            wrapper.style.height = (originalHeight * zoomScale) + 'px';
        }
    });
}

// Zoom in
function pdfZoomIn() {
    if (!pdfDoc || !pagesContainer) {
        console.warn('PDF not loaded yet');
        return;
    }
    
    const container = document.getElementById('pdfCanvasContainer');
    const canvases = pagesContainer.querySelectorAll('.pdf-page-canvas');
    
    if (canvases.length === 0) return;
    
    // Find the center point of the viewport
    const containerRect = container.getBoundingClientRect();
    const viewportCenterX = container.scrollLeft + containerRect.width / 2;
    const viewportCenterY = container.scrollTop + containerRect.height / 2;
    
    // Update zoom scale
    const oldZoomScale = zoomScale;
    zoomScale += 0.25;
    if (zoomScale > 3.0) zoomScale = 3.0;
    
    if (zoomScale !== oldZoomScale) {
        const scaleRatio = zoomScale / oldZoomScale;
        
        // Apply CSS transform to all canvases
        canvases.forEach(function(canvas) {
            canvas.style.transform = `scale(${zoomScale})`;
            canvas.style.transformOrigin = 'top center';
        });
        
        // Update wrapper sizes
        updatePageWrapperSizes();
        
        // Adjust scroll position to zoom towards center
        setTimeout(function() {
            container.scrollLeft = viewportCenterX * scaleRatio - containerRect.width / 2;
            container.scrollTop = viewportCenterY * scaleRatio - containerRect.height / 2;
        }, 10);
    }
}

// Zoom out
function pdfZoomOut() {
    if (!pdfDoc || !pagesContainer) {
        console.warn('PDF not loaded yet');
        return;
    }
    
    const container = document.getElementById('pdfCanvasContainer');
    const canvases = pagesContainer.querySelectorAll('.pdf-page-canvas');
    
    if (canvases.length === 0) return;
    
    // Find the center point of the viewport
    const containerRect = container.getBoundingClientRect();
    const viewportCenterX = container.scrollLeft + containerRect.width / 2;
    const viewportCenterY = container.scrollTop + containerRect.height / 2;
    
    // Update zoom scale
    const oldZoomScale = zoomScale;
    zoomScale -= 0.25;
    if (zoomScale < 0.5) zoomScale = 0.5;
    
    if (zoomScale !== oldZoomScale) {
        const scaleRatio = zoomScale / oldZoomScale;
        
        // Apply CSS transform to all canvases
        canvases.forEach(function(canvas) {
            canvas.style.transform = `scale(${zoomScale})`;
            canvas.style.transformOrigin = 'top center';
        });
        
        // Update wrapper sizes
        updatePageWrapperSizes();
        
        // Adjust scroll position to zoom towards center
        setTimeout(function() {
            container.scrollLeft = viewportCenterX * scaleRatio - containerRect.width / 2;
            container.scrollTop = viewportCenterY * scaleRatio - containerRect.height / 2;
        }, 10);
    }
}

// Show goto page modal
function showGotoPageModal() {
    const modal = new bootstrap.Modal(document.getElementById('gotoPageModal'));
    modal.show();
    setTimeout(() => {
        document.getElementById('gotoPageInput').focus();
    }, 300);
}

// Go to page from modal
function goToPageFromModal() {
    const input = document.getElementById('gotoPageInput');
    const page = parseInt(input.value);
    
    if (page >= 1 && page <= pdfDoc.numPages) {
        const wrappers = pagesContainer.querySelectorAll('.pdf-page-wrapper');
        for (let i = 0; i < wrappers.length; i++) {
            if (parseInt(wrappers[i].dataset.pageNumber) === page) {
                wrappers[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
                const modal = bootstrap.Modal.getInstance(document.getElementById('gotoPageModal'));
                modal.hide();
                input.value = '';
                return;
            }
        }
        // Fallback to index
        if (wrappers[page - 1]) {
            wrappers[page - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
            const modal = bootstrap.Modal.getInstance(document.getElementById('gotoPageModal'));
            modal.hide();
            input.value = '';
        }
    } else {
        alert('Invalid page number. Please enter a number between 1 and ' + pdfDoc.numPages + '.');
    }
}

// Make functions globally accessible - must be after function definitions
if (typeof window !== 'undefined') {
    window.pdfZoomIn = pdfZoomIn;
    window.pdfZoomOut = pdfZoomOut;
    window.showGotoPageModal = showGotoPageModal;
    window.goToPageFromModal = goToPageFromModal;
}

// Update current page label
function updateCurrentPageLabel() {
    const label = document.getElementById('pdfCurrentPageLabel');
    const pageNumSpan = document.getElementById('pdfCurrentPageNum');
    if (!label || !pageNumSpan) return;
    
    const container = document.getElementById('pdfCanvasContainer');
    const wrappers = pagesContainer.querySelectorAll('.pdf-page-wrapper');
    
    if (wrappers.length === 0) return;
    
    // Find the page that is most visible in viewport
    let maxVisible = 0;
    let currentPage = 1;
    
    wrappers.forEach((wrapper, index) => {
        const rect = wrapper.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate visible area
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibleRatio = visibleHeight / rect.height;
        
        if (visibleRatio > maxVisible) {
            maxVisible = visibleRatio;
            currentPage = parseInt(wrapper.dataset.pageNumber) || (index + 1);
        }
    });
    
    pageNumSpan.textContent = currentPage;
    label.classList.add('show');
}

// Hide current page label
function hideCurrentPageLabel() {
    const label = document.getElementById('pdfCurrentPageLabel');
    if (label) {
        label.classList.remove('show');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load PDF
    loadPDF();
    
    const container = document.getElementById('pdfCanvasContainer');
    let scrollTimeout = null;
    
    // Track scroll to show/hide page label
    container.addEventListener('scroll', function() {
        updateCurrentPageLabel();
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Hide label after scrolling stops
        scrollTimeout = setTimeout(function() {
            hideCurrentPageLabel();
        }, 1000); // Hide after 1 second of no scrolling
    });
    
    // Pinch zoom with two fingers (touch events)
    let isZooming = false;
    let renderTimeout = null;
    
    container.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            isZooming = true;
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            initialZoomScale = zoomScale;
        }
    });
    
    container.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2 && isZooming) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            if (initialDistance > 0) {
                const scaleChange = currentDistance / initialDistance;
                zoomScale = initialZoomScale * scaleChange;
                
                // Limit zoom scale
                if (zoomScale < 0.5) zoomScale = 0.5;
                if (zoomScale > 3.0) zoomScale = 3.0;
                
                // Apply CSS transform immediately (no re-render needed)
                const canvases = pagesContainer.querySelectorAll('.pdf-page-canvas');
                canvases.forEach(function(canvas) {
                    canvas.style.transform = `scale(${zoomScale})`;
                    canvas.style.transformOrigin = 'top center';
                });
                
                // Update wrapper sizes
                updatePageWrapperSizes();
            }
        }
    });
    
    container.addEventListener('touchend', function(e) {
        if (e.touches.length < 2) {
            if (isZooming) {
                isZooming = false;
            }
            initialDistance = 0;
        }
    });
    
    // Mouse wheel zoom (for desktop)
    container.addEventListener('wheel', function(e) {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            zoomScale += delta;
            
            // Limit zoom scale
            if (zoomScale < 0.5) zoomScale = 0.5;
            if (zoomScale > 3.0) zoomScale = 3.0;
            
            // Apply CSS transform immediately (no re-render needed)
            const canvases = pagesContainer.querySelectorAll('.pdf-page-canvas');
            canvases.forEach(function(canvas) {
                canvas.style.transform = `scale(${zoomScale})`;
                canvas.style.transformOrigin = 'top center';
            });
            
            // Update wrapper sizes
            updatePageWrapperSizes();
        }
    }, { passive: false });
    
    // Enter key for goto page modal
    document.getElementById('gotoPageInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            goToPageFromModal();
        }
    });
});

