import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  }

  useEffect(() => {
    getData();
  }, []);

  function getCaftanHash(name?: string) {
    if (!name) return '';
    return encodeURIComponent(name.replace(/\s+/g, ''));
  }

  return (
    <>
      <h1 className='page-header'>أنواع القفطان</h1>
      <div className='story-page'>
        {caftanTypes.map((caftan, index) => (
          <section key={index} className='story-section'>
            {index % 2 === 0 ? (
              <>
                <img
                  src={caftan.image_url || '/placeholder.svg'}
                  alt={caftan.caftanName}
                  className='story-image fanous'
                />
                <div className='story-content'>
                  <div className='story-header'>
                    <h2 className='story-title'>{caftan.caftanName}</h2>
                  </div>
                  <div className='story-description-container'>
                    <p className='story-description'>{caftan.description}</p>
                  </div>
                  <div className='caftan-meta'>
                    {caftan.caftanPeriod && (
                      <div className='caftan-period'>
                        <span className='meta-label'>الفترة</span>
                        <span className='meta-value'>
                          {caftan.caftanPeriod}
                        </span>
                      </div>
                    )}
                    {caftan.cityOfCaftan && (
                      <div className='caftan-city'>
                        <span className='meta-label'>المدينة</span>
                        <span className='meta-value'>
                          {caftan.cityOfCaftan}
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/caftans#${getCaftanHash(caftan.caftanName)}`}
                    className='btn'
                  >
                    المزيد من الصور
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className='story-content'>
                  <div className='story-header'>
                    <h2 className='story-title'>{caftan.caftanName}</h2>
                  </div>
                  <div className='story-description-container'>
                    <p className='story-description'>{caftan.description}</p>
                  </div>
                  <div className='caftan-meta'>
                    {caftan.caftanPeriod && (
                      <div className='caftan-period'>
                        <span className='meta-label'>الفترة</span>
                        <span className='meta-value'>
                          {caftan.caftanPeriod}
                        </span>
                      </div>
                    )}
                    {caftan.cityOfCaftan && (
                      <div className='caftan-city'>
                        <span className='meta-label'>المدينة</span>
                        <span className='meta-value'>
                          {caftan.cityOfCaftan}
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/caftans#${getCaftanHash(caftan.caftanName)}`}
                    className='btn'
                  >
                    المزيد من الصور
                  </Link>
                </div>

                <img
                  src={caftan.image_url || '/placeholder.svg'}
                  alt={caftan.caftanName}
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
