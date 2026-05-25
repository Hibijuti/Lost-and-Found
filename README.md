<img width="432" height="935" alt="image" src="https://github.com/user-attachments/assets/6db77e75-e0ec-49e4-bb67-9bd87d676b02" />
<img width="429" height="934" alt="image" src="https://github.com/user-attachments/assets/d4323674-0072-4248-a5c6-4e29b10ff27c" />
<img width="432" height="936" alt="image" src="https://github.com/user-attachments/assets/23896da6-fdf2-48ea-ac12-d335eee9ff8d" />
<img width="430" height="934" alt="image" src="https://github.com/user-attachments/assets/0f5b7363-547f-41c3-bc11-b95a8260e8b1" />
<img width="433" height="934" alt="image" src="https://github.com/user-attachments/assets/f265839f-3c0f-4578-bb70-ec0fa80801ee" />
<img width="431" height="935" alt="image" src="https://github.com/user-attachments/assets/edb2ba6d-88b6-4b79-95ca-af4eed272e44" />
<img width="432" height="937" alt="image" src="https://github.com/user-attachments/assets/ac062e79-54c3-40ff-9d0a-23b88bdfafa6" />
<img width="433" height="935" alt="image" src="https://github.com/user-attachments/assets/5ac15c05-85a6-45fa-9bd0-c5f1f62b9d8f" />
<img width="434" height="936" alt="image" src="https://github.com/user-attachments/assets/09c0c6c7-babe-4e05-8140-bbcb02e607cd" />
<img width="433" height="935" alt="image" src="https://github.com/user-attachments/assets/3e0f92a3-3992-4cb2-8756-c5a9deb1ae6a" />
<img width="433" height="939" alt="image" src="https://github.com/user-attachments/assets/383c53be-cd2d-4493-a783-d97074dc919a" />
<img width="432" height="935" alt="image" src="https://github.com/user-attachments/assets/59a914ae-3019-4738-80f5-8a4b341028f2" />
<img width="432" height="935" alt="image" src="https://github.com/user-attachments/assets/5e238399-e24e-4fef-beb6-41729b0519b3" />
<img width="430" height="933" alt="image" src="https://github.com/user-attachments/assets/e5c45acc-4d2a-4a27-976a-06ce4e2586e1" />

# Lost & Found — School Mobile App

A cross-platform **Lost and Found** application for campus use. Students can report, browse, and recover lost items; administrators review listings before they appear on the public feed.

Built with **React Native (Expo)**, **Firebase**, and **Cloudinary**.

---

## Features

### Authentication
- Sign in / register with email and password
- Forgot password (email reset via Firebase Auth)
- Role-based access: **student** and **admin**

### Students
- **Home feed** — recent approved listings
- **Browse items** — search, filter by status (lost/found), category, and keywords
- **Post item** — photo upload, category picker, lost/found status, date picker
- **Item details** — view description and contact the poster (email / phone)
- **Profile** — view info, edit name, phone, social link, and profile photo

### Admins
- **Admin panel** — approve, edit, delete, and mark items as claimed
- Pending posts stay hidden until approved

