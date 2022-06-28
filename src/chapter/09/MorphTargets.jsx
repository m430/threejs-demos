import { useEffect } from "react";
import { initCamera, initDefaultLight, initRenderer, initStats, initTrackballControls, setRandomColors } from "../../utils";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function MorphTargets() {

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let stats = initStats();
    const model = document.querySelector("#model");
    let camera = initCamera(model);
    camera.position.y = 300;

    const renderer = initRenderer(model);
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const light1 = new THREE.DirectionalLight(0xefefff, 1.5);
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffefef, 1.5);
    light2.position.set(- 1, - 1, - 1).normalize();
    scene.add(light2);

    let trackballControls = initTrackballControls(camera, renderer);

    let mesh, mixer;
    let prevTime = Date.now();
    let loader = new GLTFLoader();
    loader.load("/src/assets/models/gltf/Horse.glb", (gltf) => {
      mesh = gltf.scene.children[0];
      mesh.scale.set(1.5, 1.5, 1.5);
      scene.add(mesh);

      mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(1).play();
    });

    let clock = new THREE.Clock();
    const render = () => {
      stats.update();
      trackballControls.update(clock.getDelta());

      if (mixer) {
        const time = Date.now();
        mixer.update((time - prevTime) * 0.001);
        prevTime = time;
      }

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    render();
  }

  return (
    <div id="model"></div>
  )
}

export default MorphTargets;