import { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./AttributeValueList.module.css";
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
  createAttributeValue,
  getAttributeValue,
  getListAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from "../../../api/attribute-Value";
import { getAttributes } from "../../../api/attribute";

function AttributeValueList() {
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [filterActive, setFilterActive] = useState("all"); // all, active, inactive
  const [filterAttribute, setFilterAttribute] = useState(""); // filter by attribute

  const [form, setForm] = useState({
    value: "",
    valueCode: "",
    attributeId: "",
    isActive: true,
  });

  const [attributeValues, setAttributeValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch attribute values
  const fetchAttributeValues = useCallback(async () => {
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

      // Add filter for attribute
      if (filterAttribute) {
        params.attributeId = filterAttribute;
      }

      const res = await getListAttributeValue(params);
      console.log("Fetched attribute values:", res.data);

      if (res.data && res.data.data) {
        const attrValues = res.data.data.data || res.data.data;
        const normalizedAttrValues = attrValues.map((av) => ({
          id: av._id || av.id,
          attributeId: av.attributeId?._id || av.attributeId || "",
          value: av.value,
          valueCode: av.valueCode,
          isActive: av.isActive,
          createdAt: av.createdAt,
          ...av,
        }));
        setAttributeValues(normalizedAttrValues);
        setTotalPages(res.data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.log("Error fetching attribute values:", error);
      toast.error("Không thể tải danh sách giá trị thuộc tính!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterActive, filterAttribute, limit]);

  // Fetch attributes for dropdown
  const fetchAttributes = useCallback(async () => {
    try {
      const res = await getAttributes();
      console.log("Fetched attributes:", res.data.data);
      if (res.data && res.data.data) {
        setAttributes(res.data.data.data || res.data.data);
      }
    } catch (error) {
      console.log("Error fetching attributes:", error);
    }
  }, []);

  useEffect(() => {
    fetchAttributeValues();
    fetchAttributes();
  }, [fetchAttributeValues, fetchAttributes]);

  // Generate valueCode from value
  const generateValueCode = (value) => {
    return value
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

    if (!form.value.trim()) {
      errors.value = "Giá trị là bắt buộc";
    } else if (form.value.length < 1) {
      errors.value = "Giá trị phải có ít nhất 1 ký tự";
    } else if (form.value.length > 255) {
      errors.value = "Giá trị không được vượt quá 255 ký tự";
    }

    if (!form.valueCode.trim()) {
      errors.valueCode = "Mã giá trị là bắt buộc";
    } else if (!/^[a-z0-9_]+$/.test(form.valueCode)) {
      errors.valueCode =
        "Mã giá trị chỉ được chứa chữ thường, số và dấu gạch dưới";
    } else if (form.valueCode.length < 1) {
      errors.valueCode = "Mã giá trị phải có ít nhất 1 ký tự";
    } else if (form.valueCode.length > 50) {
      errors.valueCode = "Mã giá trị không được vượt quá 50 ký tự";
    }

    if (!form.attributeId) {
      errors.attributeId = "Vui lòng chọn thuộc tính";
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

      const attributeValueData = {
        value: form.value.trim(),
        valueCode: form.valueCode.trim(),
        attributeId: form.attributeId,
        isActive: form.isActive,
      };

      if (editId) {
        await updateAttributeValue(editId, attributeValueData);
        toast.success("Cập nhật giá trị thuộc tính thành công!");
      } else {
        await createAttributeValue(attributeValueData);
        toast.success("Thêm giá trị thuộc tính thành công!");
      }

      fetchAttributeValues();
      handleClose();
    } catch (error) {
      console.log("Error:", error);
      if (error.response?.status === 409) {
        toast.error("Mã giá trị đã tồn tại!");
      } else {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, value) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa giá trị "${value}"?`)) {
      try {
        setLoading(true);
        await deleteAttributeValue(id);
        toast.success("Xóa giá trị thuộc tính thành công!");
        fetchAttributeValues();
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
      await updateAttributeValue(id, { isActive: !currentStatus });
      toast.success(
        `${
          !currentStatus ? "Kích hoạt" : "Vô hiệu hóa"
        } giá trị thuộc tính thành công!`
      );
      fetchAttributeValues();
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
      value: "",
      valueCode: "",
      attributeId: "",
      isActive: true,
    });
    setEditId(null);
    setValidationErrors({});
  };

  const handleShow = () => setShow(true);

  // Handle edit
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const res = await getAttributeValue(id);
      const attributeValue = res.data.data;

      setForm({
        value: attributeValue.value || "",
        valueCode: attributeValue.valueCode || "",
        attributeId:
          typeof attributeValue.attributeId === "object"
            ? attributeValue.attributeId._id
            : attributeValue.attributeId || "",
        isActive:
          attributeValue.isActive !== undefined
            ? attributeValue.isActive
            : true,
      });
      setEditId(id);
      setShow(true);
    } catch (error) {
      console.log("Error:", error);
      toast.error("Không thể tải thông tin giá trị thuộc tính!");
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate valueCode when value changes
    if (field === "value" && !editId) {
      setForm((prev) => ({
        ...prev,
        valueCode: generateValueCode(value),
      }));
    }

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    if (filterType === "active") {
      setFilterActive(value);
    } else if (filterType === "attribute") {
      setFilterAttribute(value);
    }
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get attribute name by ID
  const getAttributeName = (attributeId) => {
    if (!attributeId) return "N/A";

    // Trường hợp attributeId là ObjectId dạng string
    if (typeof attributeId === "string") {
      const attribute = attributes.find((attr) => attr._id === attributeId);
      return attribute ? attribute.attributeName : "N/A";
    }

    // Trường hợp attributeId là object có _id và attributeName
    if (typeof attributeId === "object") {
      return attributeId.attributeName || "N/A";
    }

    return "N/A";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>
            <FiTag className={styles.titleIcon} />
            Quản lý Giá trị Thuộc tính
          </h2>
          <p className={styles.subtitle}>
            Quản lý danh sách giá trị cho các thuộc tính sản phẩm
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleShow}
          className={styles.addButton}
          disabled={loading}
        >
          <FiPlus /> Thêm Giá trị
        </Button>
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm giá trị thuộc tính..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={filterActive}
              onChange={(e) => handleFilterChange("active", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filterAttribute}
              onChange={(e) => handleFilterChange("attribute", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả thuộc tính</option>
              {attributes.map((attr) => (
                <option key={attr._id} value={attr._id}>
                  {attr.attributeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Giá trị</th>
                <th>Mã giá trị</th>
                <th>Thuộc tính</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {attributeValues.length > 0 ? (
                attributeValues.map((item, index) => (
                  <tr
                    key={item._id}
                    className={!item.isActive ? styles.inactiveRow : ""}
                  >
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>
                      <div className={styles.valueCell}>
                        <FiTag className={styles.valueIcon} />
                        <span className={styles.valueName}>{item.value}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.codeCell}>
                        <FiCode className={styles.codeIcon} />
                        <code className={styles.codeText}>
                          {item.valueCode}
                        </code>
                      </div>
                    </td>
                    <td>
                      <span className={styles.attributeTag}>
                        {getAttributeName(item.attributeId)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          item.isActive ? styles.active : styles.inactive
                        }`}
                      >
                        {item.isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(item._id)}
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          title="Chỉnh sửa"
                          disabled={loading}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleActive(item._id, item.isActive)
                          }
                          className={`${styles.actionBtn} ${
                            item.isActive
                              ? styles.deactivateBtn
                              : styles.activateBtn
                          }`}
                          title={item.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                          disabled={loading}
                        >
                          {item.isActive ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.value)}
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          title="Xóa"
                          disabled={loading}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <FiTag className={styles.noDataIcon} />
                      <p>Không có giá trị thuộc tính nào</p>
                      <Button variant="primary" onClick={handleShow}>
                        <FiPlus /> Thêm giá trị đầu tiên
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="outline-primary"
            disabled={currentPage === 1 || loading}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Trước
          </Button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={
                    currentPage === pageNum ? "primary" : "outline-primary"
                  }
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline-primary"
            disabled={currentPage === totalPages || loading}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FiTag className={styles.modalIcon} />
            {editId
              ? "Chỉnh sửa giá trị thuộc tính"
              : "Thêm giá trị thuộc tính"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Form.Label>
                  Thuộc tính <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Select
                  value={form.attributeId}
                  onChange={(e) =>
                    handleFormChange("attributeId", e.target.value)
                  }
                  isInvalid={!!validationErrors.attributeId}
                  disabled={loading}
                >
                  <option value="">Chọn thuộc tính</option>
                  {attributes.map((attr) => (
                    <option key={attr._id} value={attr._id}>
                      {attr.attributeName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.attributeId}
                </Form.Control.Feedback>
              </div>

              <div className={styles.formGroup}>
                <Form.Label>
                  Giá trị <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={form.value}
                  onChange={(e) => handleFormChange("value", e.target.value)}
                  placeholder="Nhập giá trị (VD: Đỏ, Xanh, S, M, L...)"
                  isInvalid={!!validationErrors.value}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.value}
                </Form.Control.Feedback>
              </div>

              <div className={styles.formGroup}>
                <Form.Label>
                  Mã giá trị <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={form.valueCode}
                  onChange={(e) =>
                    handleFormChange("valueCode", e.target.value)
                  }
                  placeholder="Mã giá trị (tự động tạo)"
                  isInvalid={!!validationErrors.valueCode}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Mã giá trị chỉ chứa chữ thường, số và dấu gạch dưới
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.valueCode}
                </Form.Control.Feedback>
              </div>

              <div className={styles.formGroup}>
                <Form.Check
                  type="switch"
                  id="isActive"
                  label="Kích hoạt"
                  checked={form.isActive}
                  onChange={(e) =>
                    handleFormChange("isActive", e.target.checked)
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Đang xử lý...
                </>
              ) : (
                <>{editId ? "Cập nhật" : "Thêm mới"}</>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AttributeValueList;
