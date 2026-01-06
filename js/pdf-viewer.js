// PDF Viewer با PDF.js - استفاده مستقیم بدون تغییر کیفیت

// تنظیمات PDF.js Worker
if (typeof pdfjsLib !== "undefined") {
	pdfjsLib.GlobalWorkerOptions.workerSrc =
		"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let baseScale = 1.0; // Scale برای رندر اولیه
let zoomLevel = 1.0; // Zoom level که با CSS transform اعمال می‌شود
let renderedPages = new Map(); // برای ذخیره اطلاعات صفحات رندر شده

// بارگذاری PDF
async function loadPDF() {
	const urlParams = new URLSearchParams(window.location.search);
	const pdfUrl = urlParams.get("url");
	const title = urlParams.get("title") || "PDF Viewer";
	const bookId = urlParams.get("bookId");

	if (!pdfUrl) {
		window.location.href = "index.html";
		return;
	}

	// به‌روزرسانی عنوان
	const titleElement = document.getElementById("pdfTitle");
	if (titleElement) {
		titleElement.textContent = title;
	}
	document.title = title + " - My Evolve";

	// به‌روزرسانی breadcrumb
	if (bookId && typeof CONFIG !== "undefined") {
		const book = CONFIG.books.find((b) => b.id === parseInt(bookId));
		if (book) {
			const breadcrumbLink =
				document.getElementById("breadcrumbBookLink");
			const breadcrumbPdfName =
				document.getElementById("breadcrumbPdfName");
			if (breadcrumbLink) {
				breadcrumbLink.textContent = book.name;
				breadcrumbLink.href = `book-details.html?id=${book.id}`;
			}
			if (breadcrumbPdfName) {
				breadcrumbPdfName.textContent = title;
			}
		}
	} else {
		const breadcrumbPdfName = document.getElementById("breadcrumbPdfName");
		if (breadcrumbPdfName) {
			breadcrumbPdfName.textContent = title;
		}
	}

	try {
		// نمایش loading indicator
		showLoadingIndicator();

		// بارگذاری PDF با PDF.js
		const loadingTask = pdfjsLib.getDocument({
			url: pdfUrl,
			verbosity: 0,
		});

		// ردیابی پیشرفت بارگذاری
		loadingTask.onProgress = (progress) => {
			if (progress.total > 0) {
				const percent = Math.round(
					(progress.loaded / progress.total) * 100
				);
				updateLoadingProgress(percent);
			}
		};

		pdfDoc = await loadingTask.promise;
		totalPages = pdfDoc.numPages;

		// به‌روزرسانی تعداد صفحات در modal
		const modalPageCount = document.getElementById("modalPageCount");
		if (modalPageCount) {
			modalPageCount.textContent = totalPages;
		}

		// محاسبه scale اولیه
		await calculateInitialScale();

		// Reset zoom level
		zoomLevel = 1.0;

		// رندر کردن تمام صفحات
		await renderAllPages();

		// مخفی کردن loading indicator
		hideLoadingIndicator();
	} catch (error) {
		console.error("خطا در بارگذاری PDF:", error);
		hideLoadingIndicator();
		const container = document.getElementById("pdfPagesContainer");
		if (container) {
			container.innerHTML = `<div class="error-message">خطا در بارگذاری PDF: ${error.message}</div>`;
		}
	}
}

// نمایش loading indicator
function showLoadingIndicator() {
	const loadingIndicator = document.getElementById("pdfLoadingIndicator");
	const pagesContainer = document.getElementById("pdfPagesContainer");
	if (loadingIndicator) {
		loadingIndicator.style.display = "flex";
	}
	if (pagesContainer) {
		pagesContainer.style.display = "none";
	}
}

// مخفی کردن loading indicator
function hideLoadingIndicator() {
	const loadingIndicator = document.getElementById("pdfLoadingIndicator");
	const pagesContainer = document.getElementById("pdfPagesContainer");
	if (loadingIndicator) {
		loadingIndicator.style.display = "none";
	}
	if (pagesContainer) {
		pagesContainer.style.display = "block";
	}
}

// به‌روزرسانی پیشرفت loading
function updateLoadingProgress(percent) {
	const progressBar = document.getElementById("pdfProgressBar");
	const loadingText = document.getElementById("pdfLoadingText");
	if (progressBar) {
		progressBar.style.width = percent + "%";
	}
	if (loadingText) {
		loadingText.textContent = `Loading PDF... ${percent}%`;
	}
}

// رندر کردن تمام صفحات
async function renderAllPages() {
	const pagesContainer = document.getElementById("pdfPagesContainer");
	if (!pagesContainer || !pdfDoc) return;

	pagesContainer.innerHTML = "";
	renderedPages.clear();

	for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
		await renderPage(pageNum);
	}

	// اعمال zoom level فعلی
	applyZoom();
}

