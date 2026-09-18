# VidPlay — Full-Stack Video Streaming Platform

A production-ready video streaming platform built with Node.js/Express/MongoDB on the backend and React 19/Redux Toolkit/Vite on the frontend.

---

## 🏗 System Architecture

### Backend (`/backend`)
- **Runtime & Framework:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Dual-token JWT (Short-lived Access Token + Long-lived Refresh Token)
  - Transmitted via `httpOnly` secure cookies as well as Bearer authorization headers
  - In-memory cache with auto-TTL for user lookups
  - Optional JWT verification middleware (`optionalVerifyJWT`) enabling public guest access to video player and comment feeds
- **Media Storage:** Cloudinary integration with automatic local file cleanup upon upload and deletion handling for both videos and image assets
- **Security & Error Handling:** Standardized `ApiError` and `ApiResponse` envelope, CORS with credential support, centralized cookie configuration for dev vs. prod

### Frontend (`/yt`)
- **UI Framework:** React 19, Vite, React Router v7
- **State Management:** **Redux Toolkit** (`@reduxjs/toolkit` and `react-redux`)
  - **Zero custom hooks abstraction:** All backend data operations flow cleanly through centralized Redux async thunks (`createAsyncThunk`)
  - Components directly interface with state via standard `useDispatch` and `useSelector`
  - Slices: `authSlice`, `videoSlice`, `commentSlice`, `likeSlice`, `subscriptionSlice`, `playlistSlice`, `dashboardSlice`, `channelSlice`, `historySlice`
- **Network Layer:** Axios client configured with credentials, automatic token attachment via request interceptor, and transparent 401 token refresh queue
- **Session Persistence:** Persistent token & user sync across browser refreshes via `authStorage`

---

## 🚀 Getting Started

### 1. Backend Setup

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env` (refer to `.env.example`):
   ```env
   PORT=8000
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net
   DB_NAME=videotube
   CORS_ORIGIN=http://localhost:5173

   ACCESS_TOKEN_SECRET=<your-access-token-secret>
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a terminal in `yt/`:
   ```bash
   cd yt
   npm install
   ```

2. Configure environment variables in `yt/.env` (refer to `.env.example`):
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Route Protection & Access Model

| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/` | **Public** | Home feed with video grid, search query, and pagination |
| `/video/:videoId` | **Public** | Video playback, description, view count, and public comment list |
| `/channel/:username` | **Public** | Creator profile, avatar, cover banner, subscriber counts, and video catalog |
| `/login` / `/register` | **Public** | Account authentication & user creation |
| `/publish-video` | **Protected** | Upload video file and thumbnail with progress handling |
| `/dashboard` | **Protected** | Creator analytics, uploaded videos management, delete action, profile editing |
| `/playlists` | **Protected** | User playlist management |
| `/playlists/:id` | **Protected** | Playlist contents view and video removal |
| `/liked-videos` | **Protected** | Collection of liked videos |
| `/history` | **Protected** | User watch history |

---

## 🛠 Key Engineering Fixes Applied

1. **Elimination of Custom Hooks:** Removed all 8 `*.hooks.js` wrappers in accordance with requirements. Replaced with predictable, standard Redux slices.
2. **Cloudinary Key Typo Resolution:** Resolved spelling discrepancies (`CLOUDNIARY_*` vs `CLOUDINARY_*`), ensuring reliable file uploads to Cloudinary and safe unlinking of temporary uploads.
3. **MongoDB Connection String:** Switched from URI path concatenation (which corrupted URI query params) to explicit `{ dbName }` option in `mongoose.connect`.
4. **Cookie Security Alignment:** Centralized cookie creation so `secure: true, sameSite: "none"` is applied only in production HTTPS, avoiding dropped cookies on localhost development.
5. **Guest Viewing & Optional Auth:** Added `optionalVerifyJWT` so users can browse videos, channels, and read comments without requiring immediate login, while maintaining seamless tracking when logged in.