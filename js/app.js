// Netflix+ - Main Application

class NetflixApp {
    constructor() {
        this.currentPage = 'home';
        this.currentSection = null;
        this.isLoading = false;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        this.hideNetflixIntro();
        this.attachEventListeners();
        await api.init();

        if (typeof HeroSlider !== 'undefined') {
            heroSlider = new HeroSlider();
            heroSlider.init();
        }

        this.loadAllSections();
        this.setupInfiniteScroll();
        this.setupThemeToggle();
        this.setupMobileMenu();
    }

    /**
     * Hide Netflix intro animation
     */
    hideNetflixIntro() {
        const intro = document.getElementById('netflix-intro');
        setTimeout(() => {
            intro.classList.add('hidden');
            intro.style.display = 'none';
        }, 2500);
    }

    /**
     * Attach global event listeners
     */
    attachEventListeners() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
                if (modal && modal.id === 'video-modal') {
                    document.getElementById('video-iframe').src = '';
                }
            });
        });

        // Modal outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    if (modal.id === 'video-modal') {
                        document.getElementById('video-iframe').src = '';
                    }
                }
            });
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.navigateToSection(section);
            });
        });

        // Close search menu on nav link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelector('.nav-menu').classList.remove('active');
            });
        });
    }

    /**
     * Navigate to section
     */
    navigateToSection(section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });

        this.currentSection = section;

        if (section === 'favorites') {
            this.openFavoritesModal();
        } else if (section === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    /**
     * Load all sections with movies
     */
    async loadAllSections() {
        // Load Continue Watching
        this.loadContinueWatching();

        // Load Trending
        this.loadMoviesInGrid('trending-grid', api.getTrendingMovies());

        // Load Popular
        this.loadMoviesInGrid('popular-grid', api.getPopularMovies());

        // Load Top Rated
        this.loadMoviesInGrid('toprated-grid', api.getTopRatedMovies());

        // Load New Releases
        this.loadMoviesInGrid('newreleases-grid', api.getNewReleases());

        // Load Categories
        this.loadCategories();
    }

    /**
     * Load continue watching section
     */
    loadContinueWatching() {
        const container = document.getElementById('continue-watching-grid');
        const watchingList = favoritesManager.getContinueWatching();

        if (watchingList.length === 0) {
            // Show default suggestions
            const suggestions = api.getTrendingMovies().slice(0, 6);
            this.loadMoviesInGrid('continue-watching-grid', suggestions);
        } else {
            this.loadMoviesInGrid('continue-watching-grid', watchingList);
        }
    }

    /**
     * Load movies into a grid
     */
    loadMoviesInGrid(gridId, movies) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        // Show skeleton loaders first
        this.showSkeletonLoaders(grid, 6);

        // Simulate loading delay
        setTimeout(() => {
            grid.innerHTML = '';
            movies.forEach((movie, index) => {
                const card = this.createMovieCard(movie);
                card.classList.add(`stagger-${(index % 8) + 1}`);
                card.classList.add('animate-fade-in');
                grid.appendChild(card);
            });
        }, 300);
    }

    /**
     * Create movie card element
     */
    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.movieId = movie.id;

        const isFavorite = favoritesManager.isFavorite(movie.id);
        const hasProgress = movie.progress !== undefined;
        const progressBar = hasProgress ? `<div style="height: 3px; background: #E50914; width: ${movie.progress}%;"></div>` : '';

        card.innerHTML = `
            <div class="movie-poster-container">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
                ${progressBar}
                <div class="movie-overlay">
                    <div class="movie-info">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-meta">
                            <span class="movie-rating"><i class="fas fa-star"></i> ${movie.rating}</span>
                            <span class="movie-year">${movie.year}</span>
                        </div>
                        <p class="movie-description">${movie.description}</p>
                        <div class="movie-card-actions">
                            <button class="action-btn action-btn-play" title="Play">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="action-btn action-btn-favorite ${isFavorite ? 'liked' : ''}" title="Add to Favorites">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        card.querySelector('.action-btn-play').addEventListener('click', () => {
            openVideoModal(movie.id);
        });

        card.querySelector('.movie-poster').addEventListener('click', () => {
            openMovieModal(movie.id);
        });

        card.querySelector('.action-btn-favorite').addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const isNowFavorite = favoritesManager.toggleFavorite(movie.id);
            
            if (isNowFavorite) {
                btn.classList.add('liked');
                showNotification(`${movie.title} added to favorites!`, 'success');
            } else {
                btn.classList.remove('liked');
                showNotification(`${movie.title} removed from favorites`, 'info');
            }
        });

        return card;
    }

    /**
     * Show skeleton loaders
     */
    showSkeletonLoaders(container, count) {
        container.innerHTML = '';
        const template = document.getElementById('skeleton-template');
        
        for (let i = 0; i < count; i++) {
            const clone = template.content.cloneNode(true);
            container.appendChild(clone);
        }
    }

    /**
     * Load categories
     */
    loadCategories() {
        const container = document.getElementById('categories-grid');
        const categories = api.getCategories();

        container.innerHTML = categories.map(category => `
            <div class="category-card" data-category="${category.name}">
                <span style="font-size: 2rem; margin-right: 10px;">${category.icon}</span>
                <div class="category-name">${category.name}</div>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                const movies = api.getMoviesByGenre(category);
                this.showCategoryMovies(category, movies);
            });
        });
    }

    /**
     * Show category movies in a modal or section
     */
    showCategoryMovies(category, movies) {
        const modal = document.getElementById('favorites-modal');
        const container = modal.querySelector('.favorites-container');

        container.innerHTML = `
            <h2><i class="fas fa-arrow-left" style="cursor: pointer;"></i> ${category}</h2>
            <div class="favorites-grid" id="category-movies"></div>
        `;

        container.querySelector('i').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        const grid = container.querySelector('#category-movies');
        movies.forEach(movie => {
            grid.appendChild(this.createMovieCard(movie));
        });

        modal.classList.add('active');
    }

    /**
     * Open favorites modal
     */
    openFavoritesModal() {
        const modal = document.getElementById('favorites-modal');
        const grid = modal.querySelector('.favorites-grid');
        const emptyMsg = modal.querySelector('.empty-favorites');

        const favorites = favoritesManager.getFavorites();

        if (favorites.length === 0) {
            grid.style.display = 'none';
            emptyMsg.style.display = 'block';
        } else {
            grid.style.display = 'grid';
            emptyMsg.style.display = 'none';
            grid.innerHTML = '';
            
            favorites.forEach(movie => {
                grid.appendChild(this.createMovieCard(movie));
            });
        }

        modal.classList.add('active');
    }

    /**
     * Setup infinite scroll
     */
    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading) {
                    this.loadMoreMovies();
                }
            });
        }, this.observerOptions);

        const footer = document.querySelector('.footer');
        if (footer) {
            observer.observe(footer);
        }
    }

    /**
     * Load more movies (infinite scroll)
     */
    async loadMoreMovies() {
        if (this.isLoading) return;
        this.isLoading = true;

        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));

        // Add more movies to popular section as example
        const popularGrid = document.getElementById('popular-grid');
        const moreMovies = api.getPopularMovies();

        moreMovies.slice(6).forEach((movie, index) => {
            const card = this.createMovieCard(movie);
            card.classList.add(`stagger-${(index % 8) + 1}`);
            card.classList.add('animate-fade-in');
            popularGrid.appendChild(card);
        });

        this.isLoading = false;
    }

    /**
     * Setup theme toggle
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';

        // Apply saved theme
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            const isLightMode = document.body.classList.toggle('light-mode');
            const theme = isLightMode ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            themeToggle.innerHTML = isLightMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Open movie modal
 */
