# 🌾 KrishiBandhu - Agricultural Support Platform

## 📋 Overview

KrishiBandhu is a comprehensive agricultural support platform designed to empower farmers with modern technology solutions. The platform provides weather monitoring, government schemes information, loan management, crop health monitoring, AI-powered assistance, and notification systems.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.1.0 with Vite 6.3.5
- **Routing**: React Router DOM 7.6.0
- **Styling**: Tailwind CSS 4.1.5
- **Charts**: Chart.js 4.4.9 with React Chart.js 2
- **Internationalization**: i18next 25.1.2
- **Authentication**: Google OAuth 2.0
- **HTTP Client**: Axios 1.6.0
- **UI Components**: Heroicons, Headless UI
- **Animations**: Framer Motion 12.11.1, Lottie React

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth
- **File Upload**: Multer middleware
- **Email Service**: Gmail SMTP
- **APIs**: 
  - OpenWeather API for weather data
  - News API for agricultural news
  - Google Gemini AI for intelligent assistance

## 🏗️ Project Structure

```
krishibandhu/
├── 📁 krishibandhu-client/          # React Frontend Application
│   ├── 📁 public/                   # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/           # Reusable UI components
│   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   │   ├── Toast.jsx            # Notification component
│   │   │   └── WeatherVisual.jsx    # Weather display component
│   │   ├── 📁 pages/                # Main page components
│   │   │   ├── HomePage.jsx         # Landing page
│   │   │   ├── LoginPage.jsx        # Authentication
│   │   │   ├── RegisterPage.jsx     # User registration
│   │   │   ├── UserDashboard.jsx    # User dashboard
│   │   │   ├── WeatherPage.jsx      # Weather information
│   │   │   └── AboutUsPage.jsx      # About page
│   │   ├── 📁 features/             # Feature-specific components
│   │   │   ├── 📁 admin/            # Admin management
│   │   │   │   ├── 📁 schemes/      # Scheme administration
│   │   │   │   ├── 📁 loans/        # Loan administration
│   │   │   │   └── 📁 components/   # Admin UI components
│   │   │   ├── 📁 assistant/        # AI Assistant
│   │   │   │   ├── 📁 pages/        # Assistant pages
│   │   │   │   └── 📁 components/   # Chat components
│   │   │   ├── 📁 cropHealth/       # Crop monitoring
│   │   │   ├── 📁 loans/            # Loan management
│   │   │   ├── 📁 notifications/    # Notification system
│   │   │   └── 📁 schemes/          # Government schemes
│   │   ├── 📁 context/              # React Context providers
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── NotificationContext.jsx # Notification state
│   │   ├── 📁 routes/               # Route protection
│   │   │   ├── PrivateRoute.jsx     # Auth-required routes
│   │   │   └── AdminRoute.jsx       # Admin-only routes
│   │   ├── 📁 hooks/                # Custom React hooks
│   │   ├── 📁 i18n/                 # Internationalization
│   │   ├── 📁 layouts/              # Layout components
│   │   ├── 📁 store/                # State management
│   │   └── 📁 utils/                # Utility functions
│   ├── package.json                 # Frontend dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── vite.config.js               # Vite configuration
│   └── eslint.config.js             # ESLint configuration
│
├── 📁 server/                       # Express.js Backend Application
│   ├── 📁 controllers/              # Route controllers
│   │   ├── adminController.js       # Admin operations
│   │   ├── assistantController.js   # AI assistant logic
│   │   ├── authController.js        # Authentication
│   │   ├── cropHealthController.js  # Crop monitoring
│   │   ├── documentController.js    # File management
│   │   ├── loanController.js        # Loan operations
│   │   ├── notificationController.js # Notifications
│   │   ├── schemeController.js      # Government schemes
│   │   ├── userController.js        # User management
│   │   └── weatherController.js     # Weather data
│   ├── 📁 middleware/               # Express middleware
│   │   ├── authMiddleware.js        # JWT authentication
│   │   └── fileUploadMiddleware.js  # File upload handling
│   ├── 📁 models/                   # MongoDB schemas
│   │   ├── User.js                  # User model
│   │   ├── Scheme.js                # Government scheme model
│   │   ├── Loan.js                  # Loan application model
│   │   ├── CropHealth.js            # Crop monitoring model
│   │   └── Notification.js          # Notification model
│   ├── 📁 routes/                   # API route definitions
│   │   ├── adminRoutes.js           # Admin endpoints
│   │   ├── assistantRoutes.js       # AI assistant endpoints
│   │   ├── authRoutes.js            # Authentication endpoints
│   │   ├── cropHealthRoutes.js      # Crop health endpoints
│   │   ├── loanRoutes.js            # Loan management endpoints
│   │   ├── newsRoutes.js            # News aggregation endpoints
│   │   ├── notificationRoutes.js    # Notification endpoints
│   │   ├── schemeRoutes.js.fixed    # Government scheme endpoints
│   │   ├── userRoutes.js            # User management endpoints
│   │   └── weatherRoutes.js         # Weather data endpoints
│   ├── 📁 scripts/                  # Database utilities
│   │   ├── createTestUsers.js       # Test user creation
│   │   ├── seedSchemes.js           # Populate schemes database
│   │   └── README.md                # Scripts documentation
│   ├── 📁 services/                 # Business logic services
│   ├── 📁 uploads/                  # File storage
│   │   └── 📁 crops/                # Crop health images
│   ├── 📁 utils/                    # Server utilities
│   ├── .env                         # Environment variables
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Express server entry point
│
├── README.md                        # Project documentation
└── start-servers.bat               # Windows startup script
```

