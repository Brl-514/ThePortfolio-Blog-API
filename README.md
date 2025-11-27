# Backend API - Portfolio & Blog

Backend RESTful API for the Portfolio & Blog application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio-blog
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Start server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Documentation

See main README.md for complete API endpoint documentation.

## Database Models

- **User**: Authentication and user management
- **Blog**: Blog post content (with author references)
- **Project**: Portfolio/portfolio projects
- **Comment**: Blog comments linked to posts and users
- **Message**: Contact form submissions

## Authentication

All admin endpoints require:
1. Valid JWT token in Authorization header: `Bearer <token>`
2. User role must be 'admin'

