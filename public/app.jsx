// app.jsx — React UI for Ismail's portfolio.
const { useState, useEffect, useRef, useMemo, useCallback } = React;

function getProfile()  { return window.__PROFILE; }
function getProjects() { return window.__PROJECTS; }

const TWEAK_DEFAULTS = { "motif": "orbs" };

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      setP(window.scrollY / max);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useTypedText(text, speed = 30, delay = 0) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0, timer, start;
    start = setTimeout(() => {
      timer = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(timer); }, speed);
    }, delay);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [text, speed, delay]);
  return out;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let best = ids[0], bestDist = Infinity;
      ids.forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top - 120);
        if (r.top < window.innerHeight * 0.5 && dist < bestDist) { best = id; bestDist = dist; }
      });
      setActive(best);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids.join('|')]);
  return active;
}

function scrollToId(id) {
  const el = document.getElementById(id); if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
}

function Nav({ active, onJump }) {
  const profile = getProfile();
  const items = [
    { id: 'hero', label: '~' }, { id: 'work', label: 'work' },
    { id: 'profile', label: 'profile' }, { id: 'contact', label: 'contact' },
  ];
  const time = new Intl.DateTimeFormat('en-US', { hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'Asia/Karachi' }).format(new Date());
  return (
    <nav className="nav">
      <div className="brand">
        <span className="glyph">İ</span>
        <span>{profile.handle}<span style={{ color:'var(--ash)' }}>.dev</span></span>
      </div>
      <div className="crumbs" style={{ marginLeft:24 }}>
        {items.map((it, i) => (
          <React.Fragment key={it.id}>
            {i > 0 && <span className="sep">/</span>}
            <button className={`hu ${active === it.id ? 'active' : ''}`} onClick={() => onJump(it.id)}>{it.label}</button>
          </React.Fragment>
        ))}
        <span className="sep">/</span>
        <a href="/admin/login" className="hu" style={{ color:'var(--sage)' }}>admin</a>
        <span className="sep">/</span>
        <a href="/cv" className="hu" style={{ color:'var(--sage)' }}>cv</a>
      </div>
      <div className="status">
        <span><span className="dot" style={{ marginRight:8 }}></span>online</span>
        <span style={{ color:'var(--bark)' }}>·</span>
        <span>lhe {time}</span>
      </div>
    </nav>
  );
}

function Hero({ onOpenProject }) {
  const profile = getProfile();
  const projects = getProjects();
  const typed = useTypedText('whoami', 70, 250);
  return (
    <section id="hero" className="hero stage">
      <div className="container hero-inner">
        <div>
          <div className="greet"><span className="bar"></span><span>$ {typed}<span className="caret"></span></span></div>
          <h1>
            <span className="quiet">i'm </span>
            <span className="accent">{profile.name.toLowerCase()}</span><span className="quiet">,</span><br />
            building the<br />
            <span className="quiet">web in </span><span className="accent">3d</span><span className="quiet">.</span>
          </h1>
          <p className="bio">{profile.bio}</p>
          <div className="cta-row">
            <button className="btn primary" onClick={() => scrollToId('work')}>view work <span className="arr">→</span></button>
            {projects[0] && <button className="btn" onClick={() => onOpenProject(projects[0])}>latest: {projects[0].title.toLowerCase()} <span className="arr">→</span></button>}
            <button className="btn" onClick={() => scrollToId('contact')}>get in touch</button>
          </div>
        </div>
        <div className="hero-card corners">
          <span className="c-tr"></span><span className="c-br"></span>
          <div className="hero-card-head">
            <span>~/about.json</span>
            <span className="lights"><i></i><i></i><i></i></span>
          </div>
          <div className="row"><div className="k">name</div><div className="v">{profile.name}</div></div>
          <div className="row"><div className="k">role</div><div className="v">Software Engineer · 3D Web</div></div>
          <div className="row"><div className="k">based</div><div className="v">{profile.location}</div></div>
          <div className="row">
            <div className="k">status</div>
            <div className="v" style={{ color:'var(--lime)' }}><span className="dot" style={{ marginRight:8 }}></span>{profile.status}</div>
          </div>
          <div className="row">
            <div className="k">stack</div>
            <div className="v">{profile.skills.slice(0,6).map(s => <span key={s.name||s} className="tag">{s.name||s}</span>)}</div>
          </div>
          <div className="row">
            <div className="k">contact</div>
            <div className="v"><a className="hu" href={`mailto:${profile.email}`} style={{ color:'var(--cream)' }}>{profile.email}</a></div>
          </div>
        </div>
      </div>
      <div className="container hero-meta">
        <div className="item"><div className="k">projects shipped</div><div className="v">{getProjects().length}+</div></div>
        <div className="item"><div className="k">stack</div><div className="v">ts · react · three.js</div></div>
        <div className="item"><div className="k">location</div><div className="v">{profile.location}</div></div>
        <div className="item"><div className="k">status</div><div className="v" style={{ color:'var(--lime)' }}>available</div></div>
      </div>
      <div className="scroll-hint"><span>scroll</span><span className="line"></span></div>
    </section>
  );
}

