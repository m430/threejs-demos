import { GUI } from "dat.gui";
import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";

function BasicScene() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const stats = initStats();
    const model = document.querySelector("#model");
    const scene = new THREE.Scene();
    // 添加雾化
    // scene.fog = new THREE.Fog(0xffffff, 0.015, 100); // 线性增长
    scene.fog = new THREE.FogExp2(0xffffff, 0.01);
    const camera = new THREE.PerspectiveCamera(45, model.clientWidth / model.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(model.clientWidth, model.clientHeight);
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xAAAAAA
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);


    const controls = new function () {
      this.rotationSpeed = 0.02;
      this.numberOfObjects = scene.children.length;

      this.removeCube = () => {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject);
          this.numberOfObjects = scene.children.length;
        }
      }

      this.addCube = () => {
        const cubeSize = Math.ceil((Math.random() * 3));
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = "cube-" + scene.children.length;

        cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
        cube.position.y = Math.round((Math.random() * 5));
        cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

        scene.add(cube);
        this.numberOfObjects = scene.children.length;
      }

      this.outputObjects = () => {
        console.log(scene.children);
      }
    }

    const gui = new GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    const render = () => {
      stats.update();
      scene.traverse((e) => {
        if (e instanceof THREE.Mesh && e != plane) {
          e.rotation.x += controls.rotationSpeed;
          e.rotation.y += controls.rotationSpeed;
          e.rotation.z += controls.rotationSpeed;
        }
      })
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    model.appendChild(renderer.domElement);
    render();
  }

  return (
    <div id="model"></div>
  )
}

export default BasicScene;