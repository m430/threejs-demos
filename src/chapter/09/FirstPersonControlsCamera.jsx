import { useEffect } from "react";
import { initCamera, initDefaultLight, initRenderer, initStats, setRandomColors } from "../../utils";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
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

    let fpControls = new FirstPersonControls(camera, renderer.domElement);
    fpControls.lookSpeed = 0.1;
    fpControls.movementSpeed = 20;
    fpControls.lookVertical = true;
    fpControls.constrainVertical = true;
    fpControls.verticalMin = 1.0;
    fpControls.verticalMax = 2.0;
    fpControls.lon = -150;
    fpControls.lat = 120;

    let loader = new OBJLoader();
    loader.load("/src/assets/models/city/city.obj", (obj) => {
      let scale = chroma.scale(['red', 'green', 'blue']);
      setRandomColors(obj, scale);

      scene.add(obj);
    });

    let clock = new THREE.Clock();
    const render = () => {
      stats.update();
      fpControls.update(clock.getDelta());

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