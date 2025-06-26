import { ThreeGLTF3DModel } from '../components/model-scene';

export function HomePage() {
  function getModelPath(modelName: string): string {
    return 'src/assets/models/' + modelName;
  }
  return (
    <div className='landing'>
      <ThreeGLTF3DModel
        width={window.innerHeight}
        height={window.innerHeight}
        modelPath={getModelPath('ziyana.glb')}
        whiteLightIntensity={200}
        yellowLightIntensity={800}
        zoom={1.8}
      />
      <div className='ambient-light'></div>
      <img src='' />
    </div>
  );
}