function ProjectViz({ seed = 0 }) {
  const r = useMemo(() => {
    const a = [];
    for (let i = 0; i < 7; i++) a.push({ cx:30+((seed*31+i*23)%100), cy:30+((seed*17+i*41)%100), r:4+((seed+i*7)%14) });
    return a;
  }, [seed]);
  return (
    <svg className="viz" viewBox="0 0 160 160" fill="none">
      {r.map((c,i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.r} stroke="#b8e051" strokeOpacity={0.4+(i%3)*0.15} />)}
      <circle cx="80" cy="80" r="46" stroke="#b8e051" strokeOpacity="0.7" strokeDasharray="2 6" />
      <circle cx="80" cy="80" r="6" fill="#b8e051" />
    </svg>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <button className={`pcard ${project.featured ? 'featured' : ''}`} onClick={() => onOpen(project)}>
      <ProjectViz seed={(project.idx.charCodeAt(0)||0) + (project.idx.charCodeAt(1)||0)} />
      <div className="pc-top"><span className="idx">{project.idx}</span><span className="year">{project.year} · {project.status}</span></div>
      <h3><span className="pre">/</span>{project.title}</h3>
      <p className="tagline">{project.tagline}</p>
      <div className="tech">{project.tech.slice(0,4).map(t => <span key={t} className="tag">{t}</span>)}</div>
      <div className="pc-bottom"><span>{project.role}</span><span className="open">open <span>→</span></span></div>
    </button>
  );
}

function Work({ onOpenProject }) {
  const projects = getProjects();
  const featured = projects.filter(p => p.featured);
  const others = projects.filter(p => !p.featured);
  return (
    <section id="work" className="section stage">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow"><span className="label-cap label-accent">// selected work</span></div>
          <div>
            <h2>built <em>recently</em></h2>
            <p>Click any card to read the case study and watch the demo. Code is online where it makes sense.</p>
          </div>
        </div>
        <div className="project-grid">{featured.map(p => <ProjectCard key={p.slug} project={p} onOpen={onOpenProject} />)}</div>
        {others.length > 0 && <>
          <div className="section-head" style={{ marginTop:80 }}>
            <div className="eyebrow"><span className="label-cap">// experiments &amp; oss</span></div>
            <div><h2>side <em>quests</em></h2><p>Open source, weekend experiments, and tools I made for myself first.</p></div>
          </div>
          <div className="project-grid">{others.map(p => <ProjectCard key={p.slug} project={p} onOpen={onOpenProject} />)}</div>
        </>}
      </div>
    </section>
  );
}

