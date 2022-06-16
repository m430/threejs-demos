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

  const initCamera = (dom) => {
    const camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(-20, 25, 20);
    camera.lookAt(new THREE.Vector3(5, 0, 0));
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }

  const initAmbientLight = () => {
    return new THREE.AmbientLight(0x0c0c0c);
  }

  const initSpotLight = () => {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 10);
    spotLight.castShadow = true;
    return spotLight;
  }

  const initPlaneGeometry = () => {
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    return plane;
  }

  const initControls = (cube) => {
    const controls = new function () {
      this.scaleX = 1;
      this.scaleY = 1;
      this.scaleZ = 1;

      this.positionX = 0;
      this.positionY = 4;
      this.positionZ = 0;

      this.rotationX = 0;
      this.rotationY = 0;
      this.rotationZ = 0;
      this.scale = 1;

      this.translateX = 0;
      this.translateY = 0;
      this.translateZ = 0;

      this.visible = true;

      this.translate = function () {

        cube.translateX(controls.translateX);
        cube.translateY(controls.translateY);
        cube.translateZ(controls.translateZ);

        controls.positionX = cube.position.x;
        controls.positionY = cube.position.y;
        controls.positionZ = cube.position.z;
      }
    }
    return controls;
  }

  const initCube = () => {
    const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
    const geom = new THREE.BoxGeometry(5, 8, 3);
    const cube = new THREE.Mesh(geom, material);
    cube.position.y = 4;
    cube.castShadow = true;
    return cube;
  }

  const initGui = (controls, cube, render) => {
    const gui = new GUI();

    const guiScale = gui.addFolder("scale");
    guiScale.add(controls, "scaleX", 0, 5);
    guiScale.add(controls, "scaleY", 0, 5);
    guiScale.add(controls, "scaleZ", 0, 5);

    const guiPosition = gui.addFolder("position");
    const contX = guiPosition.add(controls, 'positionX', -10, 10);
    const contY = guiPosition.add(controls, 'positionY', -4, 20);
    const contZ = guiPosition.add(controls, 'positionZ', -10, 10);

    contX.listen();
    contX.onChange((v) => {
      cube.position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange((v) => {
      cube.position.y = controls.positionY;
    });

    contZ.listen();
    contZ.onChange((v) => {
      cube.position.z = controls.positionZ;
    });

    const guiRotation = gui.addFolder("rotation");
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);

    const guiTranslate = gui.addFolder("translate");
    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', -10, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');

    gui.add(controls, "visible");

    render();
  }

  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();
    const scene = initScece();
    const camera = initCamera(model);
    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    const plane = initPlaneGeometry();
    scene.add(plane);
    scene.add(initAmbientLight());
    scene.add(initSpotLight());

    const cube = initCube();
    scene.add(cube);

    const render = () => {
      stats.update();
      cube.visible = controls.visible;
      cube.rotation.x = controls.rotationX;
      cube.rotation.y = controls.rotationY;
      cube.rotation.z = controls.rotationZ;
      cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    const controls = initControls(cube);
    initGui(controls, cube, render);

    render();
  }

  return (
    <div id="model"></div>
  )
}

export default CustomGeometry;