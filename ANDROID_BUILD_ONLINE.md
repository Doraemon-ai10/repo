# RBLXFinder — Online Android APK build

This project includes a Codemagic workflow for building an installable Android debug APK without GitHub Actions.

## Build from a phone

1. Open Codemagic and sign in with GitHub.
2. Add the `Doraemon-ai10/repo` repository.
3. Select the `main` branch.
4. Codemagic detects the root `codemagic.yaml`.
5. Select `rblxfinder-android-debug`.
6. Start the build.
7. Download `RBLXFinder-Noobie-v2.0.0-debug.apk` from Artifacts.

The APK is a native Android app with package `com.noobie.rblxfinder`. It does not open the Vercel website at startup; the bundled UI is inside the APK. Online Roblox/Supabase/API features still require an Internet connection.

This workflow intentionally builds a debug APK for direct personal installation. A signed release build can be added later with a user-owned Android keystore.
