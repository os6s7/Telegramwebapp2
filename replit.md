# TeleMarket - Telegram E-commerce Platform

## Overview

TeleMarket is a full-stack e-commerce platform built specifically for Telegram users. It provides a complete marketplace where users can browse, buy, and sell physical goods directly within a Telegram-integrated environment. The application features a mobile-first design optimized for the Telegram Web App experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Radix UI components with shadcn/ui component library
- **Styling**: Tailwind CSS with custom Telegram-themed design tokens
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
- **ORM**: Drizzle ORM with type-safe queries
- **Schema**: Shared TypeScript schema definitions between client and server
- **Database**: PostgreSQL (Neon serverless) with automatic migrations

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies, CSRF protection, secure session handling

### E-commerce Features
- **Product Catalog**: Categories, search, filtering, and product management
- **Shopping Cart**: Persistent cart with real-time updates
- **Order Management**: Complete order lifecycle from creation to fulfillment
- **Seller Dashboard**: Product listing, inventory management, order tracking
- **Payment Integration**: Multiple payment methods (Bitcoin, Ethereum, Telegram Stars)

### UI/UX Design
- **Theme**: Custom Telegram-inspired design system
- **Responsive**: Mobile-first approach optimized for Telegram Web Apps
- **Components**: Comprehensive UI component library based on Radix UI
- **Navigation**: Bottom navigation bar for mobile-optimized experience
- **Modals**: Overlay-based cart, checkout, and profile management

## Data Flow

### User Authentication Flow
1. User accesses application through Telegram
2. Replit Auth handles OpenID Connect authentication
3. User session stored in PostgreSQL with automatic expiration
4. Frontend uses React Query to manage authentication state

### Product Browsing Flow
1. Frontend fetches categories and products via REST API
2. Server queries PostgreSQL using Drizzle ORM
3. Products filtered by category and search terms
4. Real-time updates through React Query cache invalidation

### Purchase Flow
1. User adds products to cart (stored in database)
2. Checkout process collects shipping and payment information
3. Order created with associated order items
4. Cart cleared after successful order creation
5. Order tracking available through user dashboard

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe SQL ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Unstyled, accessible UI components
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Minimalist routing library

### Authentication & Security
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development & Build Tools
- **vite**: Fast build tool and dev server
- **typescript**: Static type checking
- **eslint**: Code linting
- **prettier**: Code formatting

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Vite HMR for frontend, tsx for backend
- **Database**: Local PostgreSQL or Neon development database
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS

### Production Build
- **Frontend**: Static assets built with Vite and served by Express
- **Backend**: TypeScript compiled to JavaScript with esbuild
- **Database**: Neon PostgreSQL serverless
- **Deployment**: Single container with Express serving both API and static files

### Configuration Management
- **Environment Variables**: Centralized configuration for database, auth, and secrets
- **Database Migrations**: Drizzle Kit for schema migrations
- **Session Storage**: PostgreSQL table for session persistence
- **CORS**: Configured for Telegram Web App origins

The application is designed to be deployed as a single service with Express handling both API routes and static file serving, making it suitable for containerized deployment environments like Replit, Railway, or similar platforms.