// محاسبه scale اولیه
async function calculateInitialScale() {
	if (!pdfDoc) return;

	try {
		const firstPage = await pdfDoc.getPage(1);
		const viewport = firstPage.getViewport({ scale: 1.0 });

		const isMobile = window.innerWidth < 768;
		const container = document.getElementById("pdfViewerContainer");

		if (isMobile) {
			// موبایل: fit to width
			const containerWidth = container.clientWidth - 40;
			if (containerWidth > 0) {
				baseScale = containerWidth / viewport.width;
			}
		} else {
			// دسکتاپ: fit to height
			const availableHeight = window.innerHeight - 200;
			if (availableHeight > 0) {
				baseScale = availableHeight / viewport.height;
			}
		}
	} catch (error) {
		console.error("خطا در محاسبه scale:", error);
	}
}

// رندر کردن یک صفحه
async function renderPage(pageNum) {
	if (!pdfDoc) return;

	try {
		const page = await pdfDoc.getPage(pageNum);

		// استفاده از devicePixelRatio برای کیفیت بهتر
		const devicePixelRatio = window.devicePixelRatio || 1;

		// استفاده از scale بالاتر برای کیفیت بهتر
		// حداقل scale 2.0 برای کیفیت بالا، یا baseScale * 2 اگر بزرگتر باشد
		const renderScale = Math.max(baseScale * 2.0, 2.0);
		const outputScale = devicePixelRatio;

		// محاسبه viewport با render scale (بالاتر برای کیفیت)
		const viewport = page.getViewport({ scale: renderScale });

		// محاسبه اندازه نمایش (کوچک کردن با CSS برای fit کردن)
		const displayWidth = (viewport.width / renderScale) * baseScale;
		const displayHeight = (viewport.height / renderScale) * baseScale;

		// ایجاد container برای صفحه
		const pageContainer = document.createElement("div");
		pageContainer.className = "pdf-page-container";
		pageContainer.dataset.pageNumber = pageNum;
		pageContainer.style.margin = "0 auto 20px auto";
		pageContainer.style.textAlign = "center";
		pageContainer.style.height = displayHeight + "px";

		// ایجاد canvas
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		// تنظیم resolution واقعی canvas (با devicePixelRatio برای کیفیت بهتر)
		canvas.width = Math.floor(viewport.width * outputScale);
		canvas.height = Math.floor(viewport.height * outputScale);

		// Scale کردن context
		ctx.scale(outputScale, outputScale);

		// تنظیم اندازه canvas برای نمایش
		canvas.style.width = displayWidth + "px";
		canvas.style.height = displayHeight + "px";

		canvas.className = "pdf-page-canvas";
		canvas.dataset.pageNumber = pageNum;
		canvas.style.cssText +=
			"display: block; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); background: #ffffff;";

		pageContainer.appendChild(canvas);

		// رندر کردن صفحه
		const renderContext = {
			canvasContext: ctx,
			viewport: viewport,
		};

		await page.render(renderContext).promise;

		// ذخیره اطلاعات صفحه
		renderedPages.set(pageNum, {
			container: pageContainer,
			canvas: canvas,
			viewport: viewport,
			originalHeight: displayHeight, // استفاده از display height
			renderScale: renderScale,
		});

		// اضافه کردن به container
		const pagesContainer = document.getElementById("pdfPagesContainer");
		if (pagesContainer) {
			pagesContainer.appendChild(pageContainer);
		}
	} catch (error) {
		console.error(`خطا در رندر کردن صفحه ${pageNum}:`, error);
	}
}

