import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { GUI } from "dat.gui";

function DirectionalLight() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    return new THREE.Scene();
  }

  const initCamera = (dom) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(-25, 30, 25);
    camera.lookAt(new THREE.Vector3(10, 0, 0));
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }

  const ambiColor = "#1c1c1c";
  const initAmbientLight = () => {
    return new THREE.AmbientLight(ambiColor);
  }

  const pointColor = "#ff5808";
  const initDirectionalLight = () => {
    const directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(-40, 60, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.intensity = 0.5;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width = 1024;
    return directionalLight;
  }

  const initPlaneGeometry = () => {
    const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, -5, 0);
    plane.receiveShadow = true;
    return plane;
  }

  const initCube = (scene) => {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);
    return cube;
  }

  const initSphere = (scene) => {
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 0, 2);
    sphere.castShadow = true;
    scene.add(sphere);
    return sphere;
  }

  const initSphereLight = (scene) => {
    const sphereLight = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
    const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.position.set(3, 20, 3);
    sphereLightMesh.castShadow = true;
    scene.add(sphereLightMesh);
    return sphereLightMesh;
  }

  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();
    const scene = initScece();
    let camera = initCamera(model, scene);
    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    const plane = initPlaneGeometry();
    scene.add(plane);
    const ambientLight = initAmbientLight();
    scene.add(ambientLight);
    const directionalLight = initDirectionalLight();
    const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(directionalLight);

    const cube = initCube(scene);
    const sphere = initSphere(scene);
    const sphereLight = initSphereLight(scene);

    let step = 0;
    let invert = 1;
    let phase = 0;
    const controls = new function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.pointColor = pointColor;
      this.intensity = 0.5;
      this.distance = 0;
      this.penumbra = 30;
      this.angle = 0.1;
      this.debug = false;
      this.castShadow = true;
      this.target = "Plane";
    }

    const gui = new GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls, 'pointColor').onChange(function (e) {
      directionalLight.color = new THREE.Color(e);
    });
    gui.add(controls, "intensity", 0, 3, 0.1).onChange((e) => {
      directionalLight.intensity = e;
    })
    gui.add(controls, 'debug').onChange(function (e) {
      if (e) {
        scene.add(helper);
      } else {
        scene.remove(helper);
      }
    });
    gui.add(controls, 'castShadow').onChange(function (e) {
      directionalLight.castShadow = e;
    });
    gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
      switch (e) {
        case "Plane":
          directionalLight.target = plane;
          break;
        case "Sphere":
          directionalLight.target = sphere;
          break;
        case "Cube":
          directionalLight.target = cube;
          break;
      }

    });

    const render = () => {
      stats.update();
      helper.update();
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

      sphereLight.position.z = -8;
      sphereLight.position.x = +(27 * (Math.sin(step / 3)));
      sphereLight.position.y = 10 + (26 * (Math.cos(step / 3)));

      directionalLight.position.copy(sphereLight.position);

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }

  return (
    <div id="model"></div>
  )
}

export default DirectionalLight;