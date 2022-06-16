import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { GUI } from "dat.gui";

function CustomGeometry() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    return new THREE.Scene();
  }

  const initCamera = (dom, scene) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(120, 60, 180);
    camera.lookAt(scene.position);
    return camera;
  }

  const initOrthographicCamera = (dom, scene) => {
    let camera = new THREE.OrthographicCamera(dom.clientWidth / -16, dom.clientWidth / 16, dom.clientHeight / 16, dom.clientHeight / -16, -200, 500);
    camera.position.set(120, 60, 180);
    camera.lookAt(scene.position);
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    return renderer;
  }

  const initAmbientLight = () => {
    return new THREE.AmbientLight(0x292929);
  }

  const initSpotLight = () => {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 10);
    spotLight.castShadow = true;
    return spotLight;
  }

  const initDirectionalLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-20.40, 60);
    return directionalLight;
  }

  const initPlaneGeometry = () => {
    const planeGeometry = new THREE.PlaneGeometry(180, 180);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    return plane;
  }

  const initControls = (camera, dom, scene) => {
    const controls = new function () {
      this.perspective = "Perspective";
      this.switchCamera = () => {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera = initOrthographicCamera(dom, scene);
          this.perspective = "Orthographic";
        } else {
          camera = initCamera(dom, scene);
          this.perspective = "Perspective";
        }
      }
    }
    return controls;
  }

  const initCube = (scene, planeGeometry) => {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ee22 });
    for (let j = 0; j < (planeGeometry.parameters.height / 5); j++) {
      for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5);
        cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + (i * 5);
        cube.position.y = 2;

        scene.add(cube);
      }
    }
  }

  const initLookAt = (scene) => {
    const lookAtGeom = new THREE.SphereGeometry(2);
    const lookAtMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const lookAtMesh = new THREE.Mesh(lookAtGeom, lookAtMaterial);
    return lookAtMesh;
  }

  const initGui = (controls) => {
    const gui = new GUI();
    gui.add(controls, "switchCamera");
    gui.add(controls, "perspective").listen();
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
    scene.add(initAmbientLight());
    scene.add(initDirectionalLight());

    initCube(scene, plane.geometry);
    const lookAtMesh = initLookAt(scene);
    scene.add(lookAtMesh);

    const controls = new function () {
      this.perspective = "Perspective";
      this.switchCamera = () => {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera = initOrthographicCamera(model, scene);
          this.perspective = "Orthographic";
        } else {
          camera = initCamera(model, scene);
          this.perspective = "Perspective";
        }
      }
    }

    initGui(controls);

    let step = 0;
    const render = () => {
      stats.update();
      step += 0.02;
      if (camera instanceof THREE.Camera) {
        let x = 10 + (100 * (Math.sin(step)));
        camera.lookAt(new THREE.Vector3(x, 10, 0));
        lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0));
      }
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