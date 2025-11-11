# Ohio Risk Tool - Portfolio Risk Metrics Dashboard

A comprehensive dashboard for monitoring and analyzing portfolio risk metrics with real-time data from a PostgreSQL database.

## Project info

**URL**: https://lovable.dev/projects/d807fc88-8a35-444d-8763-afd6ba3d8948

## Architecture

This project consists of two main components:

1. **Frontend**: React + Vite application with shadcn-ui components
2. **Backend API**: Express.js server that connects to PostgreSQL database

## Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Access to the PostgreSQL database (credentials required)

## Setup Instructions

### 1. Clone the repository

```sh
git clone https://github.com/collationai/ohiorisktool.git
cd ohiorisktool
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

The `.env` file should already contain the database credentials. If you need to update them:

```env
# PostgreSQL Database Configuration
DB_HOST="your-database-host"
DB_PORT=5432
DB_NAME="atlantis"
DB_USER="your-username"
DB_PASSWORD="your-password"
DB_SSL=true

# API Server Configuration
API_PORT=3001
VITE_API_URL="http://localhost:3001"
```

### 4. Start the development environment

You have several options:

**Option A: Run both frontend and backend together**
```sh
npm run dev:all
```

**Option B: Run them separately (in different terminals)**

Terminal 1 - Backend API:
```sh
npm run server
```

Terminal 2 - Frontend:
```sh
npm run dev
```

The frontend will be available at `http://localhost:5173` (or similar)
The backend API will be available at `http://localhost:3001`

## API Endpoints

The backend API provides the following endpoints:

### Health & Connection
- `GET /api/health` - Check API server status
- `GET /api/db/test` - Test database connection

### Database Exploration
- `GET /api/db/tables?schema=collation_storage` - List all tables
- `GET /api/db/tables/:tableName/schema?schema=collation_storage` - Get table schema
- `GET /api/db/tables/:tableName/data?limit=100&offset=0&schema=collation_storage` - Get table data with pagination

### Custom Queries
- `POST /api/db/query` - Execute custom SELECT queries
  ```json
  {
    "sql": "SELECT * FROM collation_storage.portfolios LIMIT 5",
    "params": []
  }
  ```

## Using the Frontend API Client

The project includes a pre-built API client service and React hooks for easy data fetching:

### API Client (src/services/api.ts)

```typescript
import { apiClient } from '@/services/api';

// Fetch portfolios
const portfolios = await apiClient.getPortfolios({ limit: 10, offset: 0 });

// Fetch securities
const securities = await apiClient.getSecurities();

// Execute custom query
const result = await apiClient.executeQuery('SELECT * FROM collation_storage.users');
```

### React Hooks (src/hooks/useDatabase.ts)

```typescript
import { usePortfolios, useSecurities, useTables } from '@/hooks/useDatabase';

function MyComponent() {
  const { data: portfolios, isLoading } = usePortfolios({ limit: 10 });
  const { data: securities } = useSecurities();
  const { data: tables } = useTables();

  // Use the data in your component
}
```

## Database Schema

The PostgreSQL database uses the `collation_storage` schema and contains the following tables:

- **portfolios** - Portfolio information
- **securities** - Security/investment details
- **transactions** - Transaction records
- **security_prices** - Historical price data
- **fund_managers** - Fund manager information
- **users** - User accounts
- **entities** - Entity information
- **branding_settings** - Branding configurations
- **generated_reports** - Report data
- **security_data_detail_types** - Security data type definitions
- **security_detail_data** - Detailed security data
- **security_images** - Security image references
- **transaction_documents** - Transaction document references
- **transaction_types** - Transaction type definitions
- **user_permissions** - User permission settings

## Technologies Used

### Frontend
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

### Backend
- **Express.js** - Web framework
- **PostgreSQL (pg)** - Database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Deployment

### Frontend Deployment

Simply open [Lovable](https://lovable.dev/projects/d807fc88-8a35-444d-8763-afd6ba3d8948) and click on Share -> Publish.

### Backend Deployment

The backend API server can be deployed to:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- Or any Node.js hosting service

Make sure to set the environment variables on your hosting platform.

## Custom Domain

Yes, you can connect a custom domain!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
