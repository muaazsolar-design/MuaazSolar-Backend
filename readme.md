# MuaazSolar Backend API

Complete backend REST API for MuaazSolar - A solar panel e-commerce and service booking platform.

## 🚀 Features

- **Authentication & Authorization** - JWT-based user authentication with role-based access control
- **Product Management** - CRUD operations for solar products (panels, batteries, inverters, accessories)
- **Order Management** - Complete order processing with payment tracking
- **Service Bookings** - Cost analysis requests, installation bookings, maintenance subscriptions
- **Admin Dashboard** - Sales reports, user management, inventory tracking
- **Email Notifications** - Contact form and booking confirmations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🛠️ Installation

### 1. Clone or Create Project

```bash
mkdir muaazsolar-backend
cd muaazsolar-backend
```

### 2. Initialize Node.js Project

```bash
npm init -y
```

### 3. Install Dependencies

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken nodemailer express-validator
npm install --save-dev nodemon
```

### 4. Create Project Structure

```
muaazsolar-backend/
├── server.js
├── .env
├── package.json
├── .gitignore
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── AnalysisRequest.js
│   ├── InstallationBooking.js
│   └── MaintenanceSubscription.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── analysis.js
│   ├── installation.js
│   ├── maintenance.js
│   ├── contact.js
│   └── admin.js
├── middleware/
│   └── auth.js
└── scripts/
    └── seedProducts.js
```

### 5. Configure Environment Variables

Create `.env` file in root directory:

```env
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/muaazsolar
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/muaazsolar

# JWT Secret (use a long random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
ADMIN_EMAIL=admin@muaazsolar.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 6. Update package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seedProducts.js"
  }
}
```

### 7. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Windows
# Download from mongodb.com
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update MONGODB_URI in .env

### 8. Create .gitignore

```
node_modules/
.env
*.log
.DS_Store
```

## 🏃 Running the Application

### 1. Seed Database with Products

```bash
npm run seed
```

### 2. Start Development Server

```bash
npm run dev
```

Server will run on http://localhost:5000

### 3. Test API

Visit http://localhost:5000 in browser or use Postman

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)
- `DELETE /api/orders/:id` - Cancel order

### Analysis Requests
- `POST /api/analysis` - Submit analysis request
- `GET /api/analysis` - Get all requests (admin)

### Installation Bookings
- `POST /api/installation` - Book installation
- `GET /api/installation` - Get all bookings (admin)
- `PUT /api/installation/:id` - Update booking (admin)

### Maintenance Subscriptions
- `POST /api/maintenance` - Create subscription
- `GET /api/maintenance` - Get all subscriptions (admin)
- `POST /api/maintenance/:id/service` - Add service record (admin)

### Contact
- `POST /api/contact` - Send contact form

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `GET /api/admin/reports/sales` - Get sales report (admin)

## 🔐 Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use app password in EMAIL_PASS environment variable

## 🧪 Testing with Postman

1. Import collection
2. Set base URL: http://localhost:5000/api
3. Test endpoints:
   - Register user
   - Login (save token)
   - Use token for protected routes

## 🚀 Production Deployment

### Heroku
```bash
heroku create muaazsolar-api
git push heroku main
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret
```

### Vercel
```bash
vercel
```

### Railway
```bash
railway init
railway up
```

## 📝 Example Request/Response

### Register User
```javascript
POST /api/auth/register

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Get Products
```javascript
GET /api/products?category=panels&sort=price-low

Response:
{
  "success": true,
  "count": 3,
  "products": [...]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License

## 👨‍💻 Author

Muaaz - MuaazSolar

## 📞 Support

For support, email: support@muaazsolar.com