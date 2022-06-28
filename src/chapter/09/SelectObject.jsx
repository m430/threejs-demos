import { addGroundPlane, initCamera, initDefaultLight, initRenderer, initStats, initTrackballControls } from "@/utils";
import { GUI } from "dat.gui";
import { useEffect } from "react";
import * as THREE from "three";

function SelectObject() {

  useEffect(() => {
    init();
  }, [])

  const addCube = (scene) => {
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -10;
    cube.position.y = 4;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);
    return cube;
  }

  const addSphere = (scene) => {
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    // add the sphere to the scene
    scene.add(sphere);
    return sphere;
  }

  const addCylinder = (scene) => {
    let cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
    let cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x77ff77 });
    let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder.position.set(0, 0, 1);

    scene.add(cylinder);
    return cylinder;
  }

  const init = () => {
    let model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(-30, 40, 30));
    let renderer = initRenderer(model);

    let scene = new THREE.Scene();
    camera.lookAt(scene.position);

    let plane = addGroundPlane(scene);
    plane.position.y = 0;
    let cube = addCube(scene);
    let sphere = addSphere(scene);
    let cylinder = addCylinder(scene);

    let ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    initDefaultLight(scene);

    const controls = new function () {
      this.rotationSpeed = 0.02;
      this.bouncingSpeed = 0.03;
      this.scalingSpeed = 0.03;
      this.showRay = false;
    }

    let gui = new GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    gui.add(controls, 'scalingSpeed', 0, 0.5);
    gui.add(controls, 'showRay').onChange(function (e) {
      if (tube) scene.remove(tube)
    });

    let tube;
    let step = 0;
    let scalingStep = 0;
    let stats = initStats();

    const render = () => {
      stats.update();
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

      scalingStep += controls.scalingSpeed;
      let scaleX = Math.abs(Math.sin(scalingStep / 4));
      let scaleY = Math.abs(Math.cos(scalingStep / 5));
      let scaleZ = Math.abs(Math.sin(scalingStep / 7));
      cylinder.scale.set(scaleX, scaleY, scaleZ);

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    function onDocumentMouseDown(event) {

      let vector = new THREE.Vector3(((event.clientX - 300) / model.clientWidth) * 2 - 1, -(event.clientY / model.clientHeight) * 2 + 1, 0.5);
      vector = vector.unproject(camera);

      let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      let intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

      if (intersects.length > 0) {
        console.log(intersects[0]);
        intersects[0].object.material.transparent = true;
        intersects[0].object.material.opacity = 0.1;
      }
    }

    function onDocumentMouseMove(event) {
      if (controls.showRay) {
        let vector = new THREE.Vector3(((event.clientX - 300) / model.clientWidth) * 2 - 1, -(event.clientY / model.clientHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);

        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

        if (intersects.length > 0) {

          let points = [];
          points.push(new THREE.Vector3(-30, 39.8, 30));
          points.push(intersects[0].point);

          let mat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
          let tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.001);

          if (tube)
            scene.remove(tube);

          if (controls.showRay) {
            tube = new THREE.Mesh(tubeGeometry, mat);
            scene.add(tube);
          }
        }
      }
    }

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    render();
  }


  return (
    <div id="model"></div>
  )
}

export default SelectObject;