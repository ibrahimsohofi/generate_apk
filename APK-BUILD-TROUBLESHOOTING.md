# 🔧 APK Build Troubleshooting Guide - Droguerie Jamal

## 🚨 Current Error Analysis

**Error:** `Could not read script 'cordova.variables.gradle' as it does not exist`

**Root Cause:** Capacitor hasn't properly synced the web assets with the Android project.

---

## 🛠️ **Quick Fix Solutions**

### **Option 1: Use Automated Scripts** ⭐ **RECOMMENDED**

#### Windows PowerShell (Best option):
```powershell
# Run in PowerShell as Administrator
cd C:\Users\ibso\Projects\generate_apk
.\fix-apk-build.ps1
```

#### Windows Command Prompt:
```cmd
cd C:\Users\ibso\Projects\generate_apk
fix-apk-build.bat
```

### **Option 2: Manual Step-by-Step**

```bash
# 1. Clean everything
cd C:\Users\ibso\Projects\generate_apk
rmdir /s /q dist
rmdir /s /q android\app\build

# 2. Build web app
bun run build

# 3. Force sync Capacitor
bunx cap sync android --force

# 4. Clean Android
cd android
gradlew clean
cd ..

# 5. Build APK
bunx cap build android
```

---

## 🔍 **Advanced Troubleshooting**

### **If Scripts Still Fail:**

#### **Reset Capacitor Completely:**
```bash
# Remove Android platform
bunx cap clean android

# Re-add Android platform
bunx cap add android

# Build web app
bun run build

# Sync again
bunx cap sync android

# Build APK
bunx cap build android
```

#### **Check Java Installation:**
```bash
# Verify Java version (needs JDK 17+)
java -version
javac -version

# If not installed, download from:
# https://adoptium.net/temurin/releases/
```

#### **Manual Gradle Build:**
```bash
cd android
gradlew assembleDebug --stacktrace --info
```

---

## 🎯 **Environment Requirements Checklist**

- [ ] **Java JDK 17+** installed
- [ ] **JAVA_HOME** environment variable set
- [ ] **Node.js/Bun** installed and working
- [ ] **Android SDK** (optional but recommended)
- [ ] **Project directory** is correct (`generate_apk`)

---

## 📱 **Expected APK Location**

Once successful, your APK will be at:
```
C:\Users\ibso\Projects\generate_apk\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🆘 **If All Else Fails**

### **Nuclear Option - Complete Reset:**

```bash
# 1. Backup your changes
cp -r src src_backup

# 2. Delete problematic directories
rmdir /s /q android
rmdir /s /q dist
rmdir /s /q node_modules

# 3. Reinstall everything
bun install
bunx cap add android
bun run build
bunx cap sync android
bunx cap build android
```

### **Alternative Build Methods:**

1. **Use Android Studio:**
   - Open `android/` folder in Android Studio
   - Build → Generate Signed Bundle/APK

2. **Use Cordova CLI:**
   ```bash
   npm install -g cordova
   cordova build android
   ```

---

## 📞 **Getting Help**

If you're still having issues:

1. **Check Java installation:**
   ```bash
   java -version
   echo %JAVA_HOME%
   ```

2. **Share error logs** from:
   - `android\build\reports\problems\problems-report.html`
   - Console output with `--stacktrace` flag

3. **Try minimal test:**
   ```bash
   cd android
   gradlew --version
   ```

---

## ✅ **Success Indicators**

You'll know it worked when you see:
- ✅ "BUILD SUCCESSFUL" message
- ✅ APK file created (~15-25 MB)
- ✅ No red error messages

**The APK will contain your complete Droguerie Jamal inventory system with:**
- 🏪 12 sample products (43,940 DH inventory)
- 📱 Offline functionality
- 🌍 French/Arabic support
- 🎨 Professional branding with new logos
