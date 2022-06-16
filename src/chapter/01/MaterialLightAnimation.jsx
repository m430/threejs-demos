import { useEffect } from "react";
import { AxesHelper, BoxGeometry, Color, Mesh, MeshLambertMaterial, PerspectiveCamera, PlaneGeometry, Scene, SphereGeometry, SpotLight, Vector2, WebGLRenderer } from "three";
import { initStats } from "../../utils";

function MaterialLightAnimation() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const stats = initStats();
    const model = document.querySelector("#model");

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, model.clientWidth / model.clientHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setClearColor(new Color(0x000000));
    renderer.setSize(model.clientWidth, model.clientHeight);
    // 渲染阴影
    renderer.shadowMap.enabled = true;
    const axes = new AxesHelper(20);
    scene.add(axes);



    // 创建一个面
    const planeGeometry = new PlaneGeometry(60, 20);
    const planeMaterial = new MeshLambertMaterial({
      color: 0xAAAAAA
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    // 创建一个立方体
    const cubeGeometry = new BoxGeometry(4, 4, 4);
    const cubeMaterial = new MeshLambertMaterial({
      color: 0xFF0000,
    });
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    // 创建一个球体
    const sphereGeometry = new SphereGeometry(4, 20, 20);
    const sphereMaterial = new MeshLambertMaterial({
      color: 0x7777FF,
    });
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    // 创建一个灯光
    const spotLight = new SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    let step = 0;
    const render = () => {
      stats.update();
      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;
      cube.rotation.z += 0.02;

      step += 0.04;
      sphere.position.x = 20 + 10 * (Math.cos(step));
      sphere.position.y = 2 + 10 * (Math.sin(step));
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

export default MaterialLightAnimation;