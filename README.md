# ✈️ WanderFamily — Smart Family Travel Planner

![WanderFamily Banner](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop)

Planning a family trip can be chaotic—scattered notes, separate spreadsheets, forgotten packing items, and no shared budget view. **WanderFamily** consolidates everything into one clean, organized, and beautiful interface for families. 

Built with modern web technologies and a stunning "Glassmorphism" UI, WanderFamily makes travel planning as exciting as the trip itself!

---

## ✨ Key Features

- 🔐 **Secure Authentication** — Full Firebase Email/Password sign-up and login flow with protected routes.
- 🗺️ **Trip Dashboard** — Create, view, edit, and delete upcoming, ongoing, and completed trips.
- 👨‍👩‍👧‍👦 **Family Member Management** — Add members to trips with specific roles (Adult/Child/Senior) to tailor planning.
- 📅 **Interactive Itinerary Builder** — Day-by-day activity planner with intuitive categories and family-friendly tagging.
- 💰 **Smart Budget Tracker** — Track expenses per category with automatic per-person cost splitting.
- 🧳 **Personalized Packing Lists** — Per-member packing checklists with categories and progress tracking.
- 🎨 **Premium UI/UX** — Modern, responsive design featuring dark mode aesthetics, glassmorphism, smooth animations, and gradient accents.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Routing** | React Router v6 |
| **State Management** | React Context API + Custom Hooks |
| **Backend & Auth** | Firebase (Authentication + Firestore) |
| **Styling** | Tailwind CSS v4 (Modern `@utility` syntax) |
| **Icons** | Lucide React |
| **Date Handling** | `date-fns` |

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd smart-travel-planner
npm install
```

### 2. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the setup wizard.
3. In your project, go to **Project Settings** → **General** → scroll down to **Your apps** and click the **`</>` (Web)** icon.
4. Register your app and copy the `firebaseConfig` keys.
5. In the Firebase console sidebar, go to **Authentication** → **Sign-in method** → Enable **Email/Password**.
6. Go to **Firestore Database** → **Create database** → Start in **Test mode**.

### 3. Environment Variables
Create a `.env.local` file in the root directory (you can copy `.env.example`) and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```
*(Note: `.env.local` is automatically ignored by Git to keep your keys safe).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

---

## 📁 Project Structure

```text
smart-travel-planner/
├── src/
│   ├── assets/           # Static files & images
│   ├── components/       # Reusable UI pieces (Buttons, Forms, Navbar, etc.)
│   ├── context/          # Global state providers (AuthContext, TripContext)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Full page route components (Dashboard, Login, etc.)
│   ├── services/         # Firebase initialization & API functions
│   ├── utils/            # Helper functions (Date formatting, etc.)
│   ├── App.jsx           # Main application routing wrapper
│   ├── main.jsx          # React entry point
│   └── index.css         # Tailwind v4 directives & custom utilities
├── .env.example          # Environment variable template
├── tailwind.config.js    # Tailwind theme configuration
└── vite.config.js        # Vite bundler configuration
```

---

## 🌐 Deployment (Vercel recommended)

1. Push your code to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. **Crucial:** In the deployment settings, add all your `VITE_FIREBASE_*` variables into the **Environment Variables** section.
5. Click **Deploy**!

---

*Designed and built for seamless family adventures.* 🌍✈️
