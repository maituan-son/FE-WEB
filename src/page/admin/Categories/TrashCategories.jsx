import { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from './TrashCategories.module.css';
import { 
  FiTrash2, 
  FiRotateCcw, 
  FiAlertTriangle, 
  FiCalendar, 
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiImage
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { deleteCategory, getCategories, restoreCategory } from "../../../api/categoris";

function TrashCategories() {
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');


  // Bạn sẽ implement các function này
  const fetchDeletedCategories = async () => {
    const res = await getCategories(`?trash=true`);
    setDeletedCategories(res.data.data);
    setLoading(false);
  };


  const handleRestore = async () => {
    try {
      await restoreCategory(selectedCategory._id);
      setDeletedCategories(deletedCategories.filter(cat => cat._id !== selectedCategory._id));
      setShowRestoreModal(false);
      toast.success("Khôi phục danh mục thành công!");
    } catch (error) {
      console.error('Error restoring category:', error);
      toast.error("Khôi phục danh mục thất bại. Vui lòng thử lại sau.");
    }
  };

  const handlePermanentDelete = async () => {
    try {
        await deleteCategory(selectedCategory._id);
        setDeletedCategories(deletedCategories.filter(cat => cat._id !== selectedCategory._id));
        setShowDeleteModal(false);
        toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Xóa danh mục thất bại. Vui lòng thử lại sau.");
        
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDeletedCategories();
  }, []);

  const formatDeletedDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysDeleted = (date) => {
    const deletedDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - deletedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredCategories = deletedCategories.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    
    const daysDeleted = getDaysDeleted(category.deletedAt);
    if (filterBy === 'week') return matchesSearch && daysDeleted <= 7;
    if (filterBy === 'month') return matchesSearch && daysDeleted <= 30;
    
    return matchesSearch;
  });

  if (loading && deletedCategories.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải thùng rác...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <div className={styles.headerTop}>
            <Link to="/admin/categories" className={styles.backButton}>
              <FiArrowLeft />
              Quay lại danh sách
            </Link>
          </div>
          
          <div className={styles.titleSection}>
            <div className={styles.titleWithIcon}>
              <FiTrash2 className={styles.trashIcon} />
              <div>
                <h2 className={styles.pageTitle}>Thùng rác danh mục</h2>
                <p className={styles.pageSubtitle}>
                  Quản lý các danh mục đã xóa ({deletedCategories.length} mục)
                </p>
              </div>
            </div>
          </div>

          <div className={styles.controlsSection}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục đã xóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterBox}>
              <FiFilter className={styles.filterIcon} />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Tất cả</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className={styles.emptyState}>
            <FiTrash2 size={64} className={styles.emptyIcon} />
            <h3>Thùng rác trống</h3>
            <p>
              {searchTerm || filterBy !== 'all' 
                ? 'Không tìm thấy danh mục nào phù hợp với bộ lọc'
                : 'Chưa có danh mục nào trong thùng rác'
              }
            </p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Logo</th>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th>Ngày xóa</th>
                  <th>Đã xóa</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr key={category._id} className={styles.deletedRow}>
                    <td data-label="STT">{index + 1}</td>
                    <td data-label="Logo" className={styles.logoCell}>
                      {category.logoUrl ? (
                        <img 
                          src={category.logoUrl} 
                          alt={category.title}
                          className={styles.categoryLogo}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={styles.noLogo} style={{display: category.logoUrl ? 'none' : 'flex'}}>
                        <FiImage />
                      </div>
                    </td>
                    <td data-label="Tên danh mục" className={styles.titleCell}>
                      <span className={styles.categoryTitle}>{category.title}</span>
                      <span className={styles.deletedBadge}>Đã xóa</span>
                    </td>
                    <td data-label="Mô tả" className={styles.descriptionCell}>
                      <span className={styles.description} title={category.description}>
                        {category.description.length > 40 
                          ? `${category.description.substring(0, 40)}...` 
                          : category.description
                        }
                      </span>
                    </td>
                    <td data-label="Ngày xóa" className={styles.dateCell}>
                      <div className={styles.dateInfo}>
                        <FiCalendar className={styles.dateIcon} />
                        <span>{formatDeletedDate(category.deletedAt)}</span>
                      </div>
                    </td>
                    <td data-label="Đã xóa" className={styles.durationCell}>
                      <span className={`${styles.durationBadge} ${
                        getDaysDeleted(category.deletedAt) > 30 ? styles.warning : ''
                      }`}>
                        {getDaysDeleted(category.deletedAt)} ngày
                      </span>
                    </td>
                    <td data-label="Hành động" className={styles.actionCell}>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.restoreButton}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowRestoreModal(true);
                          }}
                          title="Khôi phục"
                        >
                          <FiRotateCcw />
                        </button>
                        <button 
                          className={styles.permanentDeleteButton}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowDeleteModal(true);
                          }}
                          title="Xóa vĩnh viễn"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Restore Modal */}
        <Modal show={showRestoreModal} onHide={() => setShowRestoreModal(false)} className={styles.customModal}>
          <Modal.Header closeButton className={styles.restoreModalHeader}>
            <Modal.Title className={styles.modalTitle}>
              <FiRotateCcw className={styles.modalIcon} />
              Khôi phục danh mục
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <div className={styles.confirmContent}>
              <div className={styles.categoryInfo}>
                {selectedCategory?.logoUrl && (
                  <img 
                    src={selectedCategory.logoUrl} 
                    alt={selectedCategory?.title}
                    className={styles.modalCategoryLogo}
                  />
                )}
                <div>
                  <h4>{selectedCategory?.title}</h4>
                  <p className={styles.modalDescription}>
                    {selectedCategory?.description}
                  </p>
                </div>
              </div>
              <p className={styles.confirmText}>
                Bạn có chắc chắn muốn khôi phục danh mục này? 
                Danh mục sẽ được hiển thị trở lại trong danh sách chính.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <button 
              type="button"
              className={`${styles.modalButton} ${styles.secondaryButton}`}
              onClick={() => setShowRestoreModal(false)}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="button"
              className={`${styles.modalButton} ${styles.restoreModalButton}`}
              onClick={handleRestore}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loadingText}>
                  <div className={styles.miniSpinner}></div>
                  Đang khôi phục...
                </span>
              ) : (
                <>
                  <FiRotateCcw />
                  Khôi phục
                </>
              )}
            </button>
          </Modal.Footer>
        </Modal>

        {/* Permanent Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className={styles.customModal}>
          <Modal.Header closeButton className={styles.deleteModalHeader}>
            <Modal.Title className={styles.modalTitle}>
              <FiAlertTriangle className={styles.modalIcon} />
              Xóa vĩnh viễn
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <div className={styles.confirmContent}>
              <div className={styles.warningBox}>
                <FiAlertTriangle size={48} className={styles.warningIcon} />
                <div>
                  <h4>Cảnh báo!</h4>
                  <p>Hành động này không thể hoàn tác.</p>
                </div>
              </div>
              
              <div className={styles.categoryInfo}>
                <h4>{selectedCategory?.title}</h4>
                <p className={styles.modalDescription}>
                  {selectedCategory?.description}
                </p>
              </div>
              
              <p className={styles.confirmText}>
                Bạn có chắc chắn muốn xóa vĩnh viễn danh mục này? 
                Tất cả dữ liệu liên quan sẽ bị mất hoàn toàn.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <button 
              type="button"
              className={`${styles.modalButton} ${styles.secondaryButton}`}
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="button"
              className={`${styles.modalButton} ${styles.dangerButton}`}
              onClick={handlePermanentDelete}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loadingText}>
                  <div className={styles.miniSpinner}></div>
                  Đang xóa...
                </span>
              ) : (
                <>
                  <FiTrash2 />
                  Xóa vĩnh viễn
                </>
              )}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default TrashCategories;