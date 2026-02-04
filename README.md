# Family Tree Web Application

A responsive family tree management system built with Vue 3, Vite, Tailwind CSS, Firebase Authentication, and Cloud Firestore.

## Features

- 🔐 **Firebase Authentication** - Secure admin login
- 👥 **Member Management** - Add, edit, and delete family members
- 🌳 **Tree Visualization** - Interactive D3.js hierarchical tree view
- 📊 **Dashboard** - Overview statistics and quick actions
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔄 **Real-time Data** - Firestore integration for live updates

## Tech Stack

- **Frontend**: Vue 3 (Options API), Vite
- **Styling**: Tailwind CSS
- **Icons**: Iconify
- **Visualization**: D3.js
- **Backend**: Firebase (Auth + Firestore)
- **Deployment**: Firebase Hosting ready

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider
   - Add your admin email and password

3. Enable **Cloud Firestore**:
   - Go to Firestore Database
   - Create database in production mode
   - Add security rules (see below)

4. Get your Firebase configuration:
   - Go to Project Settings → Your apps
   - Copy the Firebase configuration object

5. Update `src/firebase.js` with your Firebase configuration

### Firestore Security Rules

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

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd family-tree
```

2. Install dependencies:
```bash
npm install
```

3. Update Firebase configuration in `src/firebase.js`

4. Run development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## Project Structure

```
family-tree/
├── src/
│   ├── api/
│   │   └── memberService.js       # Firestore operations
│   ├── composables/
│   │   ├── useAuth.js             # Authentication logic
│   │   └── useDarkMode.js         # Dark mode state
│   ├── components/
│   │   └── FamilyTree.vue         # Tree component (deprecated)
│   ├── layouts/
│   │   └── AdminLayout.vue        # Main admin layout
│   ├── views/
│   │   ├── Login.vue              # Login page
│   │   ├── Dashboard.vue          # Dashboard overview
│   │   ├── Members.vue            # Member management
│   │   └── FamilyTreeView.vue     # Tree visualization
│   ├── router/
│   │   └── index.js               # Vue Router configuration
│   ├── firebase.js                # Firebase initialization
│   ├── main.js                    # App entry point
│   ├── App.vue                    # Root component
│   └── style.css                  # Global styles
├── public/
│   └── family-structure.json      # Sample family data
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Usage

### Login

Use your Firebase admin account credentials to log in.

### Dashboard

- View total members, living members, and generations
- Quick action buttons for common tasks
- Import initial family data from JSON

### Members Management

- **Add Member**: Click "Add Member" button
- **Edit Member**: Click edit icon in the table
- **Delete Member**: Click delete icon (requires confirmation)
- **Search**: Use the search bar to filter members

### Family Tree Visualization

- Interactive D3.js tree with zoom and pan
- Click on nodes to view member details
- Color-coded by gender (blue=male, pink=female)
- Dashed border indicates deceased members

## Firestore Schema

Collection: `members`

Each document contains:
```javascript
{
  id: string,              // Auto-generated
  name: string,            // Member name
  gender: string,          // 'male' or 'female'
  birth_year: number,      // Birth year (optional)
  death_year: number,      // Death year (optional)
  is_deceased: boolean,    // Deceased status
  father_id: string,       // Reference to father's ID
  mother_id: string,       // Reference to mother's ID
  spouse_ids: array,       // Array of spouse IDs
  created_at: string,      // ISO timestamp
  updated_at: string       // ISO timestamp
}
```

## Import Initial Data

1. Place your `family-structure.json` in the `public` folder
2. Go to Dashboard
3. Click "Import Data"
4. Confirm the import

The app will automatically import all members from the JSON file into Firestore.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Firebase Hosting Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

Select:
- Hosting
- Use `dist` as public directory
- Configure as single-page app: Yes
- Don't overwrite index.html

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Features Roadmap

- [ ] Export family tree as PDF
- [ ] Multiple family tree support
- [ ] Photo uploads for members
- [ ] Family events timeline
- [ ] Relationship diagram view
- [ ] Advanced search and filters
- [ ] Member notes and stories
- [ ] Print-friendly layouts

## Development Standards

This project follows the guidelines specified in `instruction.md`:
- Options API for Vue components
- Tailwind CSS utility-first approach
- Mobile-first responsive design
- Dark mode support with slate color palette
- Modular component architecture
- Iconify for universal icons

## Troubleshooting

### Authentication Issues
- Verify Firebase configuration in `src/firebase.js`
- Check that Email/Password is enabled in Firebase Console
- Ensure admin account exists in Firebase Authentication

### Firestore Permission Errors
- Check Firestore security rules
- Verify user is authenticated
- Ensure rules allow read/write for authenticated users

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Update dependencies: `npm update`

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

## Credits

Built with ❤️ using Vue 3, Tailwind CSS, D3.js, and Firebase.
