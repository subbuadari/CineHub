const TMDB_API_KEY = "enter_Your_Api_key_here";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMG_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original";
const BACKEND_URL = "http://127.0.0.1:5000/api";

async function fetchMovies(endpoint, params = {}) {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching movies:', error);
        return null;
    }
}

// Backend API Helper
async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (requiresAuth) {
        const token = localStorage.getItem('cinehub_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    } catch (error) {
        console.error(`Error with API call to ${endpoint}:`, error);
        throw error;
    }
}

// Common functions
const getTrending = () => fetchMovies('/trending/movie/day');
const getPopular = () => fetchMovies('/movie/popular');
const getMovieDetails = (id) => fetchMovies(`/movie/${id}`, { append_to_response: 'videos,credits,reviews' });
const searchMovies = (query) => fetchMovies('/search/movie', { query });
const getGenres = () => fetchMovies('/genre/movie/list');
const discoverMovies = (params) => fetchMovies('/discover/movie', params);
const getMovieVideos = (id) => fetchMovies(`/movie/${id}/videos`);
const getMovieCredits = (id) => fetchMovies(`/movie/${id}/credits`);
const getRecommendations = (id) => fetchMovies(`/movie/${id}/recommendations`);
const getMovieReviews = (id) => fetchMovies(`/movie/${id}/reviews`);

// Watchlist Management (Backend)
const getWatchlist = () => apiCall('/watchlist');
const addToWatchlist = (movie) => apiCall('/watchlist', 'POST', {
    movieId: movie.id.toString(),
    title: movie.title,
    posterPath: movie.poster_path
});
const removeFromWatchlist = (movieId) => apiCall(`/watchlist/${movieId}`, 'DELETE');

// User Authentication
const login = async (email, password) => {
    const data = await apiCall('/auth/login', 'POST', { email, password }, false);
    localStorage.setItem('cinehub_token', data.token);
    localStorage.setItem('userProfile', JSON.stringify(data));
    localStorage.setItem('isAdmin', data.role === 'admin' ? 'true' : 'false');
    return data;
};

const register = async (name, email, password) => {
    const data = await apiCall('/auth/register', 'POST', { name, email, password }, false);
    localStorage.setItem('cinehub_token', data.token);
    localStorage.setItem('userProfile', JSON.stringify(data));
    localStorage.setItem('isAdmin', 'false'); // Registration always creates standard users
    return data;
};

const logout = () => {
    localStorage.removeItem('cinehub_token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isAdmin');
    window.location.href = '../index.html';
};

// Admin Functions
const getAdminStats = () => apiCall('/admin/stats');
const getAllUsers = () => apiCall('/admin/users');

// Rating Functions
const submitRating = (movieId, rating) => apiCall('/ratings', 'POST', { movieId, rating });
const getUserRating = (movieId) => apiCall(`/ratings/${movieId}`);
const getRatingsDistribution = () => apiCall('/admin/ratings-distribution');

// Export for use in HTML files
window.TMDB = {
    getTrending,
    getPopular,
    getMovieDetails,
    searchMovies,
    getGenres,
    discoverMovies,
    getMovieVideos,
    getMovieCredits,
    getRecommendations,
    getMovieReviews,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    login,
    register,
    logout,
    getAdminStats,
    getAllUsers,
    submitRating,
    getUserRating,
    getRatingsDistribution,
    sharePage: async (data) => {
        const shareData = {
            title: data?.title || document.title,
            text: data?.text || 'Check this out on CineHub!',
            url: data?.url || window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    },
    IMG_URL: TMDB_IMG_URL,
    BACKDROP_URL: TMDB_BACKDROP_URL,
    loadUserProfile: async () => {
        let userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const token = localStorage.getItem('cinehub_token');

        if (token && (!userProfile.name || !userProfile.avatar)) {
            try {
                userProfile = await apiCall('/user/profile');
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        }

        const userName = userProfile.name || 'Alex Rivera';
        const userAvatar = userProfile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKzA5ybjRfv36cGqnATfi_S9vobe8Ma58Gw2o1AUXYESjAbweszYdctWyToM6brwkkq_6rrkoeeAbdz2oTdOko8hvnwFsKJCMA144LYsfUSL4T-1WE19t32V-V1nNBdag3U-9W5IfJRQSzrCMZSckg1riV6_ahFi0Y6vGEkDI33kQb_VeV7UHAptZxla4jmw3Inrdx2XMK0bGfjOk7JxwteSC8ygDpjrweKqfttp5bVz8_fzm_lQ4ayVq8G-a5lobAne1j9F3Uois';

        // Update Name globally
        document.querySelectorAll('.user-name, [data-user-name]').forEach(el => el.textContent = userName);

        // Update name in headers (targeting "Alex Rivera")
        document.querySelectorAll('h1, h2, p').forEach(el => {
            if (el.textContent.trim() === 'Alex Rivera') {
                el.textContent = userName;
            }
        });

        // Update Avatars globally
        document.querySelectorAll('img').forEach(img => {
            const isProfileLink = img.closest('a[href="profilepage.html"]');
            const isDefaultAvatar = img.src.includes('googleusercontent.com') && (img.classList.contains('rounded-full') || img.classList.contains('size-10'));

            if (isProfileLink || isDefaultAvatar) {
                img.src = userAvatar;
            }
        });

        // Toggle Admin-only features
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        document.querySelectorAll('.admin-only').forEach(el => {
            if (isAdmin) {
                el.classList.remove('hidden');
                el.style.display = ''; // Reset display style
            } else {
                el.classList.add('hidden');
                el.style.display = 'none';
            }
        });
    }
};

// Auto-load profile data on every page that includes api.js
document.addEventListener('DOMContentLoaded', () => {
    if (window.TMDB && window.TMDB.loadUserProfile) {
        window.TMDB.loadUserProfile();
    }
});
