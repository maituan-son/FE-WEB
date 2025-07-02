import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createCategory, deleteCategory, getCategories, updateCategory , restoreCategory ,softDeleteCategory} from "../../../api/categoris";
import styles from './ListCategories.module.css';
import { FiEdit2, FiTrash2, FiImage, FiEye, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function ListCategories() {
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ 
    title: "", 
    logoUrl: "", 
    description: "", 
    slug: "" 
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories(``);
      console.log('Fetched categories:', res.data);
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleClose = () => {
    setShow(false);
    setForm({ title: "", logoUrl: "", description: "", slug: "" });
    setEditId(null);
  };

  const handleShow = (category = null) => {
    if (category) {
      setForm({
        title: category.title,
        logoUrl: category.logoUrl || "",
        description: category.description,
        slug: category.slug
      });
      setEditId(category._id);
    } else {
      setForm({ title: "", logoUrl: "", description: "", slug: "" });
      setEditId(null);
    }
    setShow(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setForm({ ...form, title, slug });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      
      if (editId) {
        await updateCategory(editId, form);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createCategory(form);
        toast.success("Thêm danh mục thành công!");
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa mềm: gọi API softDeleteCategory, backend sẽ set deletedAt: new Date()
  const handleSoftDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        setLoading(true);
        await softDeleteCategory(id); // API này nên đánh dấu deletedAt: new Date() ở backend
        toast.success("Xóa danh mục thành công!");
        fetchCategories();
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa!");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <h2 className={styles.pageTitle}>Quản lý danh mục</h2>
          <p className={styles.pageSubtitle}>Quản lý danh mục sản phẩm của cửa hàng</p>
        </div>

        <div className={styles.headerActions}>

          <button className={styles.addButton} onClick={() => handleShow()}>
            <FiPlus className={styles.buttonIcon} />
            Thêm danh mục mới
          </button>
           <Link to="/admin/categories/trash" className={styles.trashButton}>
            <FiTrash2 className={styles.buttonIcon} />
            Thùng rác
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className={styles.emptyState}>
            <FiImage size={64} className={styles.emptyIcon} />
            <h3>Chưa có danh mục nào</h3>
            <p>Hãy thêm danh mục đầu tiên của bạn</p>
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
                  <th>Slug</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id}>
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
                      ) : (
                        <div className={styles.noLogo}>
                          <FiImage />
                        </div>
                      )}
                      <div className={styles.noLogo} style={{display: category.logoUrl ? 'none' : 'flex'}}>
                        <FiImage />
                      </div>
                    </td>
                    <td data-label="Tên danh mục" className={styles.titleCell}>
                      <span className={styles.categoryTitle}>{category.title}</span>
                    </td>
                    <td data-label="Mô tả" className={styles.descriptionCell}>
                      <span className={styles.description} title={category.description}>
                        {category.description.length > 50 
                          ? `${category.description.substring(0, 50)}...` 
                          : category.description
                        }
                      </span>
                    </td>
                    <td data-label="Slug" className={styles.slugCell}>
                      <code className={styles.slug}>{category.slug}</code>
                    </td>
                    <td data-label="Hành động" className={styles.actionCell}>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.editButton}
                          onClick={() => handleShow(category)}
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleSoftDelete(category._id)}
                          title="Xóa"
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

        <Modal show={show} onHide={handleClose} className={styles.customModal} size="lg">
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              {editId ? "Cập nhật" : "Thêm mới"} danh mục
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Tên danh mục</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="Nhập tên danh mục..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Slug</label>
                  <input
                    type="text"
                    className={`${styles.formInput} ${styles.slugInput}`}
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="slug-tu-dong-tao"
                    required
                    readOnly
                  />
                  <small className={styles.helpText}>
                    Slug được tạo tự động từ tên danh mục
                  </small>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>URL Logo</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
                {form.logoUrl && (
                  <div className={styles.imagePreview}>
                    <img 
                      src={form.logoUrl} 
                      alt="Preview" 
                      className={styles.previewImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className={styles.previewError} style={{display: 'none'}}>
                      Không thể tải ảnh
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Mô tả</span>
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  rows={4}
                  className={styles.formTextarea}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Nhập mô tả cho danh mục..."
                  required
                />
              </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
              <button 
                type="button"
                className={`${styles.modalButton} ${styles.secondaryButton}`}
                onClick={handleClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="submit"
                className={`${styles.modalButton} ${styles.primaryButton}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.loadingText}>
                    <div className={styles.miniSpinner}></div>
                    {editId ? "Đang cập nhật..." : "Đang thêm..."}
                  </span>
                ) : (
                  editId ? "Cập nhật" : "Thêm mới"
                )}
              </button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ListCategories;
