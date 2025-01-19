# Financial Advisor Platform

A comprehensive platform for financial advisors to manage client relationships, schedule appointments, and create interactive financial canvases.

## Features

### Authentication
- Secure email and password authentication
- Session management with automatic token refresh
- Protected routes and authenticated API calls

### Appointment Management
- Schedule advisory sessions
- View upcoming appointments
- Join virtual meetings
- Record session transcripts

### Canvas Builder
- Interactive drag-and-drop interface
- Real-time session recording
- Multiple block types:
  - Metrics (KPIs and financial indicators)
  - Features (financial products and services)
  - Users (access management)
- AI-powered suggestions
- Group and organize blocks
- Save and load canvases

### Client Management
- Client onboarding workflow
- KYC verification
- Multiple account types:
  - Individual accounts
  - Joint accounts
  - Trust accounts
- Document management

### Financial Products
- Account management
  - Operating accounts
  - Reserve accounts
  - Credit lines
- Payment processing
  - ACH transfers
  - Wire transfers
  - Check payments
- Card management
  - Physical cards
  - Virtual cards
  - Card controls

## Technical Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
src/
├── components/         # React components
│   ├── canvas/        # Canvas builder components
│   ├── cards/         # Card management components
│   ├── money/         # Payment and transfer components
│   └── onboarding/    # Client onboarding components
├── contexts/          # React contexts
├── lib/              # Utility functions and services
├── types/            # TypeScript type definitions
└── assets/           # Static assets
```

## Key Components

### Canvas Builder
The canvas builder is the core feature allowing advisors to create visual representations of financial solutions:

- **BlockTemplate**: Defines the structure of draggable blocks
- **CanvasView**: Main canvas interface with drag-and-drop functionality
- **SessionRecorder**: Records advisory sessions with transcription

### Client Onboarding
A step-by-step workflow for onboarding new clients:

- **AccountTypeSelection**: Choose account type
- **IndividualKYC**: Know Your Customer verification
- **TrustDocuments**: Trust account documentation
- **TermsAndConditions**: Legal agreements

### Financial Management
Components for managing financial products and transactions:

- **CardView**: Physical and virtual card management
- **MoveMoneyView**: Payment and transfer interface
- **PayeeForm**: Manage payment recipients

## State Management

- **SupabaseContext**: Manages authentication state and database access
- **Local State**: React's useState for component-level state
- **Props**: Component composition for feature-specific state

## Security Features

- Secure authentication flow
- Protected API endpoints
- Row Level Security (RLS) in Supabase
- Encrypted sensitive data
- Session management

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Database Schema

The application uses Supabase with the following main tables:

- `appointments`: Advisory session scheduling
- `canvases`: Financial solution designs
- `canvas_products`: Financial products configuration
- `canvas_metrics`: Performance indicators
- `payment_methods`: Available payment methods

Each table implements Row Level Security (RLS) policies to ensure data access control.