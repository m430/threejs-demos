import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";

import { GUI } from "dat.gui";

function LoadSaveJsonObject() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    let scene = new THREE.Scene();
    return scene;
  }

  const initCamera = (dom) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(-30, 40, 50);
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    return renderer;
  }

  const initPlane = () => {
    const geom = new THREE.PlaneGeometry(60, 20, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let plane = new THREE.Mesh(geom, material);
    plane.position.set(15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    return plane;
  }

  const initCube = () => {
    const geom = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geom, material);

    cube.position.set(-4, 3, 0);
    return cube;
  }

  const initSphere = () => {
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    return sphere;
  }

  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();

    let scene = initScece();
    let camera = initCamera(model, scene);
    camera.lookAt(scene.position);

    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    const plane = initPlane();
    scene.add(plane);

    const cube = initCube();
    scene.add(cube);

    const sphere = initSphere();
    scene.add(sphere);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.PointLight(0xffffff);
    scene.add(spotLight);

    let step = 0;
    const controls = new function () {
      this.exportScene = function () {
        let json = scene.toJSON();
        localStorage.setItem("scene", JSON.stringify(json));
      };

      this.clearScene = () => {
        scene = new THREE.Scene();
      }

      this.importScene = () => {
        let jsonStr = localStorage.getItem("scene");
        let json = JSON.parse(jsonStr);
        const l = new THREE.ObjectLoader()
        let obj = l.parse(json);
        scene.add(obj);
      }
    }

    const gui = new GUI();
    gui.add(controls, "exportScene");
    gui.add(controls, "importScene");
    gui.add(controls, "clearScene");

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

export default LoadSaveJsonObject;