// Netflix+ - API & Data Module

const TMDB_API_KEY = ''; // Add your TMDB API key here
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const PLACEHOLDER_BASE = 'https://dummyimage.com';

function normalizeTitle(title) {
    return String(title).toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function fetchFromTMDB(path, params = {}) {
    const url = new URL(`${TMDB_BASE_URL}${path}`);
    url.searchParams.set('api_key', TMDB_API_KEY);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`TMDB request failed with status ${response.status}`);
    }

    return response.json();
}

function createPlaceholderImage(width, height, text) {
    return `${PLACEHOLDER_BASE}/${width}x${height}/1a1a1a/E50914&text=${encodeURIComponent(text)}`;
}

function createPlaceholderPoster(title) {
    return createPlaceholderImage(220, 330, title);
}

function createPlaceholderBackdrop(title) {
    return createPlaceholderImage(1400, 600, `${title} Hero`);
}

// Mock movie data (In production, this would fetch from TMDB API)
const MOCK_MOVIES = [
    {
        id: 1,
        title: "Inception",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Inception",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Inception+Hero",
        description: "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        rating: 8.8,
        year: 2010,
        genres: ["Science Fiction", "Thriller", "Action"],
        duration: 148,
        views: "1.2M",
        trending: true,
        popular: true,
        topRated: true,
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
        trailerUrl: "YoHD_XwIlNw",
        watchUrl: "https://www.youtube.com/watch?v=YoHD_XwIlNw",
        netflixUrl: "https://www.netflix.com/search?q=Inception"
    },
    {
        id: 2,
        title: "The Shawshank Redemption",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Shawshank",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Shawshank+Hero",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        rating: 9.3,
        year: 1994,
        genres: ["Drama"],
        duration: 142,
        views: "2.5M",
        trending: false,
        popular: true,
        topRated: true,
        director: "Frank Darabont",
        cast: ["Tim Robbins", "Morgan Freeman"],
        trailerUrl: "6hB3ycVmSY",
        watchUrl: "https://www.youtube.com/watch?v=6hB3ycVmSY",
        netflixUrl: "https://www.netflix.com/search?q=The%20Shawshank%20Redemption"
    },
    {
        id: 3,
        title: "Interstellar",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Interstellar",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Interstellar+Hero",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        rating: 8.7,
        year: 2014,
        genres: ["Science Fiction", "Drama", "Adventure"],
        duration: 169,
        views: "1.8M",
        trending: true,
        popular: true,
        topRated: true,
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        trailerUrl: "zSID6AWvCck",
        watchUrl: "https://www.youtube.com/watch?v=zSID6AWvCck",
        netflixUrl: "https://www.netflix.com/search?q=Interstellar"
    },
    {
        id: 4,
        title: "The Dark Knight",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Dark+Knight",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Dark+Knight+Hero",
        description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on Gotham.",
        rating: 9.0,
        year: 2008,
        genres: ["Action", "Crime", "Drama"],
        duration: 152,
        views: "2.1M",
        trending: true,
        popular: true,
        topRated: true,
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        trailerUrl: "EXeTwQNYAfQ",
        watchUrl: "https://www.youtube.com/watch?v=EXeTwQNYAfQ",
        netflixUrl: "https://www.netflix.com/search?q=The%20Dark%20Knight"
    },
    {
        id: 5,
        title: "Pulp Fiction",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Pulp+Fiction",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Pulp+Fiction+Hero",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        rating: 8.9,
        year: 1994,
        genres: ["Crime", "Drama"],
        duration: 154,
        views: "1.9M",
        trending: false,
        popular: true,
        topRated: true,
        director: "Quentin Tarantino",
        cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
        trailerUrl: "s7EdQ4FqJx0",
        watchUrl: "https://www.youtube.com/watch?v=s7EdQ4FqJx0",
        netflixUrl: "https://www.netflix.com/search?q=Pulp%20Fiction"
    },
    {
        id: 6,
        title: "Avatar",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Avatar",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Avatar+Hero",
        description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following orders and protecting the world he feels is his home.",
        rating: 8.0,
        year: 2009,
        genres: ["Science Fiction", "Action", "Adventure"],
        duration: 162,
        views: "2.8M",
        trending: true,
        popular: true,
        topRated: false,
        director: "James Cameron",
        cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
        trailerUrl: "5PSNL1qE6VE",
        watchUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VE",
        netflixUrl: "https://www.netflix.com/search?q=Avatar"
    },
    {
        id: 7,
        title: "Forrest Gump",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Forrest+Gump",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Forrest+Gump+Hero",
        description: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.",
        rating: 8.8,
        year: 1994,
        genres: ["Drama", "Romance"],
        duration: 142,
        views: "1.5M",
        trending: false,
        popular: true,
        topRated: true,
        director: "Robert Zemeckis",
        cast: ["Tom Hanks", "Sally Field", "Gary Sinise"],
        trailerUrl: "bLvqoByUGSM",
        watchUrl: "https://www.youtube.com/watch?v=bLvqoByUGSM",
        netflixUrl: "https://www.netflix.com/search?q=Forrest%20Gump"
    },
    {
        id: 8,
        title: "The Matrix",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=The+Matrix",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Matrix+Hero",
        description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        rating: 8.7,
        year: 1999,
        genres: ["Science Fiction", "Action"],
        duration: 136,
        views: "2.3M",
        trending: true,
        popular: true,
        topRated: true,
        director: "Lana Wachowski, Lilly Wachowski",
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        trailerUrl: "vKQi3bBA1y8",
        watchUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
        netflixUrl: "https://www.netflix.com/search?q=The%20Matrix"
    },
    {
        id: 9,
        title: "Gladiator",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Gladiator",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Gladiator+Hero",
        description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.",
        rating: 8.5,
        year: 2000,
        genres: ["Action", "Drama", "Adventure"],
        duration: 155,
        views: "1.7M",
        trending: false,
        popular: true,
        topRated: true,
        director: "Ridley Scott",
        cast: ["Russell Crowe", "Joaquin Phoenix", "Lucilla"],
        trailerUrl: "owK1qxDsel8",
        watchUrl: "https://www.youtube.com/watch?v=owK1qxDsel8",
        netflixUrl: "https://www.netflix.com/search?q=Gladiator"
    },
    {
        id: 10,
        title: "The Godfather",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Godfather",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Godfather+Hero",
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his youngest son.",
        rating: 9.2,
        year: 1972,
        genres: ["Crime", "Drama"],
        duration: 175,
        views: "2.2M",
        trending: false,
        popular: true,
        topRated: true,
        director: "Francis Ford Coppola",
        cast: ["Marlon Brando", "Al Pacino", "James Caan"],
        trailerUrl: "sY1S34973zA",
        watchUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
        netflixUrl: "https://www.netflix.com/search?q=The%20Godfather"
    },
    {
        id: 11,
        title: "Titanic",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Titanic",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Titanic+Hero",
        description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
        rating: 7.8,
        year: 1997,
        genres: ["Drama", "Romance"],
        duration: 194,
        views: "2.6M",
        trending: false,
        popular: true,
        topRated: false,
        director: "James Cameron",
        cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
        trailerUrl: "CHYeKg4bUkE",
        watchUrl: "https://www.youtube.com/watch?v=CHYeKg4bUkE",
        netflixUrl: "https://www.netflix.com/search?q=Titanic"
    },
    {
        id: 12,
        title: "Avengers: Endgame",
        poster: "https://dummyimage.com/220x330/1a1a1a/E50914&text=Endgame",
        backdrop: "https://dummyimage.com/1400x600/0a0a0a/E50914&text=Endgame+Hero",
        description: "After the devastating events, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
        rating: 8.4,
        year: 2019,
        genres: ["Action", "Adventure", "Drama"],
        duration: 181,
        views: "3.0M",
        trending: true,
        popular: true,
        topRated: false,
        director: "Anthony Russo, Joe Russo",
        cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
        trailerUrl: "TcmdMP6mklA",
        watchUrl: "https://www.youtube.com/watch?v=TcmdMP6mklA",
        netflixUrl: "https://www.netflix.com/search?q=Avengers%3A%20Endgame"
    }
];

