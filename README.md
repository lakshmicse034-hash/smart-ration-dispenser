# Smart Ration Dispenser System

A comprehensive full-stack application for managing public distribution system (PDS) with automated ration dispensing, biometric authentication, and IoT device management.

## Features

### Customer Features
- **View Ration Card Details**: Display monthly rice and wheat quotas
- **Track Quota Usage**: Real-time progress bars for rice and wheat consumption
- **Transaction History**: Complete record of all ration withdrawals
- **Profile Management**: View and manage personal information
- **Responsive Dashboard**: User-friendly interface for easy access

### Admin Features
- **User Management**: View, manage, and monitor customer accounts
- **Inventory Management**: Track stock levels and manage low stock alerts
- **Device Management**: Monitor IoT dispensers with real-time status, battery, and temperature
- **Refill Management**: Create and track inventory refill operations
- **Notifications**: System-wide alerts for critical events
- **Simulation Tools**: Test system behavior with simulated scenarios
  - Solar charging simulation
  - Battery drain simulation
  - Device offline/online simulation
  - Low stock simulation

## Tech Stack

### Backend
- **Node.js & Express.js**: REST API server
- **MongoDB**: NoSQL database
- **JWT**: Authentication & authorization
- **Socket.io**: Real-time notifications
- **Twilio**: SMS notifications
- **Nodemailer**: Email notifications

### Frontend
- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **Vite**: Build tool
- **CSS-in-JS**: Inline styling

## Project Structure

```
smart-ration-dispenser/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── RationCard.js
│   │   ├── Transaction.js
│   │   ├── Inventory.js
│   │   ├── Device.js
│   │   ├── Refill.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── admin.js
│   │   └── notification.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   └── notificationController.js
│   ├── services/
│   │   ├── biometricService.js
│   │   ├── notificationService.js
│   │   └── dispenserService.js
│   ├── .env
│   ├── .gitignore
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CustomerDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .gitignore
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-ration-dispenser
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1234567890

# Server Configuration
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Application runs on `http://localhost:5173`

## Demo Credentials

### Customer Account
- **Email**: user1@smartration.com
- **Password**: user123

### Admin Account
- **Email**: admin@smartration.com
- **Password**: admin123

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  name: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  familyMembers: number,
  householdType: 'APL' | 'BPL' | 'AAY'
}
```

#### Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
```

#### Get Current User
```
GET /api/auth/me
Headers: {
  Authorization: Bearer {token}
}
```

### User Endpoints

#### Get Dashboard
```
GET /api/user/dashboard
Headers: {
  Authorization: Bearer {token}
}
```

#### Get History
```
GET /api/user/history
Headers: {
  Authorization: Bearer {token}
}
```

#### Dispense Ration
```
POST /api/user/dispense
Headers: {
  Authorization: Bearer {token}
}
Body: {
  item: 'rice' | 'wheat',
  quantity: number,
  authenticationMethod: 'biometric' | 'iris'
}
```

### Admin Endpoints

#### Get Admin Dashboard
```
GET /api/admin/dashboard
Headers: {
  Authorization: Bearer {token}
}
```

#### Get Users
```
GET /api/admin/users?limit=20&page=1
Headers: {
  Authorization: Bearer {token}
}
```

#### Get Inventory
```
GET /api/admin/inventory
Headers: {
  Authorization: Bearer {token}
}
```

#### Get Devices
```
GET /api/admin/devices
Headers: {
  Authorization: Bearer {token}
}
```

#### Create Refill
```
POST /api/admin/refills
Headers: {
  Authorization: Bearer {token}
}
Body: {
  item: 'rice' | 'wheat',
  quantity: number
}
```

#### Simulate Low Stock
```
POST /api/admin/inventory/simulate/low-stock
Headers: {
  Authorization: Bearer {token}
}
Body: {
  itemId: string
}
```

#### Simulate Solar Charging
```
POST /api/admin/devices/{deviceId}/simulate/solar-charging
Headers: {
  Authorization: Bearer {token}
}
```

#### Simulate Battery Drain
```
POST /api/admin/devices/{deviceId}/simulate/battery-drain
Headers: {
  Authorization: Bearer {token}
}
```

#### Simulate Device Offline
```
POST /api/admin/devices/{deviceId}/simulate/offline
Headers: {
  Authorization: Bearer {token}
}
```

#### Simulate Device Online
```
POST /api/admin/devices/{deviceId}/simulate/online
Headers: {
  Authorization: Bearer {token}
}
```

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: 'customer' | 'admin',
  familyMembers: Number,
  householdType: 'APL' | 'BPL' | 'AAY',
  biometricId: String,
  irisPattern: String,
  createdAt: Date,
  updatedAt: Date
}
```

### RationCard
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  cardNumber: String (unique),
  type: 'APL' | 'BPL' | 'AAY',
  monthlyRiceQuota: Number,
  monthlyWheatQuota: Number,
  riceUsed: Number,
  wheatUsed: Number,
  lastResetDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  transactionId: String,
  item: 'rice' | 'wheat',
  quantity: Number,
  authenticationMethod: 'biometric' | 'iris',
  deviceId: ObjectId,
  status: 'pending' | 'completed' | 'failed',
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory
```javascript
{
  _id: ObjectId,
  item: 'rice' | 'wheat',
  currentStock: Number,
  minimumStock: Number,
  status: 'adequate' | 'low',
  lastRefillDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Device
```javascript
{
  _id: ObjectId,
  deviceId: String (unique),
  location: String,
  status: 'online' | 'offline',
  battery: Number,
  temperature: Number,
  solarCharging: Boolean,
  lastOnlineTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Refill
```javascript
{
  _id: ObjectId,
  item: 'rice' | 'wheat',
  quantity: Number,
  status: 'pending' | 'completed',
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  message: String,
  type: 'info' | 'warning' | 'error',
  read: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Features in Detail

### Biometric Authentication
- Fingerprint scanning integration
- Iris recognition support
- Secure biometric data storage
- Multi-factor authentication capability

### IoT Device Management
- Real-time device status monitoring
- Battery and temperature tracking
- Solar charging integration
- Automatic alerts for device failures
- Offline detection and logging

### Inventory Management
- Real-time stock tracking
- Automatic low-stock alerts
- Refill scheduling and tracking
- Historical inventory reports

### Notification System
- Email notifications
- SMS alerts (via Twilio)
- In-app notifications
- Push notifications (future)

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS protection

## Testing

### Simulation Features for Testing

**Admin Panel includes simulation tools:**
1. **Solar Charging Simulation**: Test solar panel charging
2. **Battery Drain Simulation**: Test battery depletion
3. **Device Offline Simulation**: Test offline scenarios
4. **Low Stock Simulation**: Test inventory alerts

These are perfect for testing without requiring actual hardware.

## Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables in platform settings
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy `dist` folder to hosting platform

3. Update API endpoint in `frontend/src/services/api.js`

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure network access is allowed (for MongoDB Atlas)

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Frontend Issues

**API Connection Error**
- Verify backend server is running
- Check proxy settings in `vite.config.js`
- Verify CORS is configured correctly

**Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: lakshmicse034@gmail.com
- GitHub: [@lakshmicse034-hash](https://github.com/lakshmicse034-hash)

## Acknowledgments

- Inspired by Government of India's Public Distribution System (PDS)
- Built with modern web technologies
- IoT integration for automation and efficiency
- Biometric security for enhanced access control
