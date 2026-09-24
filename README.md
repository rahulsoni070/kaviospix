# KaviosPix

A Google Photos–style image management app: sign in with Google, create albums, upload photos with tags, mark favorites, add comments, and share albums with friends.
Built with a React frontend, Express/Node backend, MongoDB (Mongoose) database, Cloudinary for image storage, and Google OAuth 2.0 + JWT authentication with owner/shared-user permissions.

## Demo Link

[Live Demo](https://kaviospix-rahul.vercel.app)  •  [Backend API](https://kaviospix-backend-kpzw.onrender.com)

> The backend runs on Render's free plan and sleeps after ~15 minutes of inactivity. The first request can take about 50 seconds while it wakes up.

## Login

Sign in with any Google account. No password or sign-up needed.

To try sharing, open the app in a second browser (or an Incognito window) and sign in with a different Google account. That account will then appear in the share dropdown.

## Quick Start

The frontend and backend are in separate GitHub repos.

### Backend

```
git clone https://github.com/rahulsoni070/kaviospix-backend.git
cd kaviospix-backend
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Frontend

```
git clone https://github.com/rahulsoni070/kaviospix-frontend.git
cd kaviospix-frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Environment Variables

Create a `.env` file in the backend with:

```
PORT=3000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

Create a `.env` file in the frontend with:

```
VITE_SERVER_URL=http://localhost:3000
```

In Google Cloud Console, create an OAuth client (Web application) and add `http://localhost:3000/auth/google/callback` as an Authorized redirect URI.

## Technologies

* React JS
* React Router
* Vite
* Axios
* Node.js
* Express
* MongoDB (Mongoose)
* Passport.js (Google OAuth 2.0)
* JWT (JSON Web Token)
* Multer
* Cloudinary
* Helmet, CORS, express-rate-limit
* Deployed on Vercel (frontend), Render (backend) and MongoDB Atlas

## Features

### Landing Page

* Public home page that explains the app to new visitors
* Any action, like creating an album, sends the visitor to sign in first

### Authentication

* Sign in with Google (OAuth 2.0)
* JWT issued after login and sent with every API request
* Protected pages; expired or invalid tokens log the user out automatically

### Albums

* Create albums with a name and description
* Edit an album's description directly from the Home page (owner only)
* Search albums by name
* Delete an album along with all its photos (files are also removed from Cloudinary)
* "My albums" and "Shared with me" sections

### Photos

* Upload images (jpg, png, gif, etc.) up to 5MB
* Add tags, person name, and favorite status while uploading
* Photo grid with pagination
* Mark or unmark photos as favorite
* Delete photos

### Comments

* Add comments to any photo in an album you can access
* Each comment shows the author's name, profile photo, and time

### Search & Filters

* Search photos by tag: results appear after typing 3 letters, and partial tags match (`bea` finds `#beach`)
* Show favorites only

### Sharing & Permissions

* Share an album by picking a registered user from a dropdown, so there's no guessing emails
* Users who already have access are hidden from the dropdown

| Action | Owner | Shared user |
| --- | :---: | :---: |
| View album and photos | ✅ | ✅ |
| Add comments | ✅ | ✅ |
| Upload, favorite or delete photos | ✅ | ❌ |
| Edit, share or delete the album | ✅ | ❌ |

### Responsive Design

* Works on phones, tablets and desktops (tested from 360px wide)

### Security

* Helmet security headers
* CORS restricted to the frontend URL
* Rate limiting (100 requests per 15 minutes per IP)
* 10kb JSON body limit
* File type and size checked on both frontend and backend
* A photo can only be accessed through the album it belongs to (prevents IDOR)

## API Reference

Auth routes are served under `/auth`; all other routes are served under `/api`. All `/api` routes require an `Authorization: Bearer <token>` header.

### Auth

`GET /auth/google` — Start Google sign-in

`GET /auth/google/callback` — Google redirects here after sign-in; the backend then redirects to `<CLIENT_URL>/oauth-success?token=<JWT>`

`GET /api/me` — Get the logged-in user
Sample Response:

```
{ "_id": "...", "name": "...", "email": "...", "avatar": "..." }
```

### Users

`GET /api/users` — List other registered users (used by the share dropdown)
Sample Response:

```
[{ "_id": "...", "name": "...", "email": "...", "avatar": "..." }, ...]
```

### Albums

`GET /api/albums` — List albums you own and albums shared with you
Sample Response:

```
[{ "_id": "...", "name": "Goa 2024", "description": "...", "ownerId": "...", "sharedWith": ["friend@gmail.com"] }, ...]
```

`POST /api/albums` — Create an album
Body:

```
{ "name": "Goa 2024", "description": "Photos from my trip to Goa" }
```

`GET /api/albums/:albumId` (owner or shared) — Get one album
Sample Response:

```
{ "_id": "...", "name": "...", "description": "...", "ownerId": { "_id": "...", "name": "...", "email": "...", "avatar": "..." }, "sharedWith": [...], "imageCount": 4, "isOwner": true }
```

`PUT /api/albums/:albumId` (owner) — Update album description
Body:

```
{ "description": "Updated description for the album" }
```

`DELETE /api/albums/:albumId` (owner) — Delete the album and all its photos
Sample Response:

```
{ "message": "Album deleted", "albumId": "...", "imagesDeleted": 4 }
```

`POST /api/albums/:albumId/share` (owner) — Share with registered users by email
Body:

```
{ "emails": ["friend@gmail.com"] }
```

### Images

`GET /api/albums/:albumId/images` (owner or shared) — List photos (supports `page`, `limit` (max 50) and `tags`)
Sample Response:

```
{ "images": [{ "_id": "...", "name": "beach.jpg", "imageUrl": "https://res.cloudinary.com/...", "tags": ["beach"], "person": "Rahul", "isFavorite": true, "size": 310053, "comments": [...], "uploadedAt": "..." }], "page": 1, "limit": 20, "total": 4, "totalPages": 1 }
```

`GET /api/albums/:albumId/images?tags=bea` — Filter photos by tag (matches tags that start with the text, e.g. `bea` → `beach`)

`GET /api/albums/:albumId/images/favorites` (owner or shared) — List favorite photos

`POST /api/albums/:albumId/images` (owner) — Upload a photo (multipart/form-data)
Fields: `image` (file), `tags` (e.g. `beach, sunset`), `person`, `isFavorite`

`PUT /api/albums/:albumId/images/:imageId/favorite` (owner) — Mark or unmark as favorite
Body:

```
{ "isFavorite": true }
```

`POST /api/albums/:albumId/images/:imageId/comments` (owner or shared) — Add a comment (max 500 characters)
Body:

```
{ "comment": "Beautiful sunset!" }
```

Sample Response:

```
{ "_id": "...", "text": "Beautiful sunset!", "userId": { "_id": "...", "name": "...", "avatar": "..." }, "createdAt": "..." }
```

`DELETE /api/albums/:albumId/images/:imageId` (owner) — Delete a photo (also removed from Cloudinary)

### Error Responses

| Status | Meaning |
| --- | --- |
| 400 | Invalid id, missing field, wrong file type or file too large |
| 401 | Missing, invalid or expired token |
| 403 | Logged in, but not allowed (e.g. a shared user trying to delete) |
| 404 | Album or photo not found |

## Design Decisions

* **Cloudinary for images:** photos are stored on Cloudinary; MongoDB only stores the image URL and `publicId` (used to delete the file later).
* **MongoDB `_id` as the id:** every document already has a unique `_id`, so no separate UUID field is used.
* **Emails in `sharedWith`:** albums store lowercased emails, which makes "shared with me" a simple lookup by the user's email.
* **Share dropdown:** users pick from registered accounts instead of typing an email, so sharing can't fail because of a typo or an unknown user. The backend still validates every share.
* **Prefix tag search:** tags are stored in lowercase, and the search matches the start of a tag (`^bea`), which works well with the `{ albumId, tags }` index.
* **Comments as objects:** each comment stores `text`, `userId` and `createdAt` instead of a plain string, so the app can show who wrote it and when.
* **JWT instead of sessions:** stateless auth that works across the separate frontend (Vercel) and backend (Render) domains.

## Contact

For bugs or feature requests, please reach out to [rahulsoni66676@gmail.com](mailto:rahulsoni66676@gmail.com)