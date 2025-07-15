import { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./AttributeList.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiCode,
  FiTag,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import {
  createAttribute,
  getAttribute,
  getAttributes,
  updateAttribute,
  deleteAttribute,
} from "../../../api/attribute";

function AttributeList() {
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [filterActive, setFilterActive] = useState("all"); // all, active, inactive

  const [form, setForm] = useState({
    attributeName: "",
    attributeCode: "",
    description: "",
    isActive: true,
  });

  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch attributes
  const fetchAttributes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        search: searchTerm,
      };

      // Add filter for active status
      if (filterActive !== "all") {
        params.isActive = filterActive === "active";
      }

      const res = await getAttributes(params);
      console.log("Fetched attributes:", res.data);

      if (res.data && res.data.data) {
        setAttributes(res.data.data.data || res.data.data);
        setTotalPages(res.data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.log("Error fetching attributes:", error);
      toast.error("Không thể tải danh sách thuộc tính!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterActive, limit]);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  // Generate attributeCode from name
  const generateAttributeCode = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .trim("_");
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!form.attributeName.trim()) {
      errors.attributeName = "Tên thuộc tính là bắt buộc";
    } else if (form.attributeName.length < 2) {
      errors.attributeName = "Tên thuộc tính phải có ít nhất 2 ký tự";
    } else if (form.attributeName.length > 100) {
      errors.attributeName = "Tên thuộc tính không được vượt quá 100 ký tự";
    }

    if (!form.attributeCode.trim()) {
      errors.attributeCode = "Mã thuộc tính là bắt buộc";
    } else if (!/^[a-z0-9_]+$/.test(form.attributeCode)) {
      errors.attributeCode =
        "Mã thuộc tính chỉ được chứa chữ thường, số và dấu gạch dưới";
    } else if (form.attributeCode.length < 2) {
      errors.attributeCode = "Mã thuộc tính phải có ít nhất 2 ký tự";
    } else if (form.attributeCode.length > 50) {
      errors.attributeCode = "Mã thuộc tính không được vượt quá 50 ký tự";
    }

    if (form.description && form.description.length > 500) {
      errors.description = "Mô tả không được vượt quá 500 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      setLoading(true);

      const attributeData = {
        attributeName: form.attributeName.trim(),
        attributeCode: form.attributeCode.trim(),
        description: form.description.trim(),
        isActive: form.isActive,
      };

      if (editId) {
        await updateAttribute(editId, attributeData);
        toast.success("Cập nhật thuộc tính thành công!");
      } else {
        await createAttribute(attributeData);
        toast.success("Thêm thuộc tính thành công!");
      }

      fetchAttributes();
      handleClose();
    } catch (error) {
      console.log("Error:", error);
      if (error.response?.status === 409) {
        toast.error("Mã thuộc tính đã tồn tại!");
      } else {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thuộc tính "${name}"?`)) {
      try {
        setLoading(true);
        await deleteAttribute(id);
        toast.success("Xóa thuộc tính thành công!");
        fetchAttributes();
      } catch (error) {
        console.log("Error:", error);
        toast.error("Có lỗi xảy ra khi xóa!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      setLoading(true);
      await updateAttribute(id, { isActive: !currentStatus });
      toast.success(
        `${!currentStatus ? "Kích hoạt" : "Vô hiệu hóa"} thuộc tính thành công!`
      );
      fetchAttributes();
    } catch (error) {
      console.log("Error:", error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleClose = () => {
    setShow(false);
    setForm({
      attributeName: "",
      attributeCode: "",
      description: "",
      isActive: true,
    });
    setEditId(null);
    setValidationErrors({});
  };

  const handleShow = async (attribute = null) => {
    if (attribute) {
      try {
        setLoading(true);
        const res = await getAttribute(attribute.id || attribute._id);
        const attributeData = res.data.data || res.data;

        setForm({
          attributeName: attributeData.attributeName || "",
          attributeCode: attributeData.attributeCode || "",
          description: attributeData.description || "",
          isActive:
            attributeData.isActive !== undefined
              ? attributeData.isActive
              : true,
        });
        setEditId(attributeData.id || attributeData._id);
      } catch (error) {
        console.log("Error fetching attribute:", error);
        toast.error("Không thể tải thông tin thuộc tính!");
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setForm({
        attributeName: "",
        attributeCode: "",
        description: "",
        isActive: true,
      });
      setEditId(null);
    }
    setValidationErrors({});
    setShow(true);
  };

  // Handle name change and auto-generate code
  const handleNameChange = (e) => {
    const attributeName = e.target.value;
    const generatedCode = generateAttributeCode(attributeName);

    setForm({
      ...form,
      attributeName,
      attributeCode: generatedCode,
    });

    // Clear validation errors
    if (validationErrors.attributeName) {
      setValidationErrors({ ...validationErrors, attributeName: "" });
    }
  };

  // Handle code change
  const handleCodeChange = (e) => {
    const code = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setForm({ ...form, attributeCode: code });

    if (validationErrors.attributeCode) {
      setValidationErrors({ ...validationErrors, attributeCode: "" });
    }
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filter handler
  const handleFilterChange = (filter) => {
    setFilterActive(filter);
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && attributes.length === 0) {
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
        {/* Header */}
        <div className={styles.headerSection}>
          <h2 className={styles.pageTitle}>Quản lý thuộc tính</h2>
          <p className={styles.pageSubtitle}>
            Quản lý các thuộc tính sản phẩm như màu sắc, kích thước, chất liệu
          </p>
        </div>

        {/* Actions & Filters */}
        <div className={styles.actionsSection}>
          <div className={styles.leftActions}>
            {/* Search */}
            <div className={styles.searchContainer}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm thuộc tính..."
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>

            {/* Filter */}
            <div className={styles.filterContainer}>
              <FiFilter className={styles.filterIcon} />
              <select
                value={filterActive}
                onChange={(e) => handleFilterChange(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          <div className={styles.rightActions}>
            <button
              className={styles.addButton}
              onClick={() => handleShow()}
              disabled={loading}
            >
              <FiPlus className={styles.buttonIcon} />
              Thêm thuộc tính mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiTag />
            </div>
            <div className={styles.statContent}>
              <h3>{attributes.length}</h3>
              <p>Tổng thuộc tính</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiEye />
            </div>
            <div className={styles.statContent}>
              <h3>{attributes.filter((attr) => attr.isActive).length}</h3>
              <p>Đang hoạt động</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiEyeOff />
            </div>
            <div className={styles.statContent}>
              <h3>{attributes.filter((attr) => !attr.isActive).length}</h3>
              <p>Không hoạt động</p>
            </div>
          </div>
        </div>

        {/* Table */}
        {attributes.length === 0 ? (
          <div className={styles.emptyState}>
            <FiTag size={64} className={styles.emptyIcon} />
            <h3>Chưa có thuộc tính nào</h3>
            <p>Hãy thêm thuộc tính đầu tiên của bạn</p>
            <button className={styles.addButton} onClick={() => handleShow()}>
              <FiPlus />
              Thêm thuộc tính mới
            </button>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên thuộc tính</th>
                    <th>Mã thuộc tính</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Cập nhật cuối</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((attribute, index) => (
                    <tr key={attribute.id || attribute._id}>
                      <td data-label="STT">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>

                      <td
                        data-label="Tên thuộc tính"
                        className={styles.nameCell}
                      >
                        <div className={styles.attributeName}>
                          <FiTag className={styles.attributeIcon} />
                          <span>{attribute.attributeName}</span>
                        </div>
                      </td>

                      <td
                        data-label="Mã thuộc tính"
                        className={styles.codeCell}
                      >
                        <div className={styles.attributeCode}>
                          <FiCode className={styles.codeIcon} />
                          <code>{attribute.attributeCode}</code>
                        </div>
                      </td>

                      <td data-label="Mô tả" className={styles.descriptionCell}>
                        {attribute.description ? (
                          <span className={styles.description}>
                            {attribute.description.length > 50
                              ? `${attribute.description.substring(0, 50)}...`
                              : attribute.description}
                          </span>
                        ) : (
                          <span className={styles.noDescription}>
                            Không có mô tả
                          </span>
                        )}
                      </td>

                      <td data-label="Trạng thái" className={styles.statusCell}>
                        <button
                          className={`${styles.statusBadge} ${
                            attribute.isActive ? styles.active : styles.inactive
                          }`}
                          onClick={() =>
                            handleToggleActive(
                              attribute.id || attribute._id,
                              attribute.isActive
                            )
                          }
                          disabled={loading}
                          title={`Click để ${
                            attribute.isActive ? "vô hiệu hóa" : "kích hoạt"
                          }`}
                        >
                          {attribute.isActive ? (
                            <>
                              <FiEye className={styles.statusIcon} />
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <FiEyeOff className={styles.statusIcon} />
                              Không hoạt động
                            </>
                          )}
                        </button>
                      </td>

                      <td data-label="Ngày tạo" className={styles.dateCell}>
                        {formatDate(attribute.createdAt)}
                      </td>

                      <td
                        data-label="Cập nhật cuối"
                        className={styles.dateCell}
                      >
                        {formatDate(attribute.updatedAt)}
                      </td>

                      <td data-label="Hành động" className={styles.actionCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editButton}
                            onClick={() => handleShow(attribute)}
                            title="Chỉnh sửa"
                            disabled={loading}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() =>
                              handleDelete(
                                attribute.id || attribute._id,
                                attribute.attributeName // Sửa từ attribute.attribute thành attribute.attributeName
                              )
                            }
                            title="Xóa"
                            disabled={loading}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || loading}
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
                  disabled={currentPage === totalPages || loading}
                  className={styles.pageButton}
                >
                  Trang sau →
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal Form */}
        <Modal
          show={show}
          onHide={handleClose}
          className={styles.customModal}
          size="lg"
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              {editId ? "Cập nhật" : "Thêm mới"} thuộc tính
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleSubmit}>
            <Modal.Body className={styles.modalBody}>
              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Tên thuộc tính</span>
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.formInput} ${
                    validationErrors.name ? styles.error : ""
                  }`}
                  value={form.attributeName}
                  onChange={handleNameChange}
                  placeholder="Ví dụ: Màu sắc, Kích thước, Chất liệu..."
                  maxLength="100"
                  required
                />
                {validationErrors.name && (
                  <span className={styles.errorText}>
                    {validationErrors.attributeName}
                  </span>
                )}
                <small className={styles.helpText}>
                  {form.attributeName.length}/100 ký tự
                </small>
              </div>

              {/* Attribute Code */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Mã thuộc tính</span>
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.formInput} ${styles.codeInput} ${
                    validationErrors.attributeCode ? styles.error : ""
                  }`}
                  value={form.attributeCode}
                  onChange={handleCodeChange}
                  placeholder="color, size, material..."
                  maxLength="50"
                  required
                />
                {validationErrors.attributeCode && (
                  <span className={styles.errorText}>
                    {validationErrors.attributeCode}
                  </span>
                )}
                <small className={styles.helpText}>
                  {form.attributeCode.length}/50 ký tự. Chỉ chữ thường, số và
                  dấu gạch dưới.
                </small>
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mô tả</label>
                <textarea
                  rows={4}
                  className={`${styles.formTextarea} ${
                    validationErrors.description ? styles.error : ""
                  }`}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về thuộc tính này..."
                  maxLength="500"
                />
                {validationErrors.description && (
                  <span className={styles.errorText}>
                    {validationErrors.description}
                  </span>
                )}
                <small className={styles.helpText}>
                  {form.description.length}/500 ký tự
                </small>
              </div>

              {/* Active Status */}
              <div className={styles.formGroup}>
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />
                  <label htmlFor="isActive" className={styles.checkboxLabel}>
                    Kích hoạt thuộc tính
                  </label>
                </div>
                <small className={styles.helpText}>
                  Thuộc tính được kích hoạt sẽ hiển thị trong danh sách lựa chọn
                </small>
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

export default AttributeList;
