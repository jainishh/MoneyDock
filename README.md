# 📈 Stock Market Real-Time Trading Application

A real-time stock market application built with React (frontend) and Node.js (backend), integrated with Angel One API for live market data streaming.

---

## 🎯 Features

- ✅ **Real-time Stock Data** - Live price updates via WebSocket
- ✅ **Multi-Exchange Support** - NSE, BSE, NFO, MCX, CDS
- ✅ **Fast LTP Mode** - Optimized for quick watchlist updates
- ✅ **Auto-Reconnection** - Robust error handling and reconnection logic
- ✅ **Responsive Design** - Works on desktop and mobile

---

## 🏗️ Architecture

### **Technology Stack**

**Frontend:**
- React + Vite
- Socket.IO Client
- Custom WebSocket hooks

**Backend:**
- Node.js + Express
- Socket.IO Server
- smartapi-javascript (Angel One SDK)
- MongoDB

---

## 🔄 Data Flow

```
User → Frontend (React) 
      ↓ Socket.IO
Backend (Node.js)
      ↓ WebSocket
Angel One API
      ↓ Real-time Tick Data
Frontend Parser
      ↓
UI Updates
```

### **Key Components:**

#### **Frontend:**
- `useAngelOneSocket.js` - WebSocket connection hook
- `stockDataParser.js` - Binary tick data parser
- `StockList.jsx` - Main UI component

#### **Backend:**
- `WebSocketManager.js` - Angel One connection manager
- `SubscriptionManager.js` - Multi-exchange subscription handler
- `DataStreamHandler.js` - Data forwarding service

---

## 📁 Project Structure

```
our_stock_market/
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   └── StockList/
│   │   ├── Hooks/
│   │   │   └── useAngelOneSocket.js
│   │   └── utils/
│   │       └── stockDataParser.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   ├── exchanges.config.js
│   │   └── websocket.config.js
│   ├── constants/
│   │   └── subscriptionModes.js
│   ├── services/
│   │   └── websocket/
│   │       ├── WebSocketManager.js
│   │       ├── SubscriptionManager.js
│   │       └── DataStreamHandler.js
│   ├── controllers/
│   │   └── angelController.js
│   └── index.js
│
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v18+)
- MongoDB
- Angel One trading account
- Angel One API credentials

### **Environment Variables**

Create `.env` file in `backend/`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
ANGEL_API_KEY=your_angel_api_key
JWT_SECRET=your_jwt_secret
LOG_LEVEL=info
```

### **Installation**

#### **Backend Setup:**

```bash
cd backend
npm install
npm start
```

#### **Frontend Setup:**

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 WebSocket Architecture

### **Subscription Modes:**

| Mode | Description | Data Size | Use Case |
|------|-------------|-----------|----------|
| **Mode 1 (LTP)** | Last Traded Price only | 8 bytes | Watchlist (fastest) |
| **Mode 2 (Quote)** | LTP + OHLC + Volume | 32 bytes | Standard view |
| **Mode 3 (Snap)** | Full market depth | Varies | Detailed analysis |

### **Exchange Types:**

| Exchange | Code | Type ID |
|----------|------|---------|
| NSE | `nse_cm` | 1 |
| NFO | `nse_fo` | 2 |
| BSE | `bse_cm` | 3 |
| MCX | `mcx_fo` | 5 |
| CDS | `cds_fo` | 13 |

---

## 🔐 Authentication Flow

1. User credentials stored in MongoDB
2. Auto-login with TOTP (Time-based OTP)
3. JWT + Feed tokens obtained from Angel One
4. WebSocket connection established
5. Real-time data subscription

---

## 💡 Key Design Decisions

### **1. Frontend Parsing**
- Backend forwards raw data (no parsing)
- Frontend handles all data transformation
- Reduces backend CPU usage
- Avoids code duplication

### **2. Exchange Grouping**
- Stocks grouped by exchange (NSE, NFO, etc.)
- Separate subscription requests per exchange
- Optimized API calls to Angel One

### **3. Mode 1 for Watchlist**
- Minimal 8-byte data packets
- Fastest possible updates
- Only essential price information

---

## 🛠️ Development

### **Backend Development:**

```bash
cd backend
npm run dev  # Using nodemon for auto-restart
```

### **Frontend Development:**

```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### **Logging:**

Backend logs available at:
- `backend/error.log` - Error logs
- Console - Info/Debug logs with colors

---

## 📚 Documentation

Detailed explanations available in the artifacts folder:

- **Workflow Explanation** - Complete data flow documentation
- **Parser Explanation** - Binary data parsing guide
- **WebSocket Manager** - Connection management details

---

## 🐛 Troubleshooting

### **"Failed to subscribe to stocks"**
- Check Angel One credentials
- Verify WebSocket connection status
- Restart backend server

### **No real-time updates**
- Ensure backend is connected to Angel One
- Check browser console for errors
- Verify stock tokens are valid

### **Connection drops**
- Auto-reconnection enabled (max 5 attempts)
- Check network connectivity
- Review backend logs

---

## 🔧 API Endpoints

### **Authentication:**
- `POST /api/angel/login` - Login with credentials
- `GET /api/angel/credentials` - Get session credentials

### **Health Check:**
- `GET /` - Server status

---

## 📊 Performance

- **Latency:** < 100ms for price updates
- **Data Size:** 8 bytes per tick (Mode 1)
- **Concurrent Users:** Scalable with Socket.IO
- **Reconnection:** Automatic with exponential backoff

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- **Angel One API** - Real-time market data
- **Socket.IO** - WebSocket communication
- **React** - UI framework
- **smartapi-javascript** - Angel One SDK

---

## 📞 Support

For detailed workflow and architecture documentation, refer to the artifacts in the brain folder.

---

**Built with ❤️ for real-time stock market trading**
