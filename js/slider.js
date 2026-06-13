// Netflix+ - Hero Slider Module

class HeroSlider {
    constructor() {
        this.swiper = null;
        this.movies = api.getTrendingMovies();
        this.currentIndex = 0;
        this.autoPlayTimeout = null;
    }

    /**
     * Initialize the hero slider with Swiper.js
     */
    init() {
        this.renderHeroSlides();
        this.initSwiper();
        this.attachEventListeners();
    }

    /**
     * Render hero slides from movie data
     */
    renderHeroSlides() {
        const wrapper = document.getElementById('hero-wrapper');
        wrapper.innerHTML = '';

        this.movies.forEach((movie, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="hero-slide" style="background-image: url('${movie.backdrop}');">
                    <div class="hero-content" style="animation-delay: ${index * 0.1}s;">
                        <div class="hero-tag">${movie.genres[0]} • ${movie.year}</div>
                        <h1 class="hero-title">${movie.title}</h1>
                        <p class="hero-description">${movie.description}</p>
                        <div class="hero-actions">
                            <button class="btn btn-primary play-btn" data-movie-id="${movie.id}">
                                <i class="fas fa-play"></i> Play
                            </button>
                            <button class="btn btn-secondary info-btn" data-movie-id="${movie.id}">
                                <i class="fas fa-info-circle"></i> More Info
                            </button>
                        </div>
                    </div>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        // Attach event listeners to buttons
        wrapper.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const movieId = parseInt(e.currentTarget.dataset.movieId);
                openVideoModal(movieId);
            });
        });

        wrapper.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const movieId = parseInt(e.currentTarget.dataset.movieId);
                openMovieModal(movieId);
            });
        });
    }

    /**
     * Initialize Swiper slider
     */
    initSwiper() {
        this.swiper = new Swiper('.hero-swiper', {
            loop: true,
            speed: 800,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 5
            },
            navigation: {
                nextEl: '.hero-next',
                prevEl: '.hero-prev'
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            keyboard: {
                enabled: true
            },
            mousewheel: false
        });
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Pause autoplay on hover
        document.querySelector('.hero-section').addEventListener('mouseenter', () => {
            if (this.swiper) {
                this.swiper.autoplay.pause();
            }
        });

        // Resume autoplay on leave
        document.querySelector('.hero-section').addEventListener('mouseleave', () => {
            if (this.swiper) {
                this.swiper.autoplay.resume();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.swiper.slidePrev();
            } else if (e.key === 'ArrowRight') {
                this.swiper.slideNext();
            }
        });
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        if (this.swiper) {
            this.swiper.slideTo(index);
        }
    }

    /**
     * Get current slide movie data
     */
    getCurrentMovie() {
        const currentIndex = this.swiper?.realIndex || 0;
        return this.movies[currentIndex];
    }

    /**
     * Update hero slider with new movies
     */
    updateMovies(movies) {
        this.movies = movies;
        this.renderHeroSlides();
        if (this.swiper) {
            this.swiper.destroy();
        }
        this.initSwiper();
    }
}

// Initialize hero slider when application is ready
let heroSlider;
