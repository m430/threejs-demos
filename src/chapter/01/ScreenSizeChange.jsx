import { useEffect } from "react";
import { initStats, initTrackballControls } from "../../utils";
import * as THREE from "three";
import { GUI } from "dat.gui";

function ScreenSizeChange() {

  let scene;
  let camera;
  let renderer;

  useEffect(() => {
    init();
    window.addEventListener("resize", onResize, false);
  }, []);

  const init = () => {
    const stats = initStats();
    const model = document.querySelector("#model");

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, model.clientWidth / model.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(model.clientWidth, model.clientHeight);
    model.appendChild(renderer.domElement);
    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    // 渲染阴影
    renderer.shadowMap.enabled = true;
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // 创建一个面
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xAAAAAA
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    // 创建一个立方体
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFF0000,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    // 创建一个球体
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777FF,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    // 创建一个灯光
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    const controls = new function () {
      this.rotationSpeed = 0.02;
      this.bouncingSpeed = 0.03;
    }

    const gui = new GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, "bouncingSpeed", 0, 0.5);

    let step = 0;
    const render = () => {
      stats.update();
      trackballControls.update(clock.getDelta());
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + 10 * (Math.cos(step));
      sphere.position.y = 2 + 10 * (Math.sin(step));
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    render();
  }

  const onResize = (e) => {
    e.preventDefault();
    camera.aspect = model.clientWidth / model.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(model.clientWidth, model.clientHeight);
  }

  return (
    <div id="model"></div>
  )
}

export default ScreenSizeChange;