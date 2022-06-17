import { useEffect } from "react";
import { initStats } from "../../utils";
import { GUI } from "dat.gui";
import * as THREE from "three";
import grassImg from "../../assets/textures/ground/grasslight-big.jpg";

function DirectionalLight() {

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
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.mapSize.width = 2048;
    return directionalLight;
  }

  const initSpotLight = () => {
    const spotLight = new THREE.SpotLight(0xcccccc);
    spotLight.position.set(-40, 60, -10);
    return spotLight;
  }

  const initHemiLight = () => {
    const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    hemiLight.position.set(0, 500, 0);
    return hemiLight;
  }

  const initPlaneGeometry = () => {
    // 创建一个纹理
    const textureLoader = new THREE.TextureLoader()
    const textureGrass = textureLoader.load(grassImg);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4, 4);
    console.log("texture---", textureGrass);
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

  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();
    const scene = initScece();
    let camera = initCamera(model, scene);
    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    const plane = initPlaneGeometry();
    scene.add(plane);
    const spotLight = initSpotLight();
    spotLight.lookAt(plane);
    scene.add(spotLight);
    const directionalLight = initDirectionalLight();
    directionalLight.target = plane;
    scene.add(directionalLight);
    const hemiLight = initHemiLight();
    scene.add(hemiLight);

    const cube = initCube(scene);
    const sphere = initSphere(scene);

    let step = 0;
    let invert = 1;
    let phase = 0;
    const controls = new function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;

      this.hemisphere = true;
      this.color = 0x00ff00;
      this.skyColor = 0x0000ff;
      this.intensity = 0.6;
    }

    const gui = new GUI();
    gui.add(controls, "hemisphere").onChange((e) => {
      if (!e) {
        hemiLight.intensity = 0;
      } else {
        hemiLight.intensity = controls.intensity;
      }
    })
    gui.addColor(controls, 'color').onChange(function (e) {
      hemiLight.groundColor = new THREE.Color(e);
    });
    gui.addColor(controls, 'skyColor').onChange(function (e) {
      hemiLight.color = new THREE.Color(e);
    });
    gui.add(controls, "intensity", 0, 5).onChange((e) => {
      hemiLight.intensity = e;
    })

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

export default DirectionalLight;