# ProViewz

ProViewz is a MERN stack website where users can share and review gadgets. Users can create profiles, post gadget reviews with images, and interact with other users' posts through ratings and comments.

## Live Demo

[ProViewz Demo](https://proviewz.onrender.com)

**Note:** Please allow a few seconds for the backend to load when accessing the demo site.

## Features

- User authentication (login/signup)
- User profiles with name, occupation, bio, location, and profile image
- Create posts about gadgets with:
  - Image
  - Title
  - Description
  - Pros and cons
  - Tags
  - Category
- Rate posts (1-5 stars)
- Comment on posts
- Like posts
- Search functionality (matches title, description, or tags)
- Delete own posts and profile

## Tech Stack

- Frontend: React
- Backend: Node.js with Express
- Database: MongoDB

## Dependencies

### Backend

- bcryptjs: ^2.4.3
- cors: ^2.8.5
- dotenv: ^16.4.5
- express: ^4.19.2
- express-rate-limit: ^7.3.1
- jsonwebtoken: ^9.0.2
- mongoose: ^8.4.1
- multer: ^1.4.5-lts.1

### Frontend

- @fortawesome/fontawesome-free: ^6.5.2
- @testing-library/jest-dom: ^5.17.0
- @testing-library/react: ^13.4.0
- @testing-library/user-event: ^13.5.0
- axios: ^1.7.2
- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^6.23.1
- react-scripts: 5.0.1

## Installation

1. Clone the repository
git clone https://github.com/imdevk/proviewz.git
cd proviewz
Copy
2. Install backend dependencies
cd backend
npm install
Copy
3. Install frontend dependencies
cd ../frontend
npm install
Copy
4. Set up environment variables
- Create a `.env` file in the backend directory
- Add necessary environment variables (MONGODB_URI, JWT_SECRET)

5. Run the application
- Start the backend server
  ```
  cd backend
  node server.js
  ```
- Start the frontend development server
  ```
  cd frontend
  npm start
  ```

6. Open your browser and navigate to `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
