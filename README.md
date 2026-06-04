# Ismail's Portfolio

Immersive 3D portfolio built with **Next.js 15**, **React Three Fiber**, **Tailwind CSS**, **Supabase**, and **@react-pdf/renderer**.

- Fully responsive (mobile → 4K)
- Light / Dark / System theme (auto)
- Animated 3D background with bloom, distortion, particles, and stars
- Project list on homepage → click any card → detail page with video + description
- Profile / About page
- Auto-generated PDF CV (always in sync with projects + profile)
- Admin panel at `/admin` to add / edit / delete projects and edit profile
- Works **without** a database (uses seed data). Add Supabase to enable the admin panel.
- Deployable to **Vercel** with zero config

---

## 1. Local setup

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

The site runs out of the box with seed data — no env needed.

## 2. Connect Supabase (free, enables admin panel)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL editor** and paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql). Click **Run**.
3. In **Authentication → Users**, click **Add user** with your email + a password. This is your admin login.
4. In **Settings → API**, copy the **Project URL** and the **anon key**.
5. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Restart `npm run dev`. Visit `/admin/login`, sign in with the credentials from step 3.

## 3. Connect Cloudinary (free video / image hosting)

1. Sign up at [cloudinary.com](https://cloudinary.com).
2. In **Settings → Upload**, create an **unsigned upload preset**.
3. Add to `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

To add a project video: upload to Cloudinary, copy the URL, paste it into the **Video URL** field in `/admin/projects/new`. (You can also paste a YouTube or Vimeo URL — both embed automatically.)

## 4. Deploy to Vercel

1. Push this folder to GitHub.
2. Go to [vercel.com](https://vercel.com), **New Project**, import the repo.
3. Add the env vars from `.env.local` under **Settings → Environment Variables**.
4. Click **Deploy**.

Your live site is at `https://<project>.vercel.app`. The admin panel is at `/admin/login`.

## 5. How "everything updates" works

- The homepage, projects pages, profile page, and PDF CV all read from the same Supabase tables (`projects`, `profile`).
- The admin panel writes to those tables.
- After every write, the relevant pages are revalidated automatically — no redeploy needed.
- Without Supabase configured, the site falls back to the seed data in [src/lib/data/seed.ts](src/lib/data/seed.ts) so you can preview before connecting the DB.

## 6. Project structure

```
src/
├── app/
│   ├── page.tsx                  ← Homepage (hero + projects + contact)
│   ├── projects/[slug]/page.tsx  ← Project detail (video + description)
│   ├── profile/page.tsx          ← About / CV web view
│   ├── cv/route.tsx              ← Auto-generated PDF
│   └── admin/                    ← Login + dashboard + CRUD
├── components/
│   ├── three/Scene.tsx           ← Immersive 3D background
│   ├── ui/                       ← Navbar, ProjectCard, Hero, …
│   └── admin/                    ← Admin-only components
├── lib/
│   ├── supabase/                 ← Server + browser clients + auth middleware
│   ├── data/                     ← Queries with seed fallback
│   └── pdf/CVDocument.tsx        ← React-PDF document for /cv
└── supabase/schema.sql           ← Run once in Supabase SQL editor
```

## 7. Cheatsheet

| Task | Where |
|---|---|
| Add a project | `/admin/projects/new` |
| Edit a project | `/admin/projects` → Edit |
| Edit profile / experience / skills | `/admin/profile` |
| Download CV | `/cv` (header button on `/profile`) |
| Switch theme | Sun / Moon / Monitor icon in the navbar (Light → Dark → System) |

Built with ☕ and Three.js.
