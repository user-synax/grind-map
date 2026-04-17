<div align="center">

# 🎯 GrindMap

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-FF4A4A?style=for-the-badge&logo=drizzle&logoColor=white)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

*A comprehensive learning roadmap tracker with progress tracking and streak management*

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=netlify&logoColor=white)](https://grind-map.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Features

### 📊 Learning Roadmaps
- **DSA with JavaScript** - 20 topics covering algorithms and data structures
- **Frontend Roadmap** - 15 topics covering modern web development
- Progress tracking for each topic
- Visual progress bars and completion percentages

### 🎯 Progress Tracking
- Track your learning progress with 4 status options:
  - Not Started
  - In Progress
  - Done
  - Needs Revision
- Color-coded status buttons for quick updates
- Real-time progress updates

### 🔥 Streak Management
- Daily streak tracking to maintain consistency
- Longest streak record
- Automatic streak calculation based on activity

### 🎨 Modern UI/UX
- **Supabase-inspired Dark Theme** - Native dark mode with emerald green accents
- **Noise Texture** - Subtle grain effect for visual depth
- **Responsive Design** - Works seamlessly on all devices
- **Smooth Animations** - Fluid transitions and interactions

### 🔐 Authentication
- Secure authentication powered by **Clerk**
- Sign in / Sign up functionality
- Protected dashboard routes
- User profile management

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - High-quality UI components

### Backend & Database
- **Drizzle ORM** - Type-safe SQL toolkit
- **PostgreSQL** - Relational database (Neon)
- **Neon Serverless** - Serverless PostgreSQL

### Authentication
- **Clerk** - Complete user authentication

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Step 1: Clone the repository

```bash
git clone https://github.com/user-synax/grind-map.git
cd grind-map
```

### Step 2: Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://your-neon-database-url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

### Step 4: Run database migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Step 5: Seed the database

```bash
npx tsx src/db/seed.ts
```

### Step 6: Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

### 1. Sign In / Sign Up
- Visit the homepage
- You'll be redirected to sign-in page
- Create an account or sign in with existing credentials

### 2. View Roadmaps
- After signing in, you'll see the dashboard
- Browse available learning roadmaps
- View your progress on each roadmap

### 3. Track Progress
- Click on any roadmap to view its topics
- Update topic status by clicking the status buttons:
  - **Not Started** (Gray)
  - **In Progress** (Violet)
  - **Done** (Green)
  - **Needs Revision** (Red)
- Progress updates automatically

### 4. Maintain Streak
- Update your progress daily to maintain your streak
- Streaks reset if you miss a day
- Track your longest streak

---

## 🗄️ Database Schema

### Tables
- **users** - User accounts
- **roadmaps** - Learning roadmaps
- **topics** - Roadmap topics
- **userProgress** - User progress tracking
- **streaks** - User streak data

### Relationships
- Users have many roadmaps
- Roadmaps have many topics
- Users have progress on topics
- Users have one streak record

---

## 🌐 Deployment

### Netlify Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Netlify Site**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

4. **Add Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   DATABASE_URL=your-database-url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
   CLERK_SECRET_KEY=your-clerk-secret
   ```

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `your-site.netlify.app`

6. **Update Clerk Domains**
   - Go to Clerk dashboard
   - Add your Netlify domain to allowed domains

### Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/https://github.com/user-synax/grind-map)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** - The React framework
- **Clerk** - Authentication solution
- **Drizzle** - ORM toolkit
- **Neon** - Serverless PostgreSQL
- **Supabase** - Design system inspiration
- **shadcn/ui** - UI components

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the maintainers

---

<div align="center">

**Made with ❤️ by [user-synax](https://github.com/user-synax)**

[⭐ Star this repo](https://github.com/user-synax/grind-map) if it helped you!

</div>
