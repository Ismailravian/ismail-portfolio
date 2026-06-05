// scene.js — Three.js background scene for the portfolio.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const NOISE_GLSL = /* glsl */`
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 =   v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ));
}
`;

function makeDistortMaterial({ color, accent, distort = 0.32, speed = 0.5, wire = false }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime:    { value: 0 },
      uDistort: { value: distort },
      uSpeed:   { value: speed },
      uColor:   { value: new THREE.Color(color) },
      uAccent:  { value: new THREE.Color(accent) },
      uFresnelPow: { value: 2.4 },
      uFresnelMix: { value: 0.85 },
    },
    wireframe: wire,
    vertexShader: `
      ${NOISE_GLSL}
      uniform float uTime;
      uniform float uDistort;
      uniform float uSpeed;
      varying vec3 vNormal;
      varying vec3 vViewPos;
      varying float vNoise;
      void main() {
        float t = uTime * uSpeed;
        float n = snoise(position * 1.4 + vec3(t * 0.6, t * 0.4, -t * 0.5));
        vNoise = n;
        vec3 displaced = position + normal * n * uDistort;
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        vViewPos = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uAccent;
      uniform float uFresnelPow;
      uniform float uFresnelMix;
      varying vec3 vNormal;
      varying vec3 vViewPos;
      varying float vNoise;
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPos);
        float ndv = max(dot(N, V), 0.0);
        float fresnel = pow(1.0 - ndv, uFresnelPow);
        vec3 lightDir = normalize(vec3(0.4, 0.8, 0.6));
        float lambert = max(dot(N, lightDir), 0.0);
        vec3 base = mix(uColor * 0.55, uColor, 0.4 + lambert * 0.6);
        vec3 col  = mix(base, uAccent, fresnel * uFresnelMix);
        col += uAccent * 0.18 * smoothstep(0.55, 0.85, vNoise);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

