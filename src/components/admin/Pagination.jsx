import styles from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`${styles.pagination} ${disabled ? styles.disabled : ""}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || disabled}
        className={styles.pageButton}
      >
        ← Trang trước
      </button>

      <div className={styles.pageNumbers}>
        {getPageNumbers().map((page, index) => (
          <span key={index}>
            {page === "..." ? (
              <span className={styles.dots}>...</span>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                className={`${styles.pageNumber} ${
                  page === currentPage ? styles.active : ""
                }`}
              >
                {page}
              </button>
            )}
          </span>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
        className={styles.pageButton}
      >
        Trang sau →
      </button>

      <div className={styles.pageInfo}>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
