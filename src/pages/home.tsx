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
        <ThreeGLTF3DModel
          width={window.innerHeight * 0.8}
          height={window.innerHeight * 0.8}
          modelPath={getModelPath('dwaya.glb')}
          whiteLightIntensity={200}
          yellowLightIntensity={800}
          zoom={10}
          onModelLoaded={(model) => {
            // يمكن إضافة أي تفاعلات أو تأثيرات بعد تحميل النموذج هنا
            model.parent.position.set(0, -1, 0.5); // ضبط موضع النموذج
          }}
        />

        <div>
          <p className='header'>أنواع القفطان المغربي عبر العصور</p>
          <p className='description'>
            سنأخذكم في رحلة عبر الزمن لاستكشاف جميع أنواع القفاطين المغربية، من
            أقدم التصاميم التقليدية إلى أحدث الابتكارات العصرية.
            <br />
            اكتشفوا كيف تطور القفطان المغربي ليحافظ على أصالته ويواكب الحداثة في
            آن واحد.
          </p>
          <p className='description'>
            من القفطان التقليدي إلى القفطان العصري، كل نوع يحمل قصة وتاريخًا
            فريدًا. انضموا إلينا في هذه الرحلة الثقافية لاكتشاف جمال وأناقة
            القفطان المغربي.
          </p>
          <div className='story-cards'>
            {/* هنا يمكن إضافة بطاقات القفاطين */}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href='/showroom' className='btn showroom-btn'>
              اكتشف صالة العرض
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