function makeParticleMaterial({ color, accent, size = 0.06 }) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime:   { value: 0 },
      uSize:   { value: size },
      uColor:  { value: new THREE.Color(color) },
      uAccent: { value: new THREE.Color(accent) },
      uPixel:  { value: window.devicePixelRatio || 1 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      uniform float uPixel;
      attribute float aSeed;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vSeed = aSeed;
        vec3 p = position;
        p.x += sin(uTime * 0.25 + aSeed * 6.28) * 0.35;
        p.y += cos(uTime * 0.22 + aSeed * 3.14) * 0.35;
        p.z += sin(uTime * 0.18 + aSeed * 2.71) * 0.25;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float dist = -mv.z;
        gl_PointSize = max(1.5, uSize * 540.0 * uPixel / dist) * (0.4 + aSeed);
        vAlpha = clamp(1.0 - dist / 30.0, 0.05, 1.0) * (0.45 + 0.55 * aSeed);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uAccent;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float a = smoothstep(0.5, 0.0, d);
        vec3 col = mix(uColor, uAccent, smoothstep(0.5, 1.0, vSeed));
        gl_FragColor = vec4(col, a * vAlpha);
      }
    `,
  });
}

function buildParticles(count, radius) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.6) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = r * Math.cos(phi);
    seeds[i] = Math.random();
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed',    new THREE.BufferAttribute(seeds, 1));
  return geo;
}

function buildLeafCluster() {
  const group = new THREE.Group();
  const leafGeo = new THREE.PlaneGeometry(1.2, 2.2, 6, 12);
  const pos = leafGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, Math.cos(x * 1.2) * 0.18 + Math.sin(y * 0.6) * 0.08);
  }
  leafGeo.computeVertexNormals();
  const colors = ['#4d5e3a', '#8a9b6f', '#b8e051', '#c7a04b'];
  for (let i = 0; i < 60; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.45, metalness: 0.05,
      side: THREE.DoubleSide, transparent: true, opacity: 0.92,
    });
    const m = new THREE.Mesh(leafGeo, mat);
    const r = 2 + Math.random() * 5;
    const a = Math.random() * Math.PI * 2;
    m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 5, Math.sin(a) * r - 1);
    m.rotation.set((Math.random() - 0.5) * 1.4, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 1.4);
    m.scale.setScalar(0.4 + Math.random() * 0.5);
    m.userData.driftSeed = Math.random();
    group.add(m);
  }
  return group;
}

class PortfolioScene {
  constructor(host) {
    this.host = host; this.scroll = 0; this.scrollTarget = 0;
    this.section = 'hero'; this.motif = 'orbs'; this.time = 0;
    this.distortMaterials = []; this.particleMaterials = [];
    this.distortMaterialsByGroup = {}; this.disposed = false;
    this._init();
  }

  _init() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w, h);
    renderer.setClearColor(0x060805, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    this.host.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060805, 0.045);
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(52, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    this.camera = camera;
    this.baseCamPos = camera.position.clone();

    scene.add(new THREE.AmbientLight(0x6f7a55, 0.35));
    const key = new THREE.DirectionalLight(0xebe5d0, 1.1);
    key.position.set(6, 7, 5); scene.add(key);
    const fillCool = new THREE.PointLight(0x8a9b6f, 1.5, 22);
    fillCool.position.set(-6, -2, 4); scene.add(fillCool);
    const accent = new THREE.PointLight(0xb8e051, 1.7, 18);
    accent.position.set(4, 3, -3); scene.add(accent);
    this.accentLight = accent;
    const warm = new THREE.PointLight(0xc7a04b, 0.7, 20);
    warm.position.set(-4, 4, -6); scene.add(warm);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.enablePan = false; controls.enableZoom = false;
    controls.rotateSpeed = 0.45; controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;
    controls.minPolarAngle = Math.PI * 0.32;
    controls.maxPolarAngle = Math.PI * 0.68;
    this.controls = controls;

    this.groups = { orbs: new THREE.Group(), wireframe: new THREE.Group(), particles: new THREE.Group(), flora: new THREE.Group() };
    Object.values(this.groups).forEach(g => scene.add(g));
    this._buildOrbsGroup(); this._buildWireframeGroup();
    this._buildParticlesGroup(); this._buildFloraGroup();

    this.ambientParticles = this._buildAmbientParticles();
    scene.add(this.ambientParticles.mesh);
    this.setMotif('orbs');

    window.addEventListener('resize', this._onResize);
    this._onResize();
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();

    this.clock = new THREE.Clock();
    this._tick = this._tick.bind(this);
    this._tick();
  }

  _buildOrbsGroup() {
    const g = this.groups.orbs;
    const knotMat = makeDistortMaterial({ color: '#4d5e3a', accent: '#b8e051', distort: 0.18, speed: 0.45 });
    this.distortMaterials.push(knotMat);
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.35, 0.34, 220, 28), knotMat);
    knot.userData.kind = 'knot'; g.add(knot);
    const orbDefs = [
      { p: [-3.4,1.3,0.2],   color:'#8a9b6f', accent:'#b8e051', s:0.95, sp:0.5, dist:0.4 },
      { p: [3.2,-1.5,0.6],   color:'#c7a04b', accent:'#d8f06b', s:0.74, sp:0.7, dist:0.5 },
      { p: [2.5,2.4,-1.4],   color:'#b86e3a', accent:'#c7a04b', s:0.55, sp:0.9, dist:0.6 },
      { p: [-2.4,-2.2,-0.4], color:'#4d5e3a', accent:'#8a9b6f', s:0.65, sp:0.6, dist:0.45 },
      { p: [0.6,3.2,1.3],    color:'#ebe5d0', accent:'#b8e051', s:0.40, sp:1.0, dist:0.55 },
    ];
    orbDefs.forEach((def, i) => {
      const mat = makeDistortMaterial({ color: def.color, accent: def.accent, distort: def.dist, speed: def.sp });
      this.distortMaterials.push(mat);
      const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 5), mat);
      mesh.position.set(...def.p); mesh.scale.setScalar(def.s);
      mesh.userData.driftSeed = i * 0.7; mesh.userData.baseY = def.p[1];
      g.add(mesh);
    });
    this.distortMaterialsByGroup.orbs = [...this.distortMaterials];
  }

  _buildWireframeGroup() {
    const g = this.groups.wireframe;
    const knotMat = new THREE.LineBasicMaterial({ color: 0xb8e051, transparent: true, opacity: 0.7 });
    const knot = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.TorusKnotGeometry(1.5, 0.36, 160, 18)), knotMat);
    knot.userData.kind = 'knot'; g.add(knot);
    const orbDefs = [
      { p:[-3.4,1.3,0.2],  color:0x8a9b6f, s:1.1 }, { p:[3.2,-1.5,0.6], color:0xb8e051, s:0.85 },
      { p:[2.5,2.4,-1.4],  color:0xc7a04b, s:0.6 },  { p:[-2.4,-2.2,-0.4],color:0x4d5e3a, s:0.75 },
      { p:[0.6,3.2,1.3],   color:0xebe5d0, s:0.5 },
    ];
    orbDefs.forEach((def, i) => {
      const m = new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.55 });
      const mesh = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1, 2)), m);
      mesh.position.set(...def.p); mesh.scale.setScalar(def.s);
      mesh.userData.driftSeed = i * 0.7; mesh.userData.baseY = def.p[1];
      g.add(mesh);
    });
    const grid = new THREE.GridHelper(24, 24, 0x4d5e3a, 0x14201a);
    grid.position.y = -3.6; grid.material.transparent = true; grid.material.opacity = 0.35;
    g.add(grid);
  }

  _buildParticlesGroup() {
    const g = this.groups.particles;
    const mat1 = makeParticleMaterial({ color: '#8a9b6f', accent: '#b8e051', size: 0.085 });
    g.add(new THREE.Points(buildParticles(2400, 9), mat1)); this.particleMaterials.push(mat1);
    const mat2 = makeParticleMaterial({ color: '#d8f06b', accent: '#ebe5d0', size: 0.11 });
    g.add(new THREE.Points(buildParticles(900, 3.6), mat2)); this.particleMaterials.push(mat2);
    const knotMat = new THREE.LineBasicMaterial({ color: 0xb8e051, transparent: true, opacity: 0.18 });
    const knot = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.TorusKnotGeometry(1.4, 0.32, 120, 14)), knotMat);
    knot.userData.kind = 'knot'; g.add(knot);
  }

  _buildFloraGroup() {
    const g = this.groups.flora;
    g.add(buildLeafCluster());
    const seedMat = makeDistortMaterial({ color: '#c7a04b', accent: '#b8e051', distort: 0.12, speed: 0.3 });
    this.distortMaterials.push(seedMat);
    const seed = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 5), seedMat);
    seed.userData.kind = 'knot'; g.add(seed);
    this.distortMaterialsByGroup.flora = [seedMat];
  }

  _buildAmbientParticles() {
    const geo = buildParticles(400, 14);
    const mat = makeParticleMaterial({ color: '#4d5e3a', accent: '#8a9b6f', size: 0.045 });
    return { mesh: new THREE.Points(geo, mat), mat };
  }

  setMotif(name) {
    if (!this.groups[name]) return;
    this.motif = name;
    Object.entries(this.groups).forEach(([k, group]) => { group.visible = k === name; });
    if (this.ambientParticles) this.ambientParticles.mesh.visible = name !== 'particles';
    if (this.accentLight) this.accentLight.intensity = name === 'particles' ? 0.6 : 1.7;
  }

  setScroll(frac) { this.scrollTarget = Math.max(0, Math.min(1, frac)); }
  setSection(name) { this.section = name; }

  _onResize = () => {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.particleMaterials.forEach(m => { m.uniforms.uPixel.value = window.devicePixelRatio || 1; });
    if (this.ambientParticles) this.ambientParticles.mat.uniforms.uPixel.value = window.devicePixelRatio || 1;
  };

  _onScroll = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    this.setScroll(window.scrollY / max);
  };

  _tick() {
    if (this.disposed) return;
    requestAnimationFrame(this._tick);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.time += dt;
    this.scroll += (this.scrollTarget - this.scroll) * 0.08;
    this.distortMaterials.forEach(m => { m.uniforms.uTime.value = this.time; });
    this.particleMaterials.forEach(m => { m.uniforms.uTime.value = this.time; });
    if (this.ambientParticles) this.ambientParticles.mat.uniforms.uTime.value = this.time;
    Object.values(this.groups).forEach(group => {
      group.children.forEach(obj => {
        if (obj.userData && obj.userData.driftSeed !== undefined) {
          obj.position.y = (obj.userData.baseY ?? 0) + Math.sin(this.time * 0.6 + obj.userData.driftSeed * 6.0) * 0.35;
          obj.rotation.x += dt * (0.12 + obj.userData.driftSeed * 0.1);
          obj.rotation.y += dt * (0.08 + obj.userData.driftSeed * 0.07);
        }
        if (obj.userData && obj.userData.kind === 'knot') {
          obj.rotation.x += dt * 0.15; obj.rotation.y += dt * 0.22;
        }
      });
    });
    if (this.ambientParticles) this.ambientParticles.mesh.rotation.y += dt * 0.02;
    const s = this.scroll;
    const ease = x => 1 - Math.pow(1 - x, 2);
    const e = ease(s);
    this.camera.position.x = this.baseCamPos.x + Math.sin(e * Math.PI * 1.2) * 1.6;
    this.camera.position.y = this.baseCamPos.y + e * 1.2 - Math.sin(e * Math.PI) * 0.6;
    this.camera.position.z = this.baseCamPos.z - e * 3.4;
    this.controls.target.set(0, e * 0.6 - 0.4, -e * 1.8);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('scroll', this._onScroll);
    this.renderer.dispose();
    this.host.removeChild(this.renderer.domElement);
  }
}

const host = document.getElementById('bg-canvas-host');
if (host) {
  const scene = new PortfolioScene(host);
  window.__scene = {
    setMotif: n => scene.setMotif(n),
    setScroll: f => scene.setScroll(f),
    setSection: n => scene.setSection(n),
  };
  window.dispatchEvent(new Event('scene-ready'));
}
