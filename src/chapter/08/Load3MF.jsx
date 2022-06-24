import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader";
import BaseScene from "../../utils/baseScene";

function LoadObj() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(30, 30, 30));
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = initRenderer(model);
    let scene = new BaseScene(camera, renderer);

    let loader = new ThreeMFLoader();
    loader.load("/src/assets/models/gears/dodeca_chain_loop.3mf", (model) => {
      model.scale.set(0.1, 0.1, 0.1);
      scene.render(model, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;