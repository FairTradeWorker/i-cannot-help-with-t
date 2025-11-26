# ServiceHub Mobile - Expo App

A complete React Native mobile application for the ServiceHub home services marketplace.

## Features

### Navigation
- Bottom tabs: Home, Jobs, Messages, Intelligence, Profile
- Stack navigation for all screens
- Deep linking support

### Screens

**Home/Marketplace:**
- Quick job posting (video, photo, text)
- Territory map teaser
- Featured jobs carousel
- Stats overview

**Jobs Section:**
- Job browser with filters and search
- Job details with bidding
- Location-based job browser
- Territory browser

**Dashboards:**
- Homeowner Dashboard
- Contractor Dashboard
- Operator Dashboard
- Earnings Dashboard
- Analytics Dashboard

**Intelligence APIs:**
- API marketplace
- API key management
- Learning metrics dashboard

**Communication:**
- Messages/conversations
- AI chat assistant
- Video job creator

**Payments:**
- Payment screen (Stripe integration ready)
- Payment management

**Profile/Account:**
- User profile
- Contractor verification
- Referral system
- Legal documents

### Native Features
- Camera/photo picker for job photos
- Location services for address auto-fill
- Push notifications
- Offline mode with AsyncStorage
- Biometric authentication
- Native animations with Reanimated

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

```bash
cd expo
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
expo/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Bottom tab screens
│   │   ├── index.tsx      # Home screen
│   │   ├── jobs.tsx       # Jobs browser
│   │   ├── messages.tsx   # Messages
│   │   ├── intelligence.tsx # Intelligence APIs
│   │   └── profile.tsx    # User profile
│   ├── job/               # Job detail screens
│   ├── post-job/          # Post job flow
│   ├── conversation/      # Chat screens
│   ├── dashboard/         # Dashboard screens
│   └── ...                # Other screens
├── src/
│   ├── components/        # Reusable components
│   │   └── ui/           # UI primitives
│   ├── lib/              # Utilities and store
│   ├── types/            # TypeScript types
│   ├── theme/            # Theme configuration
│   └── hooks/            # Custom hooks
├── assets/               # Images and fonts
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## UI Components

The app uses custom UI components that match the web app design:

- `Button` - Primary action button
- `Card` - Glass morphism cards
- `Badge` - Status badges
- `Input` - Form inputs
- `Avatar` - User avatars

## Theme

Supports both light and dark mode with automatic system detection.

Colors match the web app:
- Primary: Blue (#3b82f6)
- Secondary: Green (#22c55e)
- Accent: Orange (#f97316)

## Shared Code

The app shares types and patterns with the web app:
- Types from `src/types/`
- Store patterns similar to web app
- Same API interfaces

## Dependencies

Key dependencies:
- `expo` - Expo SDK
- `expo-router` - File-based routing
- `@react-navigation/*` - Navigation
- `react-native-reanimated` - Animations
- `expo-camera` - Camera access
- `expo-image-picker` - Photo/video selection
- `expo-location` - Location services
- `expo-notifications` - Push notifications
- `expo-local-authentication` - Biometric auth
- `@react-native-async-storage/async-storage` - Persistence
- `react-native-maps` - Map integration
- `@stripe/stripe-react-native` - Payments

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

MIT