function openMovieModal(movieId) {
    const movie = api.getMovieById(movieId);
    if (!movie) return;

    const modal = document.getElementById('movie-modal');
    const isFavorite = favoritesManager.isFavorite(movieId);

    // Update modal content
    document.getElementById('modal-poster-img').src = movie.poster;
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-rating').innerHTML = `<i class="fas fa-star"></i> ${movie.rating}`;
    document.getElementById('modal-year').textContent = movie.year;
    document.getElementById('modal-duration').textContent = `${movie.duration} min`;
    document.getElementById('modal-description').textContent = movie.description;

    // Update genres
    const genresContainer = document.getElementById('modal-genres');
    genresContainer.innerHTML = movie.genres.map(genre => 
        `<div class="genre-tag">${genre}</div>`
    ).join('');

    // Update buttons
    const favBtn = document.getElementById('add-to-favorites-modal');
    favBtn.textContent = isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites';
    favBtn.classList.toggle('liked', isFavorite);

    favBtn.onclick = () => {
        const isNow = favoritesManager.toggleFavorite(movieId);
        favBtn.textContent = isNow ? '❤️ Remove from Favorites' : '🤍 Add to Favorites';
        favBtn.classList.toggle('liked', isNow);
        showNotification(isNow ? 'Added to favorites!' : 'Removed from favorites', 'success');
    };

    const modalLinks = document.getElementById('modal-links');
    modalLinks.innerHTML = '';
    if (movie.watchUrl) {
        modalLinks.innerHTML += `
            <a href="${movie.watchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <i class="fas fa-play"></i> Watch on YouTube
            </a>
        `;
    }
    if (movie.netflixUrl) {
        modalLinks.innerHTML += `
            <a href="${movie.netflixUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                <i class="fas fa-film"></i> Search on Netflix
            </a>
        `;
    }

    // Continue watching
    document.getElementById('save-progress-btn').onclick = () => {
        const progress = document.getElementById('watching-progress').value;
        favoritesManager.addToContinueWatching(movieId, progress);
        showNotification('Progress saved!', 'success');
    };

    // Play button
    document.getElementById('play-button').onclick = () => {
        openVideoModal(movieId);
    };

    modal.classList.add('active');
}

/**
 * Open video modal
 */
function getVideoEmbedUrl(movie) {
    if (!movie) return '';

    const trailerSource = movie.trailerUrl || movie.watchUrl || '';
    if (trailerSource.includes('youtube.com/watch')) {
        const url = new URL(trailerSource);
        const videoId = url.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';
    }

    if (trailerSource.includes('youtu.be/')) {
        const videoId = trailerSource.split('/').pop();
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';
    }

    if (/^[A-Za-z0-9_-]{11}$/.test(trailerSource.trim())) {
        return `https://www.youtube.com/embed/${trailerSource.trim()}?autoplay=1&rel=0`;
    }

    return '';
}

function openVideoModal(movieId) {
    const movie = api.getMovieById(movieId);
    if (!movie) return;

    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    const embedUrl = getVideoEmbedUrl(movie);

    if (embedUrl) {
        iframe.src = embedUrl;
        modal.classList.add('active');
    } else if (movie.watchUrl) {
        window.open(movie.watchUrl, '_blank');
        return;
    } else {
        showNotification('Video link not available for this movie.', 'info');
        return;
    }

    // Add to continue watching
    favoritesManager.addToContinueWatching(movieId, 0);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#E50914' : '#666'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideInNotification 0.3s ease-out;
        font-weight: 500;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Initialize application when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', async () => {
    app = new NetflixApp();
    await app.init();
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}