// Categories
const CATEGORIES = [
    { name: "Action", icon: "ðŸ”¥" },
    { name: "Drama", icon: "ðŸŽ­" },
    { name: "Comedy", icon: "ðŸ˜‚" },
    { name: "Horror", icon: "ðŸ‘»" },
    { name: "Sci-Fi", icon: "ðŸš€" },
    { name: "Romance", icon: "ðŸ’•" },
    { name: "Thriller", icon: "ðŸ˜¨" },
    { name: "Animation", icon: "ðŸŽ¨" }
];

// API Manager Class
class NetflixAPI {
    constructor() {
        this.movies = MOCK_MOVIES;
        this.allMovies = [...MOCK_MOVIES];
    }

    async init() {
        if (!TMDB_API_KEY.trim()) {
            return;
        }

        try {
            await this.loadTMDBImages();
        } catch (error) {
            console.warn('TMDB image loading failed:', error);
        }
    }

    async loadTMDBImages() {
        const endpoints = [
            '/trending/movie/week',
            '/movie/popular',
            '/movie/top_rated',
            '/movie/upcoming'
        ];

        const allResults = [];

        for (const endpoint of endpoints) {
            try {
                const data = await fetchFromTMDB(endpoint, { language: 'en-US', page: 1 });
                if (Array.isArray(data.results)) {
                    allResults.push(...data.results);
                }
            } catch (error) {
                console.warn(`TMDB request failed for ${endpoint}:`, error);
            }
        }

        this.updateMoviesFromTMDB(allResults);
    }

