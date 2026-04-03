# 🍳 PantryPal Backend API

A RESTful API built with Node.js, Express, and MongoDB for a recipe management application.

## Features

- 🔐 User Authentication (JWT)
- 📝 Recipe CRUD Operations
- ❤️ Favorite Recipes
- 🔍 Search & Filter Recipes
- 🌐 CORS Enabled
- ☁️ Serverless-ready (Vercel)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Deployment**: Vercel Serverless Functions

## Project Structure

```
backend/
├── api/
│   └── index.js          # Main application entry point
├── config/
│   └── db.js             # Database connection configuration
├── models/
│   ├── User.js           # User schema with auth methods
│   └── Recipe.js         # Recipe schema
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── .env                  # Environment variables (local only)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
└── vercel.json           # Vercel deployment configuration
```

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: A secure random string (min 32 chars)
# - PORT: 5000 (default)
```

4. **Run the server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Public Routes

```
GET     /                          # Welcome message
GET     /api/recipes               # Get all recipes
GET     /api/recipes/:id           # Get single recipe
GET     /api/recipes/search        # Search recipes
POST    /api/auth/register         # Register new user
POST    /api/auth/login            # Login user
```

### Protected Routes (Require Authentication)

```
GET     /api/auth/me                       # Get current user
POST    /api/recipes                       # Create recipe
PUT     /api/recipes/:id                   # Update recipe
DELETE  /api/recipes/:id                   # Delete recipe
POST    /api/auth/favorites/:recipeId      # Add/remove favorite
GET     /api/auth/favorites                # Get favorites
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Request

```javascript
const response = await fetch('https://your-api.vercel.app/api/recipes', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
```

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deploy

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd backend
vercel --prod
```

4. **Set Environment Variables**

In Vercel Dashboard or using CLI:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add PORT
```

5. **Redeploy**
```bash
vercel --prod
```

### Environment Variables for Production

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT signing | ✅ Yes |
| `PORT` | Server port (default: 5000) | ❌ No |

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free cluster (M0)

2. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Set username and password

3. **Whitelist IP**
   - Go to Network Access
   - Add IP Address
   - Choose "Allow access from anywhere" (0.0.0.0/0)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Testing the API

### Using cURL

```bash
# Test root endpoint
curl https://your-api.vercel.app/

# Register a user
curl -X POST https://your-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get recipes (with token)
curl https://your-api.vercel.app/api/recipes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for base URL and token
3. Create requests for each endpoint
4. Use pre-request scripts to handle authentication

## Security Best Practices

- ✅ Passwords are hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens expire after 30 days
- ✅ Password field is excluded from user responses
- ✅ CORS is configured with specific origins
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints

## Error Handling

All errors return consistent JSON format:

```json
{
  "message": "Error description here"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider adding:
- Express rate limiting middleware
- Vercel's built-in rate limiting
- Third-party services like Cloudflare

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review MongoDB Atlas logs

---

**Built with ❤️ using Node.js and MongoDB**
