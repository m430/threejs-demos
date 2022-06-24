import Stats from "stats.js";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

export const initStats = (type) => {
  const panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
  const stats = new Stats();
  stats.showPanel(panelType);
  stats.dom.classList.add("globalStats");
  document.body.appendChild(stats.dom);
  return stats;
}

export const initTrackballControls = (camera, rrenderer) => {
  let trackballControls = new TrackballControls(camera, rrenderer.domElement);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.2;
  trackballControls.panSpeed = 0.8;
  trackballControls.noZoom = false;
  trackballControls.noPan = false;
  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;
  trackballControls.keys = [65, 83, 68];

  return trackballControls;
}

export const initCamera = (dom, initPosition) => {
  let position = (initPosition !== undefined) ? initPosition : new THREE.Vector3(-30, 40, 30);
  let camera = new THREE.PerspectiveCamera(45, dom.clientWidth/ dom.clientHeight, 0.1, 1000);
  camera.position.copy(position);
  camera.lookAt(new THREE.Vector3(0,0,0));
  return camera;
}

export const initRenderer = (dom, additionalaProperties) => {
  let props = (typeof additionalaProperties !== "undefined" && additionalaProperties) ? additionalaProperties : {};
  let renderer = new THREE.WebGL1Renderer(props);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(dom.clientWidth, dom.clientHeight);

  dom.appendChild(renderer.domElement);
  return renderer;
}

export const addGroundPlane = (scene) => {
  let geom = new THREE.PlaneGeometry(60, 20, 120, 120);
  let mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  let plane = new THREE.Mesh(geom, mat);
  plane.receiveShadow = true;

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);
  scene.add(plane);
  return plane;
}

export const initDefaultLight = (scene, initialPosition) => {
  var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-10, 30, 40);
  
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.copy(position);
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.fov = 15;
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.05;
  spotLight.name = "spotLight"

  scene.add(spotLight);

  var ambientLight = new THREE.AmbientLight(0x343434);
  ambientLight.name = "ambientLight";
  scene.add(ambientLight);
}