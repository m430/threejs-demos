import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";
import { GUI } from "dat.gui";
function CustomGeometry() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const stats = initStats();
    const model = document.querySelector("#model");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, model.clientWidth / model.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(model.clientWidth, model.clientHeight);
    renderer.shadowMap.enabled = true;

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    camera.position.set(-20, 25, 20);
    camera.lookAt(new THREE.Vector3(5, 0, 0));

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    model.appendChild(renderer.domElement);

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      // front
      -1, -1, 1,
      1, -1, 1,
      -1, 1, 1,

      -1, 1, 1,
      1, -1, 1,
      1, 1, 1,
      // right
      1, -1, 1,
      1, -1, -1,
      1, 1, 1,

      1, 1, 1,
      1, -1, -1,
      1, 1, -1,
      // back
      1, -1, -1,
      -1, -1, -1,
      1, 1, -1,

      1, 1, -1,
      -1, -1, -1,
      -1, 1, -1,
      // left
      -1, -1, -1,
      -1, -1, 1,
      -1, 1, -1,

      -1, 1, -1,
      -1, -1, 1,
      -1, 1, 1,
      // top
      1, 1, -1,
      -1, 1, -1,
      1, 1, 1,

      1, 1, 1,
      -1, 1, -1,
      -1, 1, 1,
      // bottom
      1, -1, 1,
      -1, -1, 1,
      1, -1, -1,

      1, -1, -1,
      -1, -1, 1,
      -1, -1, -1,
    ]);
    const normals = new Float32Array([
      // front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      // right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      // back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      // left
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      // bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    ]);
    const uvs = new Float32Array([
      // front
      0, 1,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      1, 0,
      // right
      0, 1,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      1, 0,
      // back
      0, 1,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      1, 0,
      // left
      0, 1,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      1, 0,
      // top
      0, 1,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      1, 0,
      // bottom
      0, 1,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      1, 0,
    ]);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    const materials = [
      new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
      new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
    ];

    const mesh = createMultiMaterialObject(geo, materials);
    mesh.children.forEach((e) => {
      e.castShadow = true;
    });
    scene.add(mesh);

    const render = () => {
      stats.update();
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }


    render();
  }

  return (
    <div id="model"></div>
  )
}

export default CustomGeometry;