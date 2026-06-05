// data.jsx — portfolio content for M. Ismail
// Auto-fetches live data from /api/portfolio-data (Supabase) on load.

const PROFILE = {
  name: "M. Ismail",
  handle: "ismailravian",
  headline: "bs ai student · ai/ml developer · python trainer · hackathon winner",
  bio: "4th semester BS Artificial Intelligence student at FAST NUCES with hands-on experience in Python, AI/ML, and low-level systems programming. Certified in Generative AI and experienced as a professional Python Trainer. Actively engaged in AI research — building intelligent systems that solve real-world problems.",
  email: "ismailkamboh541@gmail.com",
  phone: "0336-8051413",
  location: "Lahore, Pakistan",
  status: "Open to internships & collaborations · 2026",
  github: "github.com/Ismailravian",
  linkedin: "linkedin.com/in/muhammad-ismail-0541",
  twitter: "",
  experience: [
    {
      when: "Mar 2026",
      role: "AI Intern",
      org: "CodeAlpha",
      desc: "Performed data preprocessing and exploratory data analysis using Python. Built and evaluated regression and classification models using Scikit-learn. Extracted actionable insights from datasets to solve real-world problems.",
    },
    {
      when: "2024 — now",
      role: "BS Artificial Intelligence",
      org: "FAST-NUCES",
      desc: "4th semester. Focused on AI/ML, low-level systems programming, and building intelligent systems. Hackathon winner — Build with AI (GDGOC FAST Nuces, Team: Think3x).",
    },
    {
      when: "Graduated 2024",
      role: "Intermediate (Pre-Engineering)",
      org: "GCU Lahore",
      desc: "Pre-engineering track with strong foundation in mathematics and sciences.",
    },
  ],
  skills: [
    { name: "Python",          lvl: "fluent"   },
    { name: "AI / ML",         lvl: "fluent"   },
    { name: "Scikit-learn",    lvl: "fluent"   },
    { name: "NumPy / Pandas",  lvl: "fluent"   },
    { name: "C++",             lvl: "shipping" },
    { name: "x86 Assembly",    lvl: "shipping" },
    { name: "SQL",             lvl: "shipping" },
    { name: "Flask",           lvl: "shipping" },
    { name: "OpenCV",          lvl: "shipping" },
    { name: "Generative AI",   lvl: "learning" },
  ],
  achievements: [
    "🏆 Winner — Build with AI Hackathon, GDGOC FAST Nuces Chiniot-Faisalabad (Team: Think3x)",
    "📜 Certified in Generative AI",
    "🎓 Recognized for strong performance in systems programming & database coursework",
    "🎤 Professional Python Trainer",
  ],
};

