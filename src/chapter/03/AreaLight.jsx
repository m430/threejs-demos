import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

function AreaLight() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    const scene = new THREE.Scene();
    return scene;
  }

  const initCamera = (dom, scene) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 1, 1000);
    camera.position.set(0, 5, -15);
    scene.add(camera);
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    return renderer;
  }

  const initFloor = () => {
    const floor = new THREE.BoxGeometry(2000, 0.1, 2000);
    const material = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.1, metalness: 0 });
    const mesh = new THREE.Mesh(floor, material);
    return mesh;
  }

  const initAreaLight = (color) => {
    const areaLight = new THREE.RectAreaLight(color, 5, 4, 10);
    return areaLight;
  }

  const initKnot = () => {
    const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
    const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
    const meshKnot = new THREE.Mesh(geoKnot, matKnot);
    meshKnot.name = 'meshKnot';
    meshKnot.position.set(0, 5, 0);
    return meshKnot;
  }

  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();
    const scene = initScece();
    const camera = initCamera(model, scene);
    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    RectAreaLightUniformsLib.init();

    const rectLight1 = initAreaLight(0xff0000);
    rectLight1.position.set(- 5, 5, 5);
    scene.add(rectLight1);

    const rectLight2 = initAreaLight(0x00ff00);
    rectLight2.position.set(0, 5, 5);
    scene.add(rectLight2);

    const rectLight3 = initAreaLight(0x0000ff);
    rectLight3.position.set(5, 5, 5);
    scene.add(rectLight3);

    scene.add(new RectAreaLightHelper(rectLight1));
    scene.add(new RectAreaLightHelper(rectLight2));
    scene.add(new RectAreaLightHelper(rectLight3));

    const mshStdFloor = initFloor();
    scene.add(mshStdFloor);

    const meshKnot = initKnot();
    scene.add(meshKnot);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(meshKnot.position);
    controls.update();


    const render = () => {
      stats.update();
      meshKnot.rotation.y += 0.01;

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }

  return (
    <div id="model"></div>
  )
}

export default AreaLight;