Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   Droguerie Jamal APK Build Fix Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "capacitor.config.ts")) {
    Write-Host "ERROR: Not in the correct project directory!" -ForegroundColor Red
    Write-Host "Please navigate to the generate_apk directory first." -ForegroundColor Yellow
    exit 1
}

# Step 1: Clean previous builds
Write-Host "[1/7] Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
if (Test-Path "android\app\build") { Remove-Item "android\app\build" -Recurse -Force }

# Step 2: Check Node/Bun installation
Write-Host "[2/7] Checking environment..." -ForegroundColor Yellow
try {
    $bunVersion = & bun --version
    Write-Host "✓ Bun version: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Bun not found! Please install Bun first." -ForegroundColor Red
    exit 1
}

# Step 3: Install dependencies
Write-Host "[3/7] Installing dependencies..." -ForegroundColor Yellow
& bun install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Dependency installation failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Build web application
Write-Host "[4/7] Building web application..." -ForegroundColor Yellow
& bun run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Web build failed!" -ForegroundColor Red
    exit 1
}

# Check if dist directory was created
if (!(Test-Path "dist")) {
    Write-Host "ERROR: dist directory not created!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Web build completed successfully" -ForegroundColor Green

# Step 5: Sync Capacitor
Write-Host "[5/7] Syncing Capacitor with Android..." -ForegroundColor Yellow
& bunx cap sync android --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Cap sync had issues, trying alternative method..." -ForegroundColor Yellow

    # Alternative: Clean and re-add Android
    & bunx cap clean android
    & bunx cap add android
    & bunx cap sync android

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Capacitor sync failed!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✓ Capacitor sync completed" -ForegroundColor Green

# Step 6: Clean Android build
Write-Host "[6/7] Cleaning Android build cache..." -ForegroundColor Yellow
Set-Location "android"
& .\gradlew clean
Set-Location ".."

# Step 7: Build APK
Write-Host "[7/7] Building Android APK..." -ForegroundColor Yellow
& bunx cap build android
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: APK build failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting suggestions:" -ForegroundColor Yellow
    Write-Host "1. Make sure Java JDK 17+ is installed" -ForegroundColor White
    Write-Host "2. Set JAVA_HOME environment variable" -ForegroundColor White
    Write-Host "3. Try: cd android && gradlew assembleDebug" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "   ✅ APK BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your APK file is located at:" -ForegroundColor Cyan
Write-Host "android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""

# Check if APK file exists
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "✓ APK file size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "⚠ APK file not found at expected location" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
