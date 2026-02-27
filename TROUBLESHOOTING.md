# 🐛 Troubleshooting Guide - HotspotManager

## Common Issues & Solutions

### 1. ❌ "Cannot find expo-cli" or "expo: command not found"

**Solution:**
```bash
npm install -g expo-cli
expo --version  # Verify installation
```

Then restart your terminal.

---

### 2. ❌ App Won't Load in Expo Go

**Cause:** Phone and computer on different networks

**Solution:**
```bash
# Option 1: Check LAN (same WiFi)
npm start

# Option 2: Use tunnel mode (works over internet)
npm start -- --tunnel

# Option 3: Use localhost (emulator only)
npm start -- --localhost
```

Then scan QR code or press 'a' for Android.

---

### 3. ❌ "Cannot find module" Errors

**Cause:** Dependencies not fully installed

**Solution:**
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
npm start -- --clear

# Restart development server
```

---

### 4. ❌ Fonts Not Loading

**Signs:**
- Text appears in default font
- DevTools show font warning

**Solution:**
1. Verify font file exists: `assets/fonts/SpaceMono-Regular.ttf`
2. Restart dev server: `npm start -- --clear`
3. Delete app cache on device and reload
4. Check `app/_layout.tsx` - font loading should be here

---

### 5. ❌ "Metro Bundler" Errors

**Solution:**
```bash
# Kill any existing metro process
npx expo start --clear

# Or if that fails
npm install
npm start
```

---

### 6. ❌ TypeScript Errors in Code Editor

**Solution:** Reload VS Code window
- Mac: `Cmd + Shift + P` → Reload Window
- Windows: `Ctrl + Shift + P` → Reload Window

---

### 7. ❌ App Crashes on Android Device

**Solution Steps:**
1. Check the error in terminal
2. Verify all imports are correct
3. Ensure component paths use `@/` alias
4. Check AsyncStorage for null values
5. Clear device app cache

**If still failing:**
```bash
npm start -- --clear
# Then reload app in Expo Go
```

---

### 8. ❌ Icons Not Showing

**Check:**
```tsx
// Verify correct import
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Use correct icon name
<MaterialIcons name="home" size={24} color="black" />
```

**Browse available icons:**
https://icons.expo.fyi/

---

### 9. ❌ Performance Issues / App Slow

**Solution:**
```bash
# Clear cache and rebuild
npm start -- --clear

# Or completely reset
rm -rf .expo node_modules
npm install
npm start
```

---

### 10. ❌ "Unexpected token" or "SyntaxError"

**Usually caused by:**
- Incorrect JSX syntax
- Missing imports
- Typos in component names

**Solution:**
1. Check error location in VS Code
2. Verify file has `.tsx` (not `.ts`)
3. Import required components
4. Check for red underlines in editor

---

### 11. ❌ Network Connection Lost in Expo Go

**Solution:**
```bash
# Stop dev server
# Press Ctrl+C in terminal

# Restart with tunnel
npm start -- --tunnel

# Then scan new QR code
```

---

### 12. ❌ App Works on Emulator But Not Physical Device

**Cause:** Network connectivity issue

**Solution:**
1. Both phone and computer on **same WiFi**
2. No proxy/firewall blocking
3. Try: `npm start -- --tunnel`
4. Check phone WiFi connection
5. Restart phone WiFi

---

## 🔍 How to Debug Issues

### 1. **Check Terminal Output**
Always read the error message in terminal - usually tells you exactly what's wrong.

### 2. **Enable Developer Menu on Device**
In Expo Go:
- Shake device (or press Ctrl+M on emulator)
- Browse JS Debugger
- Check console logs

### 3. **Use React DevTools**
```bash
npm install -g react-devtools
react-devtools

# Then enable in dev server menu
```

### 4. **Check TypeScript Errors**
```bash
npx tsc --noEmit
```

---

## 📋 Pre-Check Before Starting Dev Server

✓ Node.js installed: `node --version` (should be v16+)
✓ npm updated: `npm --version`
✓ Expo CLI: `expo --version`
✓ Git initialized: `git status`
✓ Dependencies installed: `npm list --depth=0`
✓ No TypeScript errors: `npx tsc --noEmit`

---

## 🆘 If All Else Fails

**Nuclear option:**
```bash
# Complete cleanup
rm -rf node_modules .expo .expo-shared package-lock.json
npm install
npm start -- --clear
```

Then:
1. Restart computer
2. Restart phone/emulator
3. Reinstall Expo Go app
4. Scan QR code again

---

## 📞 Getting Help

- **Expo Docs**: https://docs.expo.dev/
- **Stack Overflow**: Tag with `expo` or `react-native`
- **Expo Community**: https://forums.expo.dev/
- **React Native Docs**: https://reactnative.dev/

---

## ✅ Success Indicators

When everything is working correctly, you should see:

✓ QR code appears in terminal
✓ App loads in Expo Go (usually 3-5 seconds)
✓ Two tabs visible (Home and Settings)
✓ No errors in console
✓ Hot reload works (save → instant update)
✓ Icons display correctly
✓ Tap info button shows modal
✓ Dark/Light toggle works

If you see all these, **you're good to go!** 🎉