## ✨ Key Features

### 🌤️ Weather Monitoring
- **Real-time Weather Data**: Current weather conditions using OpenWeather API
- **5-day Forecast**: Weather predictions for agricultural planning
- **Location-based Weather**: GPS and city-based weather information
- **Bookmarked Cities**: Save frequently checked locations

### 🏛️ Government Schemes
- **Scheme Discovery**: Browse available government agricultural schemes
- **Advanced Filtering**: Search by state, category, launch organization
- **Multilingual Support**: Content available in English, Hindi, and Bengali
- **Saved Schemes**: Bookmark important schemes for quick access
- **Admin Management**: Admin panel for scheme CRUD operations

### 💰 Loan Management
- **Loan Applications**: Apply for various agricultural loans
- **Document Upload**: Secure document submission system
- **EMI Calculator**: Calculate loan repayments
- **Application Tracking**: Monitor loan status
- **Admin Review**: Admin panel for loan approval/rejection

### 🌾 Crop Health Monitoring
- **Image Analysis**: AI-powered crop disease detection
- **Health Records**: Maintain crop health history
- **Treatment Recommendations**: Get AI-suggested treatments
- **Photo Documentation**: Visual record keeping

### 🤖 AI Assistant
- **Intelligent Chat**: AI-powered agricultural assistance
- **Context-aware Responses**: Personalized farming advice
- **Multilingual Support**: Communicate in preferred language
- **Chat History**: Persistent conversation records

### 🔔 Notification System
- **Real-time Alerts**: Important updates and notifications
- **Categorized Notifications**: Different types of alerts
- **Mark as Read**: Notification management
- **Admin Broadcasts**: System-wide announcements

### 👨‍💼 Admin Dashboard
- **User Management**: Monitor platform users
- **Analytics Dashboard**: Platform usage statistics
- **Content Management**: Manage schemes and loans
- **System Monitoring**: Platform health metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### Environment Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd krishibandhu
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

   Create `.env` file in server directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/krishibandhu1
   PORT=5001
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # External APIs
   OPENWEATHER_API_KEY=your_openweather_api_key
   NEWS_API_KEY=your_news_api_key
   GEMINI_API_KEY=your_gemini_api_key
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:5173
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Frontend Setup**
   ```bash
   cd krishibandhu-client
   npm install
   ```

   Create `.env.local` file in frontend directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5001
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### Database Initialization

1. **Start MongoDB**
   ```bash
   mongod --dbpath /path/to/your/db
   ```

2. **Seed Database** (Optional)
   ```bash
   cd server
   node scripts/seedSchemes.js
   node scripts/createTestUsers.js
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:5001
   ```

2. **Start Frontend Development Server**
   ```bash
   cd krishibandhu-client
   npm run dev
   # Application runs on http://localhost:5173
   ```

3. **Quick Start (Windows)**
   ```bash
   # Double-click start-servers.bat file
   # This starts both frontend and backend servers
   ```

## 📡 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `PUT /api/auth/profile` - Update user profile (Protected)

### User Management
- `POST /api/user/bookmark-city` - Add bookmarked city (Protected)
- `GET /api/user/bookmark-cities` - Get bookmarked cities (Protected)

### Weather Endpoints
- `GET /api/weather?city=cityName` - Current weather by city
- `GET /api/weather?lat=lat&lon=lon` - Current weather by coordinates
- `GET /api/weather/forecast?city=cityName` - 5-day weather forecast

