# 📦 Download & Build Guide - Droguerie Jamal APK

## 🎯 Quick Start (5 minutes to APK)

### Step 1: Download Package
```bash
# Your package is ready: droguerie-jamal-apk-ready.zip (590KB)
# Download from your Same workspace or use:
wget https://your-same-workspace/droguerie-jamal-apk-ready.zip
```

### Step 2: Install Java (One-time setup)
```bash
# Windows (PowerShell as Administrator)
choco install openjdk17
# OR download from: https://adoptium.net/temurin/releases/

# macOS
brew install openjdk@17
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc

# Linux (Ubuntu/Debian)
sudo apt update && sudo apt install openjdk-17-jdk
echo 'export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"' >> ~/.bashrc
```

### Step 3: Verify Java Installation
```bash
java -version
# Should show: openjdk version "17.x.x"
```

### Step 4: Extract and Build APK
```bash
# Extract the package
unzip droguerie-jamal-apk-ready.zip
cd android

# Make gradlew executable (Linux/macOS)
chmod +x ./gradlew

# Clean and build APK
./gradlew clean
./gradlew assembleDebug

# Windows users:
# gradlew.bat clean
# gradlew.bat assembleDebug
```

### Step 5: Locate Your APK
```bash
# Your APK will be generated at:
android/app/build/outputs/apk/debug/app-debug.apk

# File size: ~15-20 MB
# Target: Android 7.0+ (API 24+)
```

## 🔧 Alternative: Android Studio Method

1. **Install Android Studio** (includes Java automatically)
2. **Open Project**: File → Open → Select the `android/` folder
3. **Build APK**: Build → Build Bundle(s) / APK(s) → Build APK(s)
4. **APK Location**: Same as above

## 🚨 Troubleshooting

### Permission Denied (Linux/macOS)
```bash
chmod +x ./gradlew
```

### Java Not Found
```bash
# Check installation
which java
echo $JAVA_HOME

# Manually set JAVA_HOME
export JAVA_HOME="/path/to/your/java"
export PATH=$JAVA_HOME/bin:$PATH
```

### Build Failed
```bash
# Clean everything and retry
./gradlew clean --refresh-dependencies
./gradlew assembleDebug --info
```

### Gradle Daemon Issues
```bash
./gradlew --stop
./gradlew clean assembleDebug
```

## 📱 What You'll Get

### ✅ Professional Mobile App
- **App Name**: Droguerie Jamal
- **Package ID**: com.drogueriejamal.inventory
- **Version**: 1.0.0
- **Size**: ~15-20 MB

### ✅ Complete Features
- **Inventory Management**: Add, edit, delete, search products
- **Categories**: 6 professional categories for hardware stores
- **Multilingual**: French and Arabic interfaces
- **Offline**: Works without internet connection
- **Professional**: Business-ready branding and design

### ✅ Sample Data Included
- **12 authentic products** with Moroccan pricing (Dirhams)
- **Professional categories**: Droguerie, Sanitaire, Peinture, Quincaillerie, Outillage, Électricité
- **Ready for customization** with your actual inventory

## 🎉 Success!

Once generated, install the APK on your Android device:
```bash
# Install via ADB (if device connected)
adb install app-debug.apk

# OR copy APK to device and install manually
```

**Your professional inventory management app is ready for business!** 🏪
