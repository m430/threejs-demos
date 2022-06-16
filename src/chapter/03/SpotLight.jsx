import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { GUI } from "dat.gui";

function SpotLight() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    return new THREE.Scene();
  }

  const initCamera = (dom) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(-35, 30, 25);
    camera.lookAt(new THREE.Vector3(10, 0, 0));
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    return renderer;
  }

  const ambiColor = "#1c1c1c";
  const initAmbientLight = () => {
    return new THREE.AmbientLight(ambiColor);
  }

  const pointColor = "#ffffff";
  const initSpotLight = (plane) => {
    const spotLight = new THREE.SpotLight(pointColor);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 30;
    spotLight.target = plane;
    spotLight.distance = 0;
    spotLight.angle = 0.4;
    return spotLight;
  }

  const initDirectionalLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-20.40, 60);
    return directionalLight;
  }

  const initPlaneGeometry = () => {
    const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    return plane;
  }

  const initCube = (scene) => {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff7777 });
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
    sphereLightMesh.position.set(20, 0, 2);
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
    const spotLight = initSpotLight(plane);
    scene.add(spotLight);

    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 30, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);


    const cube = initCube(scene);
    const sphere = initSphere(scene);
    const sphereLight = initSphereLight(scene);

    let step = 0;
    let invert = 1;
    let phase = 0;
    let stopMovingLight = false;
    const controls = new function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.pointColor = pointColor;
      this.intensity = 1;
      this.distance = 0;
      this.penumbra = 30;
      this.angle = 0.1;
      this.debug = false;
      this.castShadow = true;
      this.target = "Plane";
      this.stopMovingLight = false;
    }

    const gui = new GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls, 'pointColor').onChange(function (e) {
      spotLight.color = new THREE.Color(e);
    });
    gui.add(controls, "angle", 0, Math.PI * 2).onChange((e) => {
      spotLight.angle = e;
    })
    gui.add(controls, "intensity", 0, 3, 0.1).onChange((e) => {
      spotLight.intensity = e;
    })
    gui.add(controls, 'distance', 0, 100).onChange(function (e) {
      spotLight.distance = e;
    });
    gui.add(controls, 'penumbra', 0, 100).onChange(function (e) {
      spotLight.penumbra = e;
    });
    gui.add(controls, 'debug').onChange(function (e) {
      spotLight.shadow.camera.visible = e;
    });
    gui.add(controls, 'castShadow').onChange(function (e) {
      spotLight.castShadow = e;
    });
    gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
      console.log(e);
      switch (e) {
        case "Plane":
          spotLight.target = plane;
          break;
        case "Sphere":
          spotLight.target = sphere;
          break;
        case "Cube":
          spotLight.target = cube;
          break;
      }
    });
    gui.add(controls, 'stopMovingLight').onChange(function (e) {
      stopMovingLight = e;
    });

    const render = () => {
      stats.update();
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

      if (!stopMovingLight) {
        if (phase > 2 * Math.PI) {
          invert = invert * -1;
          phase -= 2 * Math.PI;
        } else {
          phase += controls.rotationSpeed;
        }
        sphereLight.position.z = +(7 * (Math.sin(phase)));
        sphereLight.position.x = +(14 * (Math.cos(phase)));
        sphereLight.position.y = 10;

        if (invert < 0) {
          const pivot = 14;
          sphereLight.position.x = (invert * (sphereLight.position.x - pivot)) + pivot;
        }

        spotLight.position.copy(sphereLight.position);
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

export default SpotLight;