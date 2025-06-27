import React, { useState, useRef } from 'react';
import { sendChatMessage } from '../api/api';
const CAFTANS = [
  {
    name: 'netaa',
    index: 0,
    images: [
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fnetaa.jpg?alt=media&token=02308300-0b68-4b77-b625-36a921a24df3',
    ],
  },
  {
    name: 'khrib',
    index: 1,
    images: [
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fk1.jpg?alt=media&token=5301cba9-1fcf-4246-96fb-629f7a428b4d',
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fk2.jpg?alt=media&token=5301cba9-1fcf-4246-96fb-629f7a428b4d',
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fk3.jpg?alt=media&token=5301cba9-1fcf-4246-96fb-629f7a428b4d',
    ],
  },
  {
    name: 'bahja',
    index: 2,
    images: [
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fb1.jpg?alt=media&token=054f3bff-b466-40f9-948a-478dfa962f71',
    ],
  },
  {
    name: 'dnyajat',
    index: 3,
    images: [
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fc6.png?alt=media&token=cab6967d-af33-4d9f-907c-c5a39b5c6731',
    ],
  },
  {
    name: 'johra',
    index: 4,
    images: [
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fb1.jpg?alt=media&token=054f3bff-b466-40f9-948a-478dfa962f71',
    ],
  },
  {
    name: 'hnna',
    index: 5,
    images: [
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fc8.png?alt=media&token=947864da-a4b2-48d1-bc72-da963fd3b828',
    ],
  },
  {
    name: 'asemlal',
    index: 6,
    images: [
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fas1.jpeg?alt=media&token=0c1f7038-d053-4681-8f8e-6e1f20e7ce40',
      'https://firebasestorage.googleapis.com/v0/b/anass-dabaghi-portfolio.appspot.com/o/other_images%2Fas2.jpeg?alt=media&token=0c1f7038-d053-4681-8f8e-6e1f20e7ce40',
    ],
  },
];