### Government Schemes
- `GET /api/schemes` - Get all schemes (Public)
- `GET /api/schemes/saved` - Get saved schemes (Protected)
- `POST /api/schemes/save/:id` - Save a scheme (Protected)
- `POST /api/schemes` - Create scheme (Admin only)
- `PUT /api/schemes/:id` - Update scheme (Admin only)
- `DELETE /api/schemes/:id` - Delete scheme (Admin only)

### Loan Management
- `GET /api/loans/types` - Get loan types (Public)
- `POST /api/loans/calculate-emi` - Calculate EMI (Public)
- `POST /api/loans/apply` - Apply for loan (Protected)
- `GET /api/loans/user/:userId` - Get user loans (Protected)
- `GET /api/loans/:id` - Get loan details (Protected)
- `GET /api/loans` - Get all loans (Admin only)
- `PUT /api/loans/:id/status` - Update loan status (Admin only)

### Crop Health
- `POST /api/crop-health/analyze` - Analyze crop image (Protected)
- `GET /api/crop-health/records` - Get health records (Protected)
- `GET /api/crop-health/records/:id` - Get specific record (Protected)
- `DELETE /api/crop-health/records/:id` - Delete record (Protected)

### AI Assistant
- `POST /api/assistant/chat` - Chat with AI (Protected)
- `DELETE /api/assistant/chat` - Clear chat history (Protected)

### Notifications
- `GET /api/notifications` - Get user notifications (Protected)
- `POST /api/notifications` - Create notification (Admin only)
- `PUT /api/notifications/:id/read` - Mark as read (Protected)
- `DELETE /api/notifications/:id` - Delete notification (Protected)

### Admin Endpoints
- `GET /api/admin/stats` - Get platform statistics (Admin only)

### News
- `GET /api/news` - Get agricultural news (Public)

## 🔐 Authentication & Authorization

### User Roles
- **Regular User**: Access to all user features
- **Admin**: Full system access including management panels

### Authentication Methods
1. **Email/Password**: Traditional registration and login
2. **Google OAuth**: Single sign-on with Google account

### Route Protection
- **Public Routes**: Home, About, Schemes (view only), Weather (basic)
- **Protected Routes**: Dashboard, Loans, Crop Health, Assistant, Notifications
- **Admin Routes**: Admin Dashboard, Scheme Management, Loan Management

## 🌐 Internationalization

The platform supports multiple languages:
- **English (en)**: Default language
- **Hindi (hi)**: हिंदी भाषा समर्थन
- **Bengali (bn)**: বাংলা ভাষার সহায়তা

Translation files are located in `krishibandhu-client/src/i18n/`

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop** (1920px+)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔧 Development Tools

### Frontend Development
- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first CSS framework
- **React DevTools**: Component debugging

### Backend Development
- **Nodemon**: Auto-restart during development
- **MongoDB Compass**: Database GUI
- **Postman**: API testing
- **JWT Debugger**: Token validation

## 📦 Dependencies

### Frontend Core Dependencies
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.0",
  "axios": "^1.6.0",
  "tailwindcss": "^4.1.5",
  "vite": "^6.3.5"
}
```

### Backend Core Dependencies
```json
{
  "express": "^4.x.x",
  "mongoose": "^7.x.x",
  "jsonwebtoken": "^9.x.x",
  "bcryptjs": "^2.x.x",
  "multer": "^1.x.x",
  "nodemailer": "^6.x.x"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify database permissions

2. **API Key Issues**
   - Verify all API keys in .env file
   - Check API key quotas and limits
   - Ensure proper API key format

3. **File Upload Problems**
   - Check uploads directory permissions
   - Verify multer configuration
   - Ensure sufficient disk space

4. **Authentication Issues**
   - Verify JWT_SECRET configuration
   - Check Google OAuth credentials
   - Clear browser cookies/localStorage

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production database
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Enable security headers
- [ ] Configure backup strategy

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb://your-production-db
JWT_SECRET=strong-production-secret
FRONTEND_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: Node.js, Express.js, MongoDB
- **Frontend Development**: React, Tailwind CSS, Vite
- **AI Integration**: Google Gemini AI API
- **Database Design**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0

## 📞 Support

For support and queries:
- 📧 Email: support@krishibandhu.com
- 📱 Phone: +91-XXXXXXXXXX
- 🌐 Website: https://krishibandhu.com

---

**Made with ❤️ for farmers and agricultural communities**