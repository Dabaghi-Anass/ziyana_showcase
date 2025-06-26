import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
export function HomePage() {
  let h = window.innerHeight * 0.6;
  const { current: canvasWidth } = useRef(h);
  const { current: canvasHeight } = useRef(h);
  const controlsRef = useRef<typeof OrbitControls>(null);
  useEffect(() => {
    const canvas = document.getElementById(
      'three_d_scene'
    ) as HTMLCanvasElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvasWidth / canvasHeight,
      0.1,
      1000
    );

    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setSize(canvasWidth, canvasHeight);
    let controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.enableZoom = false;
    camera.zoom = 1.5;
    camera.position.set(5, 2, 2);
    camera.updateProjectionMatrix();

    // const ambientLight = new THREE.AmbientLight(0xff0000, 1);
    // ambientLight.name = 'AmbientLight';
    // ambientLight.position.set(2, 2, 3);
    // scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load(
      'src/assets/models/ziyana.glb',
      (gltf: any) => {
        scene.add(gltf.scene);
        gltf.scene.traverse((child: any) => {
          if (child.isLight && typeof child.intensity === 'number') {
            if (child.name === 'Light001') {
              child.intensity = 1500;
            } else {
              child.intensity = 300;
            }
            console.log(
              `Light found: ${child.name}, Intensity: ${child.intensity}`
            );
          }
        });
        camera.lookAt(new THREE.Vector3(0, 1, 0));
      },
      undefined,
      (error: any) => {
        console.error('An error happened loading the GLB model:', error);
      }
    );

    // camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  return (
    <div>
      {/* <h1>Home Page</h1>
      <p>Welcome to the home page!</p> */}

      <canvas
        id='three_d_scene'
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: '1px solid red',
        }}
      ></canvas>
    </div>
  );
}
