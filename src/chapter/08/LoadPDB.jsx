import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader";
import BaseScene from "../../utils/baseScene";

function LoadObj() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(10, 10, 10));
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = initRenderer(model);
    let scene = new BaseScene(camera, renderer);

    let loader = new PDBLoader();
    loader.load("/src/assets/models/molecules/diamond.pdb", (geometries) => {

      let group = new THREE.Object3D();

      let geomAtoms = geometries.geometryAtoms;

      for (let i = 0; i < geomAtoms.attributes.position.count; i++) {
        let startPosition = new THREE.Vector3();
        startPosition.x = geomAtoms.attributes.position.getX(i);
        startPosition.y = geomAtoms.attributes.position.getY(i);
        startPosition.z = geomAtoms.attributes.position.getZ(i);

        let color = new THREE.Color();
        color.r = geomAtoms.attributes.color.getX(i);
        color.g = geomAtoms.attributes.color.getY(i);
        color.b = geomAtoms.attributes.color.getZ(i);

        let mat = new THREE.MeshPhongMaterial({ color });

        let sphere = new THREE.SphereGeometry(0.2);
        let mesh = new THREE.Mesh(sphere, mat);
        mesh.position.copy(startPosition);
        group.add(mesh);
      }

      let geometryBonds = geometries.geometryBonds;

      for (let j = 0; j < geometryBonds.attributes.position.count; j += 2) {
        let startPosition = new THREE.Vector3();
        startPosition.x = geometryBonds.attributes.position.getX(j);
        startPosition.y = geometryBonds.attributes.position.getY(j);
        startPosition.z = geometryBonds.attributes.position.getZ(j);

        let endPosition = new THREE.Vector3();
        endPosition.x = geometryBonds.attributes.position.getX(j + 1);
        endPosition.y = geometryBonds.attributes.position.getY(j + 1);
        endPosition.z = geometryBonds.attributes.position.getZ(j + 1);

        // use the start and end to create a curve, and use the curve to draw
        // a tube, which connects the atoms
        let path = new THREE.CatmullRomCurve3([startPosition, endPosition]);
        let tube = new THREE.TubeGeometry(path, 1, 0.04);
        let material = new THREE.MeshPhongMaterial({
          color: 0xcccccc
        });
        let mesh = new THREE.Mesh(tube, material);
        group.add(mesh);
      }

      scene.render(group, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;