const VoiceCaftanGenerator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [stylePreference, setStylePreference] = useState('');
  const [occasion, setOccasion] = useState('');
  const [caftanName, setCaftanName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [caftanImage, setCaftanImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);

  const startRecording = async () => {
    try {
      setError('');

      if (
        !('webkitSpeechRecognition' in window) &&
        !('SpeechRecognition' in window)
      ) {
        throw new Error('التعرف على الصوت غير مدعوم في هذا المتصفح');
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-MA';

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setError('خطأ في التعرف على الصوت: ' + event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError('حدث خطأ أثناء بدء التسجيل: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const generateCaftanName = async () => {
    if (!transcript || !favoriteColor || !stylePreference || !occasion) {
      setError('يرجى ملء جميع الحقول وتسجيل صوتك');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = (await sendChatMessage({
        message: JSON.stringify({
          userDescription: transcript,
          favoriteColor,
          stylePreference,
          occasion,
        }),
      })) as any;
      let [descption, index] = response.data.bot_response
        .split(',')
        .map((e) => e.trim());
      index = +index;
      const c = CAFTANS.find((c) => c.index === index);
      if (!c) {
        throw new Error('لم يتم العثور على القفطان المناسب');
      }

      const im = c.images[Math.floor(Math.random() * c.images.length)];
      setCaftanImage(im);
    } catch (err) {
      setError('خطأ في توليد اسم القفطان: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0',
            textDecoration: 'underline',
            textDecorationColor: 'gold',
            color: 'white',
          }}
        >
          قفطان على ذوقي
        </h1>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
          gap: '40px',
          alignItems: 'flex-start',
        }}
      >
        {/* Form Section */}
        <div
          style={{
            flex: '1',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Voice Recording Section */}
          <div style={{ marginBottom: '25px' }}>
            <h3
              style={{
                color: '#E6E6FA',
                marginBottom: '15px',
                fontSize: '20px',
              }}
            >
              سجل صوتك
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '15px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={startRecording}
                disabled={isRecording}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isRecording
                    ? 'rgba(204, 204, 204, 0.5)'
                    : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: isRecording ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                }}
              >
                {isRecording ? '...يتم التسجيل' : 'بدء التسجيل'}
              </button>

              <button
                onClick={stopRecording}
                disabled={!isRecording}
                style={{
                  padding: '12px 24px',
                  backgroundColor: !isRecording
                    ? 'rgba(204, 204, 204, 0.5)'
                    : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: !isRecording ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                }}
              >
                إيقاف التسجيل
              </button>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder='سيظهر نص صوتك هنا...'
              style={{
                width: '100%',
                height: '100px',
                padding: '15px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '10px',
                fontSize: '16px',
                resize: 'vertical',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                backdropFilter: 'blur(5px)',
              }}
            />
          </div>

          {/* Form Fields */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#E6E6FA',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              اللون المفضل:
            </label>
            <select
              value={favoriteColor}
              onChange={(e) => setFavoriteColor(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                backdropFilter: 'blur(5px)',
              }}
            >
              <option
                value=''
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                اختر لوناً
              </option>
              <option
                value='red'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                أحمر
              </option>
              <option
                value='blue'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                أزرق
              </option>
              <option
                value='green'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                أخضر
              </option>
              <option
                value='purple'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                أرجواني
              </option>
              <option
                value='yellow'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                أصفر
              </option>
              <option
                value='pink'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                وردي
              </option>
              <option
                value='black'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                أسود
              </option>
              <option
                value='white'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                أبيض
              </option>
              <option
                value='orange'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                برتقالي
              </option>
              <option
                value='brown'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                بني
              </option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#E6E6FA',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              النمط المفضل:
            </label>
            <select
              value={stylePreference}
              onChange={(e) => setStylePreference(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                backdropFilter: 'blur(5px)',
              }}
            >
              <option
                value=''
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                اختر نمطاً
              </option>
              <option
                value='elegant'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                راقي
              </option>
              <option
                value='casual'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                عملي
              </option>
              <option
                value='formal'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                رسمي
              </option>
              <option
                value='traditional'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                تقليدي
              </option>
              <option
                value='modern'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                عصري
              </option>
            </select>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#E6E6FA',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              المناسبة:
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                backdropFilter: 'blur(5px)',
              }}
            >
              <option
                value=''
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                اختر مناسبة
              </option>
              <option
                value='wedding'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                زفاف
              </option>
              <option
                value='party'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                حفلة
              </option>
              <option
                value='casual'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                لباس يومي
              </option>
              <option
                value='ceremony'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                مراسم
              </option>
              <option
                value='festival'
                style={{ backgroundColor: '#1a0033', color: '#ffffff' }}
              >
                مهرجان
              </option>
            </select>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                color: '#ff6b6b',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 107, 107, 0.5)',
                backdropFilter: 'blur(5px)',
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={generateCaftanName}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: isLoading
                ? 'rgba(204, 204, 204, 0.5)'
                : 'linear-gradient(45deg, #FFD700, #FFA500)',
              background: isLoading
                ? 'rgba(204, 204, 204, 0.5)'
                : 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: isLoading ? '#ffffff' : '#1a0033',
              border: 'none',
              borderRadius: '25px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            {isLoading ? '...يتم التوليد' : 'توليد اسم القفطان'}
          </button>

          {caftanName && (
            <div
              style={{
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '2px solid rgba(76, 175, 80, 0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h2
                style={{
                  color: '#4CAF50',
                  marginBottom: '15px',
                  fontSize: '24px',
                }}
              >
                اسم القفطان الخاص بك:
              </h2>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  margin: '0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {caftanName}
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            flex: '0 0 400px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              color: '#FFD700',
              marginBottom: '20px',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            معاينة القفطان
          </h3>

          <div
            style={{
              width: '100%',
              height: '400px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '3px dashed rgba(255, 215, 0, 0.5)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {caftanImage ? (
              <img
                src={caftanImage}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <>
                {' '}
                <div
                  style={{
                    fontSize: '72px',
                    marginBottom: '20px',
                    opacity: '0.6',
                  }}
                >
                  👘
                </div>
                <p
                  style={{
                    color: '#E6E6FA',
                    fontSize: '18px',
                    margin: '0',
                    textAlign: 'center',
                    lineHeight: '1.4',
                  }}
                >
                  سيتم عرض تصميم القفطان المخصص هنا
                </p>
                <p
                  style={{
                    color: '#FFD700',
                    fontSize: '14px',
                    marginTop: '10px',
                    opacity: '0.8',
                  }}
                >
                  بناءً على اختياراتك وتسجيلك الصوتي
                </p>
              </>
            )}
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <p
              style={{
                color: '#E6E6FA',
                fontSize: '14px',
                margin: '0',
                lineHeight: '1.4',
              }}
            >
              يتم إنشاء التصميم تلقائياً باستخدام الذكاء الاصطناعي بناءً على
              تفضيلاتك ووصفك الصوتي
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCaftanGenerator;
