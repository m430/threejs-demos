import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";

function MeshBasicMaerial() {

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
    camera.position.set(-20, 50, 40);
    camera.lookAt(new THREE.Vector3(10, 0, 0));
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }

  const initPlaneGeometry = () => {
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 4, 4);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x777777 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -20;
    return plane;
  }

  const ambiColor = "#0c0c0c";
  const initAmbientLight = () => {
    return new THREE.AmbientLight(ambiColor);
  }

  const initSpotLight = () => {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    return spotLight;
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

    const cube = initCube(scene);

    const controls = new function () {
      this.rotationSpeed = 0.02;
    }

    const render = () => {
      stats.update();
      cube.rotation.y += controls.rotationSpeed;

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }

  return (
    <div id="model"></div>
  )
}

export default MeshBasicMaerial;