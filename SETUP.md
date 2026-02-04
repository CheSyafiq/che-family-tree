# Family Tree Application Setup Guide

## Quick Start

### 1. Firebase Project Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Once created, click the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "Family Tree")
5. Copy the Firebase configuration object

### 2. Enable Firebase Services

#### Authentication:
1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Enable the first option (Email/Password)
6. Click Save
7. Go to **Users** tab
8. Click "Add user"
9. Add your admin email and password

#### Firestore Database:
1. Go to **Build** → **Firestore Database**
2. Click "Create database"
3. Start in **Production mode**
4. Choose a location (closest to your users)
5. Click "Enable"
6. Go to **Rules** tab
7. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

8. Click "Publish"

### 3. Configure Your Application

1. Open `src/firebase.js`
2. Replace the firebaseConfig object with your values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",                    // Your API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
}

```

### 4. Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:5173 and log in with your admin credentials!

### 5. Import Initial Data (Optional)

1. Log in to the app
2. Go to Dashboard
3. Click "Import Data"
4. Confirm to import the family-structure.json

## Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting, use 'dist' folder)
firebase init

# Deploy
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

## Firestore Data Structure

The `members` collection stores documents with this structure:

```javascript
{
  id: "auto-generated",
  name: "John Doe",
  gender: "male",
  birth_year: 1950,
  death_year: 2020,          // optional
  is_deceased: true,
  father_id: "father-doc-id", // optional
  mother_id: "mother-doc-id", // optional
  spouse_ids: ["spouse-id"],  // array
  created_at: "2026-02-04T...",
  updated_at: "2026-02-04T..."
}
```

## App Features

### Dashboard
- Total members count
- Living members count
- Number of generations
- Quick actions (Add Member, View Tree, Import Data)

### Members Page
- Add new family member
- Edit existing member
- Delete member (with confirmation)
- Search by name
- Select father and mother from existing members
- Mark as deceased with death year

### Family Tree Page
- Interactive D3.js visualization
- Zoom in/out controls
- Pan and drag
- Click nodes for details
- Color coding: Blue (male), Pink (female)
- Dashed border for deceased members

## Troubleshooting

### Can't login?
- Check Firebase configuration in `src/firebase.js`
- Verify Email/Password is enabled in Firebase Console
- Ensure you created an admin user in Authentication → Users

### Firestore errors?
- Check Firestore rules allow authenticated access
- Verify you're logged in
- Check browser console for detailed errors

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

- Check Firebase Console for service status
- Review browser console for error messages
- Verify all Firebase services are enabled
- Ensure you're using Node.js v16+

## Next Steps

1. Customize the UI colors in `tailwind.config.js`
2. Add more family members
3. Explore the tree visualization
4. Export and share with family members
5. Deploy to production!

Enjoy managing your family tree! 🌳

