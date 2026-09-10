# Setup Instructions

## Quick Start Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/lakshmicse034-hash/smart-ration-dispenser.git
cd smart-ration-dispenser
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
Create `.env` file in backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smart-ration-dispenser

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# SMTP (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Smart Ration Dispenser <noreply@smartration.com>

# Twilio (Optional - for SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1234567890

# Client URL
CLIENT_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=your_session_secret
```

#### Start MongoDB (if local)
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Run Backend
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Access the Application

1. Open browser: `http://localhost:5173`
2. Login with demo credentials:
   - Customer: `user1@smartration.com` / `user123`
   - Admin: `admin@smartration.com` / `admin123`

## Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Connect with connection string in `.env`

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-ration-dispenser
```

## Initial Data Seeding

To populate demo data, run:

```bash
cd backend
node scripts/seed.js
```

This will create:
- 2 demo customers
- 1 demo admin
- Sample ration cards
- Sample inventory
- Sample devices

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on Google Account
2. Generate App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - App passwords
   - Select Mail and Windows Computer
   - Copy password
3. Add to `.env`:
```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=generated_app_password
```

### Other Email Providers

Update SMTP settings accordingly in `.env`

## SMS Configuration (Twilio)

1. Sign up at [Twilio](https://www.twilio.com)
2. Get Account SID and Auth Token from dashboard
3. Get Twilio Phone Number
4. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=+1234567890
```

## API Testing

### Using Postman

1. Import `backend/postman-collection.json`
2. Update base URL if needed
3. Test endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@smartration.com","password":"user123"}'

# Get Dashboard (replace TOKEN)
curl -X GET http://localhost:5000/api/user/dashboard \
  -H "Authorization: Bearer TOKEN"
```

## Development Tools

### Backend
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Nodemailer**: Email sending
- **Twilio**: SMS sending
- **Socket.io**: Real-time communications

### Frontend
- **React**: UI framework
- **Vite**: Build tool
- **React Router**: Navigation
- **Axios**: HTTP client
- **Lucide React**: Icons

## Debugging

### Enable Verbose Logging

In `backend/.env`:
```env
DEBUG=smart-ration:*
```

Then run with debug:
```bash
DEBUG=smart-ration:* npm start
```

### Browser DevTools

1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Check Application tab for stored tokens

## Production Deployment

### Backend (Example: Railway.app)

1. Push code to GitHub
2. Connect to Railway.app
3. Add environment variables
4. Deploy

### Frontend (Example: Vercel)

1. Build:
```bash
npm run build
```

2. Deploy `dist` folder to Vercel
3. Set environment variables in Vercel dashboard

## Troubleshooting

### Common Issues

**Issue**: "Cannot connect to MongoDB"
- **Solution**: Check MongoDB is running, verify connection string

**Issue**: "EADDRINUSE: Address already in use :5000"
- **Solution**: Kill process on port 5000 or change port in `.env`

**Issue**: "Module not found"
- **Solution**: Run `npm install` in the directory

**Issue**: "CORS error"
- **Solution**: Check CORS settings in `backend/server.js`

**Issue**: "Token expired"
- **Solution**: Login again, token expires after 7 days

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create new issue with detailed description
3. Include error logs and screenshots

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)
- [JWT.io](https://jwt.io/)

