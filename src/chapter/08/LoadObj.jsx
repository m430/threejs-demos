import { useEffect } from "react";
import { initStats, initCamera, initRenderer, initTrackballControls } from "../../utils";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import objFile from "../../assets/models/pinecone/pinecone.obj";
import BaseScene from "../../utils/baseScene";

function LoadObj() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(50, 50, 50));
    const renderer = initRenderer(model);
    let scene = new BaseScene(camera, renderer);
    camera.lookAt(new THREE.Vector3(0, 15, 0));

    const loader = new OBJLoader();
    loader.load(objFile, (mesh) => {
      scene.render(mesh, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;