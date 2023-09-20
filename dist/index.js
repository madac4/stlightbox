class Stlightbox {
    constructor(config = {}) {
        this.defaultConfig = {
            lightThemeBackground: 'rgba(255, 255, 255, 0.5)',
            darkThemeBackground: 'rgba(100, 100, 100, 0.5)',
            paginationSeparator: 'of',
            showDownloadButton: false,
            keyboardControls: true,
            videoAutoplay: false,
            pagination: false,
            loop: false,
        };
        this.config = Object.assign(Object.assign({}, this.defaultConfig), config);
        this.currentLightboxGroup = null;
        this.currentSlideIndex = 0;
        this.galleries = {};
        this.lightboxIcons = {
            close: `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>`,
            chevronRight: `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>`,
            chevronLeft: `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                `,
            download: `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              `,
        };
        this.initialize();
    }
    addElementClass(element, className) {
        element.classList.add(className);
    }
    createGalleryOverlay() {
        const galleryOverlay = document.createElement('div');
        this.addElementClass(galleryOverlay, 'stlightbox');
        this.addElementClass(galleryOverlay, 'stlightbox-overlay');
        galleryOverlay.style.opacity = '0';
        setTimeout(() => {
            void galleryOverlay.offsetWidth;
            galleryOverlay.style.opacity = '1';
        }, 1);
        return galleryOverlay;
    }
    createLightboxControls() {
        const lightboxControls = document.createElement('div');
        this.addElementClass(lightboxControls, 'stlightbox-controls');
        return lightboxControls;
    }
    createCloseButton() {
        const closeButton = document.createElement('button');
        this.addElementClass(closeButton, 'stlightbox-close');
        closeButton.insertAdjacentHTML('beforeend', this.lightboxIcons.close);
        return closeButton;
    }
    createDownloadButton(currentImage) {
        const downloadButton = document.createElement('a');
        this.addElementClass(downloadButton, 'stlightbox-download');
        downloadButton.insertAdjacentHTML('beforeend', this.lightboxIcons.download);
        downloadButton.setAttribute('download', 'image');
        downloadButton.setAttribute('href', currentImage.getAttribute('href') || '');
        return downloadButton;
    }
    createGallery() {
        const gallery = document.createElement('div');
        this.addElementClass(gallery, 'stlightbox-gallery');
        return gallery;
    }
    checkTheme() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDark;
    }
    isImage(url) {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    }
    createGallerySlides(currentGallery) {
        const gallerySlides = document.createElement('div');
        this.addElementClass(gallerySlides, 'stlightbox-gallery__slides');
        currentGallery.forEach((file, index) => {
            let gallerySlide;
            if (this.isImage(file.getAttribute('href') || '')) {
                gallerySlide = this.createGalleryPhotoSlide(file);
            }
            else {
                gallerySlide = this.createGalleryVideoSlide(file);
            }
            if (index === this.currentSlideIndex) {
                this.addElementClass(gallerySlide, 'stlightbox-gallery__slide--current');
                if (this.config.videoAutoplay &&
                    gallerySlide.children[0] instanceof HTMLVideoElement) {
                    gallerySlide.children[0].play();
                }
            }
            gallerySlides.appendChild(gallerySlide);
        });
        return gallerySlides;
    }
    createGalleryPhotoSlide(file) {
        const gallerySlide = document.createElement('div');
        const galleryImage = document.createElement('img');
        galleryImage.setAttribute('src', file.getAttribute('href') || '');
        galleryImage.setAttribute('alt', file.getAttribute('alt') || '');
        this.addElementClass(gallerySlide, 'stlightbox-gallery__slide');
        gallerySlide.appendChild(galleryImage);
        return gallerySlide;
    }
    createGalleryVideoSlide(image) {
        const gallerySlide = document.createElement('div');
        const galleryVideo = document.createElement('video');
        galleryVideo.setAttribute('src', image.getAttribute('href') || '');
        galleryVideo.setAttribute('controls', '');
        this.addElementClass(gallerySlide, 'stlightbox-gallery__slide');
        gallerySlide.appendChild(galleryVideo);
        return gallerySlide;
    }
    createGalleryControls() {
        const galleryControls = document.createElement('div');
        this.addElementClass(galleryControls, 'stlightbox-gallery__controls');
        this.addElementClass(galleryControls, 'gallery-controls');
        const galleryArrowLeft = this.createGalleryArrow('prev');
        const galleryArrowRight = this.createGalleryArrow('next');
        galleryControls.appendChild(galleryArrowLeft);
        galleryControls.appendChild(galleryArrowRight);
        return galleryControls;
    }
    createGalleryArrow(direction) {
        const galleryArrow = document.createElement('button');
        const icon = direction === 'prev' ? this.lightboxIcons.chevronLeft : this.lightboxIcons.chevronRight;
        galleryArrow.insertAdjacentHTML('afterbegin', icon);
        this.addElementClass(galleryArrow, 'gallery-controls__arrow');
        this.addElementClass(galleryArrow, `gallery-controls__arrow--${direction}`);
        galleryArrow.addEventListener('click', () => {
            direction === 'prev' ? this.navigateGallery(-1) : this.navigateGallery(1);
        });
        return galleryArrow;
    }
    createPagination() {
        var _a;
        const pagination = document.createElement('div');
        const current = this.currentSlideIndex + 1;
        const total = ((_a = this.currentLightboxGroup) === null || _a === void 0 ? void 0 : _a.length) || 0;
        const separator = this.config.paginationSeparator;
        this.addElementClass(pagination, 'stlightbox-pagination');
        pagination.innerHTML = `${current} <span class="stlightbox-pagination__separator">${separator}</span> ${total}`;
        return pagination;
    }
    navigateGallery(direction) {
        if (this.currentLightboxGroup && this.currentLightboxGroup.length > 1) {
            const prevSlide = this.currentSlideIndex;
            this.currentSlideIndex += direction;
            if (this.config.loop) {
                if (this.currentSlideIndex >= this.currentLightboxGroup.length) {
                    this.currentSlideIndex = 0;
                }
                else if (this.currentSlideIndex < 0) {
                    this.currentSlideIndex = this.currentLightboxGroup.length - 1;
                }
            }
            else {
                if (this.currentSlideIndex >= this.currentLightboxGroup.length) {
                    this.currentSlideIndex = this.currentLightboxGroup.length - 1;
                }
                else if (this.currentSlideIndex < 0) {
                    this.currentSlideIndex = 0;
                }
            }
            this.updatePagination();
            this.updateDisplayedSlide(this.currentSlideIndex, prevSlide);
            this.updateDownloadLink(this.currentSlideIndex);
        }
    }
    updateDisplayedSlide(index, prev) {
        const slides = document.querySelectorAll('.stlightbox .stlightbox-gallery__slide');
        slides.forEach((slide) => {
            slide.classList.remove('stlightbox-gallery__slide--current');
            if (slide.children[0] instanceof HTMLVideoElement) {
                slide.children[0].pause();
            }
        });
        slides[index].classList.add('stlightbox-gallery__slide--current');
        if (this.config.videoAutoplay) {
            if (slides[index].children[0] instanceof HTMLVideoElement) {
                slides[index].children[0].play();
            }
            else if (slides[prev].children[0] instanceof HTMLVideoElement) {
                slides[prev].children[0].pause();
            }
        }
    }
    updateDownloadLink(index) {
        var _a;
        const downloadLink = document.querySelector('.stlightbox-download');
        if (downloadLink) {
            const imageUrl = ((_a = this.currentLightboxGroup) === null || _a === void 0 ? void 0 : _a[index].getAttribute('href')) || '';
            downloadLink.setAttribute('href', imageUrl);
        }
    }
    updatePagination() {
        var _a;
        const pagination = document.querySelector('.stlightbox .stlightbox-pagination');
        const current = this.currentSlideIndex + 1;
        const total = ((_a = this.currentLightboxGroup) === null || _a === void 0 ? void 0 : _a.length) || 0;
        const separator = this.config.paginationSeparator;
        if (pagination) {
            pagination.innerHTML = `${current} <span class="stlightbox-pagination__separator">${separator}</span> ${total}`;
        }
    }
    dropGallery() {
        const galleryOverlay = document.querySelector('.stlightbox') || null;
        if (galleryOverlay) {
            galleryOverlay.style.opacity = '0';
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', this.handleKeyboardEvent);
            setTimeout(() => {
                galleryOverlay === null || galleryOverlay === void 0 ? void 0 : galleryOverlay.remove();
            }, 300);
        }
    }
    addKeyboardEventListeners() {
        this.handleKeyboardEvent = (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigateGallery(-1);
            }
            else if (e.key === 'ArrowRight') {
                this.navigateGallery(1);
            }
            else if (e.key === 'Escape') {
                this.dropGallery();
            }
        };
        document.addEventListener('keydown', this.handleKeyboardEvent);
    }
    refreshGallery() {
        this.galleries = {};
        this.initialize();
    }
    initialize() {
        const galleryImages = document.querySelectorAll('[data-stlightbox]');
        galleryImages.forEach((link) => {
            const lightboxGroup = link.getAttribute('data-stlightbox');
            if (lightboxGroup !== null) {
                if (!this.galleries[lightboxGroup]) {
                    this.galleries[lightboxGroup] = [];
                }
                this.galleries[lightboxGroup].push(link);
            }
        });
        galleryImages.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lightboxGroup = link.getAttribute('data-stlightbox');
                const currentGallery = this.galleries[lightboxGroup || ''] || [];
                const currentIndex = currentGallery.indexOf(link);
                const isDark = this.checkTheme();
                this.currentLightboxGroup = currentGallery;
                this.currentSlideIndex = currentIndex;
                const galleryOverlay = this.createGalleryOverlay();
                const lightboxControls = this.createLightboxControls();
                const closeButton = this.createCloseButton();
                const gallerySlides = this.createGallerySlides(currentGallery);
                const galleryControls = this.createGalleryControls();
                const lightboxGallery = this.createGallery();
                if (isDark) {
                    galleryOverlay.style.backgroundColor = this.config.darkThemeBackground;
                }
                else {
                    galleryOverlay.style.backgroundColor = this.config.lightThemeBackground;
                }
                if (this.config.pagination) {
                    lightboxControls.appendChild(this.createPagination());
                }
                if (this.config.showDownloadButton) {
                    const downloadButton = this.createDownloadButton(currentGallery[currentIndex]);
                    lightboxControls.appendChild(downloadButton);
                }
                lightboxControls.appendChild(closeButton);
                galleryOverlay.appendChild(lightboxControls);
                galleryOverlay.appendChild(lightboxGallery);
                lightboxGallery.appendChild(gallerySlides);
                lightboxGallery.appendChild(galleryControls);
                if (galleryOverlay) {
                    galleryOverlay.addEventListener('click', (e) => {
                        if (e.target instanceof HTMLElement &&
                            e.target.classList.contains('stlightbox-gallery')) {
                            this.dropGallery();
                        }
                    });
                }
                closeButton.addEventListener('click', () => {
                    this.dropGallery();
                });
                if (this.config.keyboardControls) {
                    this.addKeyboardEventListeners();
                }
                document.body.style.overflow = 'hidden';
                document.body.appendChild(galleryOverlay);
            });
        });
    }
}
export default Stlightbox;
//# sourceMappingURL=index.js.map