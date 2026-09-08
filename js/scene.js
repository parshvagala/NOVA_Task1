/* Interactive 3D hero — wireframe planet, orbiting satellite, drifting particles.
   Reacts gently to pointer movement. Only runs on the home page hero. */
(function () {
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wrap = canvas.parentElement;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) {
    return; // WebGL unavailable — CSS starfield still carries the page.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var group = new THREE.Group();
  scene.add(group);

  // Wireframe planet
  var planetGeo = new THREE.IcosahedronGeometry(1.7, 2);
  var planetMat = new THREE.MeshBasicMaterial({
    color: 0x38e0c8,
    wireframe: true,
    transparent: true,
    opacity: 0.55
  });
  var planet = new THREE.Mesh(planetGeo, planetMat);
  group.add(planet);

  // Soft inner glow core
  var coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
  var coreMat = new THREE.MeshBasicMaterial({
    color: 0x7c5cfc,
    transparent: true,
    opacity: 0.12
  });
  var core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Orbit ring (visual guide for the satellite)
  var ringGeo = new THREE.RingGeometry(2.55, 2.57, 96);
  var ringMat = new THREE.MeshBasicMaterial({
    color: 0xffb84d,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  var ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.35;
  group.add(ring);

  // Satellite
  var satGeo = new THREE.SphereGeometry(0.09, 16, 16);
  var satMat = new THREE.MeshBasicMaterial({ color: 0xffb84d });
  var satellite = new THREE.Mesh(satGeo, satMat);
  group.add(satellite);
  var satAngle = 0;

  // Particle field
  var particleCount = 420;
  var positions = new Float32Array(particleCount * 3);
  for (var i = 0; i < particleCount; i++) {
    var radius = 4 + Math.random() * 5.5;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  var particleMat = new THREE.PointsMaterial({
    color: 0xf5f3ff,
    size: 0.028,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  function resize() {
    var w = wrap.clientWidth;
    var h = wrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  window.addEventListener("resize", resize);

  var pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  window.addEventListener("pointermove", function (e) {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function renderStatic() {
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    renderStatic();
    return;
  }

  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var dt = clock.getDelta();

    planet.rotation.y += dt * 0.18;
    planet.rotation.x += dt * 0.04;
    core.rotation.y -= dt * 0.12;
    particles.rotation.y += dt * 0.015;

    satAngle += dt * 0.6;
    satellite.position.set(Math.cos(satAngle) * 2.56, 0, Math.sin(satAngle) * 2.56 * 0.42);
    satellite.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2.35);

    targetX += (pointerX - targetX) * 0.03;
    targetY += (pointerY - targetY) * 0.03;
    group.rotation.y = targetX * 0.35;
    group.rotation.x = -targetY * 0.2;

    renderer.render(scene, camera);
  }
  animate();
})();
