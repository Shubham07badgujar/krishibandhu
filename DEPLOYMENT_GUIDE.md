# 🚀 KrishiBandhu Deployment Guide

## 📋 Overview

This guide covers multiple deployment options for the KrishiBandhu application, from local development to production deployment on cloud platforms.

## 🏗️ Deployment Options

### 1. 🌐 Vercel + MongoDB Atlas (Recommended)
**Best for**: Quick deployment, serverless backend
**Cost**: Free tier available

### 2. 🔵 Heroku + MongoDB Atlas
**Best for**: Traditional PaaS deployment
**Cost**: Paid (Heroku discontinued free tier)

### 3. ☁️ AWS (EC2 + RDS/DocumentDB)
**Best for**: Enterprise-grade deployment
**Cost**: Pay-as-you-go

### 4. 🐳 Docker + VPS
**Best for**: Custom server deployment
**Cost**: VPS hosting costs

### 5. 🔧 Traditional VPS (Linux Server)
**Best for**: Full control deployment
**Cost**: VPS/dedicated server costs

## 🌟 Option 1: Vercel + MongoDB Atlas (Recommended)

### Prerequisites
- Vercel account
- MongoDB Atlas account
- GitHub repository

### Step 1: Set up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   ```
   1. Go to https://www.mongodb.com/atlas
   2. Create a free account
   3. Create a new cluster (M0 Sandbox - Free)
   4. Create a database user
   5. Whitelist your IP (or 0.0.0.0/0 for all IPs)
   6. Get your connection string
   ```

2. **Update Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/krishibandhu1?retryWrites=true&w=majority
   ```

### Step 2: Prepare Backend for Serverless

Create `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Deploy Backend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to server directory
cd server

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Step 4: Deploy Frontend to Vercel

```bash
# Navigate to frontend directory
cd krishibandhu-client

# Update environment variables
# Create vercel.json if needed

# Deploy
vercel --prod
```

### Step 5: Environment Variables Setup

**Backend Environment Variables (Vercel):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/krishibandhu1
JWT_SECRET=your-super-secure-jwt-secret-key
OPENWEATHER_API_KEY=your-openweather-api-key
NEWS_API_KEY=your-news-api-key
GEMINI_API_KEY=your-gemini-api-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-frontend-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
NODE_ENV=production
```

**Frontend Environment Variables (Vercel):**
```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🔵 Option 2: Heroku Deployment

### Step 1: Prepare for Heroku

Create `server/Procfile`:
```
web: node server.js
```

Create `server/package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Deploy to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create krishibandhu-api

# Set environment variables
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
# ... set all other environment variables

# Deploy
git push heroku main
```

### Step 3: Deploy Frontend

```bash
# Build frontend
cd krishibandhu-client
npm run build

# Deploy to Vercel or Netlify
# Or serve via Express static files
```

## ☁️ Option 3: AWS Deployment

### Architecture
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or Lambda
- **Database**: DocumentDB or MongoDB Atlas
- **Load Balancer**: ALB
- **DNS**: Route 53

### Step 1: Deploy Database

```bash
# Option A: Use MongoDB Atlas (easier)
# Option B: Set up DocumentDB cluster
aws docdb create-db-cluster \
  --db-cluster-identifier krishibandhu-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password YourSecurePassword
```

### Step 2: Deploy Backend (EC2)

```bash
# Launch EC2 instance
# Install Node.js and MongoDB
sudo apt update
sudo apt install nodejs npm nginx

# Clone repository
git clone your-repo-url
cd krishibandhu/server
npm install

# Set up PM2 for process management
npm install -g pm2
pm2 start server.js --name krishibandhu-api

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/krishibandhu
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 3: Deploy Frontend (S3 + CloudFront)

```bash
# Build frontend
cd krishibandhu-client
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Set up CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## 🐳 Option 4: Docker Deployment

### Step 1: Create Dockerfiles

**Backend Dockerfile** (`server/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
```

**Frontend Dockerfile** (`krishibandhu-client/Dockerfile`):
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: krishibandhu-mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: krishibandhu1
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    container_name: krishibandhu-api
    restart: always
    ports:
      - "5001:5001"
    environment:
      MONGO_URI: mongodb://admin:password@mongodb:27017/krishibandhu1?authSource=admin
      JWT_SECRET: your-jwt-secret
      NODE_ENV: production
    depends_on:
      - mongodb
    volumes:
      - ./server/uploads:/app/uploads

  frontend:
    build: ./krishibandhu-client
    container_name: krishibandhu-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Step 3: Deploy with Docker

```bash
# Build and run
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🔧 Option 5: Traditional VPS Deployment

### Step 1: Server Setup

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### Step 2: Deploy Application

```bash
# Clone repository
git clone your-repo-url
cd krishibandhu

# Setup backend
cd server
npm install
cp .env.example .env
# Edit .env with production values

# Start backend with PM2
pm2 start server.js --name krishibandhu-api
pm2 startup
pm2 save

# Setup frontend
cd ../krishibandhu-client
npm install
npm run build
```

### Step 3: Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /path/to/krishibandhu/krishibandhu-client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5001;
    }
}
```

### Step 4: SSL Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test renewal
sudo certbot renew --dry-run
```

## 🔒 Production Security Checklist

### Backend Security
- [ ] Use environment variables for secrets
- [ ] Enable CORS for specific domains only
- [ ] Use HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Use security headers (helmet.js)
- [ ] Validate all inputs
- [ ] Use strong JWT secrets
- [ ] Regular security updates

### Database Security
- [ ] Use strong passwords
- [ ] Enable authentication
- [ ] Restrict network access
- [ ] Regular backups
- [ ] Monitor access logs

### Server Security
- [ ] Use firewall (ufw)
- [ ] Disable root login
- [ ] Use SSH keys
- [ ] Regular OS updates
- [ ] Monitor system logs
- [ ] Set up fail2ban

## 📊 Monitoring and Maintenance

### Monitoring Tools
- **Application**: PM2 monitoring, New Relic, DataDog
- **Server**: htop, netstat, systemctl
- **Database**: MongoDB Compass, Atlas monitoring
- **Logs**: journalctl, PM2 logs, custom logging

### Backup Strategy
```bash
# Database backup
mongodump --uri="mongodb://localhost:27017/krishibandhu1" --out=/backup/$(date +%Y%m%d)

# Application backup
tar -czf /backup/krishibandhu-$(date +%Y%m%d).tar.gz /path/to/krishibandhu/
```

### Health Checks
Create health check endpoints:
```javascript
// server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🚀 Quick Deployment Commands

### Development to Production

```bash
# 1. Build frontend
cd krishibandhu-client
npm run build

# 2. Update backend environment
cd ../server
cp .env.example .env.production
# Edit production environment variables

# 3. Deploy (choose your method)
# Vercel: vercel --prod
# Docker: docker-compose up -d --build
# VPS: git pull && pm2 restart krishibandhu-api
```

### Rollback Strategy

```bash
# Git-based rollback
git log --oneline -5
git checkout <previous-commit>
pm2 restart krishibandhu-api

# Docker rollback
docker-compose down
docker pull previous-image
docker-compose up -d
```

## 📞 Support

For deployment issues:
- Check server logs: `pm2 logs krishibandhu-api`
- Monitor system resources: `htop`
- Check database connection: `mongo`
- Verify environment variables
- Check firewall settings: `sudo ufw status`

---

**Choose the deployment option that best fits your needs, budget, and technical requirements!**
