import * as THREE from "three";
import { initStats, initTrackballControls } from "./index";

function BaseScene(providedCamera, renderer, shouldAddLights, updateMesh) {
  self = this;

  this.scene = new THREE.Scene();
  this.stats = initStats();
  this.clock = new THREE.Clock();
  this.camera = providedCamera;
  this.updateMesh = updateMesh;
  this.renderer = renderer;
  this.withLights = (shouldAddLights !== undefined) ? shouldAddLights : true;

  this.trackballControls = initTrackballControls(this.camera, this.renderer);

  this.render = (mesh, camera) => {
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
      self.updateMesh(self.mesh);
    }

    self.renderer.render(self.scene, self.camera);
  }

  this._addLights = function () {
    let keyLight = new THREE.SpotLight(0xffffff);
    keyLight.position.set(0, 80, 80);
    keyLight.intensity = 2;
    keyLight.lookAt(new THREE.Vector3(0, 15, 0));
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.mapSize.width = 4096;
    this.scene.add(keyLight);

    let backlight1 = new THREE.SpotLight(0xaaaaaa);
    backlight1.position.set(150, 40, -20);
    backlight1.intensity = 0.5;
    backlight1.lookAt(new THREE.Vector3(0, 15, 0));
    this.scene.add(backlight1);

    let backlight2 = new THREE.SpotLight(0xaaaaaa);
    backlight2.position.set(-150, 40, -20);
    backlight2.intensity = 0.5;
    backlight2.lookAt(new THREE.Vector3(0, 15, 0));
    this.scene.add(backlight2);
  }

  if (this.withLights) this._addLights();
}

export default BaseScene;