import * as THREE from "three";
import { initStats, initTrackballControls } from "./index";


function BaseScene(providedCamera, renderer, updateMesh) {
  self = this;

  this.scene = new THREE.Scene();
  this.stats = initStats();
  this.clock = new THREE.Clock();
  this.camera = providedCamera;
  this.updateMesh = updateMesh;
  this.renderer = renderer;

  this.trackballControls = initTrackballControls(this.camera, this.renderer);

  this.render = (mesh, camera) => {
    console.log("this---", this);
    console.log("mesh---", mesh);
    this.scene.add(mesh);
    this.camera = camera;
    this.mesh = mesh;
    this._render();
  }

  this._render = function() {
    self.stats.update();
    requestAnimationFrame(self._render);
    self.trackballControls.update(self.clock.getDelta());

    if (updateMesh) {
      self.mesh.rotation.z += 0.01;
    }

    self.renderer.render(self.scene, self.camera);
  }
}

export default BaseScene;