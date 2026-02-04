# CHANGELOG

## [Initial Release] - 2026-02-04

### Added
- Firebase Authentication integration with email/password
- Cloud Firestore setup for member data storage
- Admin login page with responsive design
- Admin layout with sidebar navigation and dark mode support
- Dashboard with statistics (total members, living members, generations)
- Member management page (CRUD operations)
  - Add new family members
  - Edit existing members
  - Delete members with confirmation
  - Search functionality
  - Parent selection (father/mother)
  - Deceased status and death year tracking
- Family tree visualization using D3.js
  - Hierarchical tree layout
  - Interactive zoom and pan
  - Color-coded by gender
  - Visual indicator for deceased members
  - Click nodes to view details
- Dark mode support with toggle in navbar
- Internationalization (i18n) support for multiple languages
  - English (EN) and Malay (MS) translations
  - Language switcher in navbar
  - Persistent language preference
  - Browser language detection
  - Translation helper with parameter interpolation
- Responsive design for mobile, tablet, and desktop
- Import initial family data from JSON file
- Tailwind CSS configuration with custom colors
- Vue Router with authentication guards
- Composables for auth, dark mode, and language state management
- Firestore service layer with CRUD operations
- Tree building algorithm for hierarchical relationships

### Technical Details
- Vue 3 (Options API)
- Vite build tool
- Tailwind CSS
- Firebase SDK v10
- D3.js for tree visualization
- Iconify for icons
- Vue Router for navigation

### Project Structure
- `/src/api` - Firestore services
- `/src/composables` - Reusable logic (auth, dark mode)
- `/src/layouts` - Admin layout component
- `/src/views` - Page components
- `/src/router` - Route configuration
- `/src/firebase.js` - Firebase initialization

### Firebase Configuration
- Authentication: Email/Password provider
- Firestore: `members` collection with flat structure
- Security rules for authenticated access

### Features
- Member fields: name, gender, birth_year, death_year, is_deceased, father_id, mother_id, spouse_ids
- Automatic parent-child relationship tracking
- Generation level calculation
- Real-time data sync with Firestore
- Dark mode persistence in localStorage
- Mobile-responsive sidebar with hamburger menu
