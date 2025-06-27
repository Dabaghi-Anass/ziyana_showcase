import { useState, useEffect } from 'react';
import { getCaftans } from '../api/api';
import './caftans-page.css';
type Caftan = {
  _id: string;
  caftanName: string;
  caftanCategory: string;
  caftanDescription: string;
  caftanPublisherName: string;
  keyWords: string[];
  image_url?: string;
  publishedAt: string;
};

type CaftansResponse = {
  success: boolean;
  data: Caftan[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_prev: boolean;
    limit: number;
  };
  filters: {
    category: string | null;
    name: string | null;
    search: string | null;
  };
};

type GroupedCaftans = {
  [category: string]: Caftan[];
};

export function CaftansPage() {
  const [caftans, setCaftans] = useState<Caftan[]>([]);
  const [groupedCaftans, setGroupedCaftans] = useState<GroupedCaftans>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCaftans();
  }, []);

  const fetchCaftans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: CaftansResponse = (await getCaftans()) as CaftansResponse;

      if (response.success && response.data) {
        const caftansData = response.data;
        setCaftans(caftansData);

        // Group caftans by category
        const grouped = caftansData.reduce(
          (acc: GroupedCaftans, caftan: Caftan) => {
            const category = caftan.caftanCategory || 'غير مصنف';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(caftan);
            return acc;
          },
          {}
        );

        setGroupedCaftans(grouped);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching caftans:', err);
      setError('حدث خطأ في تحميل القفاطين');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className='caftans-page'>
        <div className='page-header'>
          <h1 className='page-title'>مجموعة القفاطين</h1>
          <p className='page-subtitle'>
            استكشف تشكيلتنا المتنوعة من القفاطين المغربية الأصيلة
          </p>
        </div>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p className='loading-text'>جاري تحميل القفاطين...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='caftans-page'>
        <div className='page-header'>
          <h1 className='page-title'>مجموعة القفاطين</h1>
        </div>
        <div className='error-container'>
          <div className='error-icon'>⚠️</div>
          <p className='error-message'>{error}</p>
          <button onClick={fetchCaftans} className='retry-btn'>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (Object.keys(groupedCaftans).length === 0) {
    return (
      <div className='caftans-page'>
        <div className='page-header'>
          <h1 className='page-title'>مجموعة القفاطين</h1>
        </div>
        <div className='empty-container'>
          <div className='empty-icon'>👗</div>
          <p className='empty-message'>لا توجد قفاطين متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className='caftans-page'>
      <div className='page-header'>
        <h1 className='page-title'>مجموعة القفاطين</h1>
        <p className='page-subtitle'>
          استكشف تشكيلتنا المتنوعة من القفاطين المغربية الأصيلة
        </p>
        <div className='stats-container'>
          <div className='stat-item'>
            <span className='stat-number'>{caftans.length}</span>
            <span className='stat-label'>قفطان</span>
          </div>
          <div className='stat-item'>
            <span className='stat-number'>
              {Object.keys(groupedCaftans).length}
            </span>
            <span className='stat-label'>فئة</span>
          </div>
        </div>
      </div>

      <div className='categories-container'>
        {Object.entries(groupedCaftans).map(([category, categoryItems]) => (
          <section key={category} className='category-section'>
            <div className='category-header'>
              <h2 className='category-title'>{category}</h2>
              <span className='category-count'>
                ({categoryItems.length} قفطان)
              </span>
            </div>

            <div className='caftans-grid'>
              {categoryItems.map((caftan, index) => (
                <div key={caftan._id} className='caftan-card'>
                  <div className='card-image-container'>
                    <img
                      src={
                        caftan.image_url.startsWith('http')
                          ? caftan.image_url
                          : `http://localhost:8080${caftan.image_url}`
                      }
                      alt={caftan.caftanName}
                      className='card-image'
                      loading='lazy'
                    />
                    <div className='image-overlay'>
                      <button className='view-btn'>عرض التفاصيل</button>
                    </div>
                  </div>

                  <div className='card-content'>
                    <div className='card-header'>
                      <h3 className='card-title'>{caftan.caftanName}</h3>
                      <span className='card-category'>
                        {caftan.caftanCategory}
                      </span>
                    </div>

                    <p className='card-description'>
                      {truncateText(caftan.caftanDescription, 120)}
                    </p>

                    <div className='card-meta'>
                      <div className='publisher-info'>
                        <span className='publisher-icon'>👤</span>
                        <span className='publisher-name'>
                          {caftan.caftanPublisherName}
                        </span>
                      </div>
                      {caftan.publishedAt && (
                        <div className='publish-date'>
                          <span className='date-icon'>📅</span>
                          <span className='date-text'>
                            {formatDate(caftan.publishedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {caftan.keyWords && caftan.keyWords.length > 0 && (
                      <div className='keywords-container'>
                        {caftan.keyWords
                          .slice(0, 3)
                          .map((keyword, keywordIndex) => (
                            <span key={keywordIndex} className='keyword-tag'>
                              {keyword}
                            </span>
                          ))}
                        {caftan.keyWords.length > 3 && (
                          <span className='more-keywords'>
                            +{caftan.keyWords.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