### UX
- Soft green theme with high-contrast form labels and readable placeholders
- Smooth navigation transitions and staggered list animations
- Pull-to-refresh on feeds

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Mobile framework | [Expo](https://expo.dev) ~54, [React Native](https://reactnative.dev) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Auth & database | [Firebase Authentication](https://firebase.google.com/docs/auth), [Cloud Firestore](https://firebase.google.com/docs/firestore) |
| Image hosting | [Cloudinary](https://cloudinary.com) (unsigned upload preset) |
| Language | TypeScript / JavaScript |

---

## Screens

| Screen | Route / tab |
|--------|-------------|
| Sign in | `/(auth)/login` |
| Register | `/(auth)/register` |
| Forgot password | `/(auth)/forgot-password` |
| Home | `/(tabs)` |
| Items | `/(tabs)/items` |
| Post | `/(tabs)/post` |
| Profile | `/(tabs)/profile` |
| Edit profile | `/edit-profile` |
| Item details (modal) | `/item/[id]` |
| Admin panel | `/admin` |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) on a physical device, or Android Studio / Xcode emulator
- A [Firebase](https://console.firebase.google.com/) project
- A [Cloudinary](https://cloudinary.com/) account (free tier is enough for demos)

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/LostAndFoundApp.git
cd LostAndFoundApp
npm install
```

### 2. Firebase setup

1. Create a Firebase project and enable **Email/Password** sign-in under Authentication.
2. Create a **Firestore** database (start in test mode for development, then add proper rules before production).
3. In **Project settings → Your apps**, add a **Web** app and copy the config values.

### 3. Environment variables

Copy the example env file and fill in your Firebase Web config:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Project ID |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket URL |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | App ID |
| `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional (Analytics) |

> **Security:** `.env` is gitignored. Do not commit real API keys. For release builds, set the same variables in the [Expo dashboard](https://expo.dev) (see [docs/BUILD_APK.md](docs/BUILD_APK.md)).

### 4. Cloudinary setup

Edit `constants/cloudinary.ts`:

```ts
export const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
export const CLOUDINARY_UPLOAD_PRESET = 'your_unsigned_preset';
```

Create an **unsigned** upload preset in Cloudinary: **Settings → Upload → Upload presets**.

### 5. Run the app

```bash
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with **Expo Go**.

---

## Firestore data model

### `users` collection (document ID = Firebase Auth `uid`)

| Field | Type | Notes |
|-------|------|--------|
| `uid` | string | Same as document ID |
| `name` | string | Display name |
| `studentId` | string | Read-only after registration |
| `email` | string | Read-only in app |
| `phone` | string | |
| `socialLink` | string | Optional URL |
| `photoUrl` | string | Optional (Cloudinary) |
| `role` | string | `student` or `admin` |
| `createdAt` | timestamp | |

### `items` collection

| Field | Type | Notes |
|-------|------|--------|
| `itemName` | string | |
| `category` | string | e.g. Electronics, Clothing |
| `description` | string | |
| `location` | string | |
| `date` | string | `YYYY-MM-DD` |
| `imageUrl` | string | Cloudinary URL |
| `status` | string | `lost` or `found` |
| `postedBy` | string | User `uid` |
| `posterName` | string | |
| `posterEmail` | string | |
| `posterPhone` | string | |
| `claimed` | boolean | |
| `approved` | boolean | `false` until admin approves |
| `createdAt` | timestamp | |

### Promote an admin

In Firebase Console → Firestore → `users` → your user document:

```text
role: "admin"
```

Sign out and sign in again, then open **Profile → Admin panel**.

---

## Project structure

```text
app/                    # Expo Router screens
  (auth)/               # Login, register, forgot password
  (tabs)/               # Home, items, post, profile
  item/[id].tsx         # Item details modal
  edit-profile.tsx
  admin.tsx
components/lf/          # Reusable UI (buttons, fields, cards, pickers)
context/                # AuthContext (Firebase auth + profile)
lib/                    # Firestore helpers, Cloudinary upload, validation
constants/              # Theme, categories, Cloudinary config
firebaseConfig.js       # Firebase init (reads EXPO_PUBLIC_* env vars)
docs/BUILD_APK.md       # Android APK build guide
eas.json                # EAS Build profiles (APK + AAB)
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator (macOS only) |
| `npm run lint` | Run ESLint |
| `npm run build:apk` | Build Android APK via EAS (`preview` profile) |
| `npm run build:android:production` | Build Android AAB for Play Store |

Full APK instructions: **[docs/BUILD_APK.md](docs/BUILD_APK.md)**

---

## Item categories

- Electronics  
- IDs & School Documents  
- Clothing  
- Accessories  
- School Supplies  
- Others  

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Firebase env error on launch | Ensure `.env` exists and all `EXPO_PUBLIC_FIREBASE_*` values are set; restart with `npx expo start -c` |
| Cloudinary upload fails | Check `constants/cloudinary.ts` and that the preset is **unsigned** |
| Posts not on home feed | Admin must set `approved: true` on the item |
| Admin panel missing | Set `role` to `admin` on your user document in Firestore |
| APK works but auth fails | Add Firebase env vars in Expo dashboard for the **preview** build profile |

---

## License

This project was created as a **school assignment**. Use and modify it for learning; add a license file if you plan to publish it publicly.

---

## Acknowledgments

- [Expo](https://expo.dev) — React Native tooling and builds  
- [Firebase](https://firebase.google.com/) — Authentication and Firestore  
- [Cloudinary](https://cloudinary.com/) — Image uploads  
