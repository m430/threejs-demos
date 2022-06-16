import Stats from "stats.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

export const initStats = (type) => {
  const panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
  const stats = new Stats();
  stats.showPanel(panelType);
  stats.dom.classList.add("globalStats");
  document.body.appendChild(stats.dom);
  return stats;
}

export const initTrackballControls = (camera, renderer) => {
  const trackballControls = new TrackballControls(camera, renderer.domElement);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.0;
  trackballControls.panSpeed = 1.0;
  trackballControls.staticMoving = true;
  return trackballControls;
}