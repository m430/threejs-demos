import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { GUI } from "dat.gui";

function MeshDepthMaterial() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);
    return scene;
  }

  const initCamera = (dom) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 10, 130);
    camera.position.set(-50, 40, 50);
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0x0000));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }


  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();
    const scene = initScece();
    scene.overrideMaterial = new THREE.MeshDepthMaterial();
    let camera = initCamera(model, scene);
    camera.lookAt(scene.position);
    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    const controls = new function () {
      this.cameraNear = camera.near;
      this.cameraFar = camera.far;
      this.rotationSpeed = 0.02;
      this.numberOfObjects = scene.children.length;

      this.removeCube = function () {
        var allChildren = scene.children;
        var lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject);
          this.numberOfObjects = scene.children.length;
        }
      };

      this.addCube = function () {

        var cubeSize = Math.ceil(3 + (Math.random() * 3));
        var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube randomly in the scene
        cube.position.x = -60 + Math.round((Math.random() * 100));
        cube.position.y = Math.round((Math.random() * 10));
        cube.position.z = -100 + Math.round((Math.random() * 150));

        // add the cube to the scene
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
      };

      this.outputObjects = function () {
        console.log(scene.children);
      }
    }

    const gui = new GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'cameraNear', 0, 50).onChange(function (e) {
      camera.near = e;
    });
    gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
      camera.far = e;
    });

    let i = 0;
    while (i < 50) {
      controls.addCube();
      i++;
    }

    const render = () => {
      stats.update();

      scene.traverse((e) => {
        if (e instanceof THREE.Mesh) {
          e.rotation.x += controls.rotationSpeed;
          e.rotation.y += controls.rotationSpeed;
          e.rotation.z += controls.rotationSpeed;
        }
      })

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }

  return (
    <div id="model"></div>
  )
}

export default MeshDepthMaterial;