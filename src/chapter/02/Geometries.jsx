import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";
function Geometries() {

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

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    camera.position.set(-50, 30, 20);
    camera.lookAt(new THREE.Vector3(-10, 0, 0));

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x090909);
    scene.add(ambientLight);

    addGeometry(scene);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 40, 50);
    spotLight.castShadow = true;
    scene.add(spotLight);


    const render = () => {
      stats.update();
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    model.appendChild(renderer.domElement);
    render();
  }

  const addGeometry = (scene) => {
    const geoms = [];

    geoms.push(new THREE.CylinderGeometry(1, 4, 4))

    geoms.push(new THREE.BoxGeometry(2, 2, 2));

    geoms.push(new THREE.SphereGeometry(2));

    geoms.push(new THREE.IcosahedronGeometry(4));

    const points = [
      new THREE.Vector3(2, 2, 2),
      new THREE.Vector3(2, 2, -2),
      new THREE.Vector3(-2, 2, -2),
      new THREE.Vector3(-2, 2, 2),
      new THREE.Vector3(2, 2, 2),
      new THREE.Vector3(2, -2, -2),
      new THREE.Vector3(-2, -2, -2),
      new THREE.Vector3(-2, -2, 2),
    ]
    geoms.push(new ConvexGeometry(points));

    var pts = [];//points array - the path profile points will be stored here
    var detail = .1;//half-circle detail - how many angle increments will be used to generate points
    var radius = 3;//radius for half_sphere
    for (var angle = 0.0; angle < Math.PI; angle += detail)//loop from 0.0 radians to PI (0 - 180 degrees)
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));//angle/radius to x,z
    geoms.push(new THREE.LatheGeometry(pts, 12));

    // create a OctahedronGeometry
    geoms.push(new THREE.OctahedronGeometry(3));

    // create a geometry based on a function
    geoms.push(new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));

    //
    geoms.push(new THREE.TetrahedronGeometry(3));

    geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

    geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

    var j = 0;
    for (var i = 0; i < geoms.length; i++) {
      var materials = [
        new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }),
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
      ];

      var mesh = createMultiMaterialObject(geoms[i], materials);
      mesh.traverse(function (e) {
        e.castShadow = true
      });

      //var mesh = new THREE.Mesh(geoms[i],materials[i]);
      //mesh.castShadow=true;
      mesh.position.x = -24 + ((i % 4) * 12);
      mesh.position.y = 4;
      mesh.position.z = -8 + (j * 12);

      if ((i + 1) % 4 == 0) j++;
      scene.add(mesh);
    }
  }

  return (
    <div id="model"></div>
  )
}

export default Geometries;