const PROJECTS = [
  {
    slug: "language-translation-tool",
    idx: "01",
    title: "Language Translation Tool",
    tagline: "Neural-based system for translating text across multiple languages.",
    year: "2025",
    status: "live",
    role: "solo",
    tech: ["Python", "Flask", "JavaScript", "HTML/CSS"],
    featured: true,
    description: [
      "A Flask-based translation tool with clean separation of concerns. The frontend manages user input and dynamic language selection via JavaScript, while the Python backend handles requests through a dedicated translation API.",
      "Organized into static, templates, and translator/ directories for easy scalability and maintenance.",
    ],
    links: [
      { label: "github", href: "https://github.com/Ismailravian/-Language_Translation_Tool" },
    ],
  },
  {
    slug: "faq-chatbot",
    idx: "02",
    title: "FAQ Chatbot",
    tagline: "Multi-platform NLP chatbot for university queries with 95%+ accuracy.",
    year: "2025",
    status: "open source",
    role: "solo",
    tech: ["Python", "Flask", "Scikit-learn", "NLP", "Cosine Similarity"],
    featured: true,
    description: [
      "University FAQ Chatbot: a multi-platform (Web / GUI / CLI) NLP application. Built with Python, Flask, and Scikit-learn.",
      "Features a robust preprocessing pipeline and confidence-based matching using Cosine Similarity. Designed to streamline campus queries while logging knowledge-base gaps for future training.",
    ],
    links: [
      { label: "github", href: "https://github.com/Ismailravian/Chatbot_for_FAQs-" },
    ],
  },
  {
    slug: "object-detection",
    idx: "03",
    title: "Object Detection & Tracking",
    tagline: "Real-time computer vision system to detect and track objects in video streams.",
    year: "2025",
    status: "shipped",
    role: "solo",
    tech: ["Python", "OpenCV", "Deep Learning"],
    featured: true,
    description: [
      "Real-time computer vision system built with Python and OpenCV to detect and track multiple objects across live video streams.",
      "Leverages deep learning models for accurate object localisation and persistent tracking across frames.",
    ],
    links: [
      { label: "github", href: "https://github.com/Ismailravian/Object_Detection_and_Tracking" },
    ],
  },
  {
    slug: "house-price-prediction",
    idx: "04",
    title: "House Price Prediction",
    tagline: "Regression model with 95%+ accuracy via feature engineering.",
    year: "2024",
    status: "shipped",
    role: "solo",
    tech: ["Python", "Scikit-learn", "NumPy", "Pandas"],
    featured: false,
    description: [
      "Created a regression model using Scikit-learn with 95%+ accuracy through careful feature engineering and hyperparameter tuning.",
      "Full EDA pipeline: data cleaning, visualisation, feature selection, model training, and evaluation.",
    ],
    links: [],
  },
  {
    slug: "sudoku-csp",
    idx: "05",
    title: "Sudoku CSP Solver",
    tagline: "Solves all sudoku levels using AC-3, backtracking, and MRV heuristic.",
    year: "2025",
    status: "open source",
    role: "solo",
    tech: ["Python", "CSP", "AC-3", "Backtracking"],
    featured: false,
    description: [
      "Python Sudoku solver using Constraint Satisfaction Problem techniques: AC-3 arc consistency, backtracking search, forward checking, and the Minimum Remaining Values (MRV) heuristic.",
      "Solves all difficulty levels and outputs the solution with performance statistics.",
    ],
    links: [
      { label: "github", href: "https://github.com/Ismailravian/sudoku-csp" },
    ],
  },
  {
    slug: "booking-management-cpp",
    idx: "06",
    title: "Booking Management System",
    tagline: "C++ desktop application with OOP and persistent file storage.",
    year: "2024",
    status: "shipped",
    role: "solo",
    tech: ["C++", "OOP", "File I/O"],
    featured: false,
    description: [
      "Desktop booking management application built in C++ using Object-Oriented Programming principles.",
      "Features persistent file handling so all bookings survive application restarts.",
    ],
    links: [],
  },
];

// ── Live data from Supabase via Next.js API ───────────────────────────────
async function loadLiveData() {
  try {
    const res = await fetch('/api/portfolio-data', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();

    if (data.profile) {
      const p = data.profile;
      Object.assign(window.__PROFILE, {
        name:       p.name        || window.__PROFILE.name,
        headline:   p.headline    || window.__PROFILE.headline,
        bio:        p.bio         || window.__PROFILE.bio,
        email:      p.email       || window.__PROFILE.email,
        location:   p.location    || window.__PROFILE.location,
        github:     p.github_url    ? p.github_url.replace('https://','')    : window.__PROFILE.github,
        linkedin:   p.linkedin_url  ? p.linkedin_url.replace('https://','')  : window.__PROFILE.linkedin,
        skills:     p.skills?.map(s => ({ name: s, lvl: 'fluent' })) || window.__PROFILE.skills,
        experience: p.experience?.map(e => ({
          when: e.end ? `${e.start} — ${e.end}` : `${e.start} — now`,
          role: e.role, org: e.company, desc: e.summary,
        })) || window.__PROFILE.experience,
      });
    }

    if (data.projects?.length) {
      window.__PROJECTS = data.projects.map((p, i) => ({
        slug:        p.slug,
        idx:         String(i + 1).padStart(2, '0'),
        title:       p.title,
        tagline:     p.tagline,
        year:        new Date(p.created_at).getFullYear().toString(),
        status:      p.featured ? 'featured' : 'shipped',
        role:        'engineer',
        tech:        p.tech || [],
        featured:    p.featured,
        description: p.description ? p.description.split('\n\n').filter(Boolean) : [p.tagline],
        links: [
          p.github_url   && { label: 'github',   href: p.github_url },
          p.vercel_url   && { label: 'vercel',   href: p.vercel_url },
          p.demo_url     && { label: 'demo',     href: p.demo_url },
          p.linkedin_url && { label: 'linkedin', href: p.linkedin_url },
        ].filter(Boolean),
      }));
    }

    window.dispatchEvent(new CustomEvent('portfolio-data-loaded'));
  } catch {
    // Supabase not configured — using defaults above
  }
}

window.__PROFILE  = PROFILE;
window.__PROJECTS = PROJECTS;
loadLiveData();
