import { useEffect } from "react";
import { initCamera, initRenderer } from "../../utils";
import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import BaseScene from "../../utils/baseScene";
import * as TWEEN from "@tweenjs/tween.js";

function LoadObj() {

  useEffect(() => {
    init();
  }, []);

  const generateSprite = () => {
    let canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    let context = canvas.getContext("2d");

    let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  const init = () => {
    const model = document.querySelector("#model");
    let camera = initCamera(model, new THREE.Vector3(30, 30, 30));
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = initRenderer(model);
    let posSrc = { pos: 1 };
    let tween = new TWEEN.Tween(posSrc).to({ pos: 0 }, 2000);
    tween.easing(TWEEN.Easing.Bounce.InOut);

    let tweenBack = new TWEEN.Tween(posSrc).to({ pos: 1 }, 2000);
    tweenBack.easing(TWEEN.Easing.Bounce.InOut);

    tweenBack.chain(tween);
    tween.chain(tweenBack);

    tween.start();

    let scene = new BaseScene(camera, renderer, false, (mesh) => {
      TWEEN.update();

      let positionArray = mesh.geometry.attributes["position"];
      let origPosition = mesh.geometry.origPosition;

      for (let i = 0; i < positionArray.count; i++) {
        var oldPosX = origPosition.getX(i);
        var oldPosY = origPosition.getY(i);
        var oldPosZ = origPosition.getZ(i);
        positionArray.setX(i, oldPosX * posSrc.pos);
        positionArray.setY(i, oldPosY * posSrc.pos);
        positionArray.setZ(i, oldPosZ * posSrc.pos);
      }
      positionArray.needsUpdate = true;
    });

    let loader = new PLYLoader();
    loader.load("/src/assets/models/carcloud/carcloud.ply", (geometry) => {
      let mat = new THREE.PointsMaterial({
        color: 0xffffff,
        side: 1,
        opacity: 0.6,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: generateSprite()
      });

      let origPosition = geometry.attributes['position'].clone()
      geometry.origPosition = origPosition

      let group = new THREE.Points(geometry, mat);
      group.scale.set(2.5, 2.5, 2.5);

      scene.render(group, camera);
    });
  }

  return (
    <div id="model"></div>
  )
}

export default LoadObj;