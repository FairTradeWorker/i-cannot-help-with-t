# FairTradeWorker Mobile (iOS/Android)

## 📱 Quick Start

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── JobCard.tsx
│   │   ├── BidCard.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TerritoryMap.tsx
│   │   ├── VideoRecorder.tsx
│   │   └── ...
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── JobsScreen.tsx
│   │   ├── JobDetailsScreen.tsx
│   │   ├── MessagesScreen.tsx
│   │   └── ...
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useNotifications.ts
│   │   ├── useJobs.ts
│   │   └── useTerritories.ts
│   ├── utils/            # Utility functions
│   │   ├── formatters.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   └── types/            # TypeScript types
└── App.tsx               # Root component
```

## 🎨 Components

### Available Components

- **JobCard** - Display job information
- **BidCard** - Show contractor bids
- **MessageBubble** - Chat messages
- **TerritoryMap** - Interactive territory map
- **VideoRecorder** - 60-second video recording
- **TerritoryCard** - Territory list items
- **NotificationCard** - System notifications
- **ContractorCard** - Contractor profiles
- **PaymentCard** - Payment methods/transactions
- **EmptyState** - Empty state UI
- **LoadingSpinner** - Loading indicators
- **ErrorBoundary** - Error handling

## 🪝 Custom Hooks

### useNotifications
```typescript
const { notifications, unreadCount, markAsRead } = useNotifications();
```

### useJobs
```typescript
const { jobs, stats, refresh } = useJobs({ filters: { status: 'posted' } });
```

### useTerritories
```typescript
const { territories, claimTerritory } = useTerritories({ filter: 'available' });
```

## 🛠️ Utilities

### Formatters
```typescript
import { formatCurrency, formatDate, formatTimeAgo } from '@/utils/formatters';
```

### Validation
```typescript
import { validateEmail, validatePhone, validateForm } from '@/utils/validation';
```

### Constants
```typescript
import { COLORS, SPACING, API_ENDPOINTS } from '@/utils/constants';
```

## 📱 Screens

All screens are fully functional and ready for integration:

- Home Dashboard
- Jobs Browser
- Job Details
- Messages
- Territories
- Profile
- Notifications
- Settings
- Submit Bid

## 🔗 Shared Packages

The app uses shared packages from `packages/shared/`:

- **DataStore** - Platform-agnostic data management
- **First300System** - First 300 launch system
- **TerritoryPricing** - Territory pricing logic
- **Types** - Shared TypeScript types

## 🚀 Development

### Adding a New Screen

1. Create screen file in `src/screens/`
2. Add route to `AppNavigator.tsx`
3. Update navigation types

### Adding a New Component

1. Create component in `src/components/`
2. Export from component directory
3. Use throughout app

### Styling

Uses NativeWind (Tailwind CSS for React Native):

```tsx
<View className="bg-white rounded-xl p-4 shadow-sm">
  <Text className="text-lg font-bold text-gray-900">Hello</Text>
</View>
```

## 📦 Dependencies

- React Native
- Expo
- React Navigation
- NativeWind (Tailwind CSS)
- Lucide React Native (Icons)
- React Native Maps
- Expo Camera

## 🔄 Current Status

**60% Complete** - Core features working, ready for advanced features!

See `MOBILE_MIGRATION_FINAL.md` for detailed progress report.

---

**Built with ❤️ for FairTradeWorker**