// اعمال zoom با CSS transform
function applyZoom() {
	const pagesContainer = document.getElementById("pdfPagesContainer");
	const scrollContainer = document.getElementById("pdfViewerContainer");
	if (!pagesContainer || !scrollContainer) return;

	// حفظ موقعیت scroll
	const scrollTop = scrollContainer.scrollTop;
	const scrollHeight = scrollContainer.scrollHeight;
	const scrollRatio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

	// اعمال transform به تمام صفحات و به‌روزرسانی ارتفاع
	renderedPages.forEach((pageData) => {
		if (pageData.container) {
			pageData.container.style.transform = `scale(${zoomLevel})`;
			pageData.container.style.transformOrigin = "top center";

			// به‌روزرسانی ارتفاع container برای scroll درست
			if (pageData.originalHeight) {
				pageData.container.style.height =
					pageData.originalHeight * zoomLevel + "px";
			}
		}
	});

	// بازگرداندن موقعیت scroll
	setTimeout(() => {
		const newScrollHeight = scrollContainer.scrollHeight;
		const newScrollTop = newScrollHeight * scrollRatio;
		scrollContainer.scrollTop = Math.max(0, newScrollTop);
	}, 10);
}

// Zoom in
function pdfZoomIn() {
	if (!pdfDoc) return;

	const oldZoom = zoomLevel;
	zoomLevel = Math.min(zoomLevel + 0.25, 3.0);

	if (oldZoom !== zoomLevel) {
		applyZoom();
	}
}

// Zoom out
function pdfZoomOut() {
	if (!pdfDoc) return;

	const oldZoom = zoomLevel;
	zoomLevel = Math.max(zoomLevel - 0.25, 0.5);

	if (oldZoom !== zoomLevel) {
		applyZoom();
	}
}

// نمایش modal رفتن به صفحه
function showGotoPageModal() {
	const modal = new bootstrap.Modal(document.getElementById("gotoPageModal"));
	modal.show();
	setTimeout(() => {
		const input = document.getElementById("gotoPageInput");
		if (input) {
			input.focus();
		}
	}, 300);
}

// رفتن به صفحه از modal
function goToPageFromModal() {
	const input = document.getElementById("gotoPageInput");
	if (!input) return;

	const page = parseInt(input.value);
	if (page >= 1 && page <= totalPages) {
		const pageData = renderedPages.get(page);
		if (pageData && pageData.container) {
			pageData.container.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
			currentPage = page;
			const modal = bootstrap.Modal.getInstance(
				document.getElementById("gotoPageModal")
			);
			if (modal) {
				modal.hide();
			}
			input.value = "";
		}
	} else {
		alert(
			`Invalid page number. Please enter a number between 1 and ${totalPages}.`
		);
	}
}

// مقداردهی اولیه
document.addEventListener("DOMContentLoaded", function () {
	if (typeof pdfjsLib !== "undefined") {
		loadPDF();
	} else {
		console.error("PDF.js library not loaded!");
	}

	// Enter key برای modal
	const gotoPageInput = document.getElementById("gotoPageInput");
	if (gotoPageInput) {
		gotoPageInput.addEventListener("keypress", function (e) {
			if (e.key === "Enter") {
				goToPageFromModal();
			}
		});
	}
});

