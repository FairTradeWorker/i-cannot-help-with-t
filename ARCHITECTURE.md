# FairTradeWorker Architecture

> **Version**: 1.0.0  
> **Last Updated**: January 2025

## Overview

FairTradeWorker is a modern, full-stack home services marketplace platform built with React 19, TypeScript, and Vite. The architecture follows a component-based, modular design pattern optimized for scalability, maintainability, and developer experience.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile App  │  │   API SDK    │          │
│  │  (React 19)  │  │   (Expo)     │  │ (TypeScript) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   State      │  │   Routing    │  │    Forms     │          │
│  │  Management  │  │   Layer      │  │   (Zod+RHF)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   UI Layer   │  │  Animation   │  │  Theming     │          │
│  │ (shadcn/ui)  │  │ (Framer)     │  │ (Tailwind)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  AI Service  │  │   Routing    │  │   Payment    │          │
│  │ (GPT-4 Vision)│ │    API       │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Auth       │  │   Storage    │  │ Notification │          │
│  │   Service    │  │   (KV)       │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Self-Learning API Platform                │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │ │
│  │  │AI Scope │ │ Instant │ │Contractor│ │ Demand  │          │ │
│  │  │  API    │ │ Quote   │ │  Match   │ │ Heatmap │          │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │ │
│  │            + 34 Premium APIs (Unlocks May 2026)           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Spark KV     │  │  Learning    │  │  Territory   │          │
│  │ Storage      │  │  Database    │  │  Database    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
fairtradeworker/
├── src/
│   ├── api/                    # API endpoints and services
│   │   ├── core/               # Core API utilities
│   │   │   ├── client.ts       # HTTP client configuration
│   │   │   ├── types.ts        # API type definitions
│   │   │   └── validation.ts   # Request validation schemas
│   │   └── intelligence/       # Intelligence API endpoints
│   │       ├── job-scope.ts    # AI Scope API
│   │       ├── instant-quote.ts # Instant Quote API
│   │       ├── contractor-match.ts # Contractor Match API
│   │       └── demand-heatmap.ts # Demand Heatmap API
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (40+ components)
│   │   ├── AdminDashboard/     # Admin-specific components
│   │   ├── IntelligenceAPI/    # API management UI
│   │   └── [Feature].tsx       # Feature components
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.ts       # Mobile detection hook
│   │   └── use-success-pulse.ts # Animation hook
│   │
│   ├── i18n/                   # Internationalization
│   │   ├── config.ts           # i18n configuration
│   │   └── locales/            # Translation files
│   │       ├── en.json
│   │       ├── es.json
│   │       └── fr.json
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── auth/               # Authentication services
│   │   ├── payments/           # Payment processing
│   │   ├── notifications/      # Notification services
│   │   ├── ai-service.ts       # AI analysis service
│   │   ├── routing-api.ts      # Route optimization
│   │   ├── store.ts            # Data persistence
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Utility functions
│   │
│   ├── styles/                 # Global styles
│   │   └── theme.css           # Theme variables
│   │
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global CSS
│
├── mobile/                     # React Native mobile app
│   ├── src/
│   │   ├── components/         # Mobile components
│   │   ├── navigation/         # Navigation configuration
│   │   ├── screens/            # Screen components
│   │   └── lib/                # Mobile utilities
│   ├── App.tsx
│   └── package.json
│
├── public/                     # Static assets
├── scripts/                    # Build and setup scripts
├── docs/                       # Documentation
└── .github/                    # GitHub workflows
```

---

## Core Technologies

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0 | UI framework with concurrent features |
| TypeScript | 5.7 | Type-safe JavaScript |
| Vite | 6.4 | Build tool and dev server |
| Tailwind CSS | 4.1 | Utility-first CSS framework |
| Framer Motion | 12 | Animation library |
| shadcn/ui | v4 | UI component library |

### State Management

| Technology | Purpose |
|------------|---------|
| React Hooks | Local component state |
| Spark KV | Persistent key-value storage |
| React Query | Server state management |
| React Hook Form | Form state management |

### Backend Services

| Service | Provider | Purpose |
|---------|----------|---------|
| AI Analysis | Azure OpenAI (GPT-4o) | Video/image analysis |
| Route Optimization | Trueway API | Multi-stop routing |
| Storage | Spark KV | Data persistence |
| Authentication | JWT/OAuth | User authentication |

---

## Component Architecture

### Component Hierarchy

```
App.tsx
├── Header Navigation
│   ├── MainNav (Home, Territories, Jobs, etc.)
│   ├── UserDropdown
│   └── NotificationBell
│
├── Main Content Area
│   ├── HomeownerDashboard
│   ├── ContractorDashboard
│   ├── TerritoryMapPage
│   ├── JobBrowser
│   ├── MessagesView
│   ├── IntelligenceAPIManager
│   ├── PaymentScreen
│   └── NotificationsPage
│
└── Footer
    └── LegalFooter
