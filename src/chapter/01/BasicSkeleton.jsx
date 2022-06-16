import { useEffect } from "react";
import { AxesHelper, BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SphereGeometry, WebGLRenderer } from "three";

function BasicSkeleton() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const model = document.querySelector("#model");

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, model.clientWidth / model.clientHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setClearColor(new Color(0x000000));
    renderer.setSize(model.clientWidth, model.clientHeight);
    const axes = new AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new PlaneGeometry(60, 20);
    const planeMaterial = new MeshBasicMaterial({
      color: 0xAAAAAA
    });

    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    const cubeGeometry = new BoxGeometry(4, 4, 4);
    const cubeMaterial = new MeshBasicMaterial({
      color: 0xFF0000,
      wireframe: true
    });
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    const sphereGeometry = new SphereGeometry(4, 20, 20);
    const sphereMaterial = new MeshBasicMaterial({
      color: 0x7777FF,
      wireframe: true,
    });
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.add(sphere);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    model.appendChild(renderer.domElement);
    renderer.render(scene, camera);
  }

  return (
    <div id="model"></div>
  )
}

export default BasicSkeleton;