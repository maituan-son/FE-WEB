import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./ListSubCategories.module.css";

import {
  FiEdit2,
  FiTrash2,
  FiImage,
  FiEye,
  FiPlus,
  FiLayers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import {
  createSubCategory,
  getSubCategories,
  softDeleteSubCategory,
  updateSubCategory,
} from "../../../api/subcategory";
import { getCategories } from "../../../api/categoris"; // Import để lấy danh sách parent categories

function ListSubCategories() {
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isTrash] = useState(false);
  const [form, setForm] = useState({
    title: "",
    logoUrl: "",
    description: "",
    slug: "",
    categoryParentId: "", // Thêm trường này
  });
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]); // Danh sách parent categories
  const [loading, setLoading] = useState(false);

  // Fetch parent categories
  const fetchParentCategories = useCallback(async () => {
    try {
      const res = await getCategories("trash=false&limit=100"); // Lấy tất cả categories không bị xóa
      setParentCategories(res.data.data.data || []);
    } catch (error) {
      console.log("Error fetching parent categories:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSubCategories({
        page: currentPage,
        limit,
        search: searchTerm,
        trash: isTrash ? "true" : "false",
      });

      setCategories(res.data.data.data);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải danh sách danh mục con!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, isTrash]);

  useEffect(() => {
    fetchCategories();
    fetchParentCategories(); // Fetch parent categories khi component mount
  }, [fetchCategories, fetchParentCategories]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  const handleClose = () => {
    setShow(false);
    setForm({
      title: "",
      logoUrl: "",
      description: "",
      slug: "",
      categoryParentId: "",
    });
    setEditId(null);
  };

  const handleShow = (category = null) => {
    if (category) {
      setForm({
        title: category.title,
        logoUrl: category.logoUrl || "",
        description: category.description,
        slug: category.slug,
        categoryParentId:
          category.categoryParentId?._id || category.categoryParentId || "",
      });
      setEditId(category._id);
    } else {
      setForm({
        title: "",
        logoUrl: "",
        description: "",
        slug: "",
        categoryParentId: "",
      });
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

      // Validate categoryParentId
      if (!form.categoryParentId) {
        toast.error("Vui lòng chọn danh mục cha!");
        return;
      }

      if (editId) {
        await updateSubCategory(editId, form);
        toast.success("Cập nhật danh mục con thành công!");
      } else {
        await createSubCategory(form);
        toast.success("Thêm danh mục con thành công!");
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

  const handleSoftDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục con này?")) {
      try {
        setLoading(true);
        await softDeleteSubCategory(id);
        toast.success("Xóa danh mục con thành công!");
        fetchCategories();
      } catch (error) {
        console.error("handleSoftDelete error", error);
        toast.error("Có lỗi xảy ra khi xóa!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper function để lấy tên parent category
  const getParentCategoryName = (categoryId) => {
    if (typeof categoryId === "object" && categoryId?.title) {
      return categoryId.title; // Nếu đã populate
    }
    const parent = parentCategories.find((cat) => cat._id === categoryId);
    return parent ? parent.title : "Không xác định";
  };

  if (loading && categories.length === 0) {
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
          <h2 className={styles.pageTitle}>Quản lý danh mục con</h2>
          <p className={styles.pageSubtitle}>
            Quản lý danh mục con của cửa hàng
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.addButton} onClick={() => handleShow()}>
            <FiPlus className={styles.buttonIcon} />
            Thêm danh mục con mới
          </button>
          <Link to="/admin/subcategories/trash" className={styles.trashButton}>
            <FiTrash2 className={styles.buttonIcon} />
            Thùng rác
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className={styles.emptyState}>
            <FiLayers size={64} className={styles.emptyIcon} />
            <h3>Chưa có danh mục con nào</h3>
            <p>Hãy thêm danh mục con đầu tiên của bạn</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Logo</th>
                    <th>Tên danh mục con</th>
                    <th>Danh mục cha</th>
                    <th>Mô tả</th>
                    <th>Slug</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category._id}>
                      <td data-label="STT">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td data-label="Logo" className={styles.logoCell}>
                        {category.logoUrl ? (
                          <img
                            src={category.logoUrl}
                            alt={category.title}
                            className={styles.categoryLogo}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : (
                          <div className={styles.noLogo}>
                            <FiImage />
                          </div>
                        )}
                        <div
                          className={styles.noLogo}
                          style={{
                            display: category.logoUrl ? "none" : "flex",
                          }}
                        >
                          <FiImage />
                        </div>
                      </td>
                      <td
                        data-label="Tên danh mục con"
                        className={styles.titleCell}
                      >
                        <span className={styles.categoryTitle}>
                          {category.title}
                        </span>
                      </td>
                      <td
                        data-label="Danh mục cha"
                        className={styles.parentCell}
                      >
                        <div className={styles.parentCategory}>
                          <FiLayers className={styles.parentIcon} />
                          <span className={styles.parentName}>
                            {getParentCategoryName(category.categoryParentId)}
                          </span>
                        </div>
                      </td>
                      <td data-label="Mô tả" className={styles.descriptionCell}>
                        <span
                          className={styles.description}
                          title={category.description}
                        >
                          {category.description.length > 50
                            ? `${category.description.substring(0, 50)}...`
                            : category.description}
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

            <div className={`${styles.pagination} ${styles.advanced}`}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                ← Trang trước
              </button>

              <span className={styles.pageInfo}>
                Trang {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Trang sau →
              </button>
            </div>
          </>
        )}

        <Modal
          show={show}
          onHide={handleClose}
          className={styles.customModal}
          size="lg"
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              {editId ? "Cập nhật" : "Thêm mới"} danh mục con
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Tên danh mục con</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="Nhập tên danh mục con..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Danh mục cha</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.formInput}
                    value={form.categoryParentId}
                    onChange={(e) =>
                      setForm({ ...form, categoryParentId: e.target.value })
                    }
                    required
                  >
                    <option value="">Chọn danh mục cha...</option>
                    {parentCategories.map((parent) => (
                      <option key={parent._id} value={parent._id}>
                        {parent.title}
                      </option>
                    ))}
                  </select>
                  {parentCategories.length === 0 && (
                    <small className={styles.helpText}>
                      Không có danh mục cha nào. Vui lòng tạo danh mục cha
                      trước.
                    </small>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
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
                    Slug được tạo tự động từ tên danh mục con
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>URL Logo</label>
                  <input
                    type="url"
                    className={styles.formInput}
                    value={form.logoUrl}
                    onChange={(e) =>
                      setForm({ ...form, logoUrl: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              {form.logoUrl && (
                <div className={styles.imagePreview}>
                  <img
                    src={form.logoUrl}
                    alt="Preview"
                    className={styles.previewImage}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div
                    className={styles.previewError}
                    style={{ display: "none" }}
                  >
                    Không thể tải ảnh
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Mô tả</span>
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  rows={4}
                  className={styles.formTextarea}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Nhập mô tả cho danh mục con..."
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
                ) : editId ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ListSubCategories;
