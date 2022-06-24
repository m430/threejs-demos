import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
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

    const mtlLoader = new MTLLoader();
    mtlLoader.load("/src/assets/models/butterfly/butterfly.mtl", (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load("/src/assets/models/butterfly/butterfly.obj", (mesh) => {

        // 移动翅膀到水平位置
        [0, 2, 4, 6].forEach(i => mesh.children[i].rotation.z = 0.3 * Math.PI);
        [1, 3, 5, 7].forEach(i => mesh.children[i].rotation.z = -0.3 * Math.PI);

        // 配置翅膀
        let wing1 = mesh.children[4];
        let wing2 = mesh.children[5];

        wing1.material.opacity = 0.9;
        wing1.material.transparent = true;
        wing1.material.depthTest = false;
        wing1.material.side = THREE.DoubleSide;

        wing2.material.opacity = 0.9;
        wing2.material.depthTest = false;
        wing2.material.transparent = true;
        wing2.material.side = THREE.DoubleSide;

        mesh.scale.set(140, 140, 140);
        mesh.rotation.x = 0.2;
        mesh.rotation.y = -1.3;

        scene.render(mesh, camera);
      })
    })
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;