import { useEffect, useState } from 'react';
import { CaftanType, getCaftans } from '../api/api';

export function CaftansPage() {
  const [caftans, setCaftans] = useState<CaftanType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  async function loadCaftans(page: number) {
    setLoading(true);
    try {
      const response = await getCaftans(page);
      if (Array.isArray(response)) {
        setCaftans(response);
        setHasMore(response.length > 0);
      } else {
        setCaftans(response.caftans || []);
        setTotalPages(response.totalPages || 0);
        setHasMore(page < response.totalPages - 1);
      }
    } catch (error) {
      console.error('Error loading caftans:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadCaftans(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationNumbers = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }

    return pages;
  };

  if (loading && caftans.length === 0) {
    return <div className='loading'>Loading caftans...</div>;
  }

  return (
    <div className='caftans-page'>
      {caftans.map((caftan, index) => (
        <section
          className='caftan-section'
          key={`${caftan.compition_name}-${index}`}
        >
          <div className='caftan-image-container'>
            <img
              src={caftan.image_url || '/placeholder.svg'}
              alt={caftan.compition_name}
              className='caftan-image'
            />
            {caftan.isWinner && (
              <div className='winner-badge'>
                <span>🏆 Winner</span>
              </div>
            )}
          </div>

          <div className='caftan-content'>
            <h2 className='caftan-title'>{caftan.title}</h2>
            <h3 className='caftan-competition'>{caftan.compition_name}</h3>
            <p className='caftan-description'>{caftan.description}</p>
            <div className='caftan-designer'>
              <span className='designer-label'>Designer:</span>
              <span className='designer-name'>{caftan.designer_name}</span>
            </div>
          </div>
        </section>
      ))}

      {/* Pagination Controls */}
      {(totalPages > 1 || hasMore) && (
        <div className='pagination-container'>
          <button
            className='pagination-btn'
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Previous
          </button>

          <div className='pagination-numbers'>{renderPaginationNumbers()}</div>

          <button
            className='pagination-btn'
            onClick={handleNextPage}
            disabled={!hasMore}
          >
            Next
          </button>
        </div>
      )}

      {loading && (
        <div className='loading-overlay'>
          <div className='loading-spinner'>Loading...</div>
        </div>
      )}
    </div>
  );
}
