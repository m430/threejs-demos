import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { VTKLoader } from "three/examples/jsm/loaders/VTKLoader";
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

    let loader = new VTKLoader();
    loader.load("/src/assets/models/moai/moai_fixed.vtk", (geom) => {
      let mat = new THREE.MeshNormalMaterial();

      geom.center();
      geom.computeVertexNormals();
      let group = new THREE.Mesh(geom, mat);
      group.scale.set(25, 25, 25);

      scene.render(group, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;