```

### Component Design Principles

1. **Single Responsibility**: Each component handles one specific feature
2. **Composition over Inheritance**: Use composition for component reuse
3. **Props-based Configuration**: Components configured via props
4. **Controlled Components**: Forms use controlled input patterns
5. **Error Boundaries**: Graceful error handling at component level

### UI Component Library (shadcn/ui)

```
src/components/ui/
├── Inputs
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   └── switch.tsx
├── Layout
│   ├── card.tsx
│   ├── tabs.tsx
│   ├── accordion.tsx
│   └── separator.tsx
├── Feedback
│   ├── alert.tsx
│   ├── badge.tsx
│   ├── progress.tsx
│   └── toast.tsx
├── Overlay
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── popover.tsx
│   └── tooltip.tsx
└── Navigation
    ├── navigation-menu.tsx
    └── breadcrumb.tsx
```

---

## Data Flow

### State Management Flow

```
User Action → Event Handler → State Update → Re-render

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────▶│   Event     │────▶│   State     │
│   Action    │     │  Handler    │     │   Update    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Updated   │◀────│  Virtual    │◀────│   React     │
│     DOM     │     │    DOM      │     │  Re-render  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Data Persistence Flow

```
Component ──▶ useKV Hook ──▶ Spark KV ──▶ Persistent Storage
                  │
                  ▼
           Real-time Sync
                  │
                  ▼
        Other Components/Tabs
```

---

## Intelligence API Architecture

### Learning Loop System

