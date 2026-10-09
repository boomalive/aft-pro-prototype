import {
  ACESFilmicToneMapping, BackSide, Box3, CanvasTexture, Color, CubeCamera, DoubleSide, Group,
  FileLoader, HalfFloatType, LinearFilter, Mesh, MeshBasicMaterial, MeshPhysicalMaterial,
  PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, ShaderMaterial,
  SphereGeometry, SRGBColorSpace, Vector3, WebGLCubeRenderTarget, WebGLRenderer,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {diamondMaterial, updateDiamond} from './DiamondMaterial';

type ViewerDebug = {
  ready: boolean; error?: string; loadMs?: number; angle?: number;
  setPose?: (angle: number, elevation?: number) => void;
  pause?: () => void; render?: () => void; fps?: number;
  renderer?: WebGLRenderer; scene?: Scene; camera?: PerspectiveCamera;
};
declare global {interface Window {ringViewer: ViewerDebug;}}

class PortableDracoLoader extends DRACOLoader {
  async _loadLibrary(file: string, responseType: 'text' | 'arraybuffer') {
    const inline = document.querySelector(file.endsWith('.wasm') ? '#draco-wasm' : '#draco-wrapper')?.textContent;
    if (inline) return responseType === 'text' ? inline : Uint8Array.from(atob(inline.trim()), (c) => c.charCodeAt(0)).buffer;
    return new FileLoader().setResponseType(responseType).loadAsync(`./draco/${file}`);
  }
}

const host = document.querySelector<HTMLElement>('#viewer')!;
const status = document.querySelector<HTMLElement>('#status')!;
const rotation = document.querySelector<HTMLButtonElement>('#rotate')!;
const reset = document.querySelector<HTMLButtonElement>('#reset')!;
const started = performance.now();
window.ringViewer = {ready: false};

async function start() {
  const renderer = new WebGLRenderer({antialias: true, alpha: true, powerPreference: 'high-performance'});
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0xffffff, 0);
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Трёхмерная модель кольца. Перетаскивай для вращения, используй колёсико для увеличения.');
  renderer.domElement.setAttribute('tabindex', '0');
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.01, 100);
  camera.position.set(4.3, 8.8, 7.7).normalize().multiplyScalar(6.7);
  camera.up.set(-0.65, 1, 0).normalize();
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.085;
  controls.enablePan = false;
  controls.minDistance = 4.5;
  controls.maxDistance = 12;
  controls.minPolarAngle = 0.14;
  controls.maxPolarAngle = Math.PI - 0.14;
  controls.rotateSpeed = 0.62;
  controls.zoomSpeed = 0.7;
  controls.saveState();

  function studio(gems: boolean) {
    const environment = new Scene();
    const surround = new Mesh(new SphereGeometry(20, 32, 16), new ShaderMaterial({
      side: BackSide,
      uniforms: {gem: {value: gems}},
      vertexShader: 'varying vec3 direction; void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: `varying vec3 direction; uniform bool gem;
        void main(){vec3 d=normalize(direction);float v;
          if(gem){v=mix(0.045,0.56,1.0-smoothstep(-0.85,-0.05,d.y));v+=0.17*smoothstep(0.0,0.9,d.y);}
          else{v=mix(0.055,0.95,1.0-smoothstep(-0.85,-0.05,d.y));v+=0.16*smoothstep(0.0,0.9,d.y);}
          gl_FragColor=vec4(vec3(v),1.0);
        }`,
      toneMapped: false,
    }));
    environment.add(surround);
    const gradientCanvas = document.createElement('canvas');gradientCanvas.width = 512;gradientCanvas.height = 32;
    const context = gradientCanvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, 512, 0);
    gradient.addColorStop(0, '#656565');gradient.addColorStop(0.18, '#d6d6d6');
    gradient.addColorStop(0.46, '#ffffff');gradient.addColorStop(0.72, '#eeeeee');gradient.addColorStop(1, '#898989');
    context.fillStyle = gradient;context.fillRect(0, 0, 512, 32);
    const softbox = new CanvasTexture(gradientCanvas);softbox.colorSpace = SRGBColorSpace;
    const cards = gems ? [
      [[-4, 4, 4], [3, 5], [3.2, 3.3, 3.45]],
      [[4, 2, 3], [1.6, 5], [3.8, 3.9, 4.0]],
      [[0, 5, -1], [5, 3.5], [3.0, 3.0, 3.0]],
      [[-3, 0, -5], [2.2, 5], [2.3, 2.5, 2.7]],
      [[3, -2, -4], [2.0, 4], [2.4, 2.3, 2.1]],
      [[0, -5, 1], [5, 5], [1.35, 1.35, 1.35]],
      [[1, 1, 5], [0.38, 6], [0.015, 0.02, 0.03]],
    ] : [
      [[-4, 3, 4], [4.0, 6], [2.6, 2.6, 2.6]],
      [[4, 1, 2], [1.4, 6], [2.1, 2.2, 2.3]],
      [[0, 5, -1], [5.5, 4], [2.4, 2.4, 2.4]],
      [[-3, 1, -4], [3.5, 6], [1.5, 1.6, 1.7]],
      [[3, -2, -4], [2.5, 5], [1.35, 1.35, 1.35]],
      [[0, -4, 2], [6, 5], [1.6, 1.6, 1.6]],
      [[1, 1, 5], [0.4, 6], [0.006, 0.007, 0.008]],
    ];
    for (const [position, size, rgb] of cards) {
      const card = new Mesh(new PlaneGeometry(size[0], size[1]), new MeshBasicMaterial({
        color: new Color().setRGB(rgb[0], rgb[1], rgb[2]), map: softbox, side: DoubleSide, toneMapped: false,
      }));
      card.position.set(position[0], position[1], position[2]);card.lookAt(0, 0, 0);environment.add(card);
    }
    return environment;
  }
  const pmrem = new PMREMGenerator(renderer);
  const metalStudio = studio(false);
  const metalEnv = pmrem.fromScene(metalStudio, 0.045).texture;
  scene.environment = metalEnv;
  const gemStudio = studio(true);
  const cubeTarget = new WebGLCubeRenderTarget(512, {type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter});
  new CubeCamera(0.1, 100, cubeTarget).update(renderer, gemStudio);
  pmrem.dispose();
  for (const room of [metalStudio, gemStudio]) room.traverse((o) => {
    if (o instanceof Mesh) {o.geometry.dispose();(o.material as MeshBasicMaterial).dispose();}
  });

  status.textContent = 'Подготавливаю кольцо…';
  const embedded = document.querySelector('#ring-data')?.textContent?.trim();
  const draco = new PortableDracoLoader().setWorkerLimit(2);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const gltf = embedded
    ? await loader.parseAsync(Uint8Array.from(atob(embedded), (c) => c.charCodeAt(0)).buffer, '')
    : await loader.loadAsync('./ring-web-v1.glb');
  draco.dispose();
  const model = gltf.scene;
  const bounds = new Box3().setFromObject(model);
  const center = bounds.getCenter(new Vector3());
  const height = bounds.getSize(new Vector3()).y;
  model.position.copy(center).multiplyScalar(-1);
  const normalized = new Group();normalized.add(model);normalized.scale.setScalar(3.2 / height);
  const pivot = new Group();pivot.add(normalized);scene.add(pivot);pivot.rotation.y = 1.25;
  const diamonds: {mesh: Mesh; material: ShaderMaterial; hero: boolean}[] = [];
  model.traverse((o) => {
    if (!(o instanceof Mesh)) return;
    if (o.userData.role === 'diamond' || o.name.startsWith('Diamond')) {
      const hero = o.userData.hero === true || o.name.includes('Centre');
      const material = diamondMaterial(o.geometry, cubeTarget.texture, hero);
      o.material = material;diamonds.push({mesh: o, material, hero});
    } else {
      const material = o.material as MeshPhysicalMaterial;
      material.envMap = metalEnv;material.envMapIntensity = 1;
      // The artist's roughness texture contains the engraving. Retain that detail.
      material.roughness = 1.25;
      material.needsUpdate = true;
      if (material.map) material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      if (material.normalMap) material.normalMap.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
  });

  const maximumDpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1.5 : 1.75);
  let dpr = maximumDpr;
  const resize = () => {
    const width = host.clientWidth;const heightPx = host.clientHeight;
    renderer.setPixelRatio(dpr);renderer.setSize(width, heightPx, false);
    camera.aspect = width / heightPx;
    camera.zoom = Math.min(1, camera.aspect / 0.95);camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);resize();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let autoplay = !reducedMotion.matches;
  let interacting = false;
  let resumeAt = 0;
  let visible = true;
  let last = performance.now();
  let frameCount = 0;let sampleTime = last;let fps = 60;
  let qualityAdjusted = false;
  let needsRender = true;
  controls.addEventListener('change', () => {needsRender = true;});
  const paint = () => {
    scene.updateMatrixWorld(true);
    for (const {mesh, material} of diamonds) updateDiamond(mesh, material);
    renderer.render(scene, camera);
    needsRender = false;
    window.ringViewer.angle = pivot.rotation.y;
  };
  const setQuality = (still: boolean) => {
    const high = still || !qualityAdjusted;
    const nextDpr = high ? maximumDpr : Math.max(1, maximumDpr * 0.78);
    if (dpr !== nextDpr) {dpr = nextDpr;resize();}
    for (const {material, hero} of diamonds) material.uniforms.bounces.value = high ? (hero ? 12 : 7) : (hero ? 6 : 3);
    needsRender = true;
  };
  const updateButton = () => {
    rotation.textContent = autoplay ? 'Ⅱ Пауза' : '▶ Вращать';
    rotation.setAttribute('aria-pressed', String(autoplay));
  };
  rotation.addEventListener('click', () => {autoplay = !autoplay;setQuality(!autoplay);resumeAt = 0;frameCount = 0;sampleTime = performance.now();updateButton();});
  reset.addEventListener('click', () => {controls.reset();resize();pivot.rotation.y = 1.25;resumeAt = performance.now() + 2500;paint();});
  controls.addEventListener('start', () => {interacting = true;setQuality(false);});
  controls.addEventListener('end', () => {interacting = false;resumeAt = performance.now() + 2500;if (!autoplay) setQuality(true);});
  renderer.domElement.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();pivot.rotation.y += event.key === 'ArrowLeft' ? -0.12 : 0.12;resumeAt = performance.now() + 2500;paint();
    }
  });
  new IntersectionObserver(([entry]) => {visible = entry.isIntersecting;}, {threshold: 0.05}).observe(host);
  reducedMotion.addEventListener('change', () => {autoplay = !reducedMotion.matches;updateButton();});
  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();host.classList.remove('ready');status.hidden = false;
    status.textContent = 'Просмотр 3D приостановлен. Обнови страницу, чтобы продолжить.';
  });

  window.ringViewer = {
    ready: true, loadMs: performance.now() - started, renderer, scene, camera,
    pause: () => {autoplay = false;setQuality(true);paint();updateButton();},
    setPose: (angle, elevation = 50) => {
      autoplay = false;setQuality(true);updateButton();pivot.rotation.y = angle;
      const distance = camera.position.length();
      camera.position.set(0.487, Math.tan(elevation * Math.PI / 180), 0.873).normalize().multiplyScalar(distance);
      controls.target.set(0, 0, 0);controls.update();paint();
    },
    render: paint,
  };
  controls.update();paint();
  // Compile and render before removing the loading poster.
  host.classList.add('ready');status.hidden = true;updateButton();
  document.querySelector<HTMLElement>('#hint')!.hidden = false;
  const animate = (time: number) => {
    const dt = Math.min((time - last) / 1000, 0.05);last = time;
    if (visible && !document.hidden) {
      const spinning = autoplay && !interacting && time > resumeAt;
      if (spinning) {pivot.rotation.y += dt * Math.PI * 2 / 16;needsRender = true;}
      controls.update();
      if (needsRender) {paint();frameCount++;}
      if (time - sampleTime > 2000) {
        fps = frameCount * 1000 / (time - sampleTime);window.ringViewer.fps = fps;
        frameCount = 0;sampleTime = time;
        // Reduce GPU work once on slow devices, without changing geometry or maps.
        if (!qualityAdjusted && autoplay && fps < 26) {
          qualityAdjusted = true;setQuality(false);
        }
      }
    } else {frameCount = 0;sampleTime = time;}
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

start().catch((error: Error) => {
  window.ringViewer.error = error.message;
  status.textContent = 'Не удалось открыть 3D. Попробуй актуальную версию Chrome, Safari или Edge.';
  console.error(error);
});
