# Chronos Frontend

Frontend application cho Chronos Watch Store

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Truy cập: http://localhost:5173

## 📁 Structure

```
project_clock/
├── src/
│   ├── components/    # React components
│   ├── pages/        # Page components
│   ├── stores/       # Zustand stores
│   ├── services/     # API services
│   ├── context/      # React contexts (deprecated)
│   └── data/         # Static data
├── public/           # Static assets
├── docs/            # Documentation
└── package.json
```

## 📖 Documentation

- [Zustand Migration](docs/ZUSTAND_MIGRATION.md)
- [Admin Order Sync](docs/ADMIN_ORDER_SYNC.md)
- [Customer Notifications](docs/CUSTOMER_ORDER_NOTIFICATION.md)
- [Return Request System](docs/RETURN_REQUEST_SYSTEM.md)
- [Frontend-Backend Integration](docs/FRONTEND_BACKEND_INTEGRATION.md)

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Zustand (State Management)
- Ant Design
- Axios
- React Router

## 🎨 Features

- ✅ Product Catalog
- ✅ Shopping Cart
- ✅ User Authentication
- ✅ Order Management
- ✅ Real-time Notifications
- ✅ Return Requests
- ✅ Admin Dashboard
- ✅ Responsive Design

## 🔧 Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌐 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5001/api
```

## 🔑 Test Accounts

- Admin: admin@chronos.com / admin123
- Customer: user@chronos.com / user123