function DetailPanel({ project, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div className={`detail-backdrop ${project ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`detail-panel ${project ? 'open' : ''}`}>
        {project && <>
          <div className="dp-head">
            <span>/projects/{project.slug}</span>
            <button className="close" onClick={onClose}>close · esc</button>
          </div>
          <div className="dp-body">
            <div>
              <div className="label-cap" style={{ marginBottom:14 }}><span className="label-accent">{project.idx}</span> · {project.year} · {project.status}</div>
              <h2><span className="pre">/</span>{project.title}</h2>
              <p style={{ color:'var(--cream-2)', fontSize:16, marginTop:14, maxWidth:'52ch', lineHeight:1.6 }}>{project.tagline}</p>
            </div>
            <div className="video"></div>
            <div className="specs">
              <div className="row"><div className="k">role</div><div className="v">{project.role}</div></div>
              <div className="row"><div className="k">year</div><div className="v">{project.year}</div></div>
              <div className="row"><div className="k">status</div><div className="v">{project.status}</div></div>
              <div className="row"><div className="k">stack</div><div className="v">{project.tech.join(' · ')}</div></div>
            </div>
            <div className="description">{project.description.map((para, i) => <p key={i}>{para}</p>)}</div>
            {project.links.length > 0 && (
              <div className="links">{project.links.map(l => <a key={l.label} className="btn" href={l.href} target="_blank" rel="noreferrer">{l.label} <span className="arr">→</span></a>)}</div>
            )}
          </div>
        </>}
      </aside>
    </>
  );
}

function Profile() {
  const profile = getProfile();
  return (
    <section id="profile" className="section stage">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow"><span className="label-cap label-accent">// about</span></div>
          <div><h2>cat <em>profile.json</em></h2><p>Where I've worked, what I'm best at, and how to reach me if you want to build something.</p></div>
        </div>
        <div className="terminal" style={{ marginBottom:24 }}>
          <p className="prompt">
            <span className="at">{profile.handle}@dev</span><span style={{ color:'var(--ash)' }}>:</span>
            <span className="path">~/about</span><span style={{ color:'var(--ash)' }}>$ </span>
            <span className="cmd">cat profile.json | jq</span>
          </p>
          <pre>{"{\n  "}<span className="key">"name"</span>{`:        `}<span className="str">"{profile.name}"</span>{`,\n  `}<span className="key">"based"</span>{`:       `}<span className="str">"{profile.location}"</span>{`,\n  `}<span className="key">"email"</span>{`:       `}<span className="str">"{profile.email}"</span>{`,\n  `}<span className="key">"status"</span>{`:      `}<span className="str">"{profile.status}"</span>{`\n}`}</pre>
        </div>
        <div className="profile-grid">
          <div className="profile-cell">
            <div className="label-cap" style={{ marginBottom:14 }}><span className="label-accent">//</span> experience</div>
            {profile.experience.map((e, i) => (
              <div key={i} className="timeline-item">
                <div className="when">{e.when}</div>
                <div className="what">
                  <p className="role">{e.role}</p>
                  <div className="org">@ {e.org}</div>
                  <p className="desc">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="profile-cell">
            <div className="label-cap" style={{ marginBottom:14 }}><span className="label-accent">//</span> stack</div>
            <div className="skill-grid">
              {profile.skills.map(s => <div key={s.name||s} className="sk"><span>{s.name||s}</span><span className="lvl">{s.lvl||'fluent'}</span></div>)}
            </div>
            <div className="label-cap" style={{ margin:'28px 0 14px' }}><span className="label-accent">//</span> elsewhere</div>
            <div style={{ display:'grid', gap:1, background:'var(--border-1)', border:'1px solid var(--border-1)' }}>
              {[
                { k:'github',   v:profile.github,   href:`https://${profile.github}` },
                { k:'linkedin', v:profile.linkedin, href:`https://${profile.linkedin}` },
                { k:'email',    v:profile.email,    href:`mailto:${profile.email}` },
                { k:'cv · pdf', v:'download',       href:'/cv' },
              ].map(l => (
                <a key={l.k} href={l.href} className="ch" style={{ background:'rgba(6,8,5,0.45)', padding:'12px 16px', display:'flex', justifyContent:'space-between' }}>
                  <span className="k label-cap">{l.k}</span>
                  <span style={{ color:'var(--cream)' }}>{l.v} <span style={{ color:'var(--lime)', marginLeft:6 }}>→</span></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const profile = getProfile();
  return (
    <section id="contact" className="section stage" style={{ paddingBottom:120 }}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow"><span className="label-cap label-accent">// say hi</span></div>
          <div></div>
        </div>
        <div className="contact">
          <div>
            <h2>let's build <em>something</em>.</h2>
            <p className="addr">Open to interesting product work, collaborations, and conversations. Reply within 48 hours.</p>
          </div>
          <div className="channels">
            <a className="ch" href={`mailto:${profile.email}`}><span className="k">email</span><span>{profile.email} <span style={{ color:'var(--lime)', marginLeft:6 }}>→</span></span></a>
            <a className="ch" href={`https://${profile.github}`} target="_blank" rel="noreferrer"><span className="k">github</span><span>{profile.github} <span style={{ color:'var(--lime)', marginLeft:6 }}>→</span></span></a>
            <a className="ch" href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer"><span className="k">linkedin</span><span>/in/ismail <span style={{ color:'var(--lime)', marginLeft:6 }}>→</span></span></a>
            <a className="ch" href="/cv"><span className="k">cv · pdf</span><span>download <span style={{ color:'var(--lime)', marginLeft:6 }}>→</span></span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Foot() {
  return (
    <footer className="foot">
      <div className="container row">
        <span>© 2026 ismail. <span style={{ color:'var(--bark)' }}>·</span> handcrafted in next + three.</span>
        <span><a href="/admin/login" style={{ color:'var(--ash)' }}>admin</a></span>
      </div>
    </footer>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [openProject, setOpenProject] = useState(null);
  const [, forceUpdate] = useState(0);
  const active = useActiveSection(['hero', 'work', 'profile', 'contact']);

  // Re-render when Supabase data loads
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('portfolio-data-loaded', handler);
    return () => window.removeEventListener('portfolio-data-loaded', handler);
  }, []);

  useEffect(() => {
    const apply = () => { if (window.__scene) window.__scene.setMotif(t.motif); };
    if (window.__scene) apply();
    else window.addEventListener('scene-ready', apply, { once: true });
  }, [t.motif]);

  useEffect(() => { if (window.__scene) window.__scene.setSection(active); }, [active]);

  const onJump = useCallback(id => {
    if (id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToId(id);
  }, []);

  return (
    <>
      <Nav active={active} onJump={onJump} />
      <Hero onOpenProject={setOpenProject} />
      <Work onOpenProject={setOpenProject} />
      <Profile />
      <Contact />
      <Foot />
      <DetailPanel project={openProject} onClose={() => setOpenProject(null)} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="3D motif" />
        <TweakSelect label="Scene" value={t.motif}
          options={[
            { value:'orbs',      label:'Glossy orbs + knot' },
            { value:'wireframe', label:'Wireframe blueprint' },
            { value:'particles', label:'Spore nebula' },
            { value:'flora',     label:'Foliage drift' },
          ]}
          onChange={v => setTweak('motif', v)}
        />
        <div style={{ marginTop:8, fontSize:11, color:'#9a9a9a', lineHeight:1.5 }}>Drag the canvas to orbit. Scroll to fly.</div>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
