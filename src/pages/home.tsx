import { Link } from 'react-router';
import AppLogo from '../components/app-logo';
import { ThreeGLTF3DModel } from '../components/model-scene';
import { QuoteSvg } from '../components/quote';

export function HomePage() {
  function getModelPath(modelName: string): string {
    return 'src/assets/models/' + modelName;
  }
  return (
    <main>
      <div className='hero'>
        <div className='hero-text'>
          <AppLogo />
          <p>
            بالرفق نصون تراث القفطان المغربي
            <br /> فهو ليس مجرد لباس بل قصة حكاها الأجداد.
            <br /> وكما يقول المثل <br /> <QuoteSvg />
            اللِّي ما عندو ماضي، ما عندو حاضر
            <QuoteSvg isClosing />
          </p>
        </div>
        <ThreeGLTF3DModel
          width={window.innerHeight * 0.8}
          height={window.innerHeight * 0.8}
          modelPath={getModelPath('ziyana.glb')}
          whiteLightIntensity={200}
          yellowLightIntensity={800}
          zoom={1.8}
        />
        <div className='ambient-light'></div>
      </div>

      <section className='full stories'>
        <div>
          <p className='header'>أنواع القفطان المغربي عبر العصور</p>
          <p className='description'>
            سنأخذكم في رحلة عبر الزمن لاستكشاف جميع أنواع القفاطين المغربية، من
            أقدم التصاميم التقليدية إلى أحدث الابتكارات العصرية.
            <br /> <br />
            اكتشفوا كيف تطور القفطان المغربي ليحافظ على أصالته ويواكب الحداثة في
            آن واحد.
          </p>
          <p className='description'>
            من القفطان التقليدي إلى القفطان العصري، كل نوع يحمل قصة وتاريخًا
            فريدًا. <br /> <br /> انضموا إلينا في هذه الرحلة الثقافية لاكتشاف
            جمال وأناقة القفطان المغربي.
          </p>
          <div className='story-cards'>
            {/* هنا يمكن إضافة بطاقات القفاطين */}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to='/story' className='btn showroom-btn'>
              اكتشف قصة القفطان
            </Link>
          </div>
        </div>
        <ThreeGLTF3DModel
          width={window.innerHeight * 0.8}
          height={window.innerHeight * 0.8}
          modelPath={getModelPath('isence.glb')}
          whiteLightIntensity={10000}
          yellowLightIntensity={10000}
          zoom={1.5}
          onModelLoaded={(model) => {
            // model.parent.position.set(-1, -5, -1);
          }}
        />
      </section>
    </main>
  );
}
