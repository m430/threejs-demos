import { useEffect } from "react";
import { initStats } from "../../utils";
import * as THREE from "three";
import { GUI } from "dat.gui";

function LoadSaveJsonObject() {

  useEffect(() => {
    init();
  }, []);

  const initScece = () => {
    const scene = new THREE.Scene();
    return scene;
  }

  const initCamera = (dom) => {
    let camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    camera.position.set(-30, 40, 50);
    camera.lookAt(new THREE.Vector3(-20, 0, 0));
    return camera;
  }

  const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
  }

  const createMesh = (geom) => {
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      wireframeLinewidth: 2,
      color: 0xaaaaaa,
    });
    material.side = THREE.DoubleSide;

    let mesh = new THREE.Mesh(geom, material);
    return mesh;
  }


  const init = () => {
    const model = document.querySelector("#model");
    const stats = initStats();

    const scene = initScece();
    let camera = initCamera(model, scene);

    const renderer = initRenderer(model);
    model.appendChild(renderer.domElement);

    let knotGeom = new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3);
    let knot = createMesh(knotGeom);
    scene.add(knot);

    let step = 0;
    let loadedMesh;
    const controls = new function () {
      console.log(knot.geometry.parameters);

      this.radius = knot.geometry.parameters.radius;
      this.tube = 0.3;
      this.radialSegments = knot.geometry.parameters.radialSegments;
      this.tubularSegments = knot.geometry.parameters.tubularSegments;
      this.p = knot.geometry.parameters.p;
      this.q = knot.geometry.parameters.q;

      this.redraw = () => {
        scene.remove(knot);
        knot = createMesh(new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q)));
        scene.add(knot);
      }

      this.save = () => {
        let result = knot.toJSON();
        localStorage.setItem("json", JSON.stringify(result));
      }

      this.load = () => {
        scene.remove(loadedMesh);
        const loader = new THREE.ObjectLoader();
        let json = localStorage.getItem("json");
        if (json) {
          let loadedGeom = JSON.parse(json);
          loadedMesh = loader.parse(loadedGeom);
          loadedMesh.position.x -= 50;
          scene.add(loadedMesh);
        }
      }
    }

    const gui = new GUI();
    var ioGui = gui.addFolder('Save & Load');
    ioGui.add(controls, 'save').onChange(controls.save);
    ioGui.add(controls, 'load').onChange(controls.load);
    var meshGui = gui.addFolder('mesh');
    meshGui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);

    const render = () => {
      stats.update();
      knot.rotation.y = step += 0.01;

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }

  return (
    <div id="model"></div>
  )
}

export default LoadSaveJsonObject;