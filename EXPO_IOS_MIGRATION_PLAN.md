# Expo iOS Migration Plan

Complete migration strategy to bring all web app functionality to Expo/React Native for iOS.

## Migration Overview

### Current State
- **Web App**: React 19 + Vite (complete, 160+ components)
- **Mobile App**: Expo skeleton (basic structure exists)

### Target State
- **iOS App**: Full feature parity with web app
- **Shared Code**: Maximize code reuse between web and mobile

### Migration Strategy
1. **Shared Libraries** - Move business logic to shared packages
2. **Component Adaptation** - Create React Native versions of web components
3. **Platform-Specific UI** - Native iOS design patterns
4. **Incremental Migration** - Feature by feature

---

## Step 1: Create Shared Libraries

### Core Shared Modules

Create `packages/shared/` directory structure:

```
packages/shared/
├── src/
│   ├── lib/
│   │   ├── store.ts              # DataStore (Spark KV wrapper)
│   │   ├── types.ts              # All TypeScript types
│   │   ├── territory-pricing.ts  # Territory pricing logic
│   │   ├── territory-validation.ts
│   │   ├── first300.ts
│   │   ├── ai-service.ts
│   │   └── ...
│   ├── api/
│   │   └── client.ts             # API client (works on web & mobile)
│   └── utils/
│       └── ...
└── package.json
```

### Business Logic (Shareable)
- ✅ DataStore class
- ✅ Territory pricing logic
- ✅ Territory validation
- ✅ First 300 system
- ✅ AI service integration
- ✅ Route optimization logic
- ✅ Type definitions

### Platform-Specific (Separate)
- ❌ UI Components (web uses shadcn/ui, mobile uses React Native)
- ❌ Navigation (web uses tabs, mobile uses React Navigation)
- ❌ Maps (web uses react-simple-maps, mobile uses react-native-maps)

---

## Step 2: Component Mapping

### Web → Mobile Component Mapping

| Web Component | Mobile Component | Status |
|---------------|------------------|--------|
| `App.tsx` | `App.tsx` (Expo) | ✅ Exists |
| `HomeownerDashboard.tsx` | `screens/HomeownerScreen.tsx` | 🔄 To migrate |
| `ContractorDashboard.tsx` | `screens/ContractorScreen.tsx` | 🔄 To migrate |
| `JobBrowser.tsx` | `screens/JobsScreen.tsx` | 🔄 To migrate |
| `TerritoryMapPage.tsx` | `screens/TerritoriesScreen.tsx` | ✅ Exists (basic) |
| `MessagesView.tsx` | `screens/MessagesScreen.tsx` | 🔄 To migrate |
| `VideoJobCreator.tsx` | `screens/CreateJobScreen.tsx` | 🔄 To migrate |
| `PaymentScreen.tsx` | `screens/PaymentScreen.tsx` | 🔄 To migrate |
| `RealTimeTerritoryMap.tsx` | `components/TerritoryMap.tsx` | 🔄 To migrate |

---

## Step 3: Migration Priority

### Phase 1: Core Infrastructure (Week 1)
1. ✅ Set up shared packages structure
2. ✅ Move business logic to shared
3. ✅ Create API client abstraction
4. ✅ Set up React Navigation
5. ✅ Configure Expo build

### Phase 2: Essential Features (Week 2)
1. User authentication & profiles
2. Job browser (list view)
3. Job details
4. Basic messaging
5. Territory map (basic)

### Phase 3: Advanced Features (Week 3)
1. Video job creation
2. Territory claiming
3. Payment integration
4. Route optimization
5. Analytics dashboards

### Phase 4: Polish & Optimization (Week 4)
1. iOS-specific UI refinements
2. Performance optimization
3. Push notifications
4. App Store preparation

---

## Step 4: Implementation Plan

### Files to Create/Update

#### Shared Libraries
1. `packages/shared/package.json`
2. `packages/shared/src/lib/store.ts` (from `src/lib/store.ts`)
3. `packages/shared/src/lib/types.ts` (from `src/lib/types.ts`)
4. `packages/shared/src/lib/territory-pricing.ts`
5. `packages/shared/src/lib/territory-validation.ts`
6. `packages/shared/src/lib/first300.ts`
7. `packages/shared/src/api/client.ts`

#### Mobile Components
1. Update `mobile/src/navigation/AppNavigator.tsx`
2. Create `mobile/src/screens/HomeScreen.tsx` (enhanced)
3. Create `mobile/src/screens/JobsScreen.tsx`
4. Create `mobile/src/screens/JobDetailsScreen.tsx`
5. Create `mobile/src/screens/CreateJobScreen.tsx`
6. Create `mobile/src/screens/TerritoriesScreen.tsx` (enhanced)
7. Create `mobile/src/screens/MessagesScreen.tsx`
8. Create `mobile/src/screens/PaymentScreen.tsx`
9. Create `mobile/src/screens/ProfileScreen.tsx`

#### Mobile Components (UI)
1. Create `mobile/src/components/JobCard.tsx`
2. Create `mobile/src/components/TerritoryCard.tsx`
3. Create `mobile/src/components/MessageBubble.tsx`
4. Create `mobile/src/components/VideoRecorder.tsx`
5. Create `mobile/src/components/TerritoryMap.tsx` (react-native-maps)

---

## Step 5: Platform-Specific Considerations

### iOS Design Patterns
- Use **NativeBase** or **React Native Paper** for UI components
- Follow **iOS Human Interface Guidelines**
- Use **React Native Maps** for territory map
- Use **React Native Video** for video recording/playback
- Use **Expo Camera** for photo/video capture

### Navigation
- Use **@react-navigation/native**
- Tab navigation for main sections
- Stack navigation for detail screens
- Modal navigation for forms

### Data Storage
- Use **@react-native-async-storage/async-storage** for local storage
- Use **Supabase JS Client** (works in React Native)
- Use **Upstash Redis REST API** (works anywhere)

### Media Handling
- **Expo Camera** for recording
- **Expo ImagePicker** for photo selection
- **Expo Video** for playback
- Upload to cloud storage (Supabase Storage or similar)

---

## Step 6: Dependencies

### Mobile-Specific Packages Needed

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@react-navigation/stack": "^6.x",
    "react-native-maps": "^1.x",
    "react-native-video": "^5.x",
    "expo-camera": "~15.x",
    "expo-image-picker": "~15.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "@supabase/supabase-js": "^2.x",
    "@upstash/redis": "^1.x",
    "react-native-gesture-handler": "~2.x",
    "react-native-reanimated": "~3.x"
  }
}
```

---

## Step 7: Configuration Files

### Expo Configuration
Update `mobile/app.json`:
- Bundle identifier
- iOS version requirements
- Permissions (camera, location, etc.)
- Icons & splash screens

### Build Configuration
- iOS deployment target: 13.0+
- Enable camera permissions
- Enable location permissions
- Configure maps API key

---

## Next Steps

Starting migration now. Creating shared packages and mobile components...

