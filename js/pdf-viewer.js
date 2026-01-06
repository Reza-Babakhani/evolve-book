// PDF Viewer با PDF.js Viewer استاندارد

// بارگذاری PDF با PDF.js Viewer
function loadPDF() {
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

	// استفاده از PDF.js viewer استاندارد
	// استفاده از viewer.html از mozilla.github.io
	const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
		pdfUrl
	)}`;
	const iframe = document.getElementById("pdfViewer");
	if (iframe) {
		iframe.src = viewerUrl;
	}
}

// مقداردهی اولیه
document.addEventListener("DOMContentLoaded", function () {
	loadPDF();
});
