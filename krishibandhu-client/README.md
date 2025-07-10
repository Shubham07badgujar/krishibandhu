# KrishiBandhu - Agricultural Support App

KrishiBandhu is a comprehensive platform designed to support Indian farmers by providing access to agricultural schemes, weather updates, market information, and personalized farming advice.

## Features

### User Authentication
- **Enhanced Registration**: Multi-step registration form with personal and farm details
- **Additional User Fields**: Village, District, State, Phone Number, Primary Crop
- **Google Authentication**: One-click sign-in with Google account
- **Email Notifications**: Welcome emails and login notifications
- **Attractive UI**: Redesigned authentication pages with improved UX

### Homepage
- **Dynamic Content**: Different views for logged-in and logged-out users
- **Personalized Welcome**: Custom greeting for logged-in users 
- **Quick Actions**: Access to frequently used features
- **Modern UI**: Responsive design with smooth animations and transitions

### Core Features
- **Agricultural Schemes**: Browse and save government schemes and subsidies
- **Weather Updates**: Get location-based weather forecasts
- **AI Assistant**: Ask farming-related questions to our AI-powered assistant
- **Learning Resources**: Educational content about farming practices
- **Multi-language Support**: Available in English and Hindi

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   cd krishibandhu-client
   npm install
   ```
3. Configure environment variables:
   - Create `.env` file in the client directory with:
     ```
     VITE_BACKEND_URL=http://localhost:5000
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     ```
   - Create `.env` file in the server directory with:
     ```
     JWT_SECRET=your_jwt_secret
     MONGO_URI=your_mongodb_connection_string
     EMAIL_SERVICE=gmail
     EMAIL_USER=your_email
     EMAIL_PASSWORD=your_app_password
     GOOGLE_CLIENT_ID=your_google_client_id
     ```

4. Start the development server:
   ```
   npm run dev
   ```

## Technologies

- **Frontend**: React, Tailwind CSS, i18next
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, Google OAuth
- **Email**: Nodemailer
- **AI**: Google Gemini API
