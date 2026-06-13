// Netflix+ - Favorites/Watchlist Module

class FavoritesManager {
    constructor() {
        this.STORAGE_KEY = 'netflix_favorites';
        this.WATCHING_KEY = 'netflix_watching';
        this.favorites = this.loadFavorites();
        this.continueWatching = this.loadContinueWatching();
    }

    /**
     * Load favorites from localStorage
     */
    loadFavorites() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Load continue watching from localStorage
     */
    loadContinueWatching() {
        const stored = localStorage.getItem(this.WATCHING_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Save favorites to localStorage
     */
    saveFavorites() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
        this.updateFavoritesUI();
    }

    /**
     * Save continue watching to localStorage
     */
    saveContinueWatching() {
        localStorage.setItem(this.WATCHING_KEY, JSON.stringify(this.continueWatching));
    }

    /**
     * Add movie to favorites
     */
    addFavorite(movieId) {
        const movie = api.getMovieById(movieId);
        if (movie && !this.isFavorite(movieId)) {
            this.favorites.push({
                ...movie,
                addedAt: new Date().toISOString()
            });
            this.saveFavorites();
            return true;
        }
        return false;
    }

    /**
     * Remove movie from favorites
     */
    removeFavorite(movieId) {
        this.favorites = this.favorites.filter(m => m.id !== movieId);
        this.saveFavorites();
        return true;
    }

    /**
     * Toggle favorite status
     */
    toggleFavorite(movieId) {
        if (this.isFavorite(movieId)) {
            return this.removeFavorite(movieId);
        } else {
            return this.addFavorite(movieId);
        }
    }

    /**
     * Check if movie is favorite
     */
    isFavorite(movieId) {
        return this.favorites.some(m => m.id === movieId);
    }

    /**
     * Get all favorites
     */
    getFavorites() {
        return this.favorites;
    }

    /**
     * Get favorite count
     */
    getFavoriteCount() {
        return this.favorites.length;
    }

    /**
     * Add to continue watching
     */
    addToContinueWatching(movieId, progress = 0) {
        const movie = api.getMovieById(movieId);
        if (!movie) return false;

        // Remove if already exists
        this.continueWatching = this.continueWatching.filter(m => m.id !== movieId);

        // Add to beginning
        this.continueWatching.unshift({
            ...movie,
            progress: progress,
            watchedAt: new Date().toISOString()
        });

        // Keep only last 20
        if (this.continueWatching.length > 20) {
            this.continueWatching = this.continueWatching.slice(0, 20);
        }

        this.saveContinueWatching();
        return true;
    }

    /**
     * Update continue watching progress
     */
    updateProgress(movieId, progress) {
        const item = this.continueWatching.find(m => m.id === movieId);
        if (item) {
            item.progress = progress;
            item.watchedAt = new Date().toISOString();
            this.saveContinueWatching();
            return true;
        }
        return false;
    }

    /**
     * Remove from continue watching
     */
    removeFromContinueWatching(movieId) {
        this.continueWatching = this.continueWatching.filter(m => m.id !== movieId);
        this.saveContinueWatching();
        return true;
    }

    /**
     * Get continue watching
     */
    getContinueWatching() {
        return this.continueWatching;
    }

    /**
     * Update favorites count in UI
     */
    updateFavoritesUI() {
        const favCountEl = document.querySelector('.fav-count');
        if (favCountEl) {
            favCountEl.textContent = this.getFavoriteCount();
        }
    }

    /**
     * Clear all favorites
     */
    clearFavorites() {
        if (confirm('Are you sure you want to clear all favorites?')) {
            this.favorites = [];
            this.saveFavorites();
            return true;
        }
        return false;
    }

    /**
     * Export favorites as JSON
     */
    exportFavorites() {
        const dataStr = JSON.stringify(this.favorites, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `netflix-favorites-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    /**
     * Import favorites from JSON
     */
    importFavorites(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.favorites = imported;
                    this.saveFavorites();
                    alert('Favorites imported successfully!');
                }
            } catch (err) {
                alert('Error importing favorites:', err);
            }
        };
        reader.readAsText(file);
    }
}

// Initialize favorites manager
const favoritesManager = new FavoritesManager();

// Update UI on page load
document.addEventListener('DOMContentLoaded', () => {
    favoritesManager.updateFavoritesUI();

    // Add event delegation for favorite buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action-btn-favorite')) {
            const card = e.target.closest('.movie-card');
            const movieId = parseInt(card.dataset.movieId);
            
            const btn = e.target.closest('.action-btn-favorite');
            const isNowFavorite = favoritesManager.toggleFavorite(movieId);
            
            if (isNowFavorite) {
                btn.classList.add('liked');
                showNotification(`Added to favorites!`, 'success');
            } else {
                btn.classList.remove('liked');
                showNotification(`Removed from favorites`, 'info');
            }
        }
    });
});

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
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}
