import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
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

    let loader = new TDSLoader();
    loader.load("/src/assets/models/chair/Eames_chair_DSW.3DS", (model) => {
      model.scale.set(0.3, 0.3, 0.3);
      scene.render(model, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;