// Mobile menu functionality
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('#contact form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send this data to a server
    console.log('Form submitted:', { name, email, message });
    alert(typeof t === 'function' ? t('contact.success') : 'Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections
document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});

// Add animation classes to elements
document.querySelectorAll('.skill-card, .project-card').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// Profile photo animation
const profilePhoto = document.querySelector('.profile-photo');
if (profilePhoto) {
    observer.observe(profilePhoto);
}

// Add hover animations to buttons
document.querySelectorAll('a, button').forEach(button => {
    button.classList.add('btn');
});

// Add form animations
document.querySelectorAll('form').forEach(form => {
    form.classList.add('contact-form');
});

// CV modal (grande fenêtre + PDF.js)
const cvCard = document.getElementById('cv-card');
const cvModal = document.getElementById('cv-modal');
const cvModalBackdrop = document.getElementById('cv-modal-backdrop');
const cvToggleBtn = document.getElementById('cv-toggle-btn');
const cvCloseBtn = document.getElementById('cv-close-btn');
const cvPdfContainer = document.getElementById('cv-pdf-container');
const cvLoading = document.getElementById('cv-loading');
const CV_PDF_URL = 'cv.pdf';
let cvPdfLoaded = false;

if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function renderCvPdf() {
    if (!cvPdfContainer || typeof pdfjsLib === 'undefined') return;

    if (cvPdfLoaded) return;

    try {
        if (cvLoading) cvLoading.textContent = typeof t === 'function' ? t('cv.loading') : 'Loading CV...';

        const pdf = await pdfjsLib.getDocument(CV_PDF_URL).promise;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const canvas = document.createElement('canvas');
            canvas.className = 'cv-pdf-page';
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.4 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;
            cvPdfContainer.appendChild(canvas);
        }

        if (cvLoading) cvLoading.remove();
        cvPdfLoaded = true;
    } catch (error) {
        console.error('Erreur chargement CV:', error);
        if (cvLoading) {
            cvLoading.innerHTML = typeof t === 'function'
                ? t('cv.error')
                : 'Unable to display the CV here. <a href="cv.pdf" target="_blank" class="text-amber-600 underline">Open the PDF</a>';
        }
    }
}

function openCvModal() {
    if (!cvModal) return;

    cvModal.classList.remove('hidden');
    cvModal.classList.add('cv-modal-open');
    cvModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cv-modal-active');

    renderCvPdf();

    if (cvToggleBtn) {
        const hideLabel = typeof t === 'function' ? t('about.cv.hide') : 'Hide';
        cvToggleBtn.innerHTML = `<i class="fa-solid fa-eye-slash mr-1"></i> ${hideLabel}`;
    }
}

function closeCvModal() {
    if (!cvModal) return;

    cvModal.classList.add('hidden');
    cvModal.classList.remove('cv-modal-open');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cv-modal-active');

    if (cvToggleBtn) {
        const viewLabel = typeof t === 'function' ? t('about.cv.view') : 'View';
        cvToggleBtn.innerHTML = `<i class="fa-solid fa-eye mr-1"></i> ${viewLabel}`;
    }
}

function toggleCvModal() {
    if (!cvModal) return;

    if (cvModal.classList.contains('hidden')) {
        openCvModal();
    } else {
        closeCvModal();
    }
}

if (cvCard && cvModal) {
    cvCard.addEventListener('click', (e) => {
        if (e.target.closest('a[download]')) return;
        toggleCvModal();
    });

    if (cvToggleBtn) {
        cvToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCvModal();
        });
    }

    if (cvCloseBtn) {
        cvCloseBtn.addEventListener('click', closeCvModal);
    }

    if (cvModalBackdrop) {
        cvModalBackdrop.addEventListener('click', closeCvModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !cvModal.classList.contains('hidden')) {
            closeCvModal();
        }
    });
}
