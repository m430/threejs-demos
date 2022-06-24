import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import BaseScene from "../../utils/baseScene";

function LoadObj() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(50, 50, 50));
    camera.lookAt(new THREE.Vector3(0, 15, 0));

    const renderer = initRenderer(model);
    let scene = new BaseScene(camera, renderer);

    let loader = new ColladaLoader();
    loader.load("/src/assets/models/medieval/Medieval_building.DAE", (result) => {
      let sceneGroup = result.scene;
      console.log(result);
      sceneGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.receiveShadow = true;
          child.castShadow = true;
        } else {
          sceneGroup.remove(child);
        }
      })

      sceneGroup.rotation.z = 0.5 * Math.PI;
      sceneGroup.scale.set(8, 8, 8);

      scene.render(sceneGroup, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;