    updateMoviesFromTMDB(results) {
        results.forEach(result => {
            const titleKey = normalizeTitle(result.title || result.name || '');
            if (!titleKey) return;

            const localMovie = this.movies.find(movie => normalizeTitle(movie.title) === titleKey);
            if (!localMovie) return;

            if (result.poster_path) {
                localMovie.poster = `${TMDB_IMAGE_BASE}${result.poster_path}`;
            }

            if (result.backdrop_path) {
                localMovie.backdrop = `${TMDB_BACKDROP_BASE}${result.backdrop_path}`;
            }

            if (typeof result.vote_average === 'number' && result.vote_average > 0) {
                localMovie.rating = result.vote_average;
            }

            if (typeof result.release_date === 'string' && result.release_date.length >= 4) {
                const year = parseInt(result.release_date.slice(0, 4), 10);
                if (!Number.isNaN(year)) {
                    localMovie.year = year;
                }
            }
        });
    }

    /**
     * Get trending movies
     */
    getTrendingMovies() {
        return this.movies.filter(movie => movie.trending).slice(0, 12);
    }

    /**
     * Get popular movies
     */
    getPopularMovies() {
        return this.movies.filter(movie => movie.popular).slice(0, 12);
    }

    /**
     * Get top-rated movies
     */
    getTopRatedMovies() {
        return this.movies.filter(movie => movie.topRated).sort((a, b) => b.rating - a.rating).slice(0, 12);
    }

    /**
     * Get new releases
     */
    getNewReleases() {
        return this.movies.sort((a, b) => b.year - a.year).slice(0, 12);
    }

    /**
     * Search movies by title or description
     */
    searchMovies(query) {
        if (!query) return [];
        
        const q = query.toLowerCase();
        return this.allMovies.filter(movie => 
            movie.title.toLowerCase().includes(q) || 
            movie.description.toLowerCase().includes(q) ||
            movie.genres.some(g => g.toLowerCase().includes(q))
        );
    }

    /**
     * Get movie by ID
     */
    getMovieById(id) {
        return this.movies.find(movie => movie.id === parseInt(id));
    }

    /**
     * Get movies by genre
     */
    getMoviesByGenre(genre) {
        return this.movies.filter(movie => 
            movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
        );
    }

    /**
     * Get all categories
     */
    getCategories() {
        return CATEGORIES;
    }

    /**
     * Simulate Continue Watching data
     */
    getContinueWatching() {
        return this.movies.slice(0, 6).map(movie => ({
            ...movie,
            progress: Math.floor(Math.random() * 80)
        }));
    }

    /**
     * Get all movies with pagination
     */
    getAllMovies(page = 1, limit = 12) {
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            movies: this.allMovies.slice(start, end),
            total: this.allMovies.length,
            page,
            totalPages: Math.ceil(this.allMovies.length / limit)
        };
    }

    /**
     * Simulate infinite scroll loading
     */
    loadMoreMovies(page = 1) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.getAllMovies(page));
            }, 500);
        });
    }
}

// Create API instance
const api = new NetflixAPI();

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { api, CATEGORIES, MOCK_MOVIES };
}

