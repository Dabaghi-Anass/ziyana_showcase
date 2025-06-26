import { ThreeGLTF3DModel } from '../components/model-scene';
export function HomePage() {
  function getModelPath(modelName: string): string {
    return 'src/assets/models/' + modelName;
  }
  return (
    <div>
      <ThreeGLTF3DModel
        width={window.innerHeight * 0.6}
        height={window.innerHeight * 0.6}
        modelPath={getModelPath('blue_candle_on_moroccan_plate.glb')}
        whiteLightIntensity={500}
        yellowLightIntensity={1500}
        zoom={10}
        style={{
          border: '1px solid black',
        }}
        onModelLoaded={(model) => {
          model.parent?.position.set(0, 1, 0);
        }}
      />
      {/* <ThreeGLTF3DModel
        width={100}
        height={100}
        modelPath={getModelPath('berrad.glb')}
        enableControls={true}
        whiteLightIntensity={5000}
        yellowLightIntensity={500}
        zoom={10}
        onModelLoaded={(model) => {
          model.parent?.position.set(0, 0.3, 0);
        }}
      /> */}
    </div>
  );
}
