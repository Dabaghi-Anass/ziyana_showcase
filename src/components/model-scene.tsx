import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { v4 as uuidv4 } from 'uuid';
type Props = {
  width?: number;
  height?: number;
  modelPath?: string;
  enableControls?: boolean;
  zoom?: number;
};
export function ThreeGLTF3DModel({
  width,
  height,
  modelPath,
  enableControls = true,
  zoom = 1.0,
}: Props) {
  const { current: canvasWidth } = useRef(
    width ? width : window.innerWidth * 0.6
  );
  const { current: canvasHeight } = useRef(
    height ? height : window.innerHeight * 0.6
  );
  const { current: uniqueId } = useRef(uuidv4());
  const controlsRef = useRef<typeof OrbitControls>(null);
  useEffect(() => {
    const canvas = document.getElementById(uniqueId) as HTMLCanvasElement;

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
    let controls: typeof OrbitControls | undefined = undefined;
    if (enableControls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      controls.enableDamping = enableControls;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
      controls.enableZoom = false;
    }

    camera.zoom = zoom;
    camera.position.set(5, 2, 2);
    camera.updateProjectionMatrix();

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf: any) => {
        scene.add(gltf.scene);
        gltf.scene.traverse((child: any) => {
          console.log(`Child name: ${child.name}, Type: ${child.type}`);
          if (child.name === 'Scene' && controls) {
            child.position.set(0, -0.5, 0);
          }
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

    const animate = function () {
      requestAnimationFrame(animate);
      if (controls) {
        controls.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      if (controls) {
        controls.dispose();
      }
    };
  }, []);
  return (
    <canvas
      id={uniqueId}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        border: '1px solid red',
      }}
    ></canvas>
  );
}