```
┌───────────────────────────────────────────────────────────────┐
│                    LEARNING LOOP SYSTEM                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐   │
│  │  Input  │───▶│Prediction│───▶│ Action  │───▶│Feedback │   │
│  │  Data   │    │  Model   │    │  Taken  │    │ Capture │   │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘   │
│       ▲                                             │        │
│       │                                             │        │
│       │         ┌─────────────────────┐            │        │
│       └─────────│   Model Training    │◀───────────┘        │
│                 │  & Improvement      │                      │
│                 └─────────────────────┘                      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### API Categories

1. **Production APIs (4)** - Live at launch
   - AI Scope API ($2,499/mo)
   - Instant Quote API ($499/mo)
   - Contractor Match API ($299/mo)
   - Demand Heatmap API ($199/mo)

2. **Premium APIs (34)** - Unlock May 2026
   - Job Intelligence (10 endpoints)
   - Contractor Intelligence (10 endpoints)
   - Market Intelligence (10 endpoints)
   - Financial Intelligence (4 endpoints)

---

## Authentication & Authorization

### Auth Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User enters credentials                                   │
│            │                                                  │
│            ▼                                                  │
│  2. Validate credentials                                      │
│            │                                                  │
│            ▼                                                  │
│  3. Generate JWT token                                        │
│            │                                                  │
│            ▼                                                  │
│  4. Store token securely                                      │
│            │                                                  │
│            ▼                                                  │
│  5. Include token in API requests                             │
│            │                                                  │
│            ▼                                                  │
│  6. Validate token on each request                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| Homeowner | Post jobs, view bids, message contractors, make payments |
| Contractor | Browse jobs, submit bids, message homeowners, receive payments |
| Subcontractor | Same as contractor, can be hired by GCs |
| Operator | Manage territories, approve contractors, view analytics |
| Admin | Full platform access, analytics, user management |

---

## Performance Optimization

### Code Splitting Strategy

```javascript
// Lazy load route components
const TerritoryMapPage = lazy(() => import('./components/TerritoryMapPage'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const IntelligenceAPIManager = lazy(() => import('./components/IntelligenceAPI/IntelligenceAPIManager'));
```

### Bundle Optimization

1. **Tree Shaking**: Remove unused code automatically
2. **Code Splitting**: Route-based chunks
3. **Lazy Loading**: Load components on demand
4. **Image Optimization**: WebP with fallbacks
5. **Compression**: Gzip/Brotli for production

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Time to Interactive | < 3s | ~2.5s |
| Lighthouse Score | > 90 | 95+ |
| Bundle Size (main) | < 500KB | ~430KB |

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Network Security                                   │
│  ├── HTTPS/TLS encryption                                   │
│  ├── CORS configuration                                     │
│  └── Rate limiting                                          │
│                                                              │
│  Layer 2: Authentication                                     │
│  ├── JWT token validation                                   │
│  ├── OAuth 2.0 providers                                    │
│  └── Session management                                     │
│                                                              │
│  Layer 3: Authorization                                      │
│  ├── Role-based access control                              │
│  ├── Resource-level permissions                             │
│  └── API key validation                                     │
│                                                              │
│  Layer 4: Data Protection                                    │
│  ├── Input validation (Zod)                                 │
│  ├── XSS prevention                                         │
│  ├── CSRF tokens                                            │
│  └── SQL injection prevention                               │
│                                                              │
│  Layer 5: Compliance                                         │
│  ├── GDPR consent management                                │
│  ├── CCPA compliance                                        │
│  ├── PCI DSS for payments                                   │
│  └── Audit logging                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy

### Test Pyramid

```
         ┌───────────────┐
         │    E2E       │  Playwright/Cypress
         │   Tests      │  (10%)
         └───────────────┘
        ┌─────────────────┐
        │  Integration   │  Component tests
        │    Tests       │  (30%)
        └─────────────────┘
       ┌───────────────────┐
       │     Unit         │  Vitest/Jest
       │    Tests         │  (60%)
       └───────────────────┘
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| Vitest | Unit tests for web app |
| Jest | Unit tests for mobile app |
| React Testing Library | Component testing |
| Playwright | End-to-end testing |
| MSW | API mocking |

### Coverage Targets

- **Unit Tests**: 80%+ line coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Happy paths and edge cases

---

## Deployment Architecture

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                      CI/CD PIPELINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Push to main                                                │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────┐                                            │
│  │    Lint     │ ESLint + TypeScript                        │
│  └─────────────┘                                            │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────┐                                            │
│  │    Test     │ Vitest + Coverage                          │
│  └─────────────┘                                            │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────┐                                            │
│  │    Build    │ Vite production build                      │
│  └─────────────┘                                            │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────┐                                            │
│  │   Deploy    │ GitHub Pages / Vercel / Netlify            │
│  └─────────────┘                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Targets

| Environment | Platform | Purpose |
|-------------|----------|---------|
| Development | Local | Feature development |
| Staging | Vercel Preview | QA and testing |
| Production | GitHub Pages | Live application |

---

## Mobile Architecture

### React Native / Expo Structure

```
mobile/
├── App.tsx                 # Entry point
├── src/
│   ├── components/         # Shared components
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── JobsScreen.tsx
│   │   ├── TerritoriesScreen.tsx
│   │   ├── MessagesScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/         # React Navigation
│   │   └── AppNavigator.tsx
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
└── package.json
```

### Mobile-Specific Considerations

1. **Offline Support**: AsyncStorage for local data
2. **Push Notifications**: Expo Notifications
3. **Camera/Video**: Expo Camera/AV
4. **Location**: Expo Location
5. **Maps**: React Native Maps

---

## API Documentation

### OpenAPI Specification

All Intelligence APIs follow OpenAPI 3.0.1 specification:

```yaml
openapi: 3.0.1
info:
  title: FairTradeWorker Intelligence API
  version: 1.0.0
  description: Self-learning APIs for home services intelligence
servers:
  - url: https://api.fairtradeworker.com/v1
paths:
  /intelligence/job-scope:
    post:
      summary: Generate job scope from video/image
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/JobScopeRequest'
      responses:
        '200':
          description: Generated job scope
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/JobScopeResponse'
```

---

## Scaling Considerations

### Horizontal Scaling

```
                    Load Balancer
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ App     │    │ App     │    │ App     │
    │ Server  │    │ Server  │    │ Server  │
    └─────────┘    └─────────┘    └─────────┘
         │               │               │
         └───────────────┴───────────────┘
                         │
                    ┌────────┐
                    │Database│
                    └────────┘
```

### Caching Strategy

| Cache Type | Technology | TTL |
|------------|------------|-----|
| API Responses | CDN/Edge | 5 min |
| Static Assets | CDN | 1 year |
| User Sessions | Memory | 24 hours |
| AI Predictions | KV Store | 1 hour |

---

## Monitoring & Observability

### Monitoring Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Error Tracking | Sentry | Error capture and alerting |
| Performance | Web Vitals | Core web vitals monitoring |
| Analytics | Custom | Business metrics |
| Logging | Console + Sentry | Debug information |

### Key Metrics

1. **Business Metrics**
   - Jobs posted per day
   - Bid acceptance rate
   - Territory claim rate
   - API call volume

2. **Technical Metrics**
   - Response times
   - Error rates
   - Uptime percentage
   - Build times

---

## Future Considerations

### Planned Enhancements

1. **Microservices Migration**: Split monolith as scale requires
2. **GraphQL**: Consider for complex data requirements
3. **Real-time**: WebSocket for live updates
4. **AI Enhancement**: On-device ML for faster predictions
5. **Multi-region**: Geographic distribution for latency

### Technology Radar

| Technology | Status | Notes |
|------------|--------|-------|
| Next.js | Evaluate | SSR/SSG benefits |
| tRPC | Evaluate | Type-safe API layer |
| Turborepo | Evaluate | Monorepo tooling |
| Rust | Watch | Backend performance |

---

## Contributing

See [README.md](README.md) for contribution guidelines.

## Related Documentation

- [PRD.md](PRD.md) - Product requirements
- [INTELLIGENCE_API_ARCHITECTURE.md](INTELLIGENCE_API_ARCHITECTURE.md) - API details
- [SECURITY.md](SECURITY.md) - Security policies
- [LEGAL_COMPLIANCE.md](LEGAL_COMPLIANCE.md) - Compliance requirements

---

*Last updated: January 2025*
