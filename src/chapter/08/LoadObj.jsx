import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
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

    const material = new THREE.MeshLambertMaterial({ color: 0x5c3a21 });

    const loader = new OBJLoader();
    loader.load("/src/assets/models/pinecone/pinecone.obj", (mesh) => {
      mesh.children.forEach((child) => {
        child.material = material;
      })
      mesh.scale.set(120, 120, 120);
      scene.render(mesh, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;