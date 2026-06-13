// Netflix+ - Search Module

class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.suggestionsContainer = document.getElementById('search-suggestions');
        this.debounceTimer = null;
        this.currentQuery = '';
        this.results = [];
    }

    /**
     * Initialize search functionality
     */
    init() {
        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e);
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.currentQuery) {
                this.showSuggestions();
            }
        });

        this.searchInput.addEventListener('blur', () => {
            // Delay to allow click on suggestions
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Handle search input with debounce
     */
    handleInput(e) {
        const query = e.target.value.trim();
        this.currentQuery = query;

        clearTimeout(this.debounceTimer);

        if (query.length === 0) {
            this.hideSuggestions();
            return;
        }

        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        // Debounce search
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    /**
     * Perform search operation
     */
    performSearch(query) {
        this.results = api.searchMovies(query);
        this.displaySuggestions(this.results);
    }

    /**
     * Display search suggestions
     */
    displaySuggestions(movies) {
        if (!movies || movies.length === 0) {
            this.suggestionsContainer.innerHTML = `
                <div class="search-suggestion-item">
                    <i class="fas fa-search"></i>
                    <span>No results found for "${this.currentQuery}"</span>
                </div>
            `;
            this.showSuggestions();
            return;
        }

        // Limit to 5 suggestions
        const limitedResults = movies.slice(0, 5);

        this.suggestionsContainer.innerHTML = limitedResults.map((movie, index) => `
            <div class="search-suggestion-item" data-index="${index}" data-movie-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="search-suggestion-info">
                    <div class="search-suggestion-title">${this.highlightQuery(movie.title, this.currentQuery)}</div>
                    <div class="search-suggestion-year">${movie.year} • ${movie.genres.join(', ')}</div>
                </div>
                <i class="fas fa-arrow-right"></i>
            </div>
        `).join('');

        // Attach click listeners to suggestions
        this.suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const movieId = parseInt(e.currentTarget.dataset.movieId);
                this.selectSuggestion(movieId);
            });

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const movieId = parseInt(e.currentTarget.dataset.movieId);
                    this.selectSuggestion(movieId);
                }
            });
        });

        this.showSuggestions();
    }

    /**
     * Highlight search query in results
     */
    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    /**
     * Select a suggestion
     */
    selectSuggestion(movieId) {
        const movie = api.getMovieById(movieId);
        if (movie) {
            // Open movie modal
            openMovieModal(movieId);
            
            // Clear search
            this.searchInput.value = '';
            this.currentQuery = '';
            this.hideSuggestions();
        }
    }

    /**
     * Show suggestions container
     */
    showSuggestions() {
        this.suggestionsContainer.classList.add('active');
    }

    /**
     * Hide suggestions container
     */
    hideSuggestions() {
        this.suggestionsContainer.classList.remove('active');
    }

    /**
     * Clear search
     */
    clear() {
        this.searchInput.value = '';
        this.currentQuery = '';
        this.results = [];
        this.hideSuggestions();
    }
}

// Initialize search manager
let searchManager;

document.addEventListener('DOMContentLoaded', () => {
    searchManager = new SearchManager();
    searchManager.init();
});
