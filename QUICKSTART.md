# 🚀 Quick Start Guide - HotspotManager

## First Time Setup ✅

Your project is now fully configured with all necessary dependencies, fonts, layouts, and icons for development in Expo Go.

### What's Been Installed:

✅ **29 Essential Dependencies**
- Expo SDK 55 with Router for navigation
- React 19 & React Native 0.83
- Icon Libraries: FontAwesome, MaterialIcons, Ionicons, AntDesign
- Custom Font Support (SpaceMono)
- Data Persistence (AsyncStorage)
- HTTP Client (Axios)
- Device Access Utilities
- SVG & Animation Support

✅ **Project Structure**
- `/app` - Route-based file structure with Expo Router
- `/components` - Reusable UI components
- `/constants` - Colors, styles, and configurations
- `/hooks` - Custom React hooks
- `/utils` - Helper functions and services
- `/assets/fonts` - Custom fonts (SpaceMono)
- `/assets/images` - App icons and splash screens

✅ **Configuration & Features**
- TypeScript support
- Dark/Light theme support
- Global error handling
- Async storage utilities
- API client with Axios
- Device info detection
- Android permissions configured

---

## 🎯 Start Your App

### Option 1: Start Development Server
```bash
npm start
```

Then press:
- **`a`** to open in Android Emulator
- **`i`** to open in iOS Simulator (Mac only)
- **`w`** to open in web browser

### Option 2: Direct Android Start
```bash
npm run android
```

### Option 3: Using Expo CLI Directly
```bash
expo start
# Then scan QR code with Expo Go app on your Android device
```

---

## 📱 Using on Physical Android Device

1. **Install Expo Go** app from Google Play Store
2. **Connect to Same WiFi** as your development computer
3. **Run development server:**
   ```bash
   npm start
   ```
4. **Scan the QR code** with your Android device
5. **App loads automatically** in Expo Go

---

## 🎨 Available Icon Libraries

Use any of these icon families in your components:

```tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

// Usage examples:
<MaterialIcons name="home" size={24} color="black" />
<Ionicons name="settings" size={24} color="blue" />
<FontAwesome name="heart" size={24} color="red" />
<AntDesign name="user" size={24} color="green" />
```

📚 **Browse all icons:** https://icons.expo.fyi/

---

## 📁 Project Structure Overview

```
HotspotManager/
├── app/                              # Main app routes
│   ├── _layout.tsx                  # Root layout + font loading
│   ├── +html.tsx                    # Web entry point
│   ├── +not-found.tsx               # 404 page
│   ├── modal.tsx                    # Modal example
│   └── (tabs)/                      # Tab navigation group
│       ├── _layout.tsx              # Tab layout
│       ├── index.tsx                # Home tab
│       └── two.tsx                  # Settings tab
│
├── assets/
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf    # Custom font
│   └── images/
│       ├── icon.png                 # App icon
│       ├── splash-icon.png          # Splash screen
│       ├── favicon.png              # Web favicon
│       └── android-icon-*.png       # Android icons
│
├── components/                       # Reusable components
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   ├── Themed.tsx
│   └── useColorScheme.ts
│
├── constants/
│   ├── Colors.ts                    # Theme colors
│   └── Styles.ts                    # Common styles
│
├── hooks/
│   └── useAppState.ts               # App state & storage hooks
│
├── utils/
│   ├── api.ts                       # Axios API client
│   ├── env.ts                       # Environment config
│   ├── errorHandler.ts              # Global error handling
│   └── helpers.ts                   # Utility functions
│
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── metro.config.js                  # Metro bundler config
```

---

## 🎯 Key Features & Usage

### 1. **Dark/Light Theme Support**
Automatically switches based on device settings:
```tsx
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const colorScheme = useColorScheme();
const color = Colors[colorScheme ?? 'light'].text;
```

### 2. **Persistent Storage**
```tsx
import { useAsyncStorage } from '@/hooks/useAppState';

const { value, updateValue } = useAsyncStorage('myKey', 'defaultValue');
```

### 3. **API Services**
```tsx
import { apiService } from '@/utils/api';

const { data } = await apiService.get('/endpoint');
```

### 4. **Device Information**
```tsx
import { useAppState } from '@/hooks/useAppState';

const { appInfo } = useAppState();
console.log(appInfo?.device);  // Device name
```

### 5. **Common Styles**
```tsx
import { commonStyles } from '@/constants/Styles';

<View style={commonStyles.centerContainer}>...</View>
```

---

## ⚙️ Android Configuration

Your app is configured with these Android permissions:
- `INTERNET` - Network access
- `CHANGE_NETWORK_STATE` - Manage network
- `ACCESS_NETWORK_STATE` - Read network state
- `CHANGE_WIFI_STATE` - Control WiFi
- `ACCESS_WIFI_STATE` - Read WiFi state
- `READ_PHONE_STATE` - Phone state access

Package name: `com.onlythefamily.hotspotmanager`

---

## 🔧 Customization

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Theme Colors
Edit `constants/Colors.ts`:
```ts
const tintColorLight = '#2f95dc';  // Change to your color
```

### Add Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ENVIRONMENT=development
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
expo start --clear
```

### App won't appear in Expo Go
1. Check both devices on same WiFi network
2. Try: `expo start --tunnel`
3. Or tunnel mode: `expo start --localhost`

### Fonts not loading
1. Ensure fonts in `assets/fonts/` directory
2. Restart dev server
3. Clear bundle cache: `expo start --clear`

### TypeScript errors
```bash
npm run tsc  # or npx tsc
```

---

## 📚 Learn More

- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **Expo Router**: https://expo.dev/docs/routing/introduction/
- **Icon Browser**: https://icons.expo.fyi/

---

## ✨ You're All Set!

Your Expo Android project is ready to use. Start developing with:

```bash
npm start
```

Then scan the QR code with **Expo Go** on your Android device! 🎉
