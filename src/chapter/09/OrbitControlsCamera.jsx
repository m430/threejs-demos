import { useEffect } from "react";
import { initCamera, initDefaultLight, initRenderer, initStats, setRandomColors } from "../../utils";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import chroma from "chroma-js";

function TrackballControlsCamera() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let stats = initStats();
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(30, 30, 30));
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = initRenderer(model);
    let scene = new THREE.Scene();

    initDefaultLight(scene);

    let orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = true;

    let planetTexture = new THREE.TextureLoader().load("/src/assets/textures/mars/mars_1k_color.jpg");
    let normalTexture = new THREE.TextureLoader().load("/src/assets/textures/mars/mars_1k_normal.jpg");
    let planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });

    let sphere = new THREE.SphereGeometry(20, 40, 40);
    let mesh = new THREE.Mesh(sphere, planetMaterial);
    scene.add(mesh);

    let clock = new THREE.Clock();
    const render = () => {
      stats.update();
      orbitControls.update(clock.getDelta());

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    render();
  }

  return (
    <div id="model"></div>
  )
}

export default TrackballControlsCamera;