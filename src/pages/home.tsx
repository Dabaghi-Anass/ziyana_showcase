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
            <br /> وكما يقول المثل <QuoteSvg />
            اللِّي ما عندو ماضي، ما عندو حاضر.
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
        <h2>أنواع القفطان المغربي عبر العصور</h2>
        <p>
          سنأخذكم في رحلة عبر الزمن لاستكشاف جميع أنواع القفاطين المغربية، من
          أقدم التصاميم التقليدية إلى أحدث الابتكارات العصرية.
          <br />
          اكتشفوا كيف تطور القفطان المغربي ليحافظ على أصالته ويواكب الحداثة في
          آن واحد.
        </p>
        <div className='story-cards'>
          {/* هنا يمكن إضافة بطاقات القفاطين */}
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href='/showroom' className='btn showroom-btn'>
            اكتشف صالة العرض
          </a>
        </div>
      </section>
    </main>
  );
}
