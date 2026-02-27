# HotspotManager - Expo React Native App

A fully configured Expo project with React Native for Android development using Expo Go.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app installed on Android device

### Quick Start

1. **Install Dependencies** (Already done)
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   or for Android specifically:
   ```bash
   npm run android
   ```

3. **Open in Expo Go**
   - Scan the QR code with your Android device using Expo Go app
   - Or press `a` in the terminal to open on Android emulator

## 📱 Project Structure

```
.
├── app/                      # App routes and layouts
│   ├── _layout.tsx          # Root layout with font configuration
│   ├── (tabs)/              # Tabbed navigation
│   │   ├── _layout.tsx      # Tab navigation layout
│   │   ├── index.tsx        # Home screen
│   │   └── two.tsx          # Settings screen
│   └── modal.tsx            # Modal screen
├── assets/                   # Images, fonts, icons
│   ├── fonts/               # Custom fonts (SpaceMono)
│   └── images/              # App icons and splash screens
├── components/              # Reusable components
├── constants/               # App constants, colors, and styles
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions and services
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Installed Dependencies

### Core
- `expo@55.0.2` - Expo framework
- `expo-router@55.0.2` - File-based routing
- `react-native@0.83.2` - React Native framework
- `react@19.2.0` - React library
- `typescript@5.9.2` - TypeScript support

### UI & Navigation
- `@react-navigation/native@7.1.28` - Navigation library
- `react-native-screens@4.23.0` - Device screen optimization
- `react-native-safe-area-context@5.6.2` - Safe area handling
- `react-native-gesture-handler@^latest` - Gesture support

### Fonts & Icons
- `@expo/vector-icons@15.0.2` - Multiple icon font families:
  - FontAwesome
  - MaterialIcons
  - Ionicons
  - AntDesign
- `expo-font@55.0.4` - Custom font loading

### Features & Utilities
- `expo-device` - Device information
- `expo-clipboard` - Clipboard access
- `expo-haptics` - Vibration/haptics
- `expo-localization` - Locale support
- `expo-file-system` - File system access
- `expo-application` - Application utilities
- `@react-native-async-storage/async-storage` - Data persistence
- `react-native-svg` - SVG support
- `axios` - HTTP client

### Animation
- `react-native-reanimated@4.2.1` - Animation library
- `react-native-worklets@0.7.2` - Worklets support

## 🚀 Available Scripts

```bash
# Start the development server
npm start

# Open on Android emulator/device
npm run android

# Open on iOS (Mac only)
npm run ios

# Open web version
npm run web
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ENVIRONMENT=development
```

### Android Permissions
Configured in `app.json`:
- INTERNET
- CHANGE_NETWORK_STATE
- ACCESS_NETWORK_STATE
- CHANGE_WIFI_STATE
- ACCESS_WIFI_STATE
- READ_PHONE_STATE

## 📚 Icon Libraries

You can use multiple icon families in the app:

```tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

// Usage
<MaterialIcons name="home" size={24} color="black" />
```

Browse available icons: https://icons.expo.fyi/

## 📖 Custom Hooks

### `useAppState()`
Get app initialization status and device information.

```tsx
import { useAppState } from '@/hooks/useAppState';

const { isReady, appInfo, error } = useAppState();
```

### `useAsyncStorage(key, initialValue)`
Persistent storage with async operations.

```tsx
import { useAsyncStorage } from '@/hooks/useAppState';

const { value, loading, updateValue } = useAsyncStorage('myKey', 'defaultValue');
```

## 🐛 Error Handling

The app includes a global error handler for better debugging:

```tsx
import { errorHandler, setupGlobalErrorHandler } from '@/utils/errorHandler';

setupGlobalErrorHandler();
errorHandler.captureError(new Error('Test'), 'context');
```

## 🌐 API Services

Use the pre-configured Axios instance:

```tsx
import { apiService } from '@/utils/api';

// GET request
const response = await apiService.get('/endpoint');

// POST request
await apiService.post('/endpoint', { data: 'value' });
```

## 🎯 Troubleshooting

### App won't load in Expo Go
1. Ensure both phone and computer are on the same WiFi network
2. Check that the Expo development server is running
3. Try scanning the QR code again
4. Clear Expo cache: `expo start --clear`

### Fonts not loading
1. Ensure font files are in `assets/fonts/`
2. Font files are loaded in `app/_layout.tsx`
3. Restart the development server

### Build issues
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Expo cache: `expo start --clear`
3. Restart the development server

## 📄 License

This project is private and belongs to OnlyTheFamily.

## 🤝 Support

For issues or questions, check the [Expo Documentation](https://docs.expo.dev/)
