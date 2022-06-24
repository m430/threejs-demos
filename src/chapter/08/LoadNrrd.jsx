import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
import BaseScene from "../../utils/baseScene";

// 
function LoadNrrd() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(30, 30, 30));
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = initRenderer(model);
    let scene = new BaseScene(camera, renderer);

    let loader = new NRRDLoader();
    loader.load("/src/assets/models/nrrd/I.nrrd", (volume) => {
      let indexZ = 0;
      let sliceZ = volume.extractSlice("z", Math.floor(volume.RASDimensions[2] / 4))
      scene.render(sliceZ.mesh, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadNrrd;