<h1 align="center">Hospice Comparison Platform</h1>

<p align="center">
 A consumer-focused platform empowering families to find and compare hospice providers using Medicare data
</p>

<p align="center">
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#development-workflow"><strong>Development</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#testing-instructions"><strong>Testing Instructions</strong></a>
</p>
<br/>

## Core Features

- Hospice provider comparisons: Side-by-side comparisons of hospice providers with quality metrics, ratings, and services.
- CMS data integration: Real-time use of CMS.gov Medicare hospice datasets via their public APIs.
- Search & filtering: Geographic search by zip code and advanced filters to narrow providers by services and performance.
- Quality metrics: Clear display of key performance indicators such as patient satisfaction, care quality, and compliance ratings drawn from Medicare data.

## Technical Stack

- Next.js 15 with App Router
- TypeScript and Tailwind CSS
- Supabase for authentication, database, and real-time features
- Cookie-based authentication working across Server/Client Components, Route Handlers, Server Actions, and Middleware
- Integration points to CMS APIs for hospice datasets
- UI Components: BaseUI
- Icons: Iconoir

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase CLI (`npm install -g @supabase/cli`)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mrcoolawesome/home-health-help.git
   cd home-health-help
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Supabase locally**
   ```bash
   npx supabase start
   ```
   This will start all Supabase services including:
   - Studio (GUI) at http://127.0.0.1:54323
   - Email testing (inbucket) at http://127.0.0.1:54324

4. **Set up environment variables**
   After `supabase start` completes, it will output the local connection details. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[ANON_KEY_FROM_SUPABASE_START_OUTPUT]
   SUPABASE_SERVICE_ROLE_KEY=[Service roll key]
   NEXT_PUBLIC_GOOGLE_API_KEY=[Googel API key]
   DEV_BASE_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Key Commands
```bash
# Start Supabase services
npx supabase start

# Stop Supabase services  
npx supabase stop

# Generate migration from current database state
npx supabase db diff -f my_migration_name

# Apply migrations to local database
npx supabase db reset

# Push migrations to remote (production)
npx supabase db push
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages 
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── base-ui/          # Basic react components
│   └── .../               # Categorized/page specific components
├── lib/                  # Utilities and Supabase clients
│   ├── supabase/         # Supabase client configurations
|   └── .../              # Organized backend server functions
└── supabase/             # Supabase configuration and migrations
    ├── migrations/       # Database schema changes
    └── config.toml       # Local development configuration
```

## Contributing

1. Branch off of dev branch
2. Make your changes and merge to dev
3. Follow testing instructions in dev
4. Once tests are passed, merge to main

For database changes, always include migration files generated with `npx supabase db diff -f migration_name`.

## Testing Instructions
