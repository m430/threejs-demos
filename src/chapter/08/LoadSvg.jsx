import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import BaseScene from "../../utils/baseScene";

// 
function LoadNrrd() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(30, 30, 150));
    camera.lookAt(new THREE.Vector3(100, 100, 100));

    const renderer = initRenderer(model);
    let scene = new BaseScene(camera, renderer);

    let loader = new SVGLoader();
    loader.load("/src/assets/models/tiger/tiger.svg", ({ paths }) => {
      console.log("paths--", paths);
      let group = new THREE.Group();
      group.scale.multiplyScalar(0.1);
      group.scale.y *= -1;
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let material = new THREE.MeshBasicMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        let shapes = path.toShapes(true);
        for (let j = 0; j < shapes.length; j++) {
          let shape = shapes[j];
          let geometry = new THREE.ShapeBufferGeometry(shape);
          let mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }

      console.log("group--", group);
      scene.render(group, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadNrrd;