import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";
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
    camera.near = 7;
    camera.far = 139;
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.sortObjects = false;
    renderer.setClearColor(new THREE.Color(0x0000));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }

  const initGround = () => {
    const plane = new THREE.PlaneGeometry(100, 100, 4, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0x777777 });
    const mesh = new THREE.Mesh(plane, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -20;
    return mesh;
  }


  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();
    const scene = initScece();
    let camera = initCamera(model, scene);
    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    const ground = initGround();
    scene.add(ground);

    const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


    const meshMaterial = new THREE.MeshNormalMaterial();
    let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    let cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    let plane = new THREE.Mesh(planeGeometry, meshMaterial);

    // position the sphere
    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;

    // for (let f = 0, fl = sphere.geometry.; f < fl; f++) {
    //   const face = sphere.geometry.faces[f];
    //   const centroid = new THREE.Vector3(0, 0, 0);
    //   centroid.add(sphere.geometry.vertices[face.a]);
    //   centroid.add(sphere.geometry.vertices[face.b]);
    //   centroid.add(sphere.geometry.vertices[face.c]);
    //   centroid.divideScalar(3);

    //   const arrow = new THREE.ArrowHelper(
    //     face.normal,
    //     centroid,
    //     2,
    //     0x3333FF,
    //     0.5,
    //     0.5);
    //   sphere.add(arrow);
    // }
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    let step = 0;
    let oldContext = null;
    const controls = new function () {
      this.rotationSpeed = 0.02;
      this.bouncingSpeed = 0.03;

      this.opacity = meshMaterial.opacity;
      this.transparent = meshMaterial.transparent;

      this.visible = meshMaterial.visible;
      this.side = "front";

      this.wireframe = meshMaterial.wireframe;
      this.wireframeLinewidth = meshMaterial.wireframeLinewidth;

      this.selectedMesh = "cube";

      this.shadow = "flat";
    }

    const gui = new GUI();
    const spGui = gui.addFolder("Mesh");
    spGui.add(controls, 'opacity', 0, 1).onChange(function (e) {
      meshMaterial.opacity = e
    });
    spGui.add(controls, 'transparent').onChange(function (e) {
      meshMaterial.transparent = e
    });
    spGui.add(controls, 'wireframe').onChange(function (e) {
      meshMaterial.wireframe = e
    });
    spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(function (e) {
      meshMaterial.wireframeLinewidth = e
    });
    spGui.add(controls, 'visible').onChange(function (e) {
      meshMaterial.visible = e
    });
    spGui.add(controls, 'side', ["front", "back", "double"]).onChange(function (e) {
      console.log(e);
      switch (e) {
        case "front":
          meshMaterial.side = THREE.FrontSide;
          break;
        case "back":
          meshMaterial.side = THREE.BackSide;
          break;
        case "double":
          meshMaterial.side = THREE.DoubleSide;
          break;
      }
      meshMaterial.needsUpdate = true;

    });
    spGui.add(controls, 'shadow', ["flat", "smooth"]).onChange(function (e) {
      switch (e) {
        case "flat":
          // https://github.com/mrdoob/three.js/issues/1929
          meshMaterial.shading = THREE.FlatShading;
          break;
        case "smooth":
          meshMaterial.shading = THREE.SmoothShading;
          break;
      }

      var oldPos = sphere.position.clone();
      scene.remove(sphere);
      scene.remove(plane);
      scene.remove(cube);
      sphere = new THREE.Mesh(sphere.geometry.clone(), meshMaterial);
      cube = new THREE.Mesh(cube.geometry.clone(), meshMaterial);
      plane = new THREE.Mesh(plane.geometry.clone(), meshMaterial);

      sphere.position = oldPos;
      cube.position = oldPos;
      plane.position = oldPos;

      switch (controls.selectedMesh) {
        case "cube":
          scene.add(cube);

          break;
        case "sphere":
          scene.add(sphere);

          break;
        case "plane":
          scene.add(plane);
          break;

      }

      meshMaterial.needsUpdate = true;
      console.log(meshMaterial);
    });

    spGui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function (e) {

      scene.remove(plane);
      scene.remove(cube);
      scene.remove(sphere);


      switch (e) {
        case "cube":
          scene.add(cube);

          break;
        case "sphere":
          scene.add(sphere);

          break;
        case "plane":
          scene.add(plane);
          break;

      }

      scene.add(e);
    });

    const render = () => {
      stats.update();

      cube.rotation.y = step += 0.01;
      plane.rotation.y = step;
      sphere.rotation.y = step;

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