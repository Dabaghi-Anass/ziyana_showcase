import { useEffect, useState } from 'react';

/*
  {
    "caftan_name": "المنصورية",
    "caftan_period": "العهد السعدي - القرن 16",
    "city_of_caftan": "فاس",
    "description": "لباس مكون من قطعتين من القفطان: السفلية (الدفينة) من ثوب سميك والفوقية من ثوب شفاف. نسبة إلى السلطان المنصور الذهبي",
    "extra_image": "المنصورية.jpg"
  }*/
type MoroccanCaftanType = {
  image_url?: string;
  caftanName?: string;
  caftanPeriod?: string;
  cityOfCaftan?: string;
  description: string;
};
export function ShowRoom() {
  const [caftanTypes, setCaftanTypes] = useState<MoroccanCaftanType[]>([]);
  async function getData() {
    const res = await fetch('src/api/caftan-types.json');
    const data = await res.json();
    setCaftanTypes(data);
    console.log(data.map((i) => i.caftanName));
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <h1 className='page-header'>أنواع القفطان</h1>
      <div className='story-page'>
        {caftanTypes.map((story, index) => (
          <section key={index} className='story-section'>
            {index % 2 === 0 ? (
              <>
                <img
                  src={story.image_url}
                  alt={story.caftanName}
                  className='story-image fanous'
                />
                <div className='story-content'>
                  <div className='story-header'>
                    <h2 className='story-title'>{story.caftanName}</h2>
                  </div>
                  <div className='story-description-container'>
                    <p className='story-description'>{story.description}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='story-content'>
                  <div className='story-header'>
                    <h2 className='story-title'>{story.caftanName}</h2>
                  </div>
                  <div className='story-description-container'>
                    <p className='story-description'>{story.description}</p>
                  </div>
                </div>
                <img
                  src={story.image_url}
                  alt={story.caftanName}
                  className='story-image fanous'
                />
              </>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
