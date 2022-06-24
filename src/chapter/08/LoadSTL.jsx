import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
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

    let loader = new STLLoader();
    loader.load("/src/assets/models/head/SolidHead_2_lowPoly_42k.stl", (geom) => {
      let mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.5
      });

      let group = new THREE.Mesh(geom, mat);
      group.rotation.x = -0.5 * Math.PI;
      group.scale.set(0.3, 0.3, 0.3);

      scene.render(group, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;