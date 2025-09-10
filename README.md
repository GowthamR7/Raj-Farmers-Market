🌾 Raj's Online Farmers Market
A comprehensive AI-powered e-commerce platform connecting organic farmers directly with customers. Built with modern web technologies and integrated with AI for intelligent product recommendations and farming advice.

📋 Table of Contents
Features

Tech Stack

Prerequisites

Installation

Environment Setup

Usage

API Documentation

Project Structure

Contributing

License

✨ Features
🛒 E-commerce Core
Multi-role Authentication - Customers, Farmers, and Admin roles

Product Management - Farmers can list, edit, and manage their products

Shopping Cart - Add/remove items, quantity management

Order Management - Complete order lifecycle from placement to delivery

Search & Filter - Advanced product search with category filtering

🤖 AI-Powered Intelligence
Smart Product Recommendations - Personalized suggestions based on user behavior

AI Farming Assistant - 24/7 chatbot for farming advice and tips

Auto-Generated Descriptions - AI creates compelling product descriptions

Seasonal Suggestions - Context-aware recommendations for different seasons

👨‍🌾 Farmer Dashboard
Product Analytics - Track product performance and sales

Inventory Management - Real-time stock updates

AI Description Generator - Automated product description creation

Sales Tracking - Monitor earnings and order history

👥 User Experience
Responsive Design - Mobile-first approach with Tailwind CSS

Real-time Notifications - Toast messages for user feedback

Secure Authentication - JWT-based authentication with bcrypt hashing

Profile Management - Complete user profile customization

🛠 Tech Stack
Frontend
Next.js 14 - React framework with App Router

TypeScript - Type-safe JavaScript

Tailwind CSS - Utility-first CSS framework

React Hot Toast - Beautiful notifications

Axios - HTTP client for API calls

Backend
Node.js - JavaScript runtime

Express.js - Web framework

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

JWT - JSON Web Tokens for authentication

bcryptjs - Password hashing

AI Integration
Google Gemini AI - Advanced language model for recommendations

OpenAI GPT - Alternative AI provider (configurable)

Development Tools
nodemon - Development server auto-restart

ESLint - Code linting

Prettier - Code formatting

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher)

npm or yarn

MongoDB (local or MongoDB Atlas)

Git

🚀 Installation
1. Clone the Repository
bash
git clone https://github.com/your-username/rajs-farmers-market.git
cd rajs-farmers-market
2. Install Backend Dependencies
bash
cd backend
npm install
3. Install Frontend Dependencies
bash
cd ../frontend
npm install
🔧 Environment Setup
Backend Environment Variables
Create backend/.env file:

bash
# Database
MONGODB_URI=mongodb://localhost:27017/farmers-market
# OR for MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmers-market

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=10

# Server Configuration
PORT=5000
NODE_ENV=development

# AI Integration
GEMINI_API_KEY=your-google-gemini-api-key
# Get your API key from: https://makersuite.google.com/app/apikey

# CORS
FRONTEND_URL=http://localhost:3000
Frontend Environment Variables
Create frontend/.env.local file:

bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Raj's Farmers Market
NEXT_PUBLIC_APP_VERSION=1.0.0
🏃‍♂️ Usage
1. Start MongoDB
Make sure MongoDB is running on your system or use MongoDB Atlas.

2. Seed Database (Optional)
bash
cd backend
npm run seed
3. Start Backend Server
bash
cd backend
npm run dev
Server will start at http://localhost:5000

4. Start Frontend Development Server
bash
cd frontend
npm run dev
Application will start at http://localhost:3000

5. Access the Application
Default Test Accounts:

Farmer: ravi@farmer.com / 123456

Customer: kumar@customer.com / 123456

Admin: admin@farmersmarket.com / admin123

🔗 API Documentation
Authentication Endpoints
text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
Product Endpoints
text
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (Farmers only)
PUT    /api/products/:id          # Update product (Farmers only)
DELETE /api/products/:id          # Delete product (Farmers only)
Order Endpoints
text
GET  /api/orders                  # Get user orders
POST /api/orders                  # Create new order
GET  /api/orders/:id              # Get single order
PUT  /api/orders/:id/status       # Update order status (Farmers only)
AI Endpoints
text
POST /api/gemini/farming-advice   # Get farming advice
POST /api/gemini/generate-description # Generate product description
GET  /api/gemini/health           # Check AI service status
Recommendation Endpoints
text
GET  /api/recommendations/personalized    # Get personalized recommendations
GET  /api/recommendations/related/:id     # Get related products
GET  /api/recommendations/trending        # Get trending products
POST /api/recommendations/track-search    # Track user search
POST /api/recommendations/track-view      # Track product view
📁 Project Structure
text
rajs-farmers-market/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── gemini.js
│   │   └── recommendations.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── UserBehaviorService.js
│   ├── server.js
│   ├── seedData.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── farmer-dashboard/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductRecommendations.tsx
│   │   │   └── AISearchAssistant.tsx
│   │   ├── context/
│   │   │   └── CartContext.tsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── recommendationAPI.js
│   │   └── styles/
│   └── package.json
└── README.md
🎯 Key Features Demo
1. AI-Powered Product Recommendations
Personalized suggestions based on user behavior

Smart cross-selling and upselling

Seasonal product recommendations

2. Intelligent Farming Assistant
24/7 AI chatbot for farming queries

Context-aware advice based on location and season

Multi-language support (English, Tamil)

3. Advanced Search & Filter
Real-time search with autocomplete

Category-based filtering

AI-suggested search alternatives

4. Farmer Dashboard
Comprehensive product management

Sales analytics and insights

AI-generated product descriptions

🚀 Deployment
Backend Deployment (Heroku/Railway)
bash
# Build and deploy backend
npm run build
npm start
Frontend Deployment (Vercel/Netlify)
bash
# Build frontend
npm run build
npm run start
Environment Variables for Production
Update environment variables for production:

Use MongoDB Atlas connection string

Set secure JWT secret

Configure CORS for production domain

Add production API keys

🤝 Contributing
Fork the Project

Create Feature Branch (git checkout -b feature/AmazingFeature)

Commit Changes (git commit -m 'Add some AmazingFeature')

Push to Branch (git push origin feature/AmazingFeature)

Open Pull Request

Development Guidelines
Follow TypeScript best practices

Write meaningful commit messages

Add tests for new features

Update documentation as needed

Follow the existing code style

🐛 Bug Reports
If you encounter any bugs, please create an issue with:

Environment details (OS, Node version, etc.)

Steps to reproduce the issue

Expected vs actual behavior

Screenshots if applicable

🌟 Feature Requests
We welcome feature requests! Please include:

Problem description

Proposed solution

Use cases

Alternative solutions considered

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Contact & Support
Developer: Gowtham Ramar

Email: support@rajsfarmersmarket.com

LinkedIn: Your LinkedIn Profile

Twitter: @yourhandle

🙏 Acknowledgments
Google Gemini AI for intelligent recommendations

MongoDB for reliable data storage

Tailwind CSS for beautiful styling

Next.js for exceptional React framework

Express.js for robust backend framework

⭐ Star this repo if you find it helpful!

🚀 Built with ❤️ for sustainable farming and direct farmer-customer connections