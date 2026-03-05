# CineHub 2.0 - Movie Streaming Platform

**CineHub 2.0** is a full-stack web application for discovering, rating, and managing a personal watchlist of movies and TV shows using the TMDB API.

## Tech Stack

**Backend:** Node.js, Express 5.2.1, MongoDB, Mongoose 9.2.4, JWT, bcryptjs, CORS, dotenv

**Frontend:** HTML5, Tailwind CSS 3 (CDN), Vanilla JavaScript, Material Icons, Google Fonts

**External:** TMDB API, MongoDB Atlas

## Project Structure

```
CineHub!/
├── backend/
│   ├── controllers/       # Business logic (auth, user, watchlist, ratings, admin)
│   ├── middleware/        # Auth & admin middleware
│   ├── models/            # User and Rating schemas
│   ├── routes/            # API endpoints
│   ├── server.js          # Express entry point
│   ├── package.json
│   └── .env              # Environment variables
│
└── frontend/
    ├── index.html        # Landing page
    ├── js/
    │   └── api.js        # API client & TMDB integration
    ├── pages/            # App pages (login, signup, dashboard, watchlist, profile, etc.)
    └── assets/           # Images and static files
```

## Prerequisites

- Node.js v14+ ([nodejs.org](https://nodejs.org/))
- npm v6+ (included with Node.js)
- MongoDB Atlas free account ([mongodb.com](https://www.mongodb.com/cloud/atlas))
- TMDB API key ([themoviedb.org](https://www.themoviedb.org/settings/api)) - optional but recommended

## Installation

1. **Navigate to backend folder:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file in backend directory:**
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinehub?retryWrites=true&w=majority
   JWT_SECRET=your_random_32_character_secret_key_here
   ```

3. **Get MongoDB URI:**
   - Go to MongoDB Atlas → Connect → Drivers → Copy connection string
   - Replace `<username>`, `<password>`, and database name

4. **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Running the Application

**Start Backend:**
```bash
cd backend
node server.js
```
Server runs on `http://127.0.0.1:5000`

**Open Frontend:**
- Option 1: Use Live Server extension - Right-click `frontend/index.html` → "Open with Live Server"
- Option 2: Direct file path - `file:///C:/Users/admin/OneDrive/Desktop/My Projects/CineHub!/frontend/index.html`
- Option 3: Python server - `python -m http.server 8000` (from frontend folder)

## API Endpoints

**Base URL:** `http://127.0.0.1:5000/api`

### Auth Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email & password

### User Routes (Protected)
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Watchlist Routes (Protected)
- `GET /watchlist` - Get user's watchlist
- `POST /watchlist` - Add movie to watchlist
- `DELETE /watchlist/:movieId` - Remove movie from watchlist

### Rating Routes (Protected)
- `POST /ratings` - Submit/update movie rating (1-10)
- `GET /ratings/:movieId` - Get user's rating for a movie

### Admin Routes (Protected + Admin Role)
- `GET /admin/stats` - Get platform statistics
- `GET /admin/users` - Get all users

All protected routes require `Authorization: Bearer <token>` header.

## Frontend Pages

- **index.html** - Landing page with feature showcase
- **loginpage.html** - User login
- **signuppage.html** - User registration
- **homedashboard.html** - Main dashboard with trending movies
- **advancedfilters.html** - Movie search and filtering
- **watchlist.html** - User's saved movies
- **movieDetails.html** - Full movie information
- **profilepage.html** - User profile (read-only)
- **editprofile.html** - Edit user profile
- **fullcast.html** - Full cast and crew
- **analyticsdashboard.html** - Admin statistics (admin only)

## Authentication

- Uses JWT tokens stored in localStorage
- Passwords hashed with bcryptjs (salt rounds: 10)
- Token expires after 24 hours
- Admin role required for analytics dashboard

To become admin: Database admin manually updates user's role:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
);
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found error | Run `npm install` in backend folder |
| Port 5000 already in use | Change PORT in .env to 5001, or kill process: `netstat -ano \| findstr :5000` |
| MongoDB connection failed | Verify MONGO_URI, check IP whitelist in Atlas, verify credentials |
| JWT token errors | Login again to get new token, check localStorage |
| CORS errors | Verify backend has CORS enabled, check request headers |
| Movies not loading | Check TMDB API key in api.js, verify API permissions |
| Can't login after signup | Verify backend is running, check browser console for errors |
| Watchlist not saving | Ensure JWT token is valid, check backend connection |

## Features

**User Features:**
- User registration & login with JWT authentication
- Browse and search movies/TV shows via TMDB API
- Advanced filtering by genre, year, rating
- View detailed movie information (cast, synopsis, ratings)
- Save movies to personal watchlist
- Rate movies on 1-10 scale
- Edit user profile (name, avatar, bio)
- Dark/light mode toggle

**Admin Features:**
- View platform statistics (total users, ratings, watchlist items)
- Monitor user activity and growth
- View rating distribution
- Access user management

## Future Improvements

- Password reset feature
- Social authentication (Google/GitHub)
- Email notifications
- Advanced search with suggestions
- User following system
- Watch party (real-time viewing)
- Collections/custom lists
- Mobile app (React Native)
- ML-based recommendations
- Streaming service integration
- Multi-language support
- Push notifications
- Offline mode

## Project Statistics

| Metric | Count |
|--------|-------|
| Backend Routes | 15+ endpoints |
| Frontend Pages | 11 HTML pages |
| Database Models | 2 (User, Rating) |
| Middleware Functions | 2 (Auth, Admin) |
| Controllers | 5 |
| Core Features | 14+ |
| Tech Stack | 12 technologies |

## License

MIT License - See LICENSE file for details.
