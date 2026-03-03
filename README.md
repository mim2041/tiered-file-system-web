# Tiered File System Web

A modern, subscription-based file and folder management system built with Next.js 16. This application provides a comprehensive solution for managing files and folders with tiered storage limits, dynamic package permissions, and real-time validation through API integration.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Features

### Core Functionality
- **User Authentication** - Complete authentication flow with registration, login, email verification, and password reset
- **File Management** - Upload, download, organize, and manage files with storage tier enforcement
- **Folder Structure** - Create, organize, and navigate hierarchical folder structures
- **Subscription Management** - Tiered subscription plans with dynamic storage limits
- **Package System** - Flexible package-based permissions and capabilities
- **Usage History** - Track and monitor file operations and system usage

### Technical Features
- **Internationalization (i18n)** - Multi-language support (English, Bengali) using next-intl
- **Protected Routes** - Secure authentication guards for protected pages
- **Responsive Design** - Modern, mobile-first UI built with Tailwind CSS
- **Type Safety** - Full TypeScript implementation for enhanced code quality
- **API Integration** - RESTful API client with centralized error handling
- **Toast Notifications** - User-friendly feedback using Sonner

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** - Version 18.x or higher
- **npm** or **yarn** - Latest stable version
- **Git** - For cloning the repository

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tiered-file-system-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://fs-api.mimkhatun.me/api/v1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | Yes | - |

### API Endpoints

The application interfaces with the following backend endpoints:

- **Authentication**: `/auth/*` - User registration, login, verification
- **Files**: `/files/*` - File operations and management
- **Folders**: `/folders/*` - Folder operations and organization
- **Packages**: `/packages/*` - Package listing and management
- **Subscriptions**: `/subscriptions/*` - Subscription activation and details

## 📁 Project Structure

```
tiered-file-system-web/
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── [locale]/        # Internationalized routes
│   │   │   ├── (protected)/ # Protected pages (dashboard, explorer, etc.)
│   │   │   └── (public)/    # Public pages (auth, landing)
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable React components
│   │   ├── auth-guard.tsx   # Authentication guard
│   │   ├── auth-layout.tsx  # Authentication layout
│   │   └── sidebar.tsx      # Navigation sidebar
│   ├── config/              # Configuration files
│   │   └── env.ts           # Environment configuration
│   ├── contexts/            # React context providers
│   │   └── auth-context.tsx # Authentication context
│   ├── core/                # Core functionality
│   │   └── api/             # API client and services
│   │       ├── api-client.ts
│   │       ├── auth.ts
│   │       ├── files.ts
│   │       ├── folders.ts
│   │       ├── packages.ts
│   │       └── subscriptions.ts
│   ├── i18n/                # Internationalization
│   │   ├── routing.ts       # Route configuration
│   │   └── locale/          # Translation files
│   ├── lib/                 # Utility libraries
│   │   ├── http.ts          # HTTP client
│   │   ├── storage.ts       # Local storage utilities
│   │   └── utils.ts         # Helper functions
│   ├── services/            # Business logic services
│   └── types/               # TypeScript type definitions
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run lint:fix` | Auto-fix ESLint issues |

## 🛣️ Application Routes

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset
- `/verify-email` - Email verification

### Protected Routes (Requires Authentication)
- `/dashboard` - User dashboard with overview
- `/explorer` - File and folder explorer
- `/history` - Usage and activity history
- `/packages` - Available packages and subscriptions

## 🌐 Internationalization

The application supports multiple languages using `next-intl`:

- **English (en)** - Default language
- **Bengali (bn)** - Secondary language

Translation files are located in `src/i18n/locale/[lang]/common.json`

## 🧪 Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **HTTP Client**: Axios

### Development Tools
- **Linting**: ESLint
- **CSS Processing**: PostCSS, Autoprefixer
- **Type Checking**: TypeScript

## 🔒 Authentication Flow

1. User registers with email and password
2. Email verification link sent to user
3. User verifies email through verification link
4. User logs in with credentials
5. JWT token stored in local storage
6. Protected routes accessible with valid token
7. Token validated on each protected page load

## 📦 Package Management

The system supports multiple subscription tiers:

- Different storage limits per tier
- Dynamic permission management
- Package upgrade/downgrade capabilities
- Real-time usage tracking and enforcement

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🐛 Bug Reports & Feature Requests

If you encounter any bugs or have feature requests, please create an issue in the repository with detailed information.

## 📞 Support

For additional support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Next.js and React**
