import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { VRMLLoader } from "three/examples/jsm/loaders/VRMLLoader";
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

    let loader = new VRMLLoader();
    loader.load("/src/assets/models/tree/tree.wrl", (model) => {
      model.scale.set(2.5, 2.5, 2.5);
      scene.render(model, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;