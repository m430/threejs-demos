import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { GCodeLoader } from "three/examples/jsm/loaders/GCodeLoader";
import BaseScene from "../../utils/baseScene";

function LoadGCODE() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(30, 30, 30));
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = initRenderer(model);
    let scene = new BaseScene(camera, renderer);

    let loader = new GCodeLoader();
    loader.load("/src/assets/models/benchy/benchy.gcode", (object) => {
      scene.render(object, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadGCODE;