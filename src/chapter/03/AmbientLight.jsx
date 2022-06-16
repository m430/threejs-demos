import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { GUI } from "dat.gui";

function AmbientLight() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    return new THREE.Scene();
  }

  const initCamera = (dom) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(-25, 30, 25);
    camera.lookAt(new THREE.Vector3(10, 0, 0));
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }

  const ambiColor = "#0c0c0c";
  const initAmbientLight = () => {
    return new THREE.AmbientLight(ambiColor);
  }

  const initSpotLight = (dom) => {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    return spotLight;
  }

  const initDirectionalLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-20.40, 60);
    return directionalLight;
  }

  const initPlaneGeometry = () => {
    const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    return plane;
  }

  const initCube = (scene) => {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);
    return cube;
  }

  const initSphere = (scene) => {
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    return sphere;
  }

  const initGui = (controls, ambientLight, spotLight) => {
    const gui = new GUI();
    gui.add(controls, "intensity", 0, 3, 0.1).onChange((e) => {
      ambientLight.color = new THREE.Color(controls.ambientColor);
      ambientLight.intensity = controls.intensity;
    })
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(e);
    });
    gui.add(controls, 'disableSpotlight').onChange(function (e) {
      spotLight.visible = !e;
    });
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
    const spotLight = initSpotLight(model);
    scene.add(spotLight);

    const cube = initCube(scene);
    const sphere = initSphere(scene);

    const controls = new function () {
      this.intensity = ambientLight.intensity;
      this.rotationSpeed = 0.02;
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.disableSpotlight = false;
    }

    initGui(controls, ambientLight, spotLight);

    let step = 0;
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

export default AmbientLight;