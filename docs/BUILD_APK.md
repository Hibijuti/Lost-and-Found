# Build an Android APK (Lost & Found)

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) to produce a installable `.apk` file.

## One-time setup

1. Install the EAS CLI and log in:

   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Link the app to your Expo account (creates/updates `projectId` in `app.json`):

   ```bash
   cd C:\Users\PC\LostAndFoundApp
   eas init
   ```

3. Copy environment variables from `.env.example` to a local `.env` for development:

   ```bash
   copy .env.example .env
   ```

   Fill in Firebase values from the Firebase Console → Project settings → Your apps → Web app.

4. Set the **same** variables for cloud builds (EAS does not upload your local `.env` file).

   **Option A — Expo website (recommended)**  
   [expo.dev](https://expo.dev) → your project → **Environment variables** → add each name for the **preview** environment:

   | Variable | Required |
   |----------|----------|
   | `EXPO_PUBLIC_FIREBASE_API_KEY` | Yes |
   | `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes |
   | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Yes |
   | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes |
   | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes |
   | `EXPO_PUBLIC_FIREBASE_APP_ID` | Yes |
   | `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional |

   **Option B — CLI secrets**

   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value "your-key" --type string
   ```

   Repeat for each `EXPO_PUBLIC_*` variable.

5. Configure Cloudinary in `constants/cloudinary.ts` (cloud name + upload preset). These are bundled at build time from source, not from `.env`.

## Build the APK

From the project folder:

```bash
npm run build:apk
```

Or directly:

```bash
eas build -p android --profile preview
```

- Profile **`preview`** → Android **APK** (`buildType: "apk"` in `eas.json`).
- Profile **`production`** → Android **AAB** for Google Play (not an APK).

When the build finishes, open the link in the terminal or on [expo.dev](https://expo.dev) → **Builds** → download the `.apk`.

## Install on a phone

1. Transfer the APK to the device (USB, Drive, etc.).
2. Enable installation from unknown sources if Android asks.
3. Open the APK and install.

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Firebase/auth fails in the APK only | Environment variables missing on EAS; add them for **preview**. |
| Build asks for credentials | Follow the prompts to let EAS manage an Android keystore (fine for school demos). |
| `eas: command not found` | Run `npm install -g eas-cli` or use `npx eas-cli build ...` |
| Upload to Play Store | Use `eas build -p android --profile production` (AAB, not APK). |

## Profiles in `eas.json`

| Profile | Output | Use case |
|---------|--------|----------|
| `preview` | `.apk` | Share with classmates, teacher, testing |
| `production` | `.aab` | Google Play Store |
| `development` | Dev client | Advanced local debugging |
