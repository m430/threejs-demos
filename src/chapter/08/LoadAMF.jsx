import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { AMFLoader } from "three/examples/jsm/loaders/AMFLoader";
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

    let loader = new AMFLoader();
    loader.load("/src/assets/models/gimbal/Gimbal_snowflake_star_small_hole_6mm.amf", (model) => {
      model.scale.set(0.4, 0.4, 0.4);
      scene.render(model, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;