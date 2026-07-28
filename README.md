# Cinema Palembang (CINEMA-PLG)

Welcome to the **CINEMA-PLG** repository – a cinema website that provides complete information about movies currently showing in Palembang.

## What is this project?

- Modern front‑end built with **React + TypeScript** and **Vite** (or Next.js if you prefer).
- Stylish UI with dark‑mode support and smooth animations for a pleasant experience.
- Data is fetched from the public **JadwalNonton.com** API (integration located in `src/api`).
- Can run locally on **localhost** or be deployed to **Vercel** (free and fast).

## Technology stack

| Category | Technology |
|----------|------------|
| UI       | React, TypeScript, Tailwind (optional), CSS‑in‑JS |
| Build    | Vite (development) / Vercel (production) |
| Data     | Fetch API (REST) |
| Others   | ESLint, Prettier, Vitest (unit testing) |

## Running locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/CINEMA-PLG.git
   cd CINEMA-PLG
   ```
2. **Install dependencies** (Node.js ≥ 18 required)
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

## Deploy to Vercel

- Sign in to Vercel, click **New Project**, select this repo, and let Vercel automatically detect the `vite` framework.
- If environment variables are needed (e.g., API keys), add them under Settings → Environment Variables.
- Vercel will provide a live URL within seconds after the build completes.
- If you too lazy want to deploy, here is the link : **My Vercel :** https://cinema-palembang.vercel.app/

## Important folder structure

```
CINEMA-PLG/
├─ src/                # React + TSX code
│   ├─ components/    # UI components (DashboardTable, MovieModal, etc.)
│   ├─ api/           # API wrapper for cinema data
│   └─ main.tsx       # Entry point
├─ temp/front/        # Static HTML template (backup / example layout)
├─ public/            # Public assets (logo, placeholder images)
├─ package.json       # Dependencies & scripts
└─ README.md          # (You are here!)
```

## Key features

- **Movie list**: Displays all currently showing movies with posters, ratings, and short synopses.
- **Filter & Search**: Search movies by title or genre.
- **Detail modal**: Click a poster to open a modal with full details (duration, director, schedule).
- **Responsive design**: UI adapts automatically to desktop, tablet but a fizzy fuzzy on mobile screens.

## Contributing

Have ideas or found a bug? Fork the repo, create a new branch, and submit a **Pull Request**. We’ll review it as soon as possible.

## License

This project is licensed under the **MIT License** – you are free to use, modify, and distribute it.

Thank you to **JadwalNonton.com** for providing the movie schedule data.

## Special Thanks

- **JadwalNonton.com** – data source for movie schedules.
- **Vercel** – effortless deployment platform.
- **Community contributors** – ideas, feedback, and bug reports.

---

*Happy coding and enjoy the movies!*
