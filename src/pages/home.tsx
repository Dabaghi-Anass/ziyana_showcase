import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ThreeGLTF3DModel } from '../components/model-scene';
export function HomePage() {
  return (
    <div>
      <ThreeGLTF3DModel
        width={window.innerHeight * 0.6}
        height={window.innerHeight * 0.6}
        modelPath={'src/assets/models/ziyana.glb'}
        enableControls={true}
        zoom={1.8}
      />
    </div>
  );
}
