import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { PRWMLoader } from "three/examples/jsm/loaders/PRWMLoader";
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

    let loader = new PRWMLoader();
    loader.load("/src/assets/models/cerberus/cerberus.be.prwm", (geometry) => {
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      geometry.computeBoundingBox();

      var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());

      mesh.scale.set(30, 30, 30)

      scene.render(mesh, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;