# URL Shortener (minimal) 🔧

Node.js/Express backend API for the URL Shortener application with MongoDB integration and basic analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
npm install
cp .env.example .env
```

### Environment Setup
Configure `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/urlshortener
JWT_SECRET=your_super_secret_jwt_key
BASE_URL=http://localhost:3000
PORT=3000
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth/login` | User login | ❌ |

### URL Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/urls` | Get user's URLs | ✅ |
| POST | `/api/urls` | Create short URL | ✅ |
| GET | `/api/urls/:id/analytics` | Get URL analytics | ✅ |
| GET | `/:code` | Redirect to original URL + track | ❌ |

## 🏗️ Project Structure

```
src/
├── controllers/           # Route handlers
│   ├── auth.controller.js # Authentication logic
│   └── url.controller.js  # URL management & analytics
├── models/               # Database schemas
│   ├── User.js          # User model
│   ├── Url.js           # URL model
│   └── Click.js         # Click tracking model
├── routes/              # API routes
│   ├── auth.routes.js   # Auth endpoints
│   └── url.routes.js    # URL endpoints
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT authentication
│   └── error.js        # Error handling
├── utils/              # Helper functions
│   ├── ip.js          # IP & geolocation utilities
│   ├── short.js       # Short code generation
│   └── userAgent.js   # User agent parsing
├── config/
│   └── db.js          # Database connection
└── index.js           # App entry point
```

## 🛠️ Dependencies

### Core
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin requests
- **helmet** - Security headers
- **morgan** - HTTP request logger

### Authentication & Security
- **jsonwebtoken** - JWT tokens
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting
- **validator** - Input validation

### Analytics & Utilities
- **geoip-lite** - IP geolocation
- **nanoid** - Short ID generation
- **dotenv** - Environment variables
- **cookie-parser** - Cookie parsing

## 📊 Database Models

### User Schema
```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### URL Schema
```javascript
{
  shortCode: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  owner: { type: ObjectId, ref: 'User', required: true },
  clicksCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### Click Schema
```javascript
{
  url: { type: ObjectId, ref: 'Url', required: true },
  ip: String,
  country: String,
  city: String,
  userAgent: String,
  device: String,
  browser: String,
  os: String,
  referer: String,
  at: { type: Date, default: Date.now }
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: 20 requests/minute for URL creation
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: URL and custom code validation
- **CORS Protection**: Configurable origins
- **Helmet Security**: HTTP header protection

## 📈 Analytics Features

- **Real-time Tracking**: Click events with metadata
- **Geographic Data**: Country/city from IP
- **Device Detection**: Desktop/mobile identification
- **Browser Analytics**: Browser and OS detection
- **Referrer Tracking**: Traffic source analysis
- **Time-based Analytics**: Daily and hourly patterns
- **Aggregated Statistics**: Total clicks, unique visitors

## 🚀 Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=production_jwt_secret
BASE_URL=https://yourdomain.com
PORT=3000
NODE_ENV=production
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

Run tests (if implemented):
```bash
npm test
```

## 📝 API Usage Examples

### Create Short URL
```bash
curl -X POST http://localhost:3000/api/urls 
  -H "Authorization: Bearer YOUR_JWT_TOKEN" 
  -H "Content-Type: application/json" 
  -d '{"originalUrl": "https://example.com", "customCode": "mylink"}'
```

### Get Analytics
```bash
curl -X GET http://localhost:3000/api/urls/URL_ID/analytics 
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Submit pull requests

---

**Part of URLSShortener Project** 🔗
