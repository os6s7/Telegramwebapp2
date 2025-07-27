# TeleMarket - Telegram E-commerce Platform

## Overview
TeleMarket is a native Telegram marketplace for buying/selling physical goods directly within Telegram Web Apps. Optimized for seamless in-app experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **UI**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS with Telegram design tokens
- **Auth**: Telegram WebApp `initData`

### Backend Architecture
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (Neon)
- **Auth**: Telegram HMAC-SHA256 verification
- **Sessions**: PostgreSQL via connect-pg-simple

## Key Changes from Replit to Telegram

### Authentication System
| Feature            | Replit Implementation       | Telegram Implementation          |
|--------------------|-----------------------------|-----------------------------------|
| Auth Provider      | Replit OIDC                 | Telegram WebApp `initData`        |
| Verification       | OIDC Tokens                 | HMAC-SHA256 Signature             |
| User Data          | Replit Profile              | Telegram User Object              |
| Session Security   | HTTP-only Cookies           | Telegram-verified WebApp Sessions |

### Modified Components
1. **Auth Flow**:
   - Old: Replit OIDC Redirect → Callback → Session
   - New: Client-side Telegram auth → `initData` → Server verification

2. **Endpoints**:
   ```diff
   - /api/login → Replit OIDC
   - /api/callback → Replit OIDC
   + /api/auth → Telegram initData verification