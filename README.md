# Marble ✨

**A beautiful spatial canvas for your second brain.**

Marble is a stunning visual knowledge management tool where ideas flow freely. Capture thoughts, connect concepts, and organize your thinking on an infinite canvas.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## ✨ Features

### Core Product
- **Infinite Canvas** — Pan and zoom freely across your knowledge space
- **Multiple Node Types** — Notes, code snippets, links, tasks, images
- **Data Persistence** — Your work saves automatically to localStorage
- **Multiple Canvases** — Create, manage, and switch between workspaces
- **Dashboard** — Visual overview of all your canvases
- **Export/Import** — Backup and share your canvases as JSON

### User Experience
- **Onboarding Flow** — Guided introduction for new users
- **Command Palette** — Quick access to all features with ⌘K
- **Keyboard Shortcuts** — Power-user efficiency
- **Beautiful Design** — Dark theme with vibrant accent colors
- **Smooth Animations** — Framer Motion powered interactions

### Coming Soon
- Real-time collaboration
- AI-powered suggestions
- Mobile app

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command palette | `⌘K` |
| New note | `⌘N` |
| New link | `⌘L` |
| New task | `⌘T` |
| Reset view | `⌘0` |
| Delete selected | `Delete` / `Backspace` |
| Deselect | `Escape` |

## 🛠 Tech Stack

- **Next.js 14** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **Zustand** — State management with persistence
- **Lucide** — Beautiful icons

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Landing page
│   ├── canvas/page.tsx    # Main canvas app
│   ├── dashboard/page.tsx # Canvas management
│   └── api/waitlist/      # Waitlist API
├── components/
│   ├── Canvas.tsx         # Main canvas component
│   ├── Toolbar.tsx        # Node creation toolbar
│   ├── CommandPalette.tsx # Quick command access
│   ├── Onboarding.tsx     # New user guide
│   └── nodes/             # Node type components
└── store/
    └── canvasStore.ts     # Zustand store
```

## 💰 Monetization

This product is set up for freemium SaaS:

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 1 canvas, 50 nodes |
| Pro | $12/mo | Unlimited, AI, collaboration |
| Team | $29/user/mo | SSO, admin, API |

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Other Platforms

Build the production bundle:
```bash
npm run build
npm run start
```

## 📈 Scaling Up

To turn this into a production SaaS:

1. **Authentication** — Add [Clerk](https://clerk.dev) or [NextAuth](https://next-auth.js.org)
2. **Database** — Connect [Supabase](https://supabase.com) or [PlanetScale](https://planetscale.com)
3. **Payments** — Integrate [Stripe](https://stripe.com)
4. **Analytics** — Add [PostHog](https://posthog.com) or [Mixpanel](https://mixpanel.com)

## 📄 License

MIT

---

Built with ❤️ for dreamers and thinkers.
