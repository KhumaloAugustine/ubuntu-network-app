# Mobile App Setup Guide - Android

## Prerequisites

You need to install Android development tools to run the React Native app.

### 1. Install Android Studio

1. **Download Android Studio**: https://developer.android.com/studio
2. **Install** and open Android Studio
3. **Complete the setup wizard** - it will install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### 2. Configure Environment Variables

Add these to your system environment variables:

#### Using PowerShell (Run as Administrator):

```powershell
# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')

# Add platform-tools to PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidPlatformTools = "$env:LOCALAPPDATA\Android\Sdk\platform-tools"
$androidTools = "$env:LOCALAPPDATA\Android\Sdk\tools"
$androidToolsBin = "$env:LOCALAPPDATA\Android\Sdk\tools\bin"

if ($currentPath -notlike "*$androidPlatformTools*") {
    [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPlatformTools;$androidTools;$androidToolsBin", 'User')
}

Write-Host "✓ Environment variables set. Please RESTART your terminal for changes to take effect."
```

#### Or Manually:

1. Open **Settings** → **System** → **About** → **Advanced system settings**
2. Click **Environment Variables**
3. Under **User variables**, click **New**:
   - **Variable name**: `ANDROID_HOME`
   - **Variable value**: `C:\Users\<YourUsername>\AppData\Local\Android\Sdk`
4. Edit **Path** variable and add:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```
5. **Restart your terminal** (or computer)

### 3. Create an Android Virtual Device (Emulator)

1. Open **Android Studio**
2. Click **More Actions** → **Virtual Device Manager**
3. Click **Create Device**
4. Select a device (e.g., **Pixel 5**)
5. Select a system image (e.g., **Android 13 (API 33)**)
   - Click **Download** if not installed
6. Click **Finish**

### 4. Verify Installation

```powershell
# Check if adb is available
adb version

# List available emulators
emulator -list-avds

# Check Android SDK
where.exe adb
```

Expected output:
```
Android Debug Bridge version 1.0.41
...
```

---

## Running the Mobile App

### Option 1: Using Android Emulator

1. **Start the emulator** (one of these methods):
   
   **Via Android Studio:**
   - Open Android Studio → Virtual Device Manager → Click ▶️ on your device

   **Via Command Line:**
   ```powershell
   emulator -avd <YourAVDName>
   # Example: emulator -avd Pixel_5_API_33
   ```

2. **Wait for emulator to fully boot** (you'll see the Android home screen)

3. **Run the React Native app:**
   ```powershell
   cd mobile
   npx react-native run-android
   ```

### Option 2: Using Physical Android Device

1. **Enable Developer Options** on your Android phone:
   - Settings → About Phone → Tap **Build Number** 7 times
   
2. **Enable USB Debugging**:
   - Settings → Developer Options → USB Debugging → ON

3. **Connect phone via USB**

4. **Verify device connection:**
   ```powershell
   adb devices
   ```
   
   Should show:
   ```
   List of devices attached
   <device_id>    device
   ```

5. **Run the app:**
   ```powershell
   cd mobile
   npx react-native run-android
   ```

---

## Troubleshooting

### `adb` not recognized

**Solution:** Environment variables not loaded. Restart your terminal or run:
```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
```

### No emulators found

**Solution:** Create an AVD in Android Studio (see step 3 above)

### Build fails with Gradle error

**Solution:**
```powershell
cd mobile\android
./gradlew clean
cd ..
npx react-native run-android
```

### App installs but crashes

**Solution:** Check Metro bundler is running:
```powershell
# Terminal 1: Start Metro
npx react-native start

# Terminal 2: Run Android
npx react-native run-android
```

### Cannot connect to API

**Symptoms:** Network errors, "Unable to connect" messages

**Solution:** The app is configured to use `http://10.0.2.2:3000/api` for Android emulator.

1. **Ensure API server is running:**
   ```powershell
   cd api
   npm run start:dev
   ```

2. **Check the API is accessible:**
   ```powershell
   curl http://localhost:3000/api/auth/request-otp -Method POST -ContentType "application/json" -Body '{"phone":"+27821234567"}'
   ```

3. **For physical device**, update `mobile/src/services/api/apiClient.ts`:
   ```typescript
   // Replace localhost with your computer's IP
   return 'http://192.168.1.XXX:3000/api';
   ```

---

## Quick Start After Setup

Once Android Studio and emulator are configured:

```powershell
# Terminal 1: Start API server
cd api
npm run start:dev

# Terminal 2: Start emulator (if not already running)
emulator -avd Pixel_5_API_33

# Terminal 3: Run mobile app
cd mobile
npx react-native run-android
```

The app will:
1. Show the **Welcome** screen
2. Click **Get Started** → **Phone Verification** screen
3. Enter South African phone number (e.g., `0821234567`)
4. Click **Send Verification Code**
5. Check API server console for OTP (in debug mode)
6. Enter OTP → Success!

---

## iOS Setup (macOS Only)

If you're on macOS and want to test iOS:

1. **Install Xcode** from App Store
2. **Install CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```
3. **Install iOS dependencies:**
   ```bash
   cd mobile/ios
   pod install
   cd ..
   ```
4. **Run iOS:**
   ```bash
   npx react-native run-ios
   ```

---

## Next Steps

✅ **You've successfully set up:**
- React Native mobile app with native Android/iOS projects
- Welcome, Phone Verification, and OTP screens
- API integration with auto-configured URLs
- Navigation between screens

**Ready to develop:**
- Photo verification screen
- User profile management
- Vouching system UI
- Activity request/management screens
- GPS monitoring and panic button
