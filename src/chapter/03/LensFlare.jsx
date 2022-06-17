import { useEffect } from "react";
import { initStats } from "../../utils";
import { GUI } from "dat.gui";
import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";
import grassImg from "../../assets/textures/ground/grasslight-big.jpg";
import lensImg0 from "../../assets/textures/lensflare/lensflare0.png";
import lensImg3 from "../../assets/textures/lensflare/lensflare3.png";

function LensFlareExample() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);
    return scene;
  }

  const initCamera = (dom) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(-25, 15, 45);
    camera.lookAt(new THREE.Vector3(10, 0, 0));
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xaaaaff));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }

  const ambiColor = "#1c1c1c";
  const initAmbientLight = () => {
    return new THREE.AmbientLight(ambiColor);
  }

  const pointColor = "#ffffff";
  const initDirectionalLight = () => {
    const directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(30, 10, -50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;

    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.mapSize.width = 2048;
    return directionalLight;
  }

  const initSpotLight = () => {
    const spotLight = new THREE.SpotLight(0xcccccc);
    spotLight.position.set(-40, 60, -10);
    return spotLight;
  }

  const initPlaneGeometry = () => {
    // 创建一个纹理
    const textureLoader = new THREE.TextureLoader()
    const textureGrass = textureLoader.load(grassImg);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4, 4);
    const planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    return plane;
  }

  const initCube = (scene) => {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);
    return cube;
  }

  const initSphere = (scene) => {
    const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(10, 5, 10);
    sphere.castShadow = true;
    scene.add(sphere);
    return sphere;
  }

  const initFlare = () => {
    const textureFlare0 = new THREE.TextureLoader().load(lensImg0);
    const textureFlare3 = new THREE.TextureLoader().load(lensImg3);

    const flareColor = new THREE.Color(0xffaacc);
    const lensFlare = new Lensflare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);

    lensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6))
    lensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7))
    lensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9))
    lensFlare.addElement(new LensflareElement(textureFlare3, 70, 1.0))
    return lensFlare;
  }

  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();
    const scene = initScece();
    let camera = initCamera(model, scene);
    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    const plane = initPlaneGeometry();
    scene.add(plane);
    const ambientLight = initAmbientLight();
    scene.add(ambientLight);
    const spotLight = initSpotLight();
    spotLight.lookAt(plane);
    scene.add(spotLight);
    const directionalLight = initDirectionalLight();
    directionalLight.target = plane;
    scene.add(directionalLight);

    const cube = initCube(scene);
    const sphere = initSphere(scene);
    const lensFlare = initFlare();
    lensFlare.position.copy(directionalLight.position);
    scene.add(lensFlare);

    let step = 0;
    let invert = 1;
    let phase = 0;
    const controls = new function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.pointColor = pointColor;
      this.intensity = 0.1;
      this.angle = 0.1;
      this.debug = false;
      this.castShadow = true;
      this.target = "Plane";
    }

    const gui = new GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function (e) {
      directionalLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
      directionalLight.intensity = e;
    });

    const render = () => {
      stats.update();
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }

  return (
    <div id="model"></div>
  )
}

export default LensFlareExample;