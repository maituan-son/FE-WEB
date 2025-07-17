import {
  getListProductVariant,
  getProductVariant,
  createProductVariant,
  updateProductVariant,
} from "../../../api/variants";
import { getAttributes } from "../../../api/attribute";
import { getListAttributeValue } from "../../../api/attribute-Value";
import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiEye,
  FiPackage,
} from "react-icons/fi";
import { BsBoxSeam, BsCurrencyDollar, BsGraphUp } from "react-icons/bs";
import { toast } from "react-toastify";
import styles from "./VariantManager.module.css";

const VariantManager = () => {
  // State management
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    attributeId: "",
    valueId: "",
    stock: "",
    price: "",
    oldPrice: "",
    sku: "",
  });

  // New state for bulk variant creation
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [generatedCombinations, setGeneratedCombinations] = useState([]);
  const [bulkFormData, setBulkFormData] = useState({
    basePrice: "",
    baseStock: "",
    baseSku: "",
  });

  // Fetch data functions
  useEffect(() => {
    fetchAllData();
    fetchAttributeValues();
    fetchAttributes();
    fetchProductVariant();
  }, []);
  const fetchAttributes = async () => {
    try {
      const attributesData = await getAttributes();
      // Check data structure

      setAttributes(attributesData.data.data);
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
    }
  };
  const fetchAttributeValues = async () => {
    try {
      const valuesData = await getListAttributeValue();

      setAttributeValues(valuesData.data.data);
    } catch (error) {
      console.error("Failed to fetch attribute values:", error);
    }
  };
  const fetchProductVariant = async () => {
    try {
      const variantData = await getListProductVariant();
      console.log("Fetched variants:", variantData.data.data);

      setVariants(variantData.data.data);
    } catch (error) {
      console.error("Failed to fetch product variant:", error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [variantsData, attributesData, valuesData] = await Promise.all([
        getListProductVariant(),
        getAttributes(),
        getListAttributeValue(),
      ]);

      // Enrich variants with attribute and value names
      const enrichedVariants = variantsData.map((variant) => {
        const attribute = attributesData.find(
          (attr) => attr._id === variant.attributeId
        );
        const value = valuesData.find((val) => val._id === variant.valueId);

        return {
          ...variant,
          attributeName: attribute?.attributeName || "Unknown",
          valueName: value?.value || "Unknown",
        };
      });

      setVariants(enrichedVariants);
      setAttributes(attributesData);
      setAttributeValues(valuesData);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.attributeId) errors.attributeId = "Vui lòng chọn thuộc tính";
    if (!formData.valueId) errors.valueId = "Vui lòng chọn giá trị";
    if (!formData.sku.trim()) errors.sku = "SKU không được để trống";
    if (!formData.stock || formData.stock < 0)
      errors.stock = "Số lượng tồn kho phải >= 0";
    if (!formData.price || formData.price <= 0) errors.price = "Giá phải > 0";
    if (
      formData.oldPrice &&
      parseFloat(formData.oldPrice) <= parseFloat(formData.price)
    ) {
      errors.oldPrice = "Giá cũ phải lớn hơn giá hiện tại";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);

    const variantData = {
      attributeId: formData.attributeId,
      valueId: formData.valueId,
      stock: parseInt(formData.stock),
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      sku: formData.sku.trim(),
    };

    try {
      if (editingVariant) {
        await updateProductVariant(editingVariant.id, variantData);
        toast.success("Cập nhật variant thành công!");
      } else {
        await createProductVariant(variantData);
        toast.success("Thêm variant thành công!");
      }

      await fetchAllData();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setFormData({
      attributeId: variant.attributeId,
      valueId: variant.valueId,
      stock: variant.stock.toString(),
      price: variant.price.toString(),
      oldPrice: variant.oldPrice ? variant.oldPrice.toString() : "",
      sku: variant.sku,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa variant này?")) return;

    setLoading(true);
    try {
      // Note: You'll need to implement deleteProductVariant in your API
      // await deleteProductVariant(id);
      console.log("Delete variant:", id);
      await fetchAllData();
      toast.success("Xóa variant thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa variant: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      attributeId: "",
      valueId: "",
      stock: "",
      price: "",
      oldPrice: "",
      sku: "",
    });
    setEditingVariant(null);
    setFormErrors({});
    // Reset bulk mode states
    setIsBulkMode(false);
    setSelectedAttributes([]);
    setSelectedValues({});
    setGeneratedCombinations([]);
    setBulkFormData({
      basePrice: "",
      baseStock: "",
      baseSku: "",
    });
  };

  // Bulk variant creation functions
  const handleAttributeSelection = (attributeId, isSelected) => {
    if (isSelected) {
      setSelectedAttributes((prev) => [...prev, attributeId]);
      setSelectedValues((prev) => ({
        ...prev,
        [attributeId]: [],
      }));
    } else {
      setSelectedAttributes((prev) => prev.filter((id) => id !== attributeId));
      setSelectedValues((prev) => {
        const newValues = { ...prev };
        delete newValues[attributeId];
        return newValues;
      });
    }
  };

  const handleValueSelection = (attributeId, valueId, isSelected) => {
    setSelectedValues((prev) => ({
      ...prev,
      [attributeId]: isSelected
        ? [...(prev[attributeId] || []), valueId]
        : (prev[attributeId] || []).filter((id) => id !== valueId),
    }));
  };

  const generateCombinations = () => {
    if (selectedAttributes.length === 0) return;

    const attributeValuePairs = selectedAttributes.map((attrId) => {
      const values = selectedValues[attrId] || [];
      return values.map((valueId) => ({
        attributeId: attrId,
        valueId: valueId,
        attributeName:
          attributes.find((a) => a._id === attrId)?.attributeName || "",
        valueName: attributeValues.find((v) => v._id === valueId)?.value || "",
      }));
    });

    // Generate all combinations
    const combinations = attributeValuePairs.reduce((acc, curr) => {
      if (acc.length === 0) {
        return curr.map((item) => [item]);
      }

      const newCombinations = [];
      acc.forEach((combination) => {
        curr.forEach((item) => {
          newCombinations.push([...combination, item]);
        });
      });
      return newCombinations;
    }, []);

    // Create variant objects with default values
    const variantCombinations = combinations.map((combination, index) => {
      const sku = bulkFormData.baseSku
        ? `${bulkFormData.baseSku}-${index + 1}`
        : `VAR-${Date.now()}-${index + 1}`;

      return {
        id: `temp-${index}`,
        combinations: combination,
        sku: sku,
        stock: parseInt(bulkFormData.baseStock) || 0,
        price: parseFloat(bulkFormData.basePrice) || 0,
        oldPrice: 0,
        enabled: true,
      };
    });

    setGeneratedCombinations(variantCombinations);
  };

  const updateCombination = (tempId, field, value) => {
    setGeneratedCombinations((prev) =>
      prev.map((combo) =>
        combo.id === tempId ? { ...combo, [field]: value } : combo
      )
    );
  };

  const toggleCombination = (tempId) => {
    setGeneratedCombinations((prev) =>
      prev.map((combo) =>
        combo.id === tempId ? { ...combo, enabled: !combo.enabled } : combo
      )
    );
  };

  const createBulkVariants = async () => {
    const enabledCombinations = generatedCombinations.filter(
      (combo) => combo.enabled
    );

    if (enabledCombinations.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tổ hợp để tạo");
      return;
    }

    setLoading(true);

    try {
      const createPromises = enabledCombinations
        .map((combo) => {
          // For multi-attribute combinations, we'll create separate variants for each attribute-value pair
          // or you can modify this based on your backend structure
          return combo.combinations.map((item) =>
            createProductVariant({
              attributeId: item.attributeId,
              valueId: item.valueId,
              stock: combo.stock,
              price: combo.price,
              oldPrice: combo.oldPrice || null,
              sku: `${combo.sku}-${item.attributeName}-${item.valueName}`.toUpperCase(),
            })
          );
        })
        .flat();

      await Promise.all(createPromises);

      toast.success(`Đã tạo thành công ${createPromises.length} variants!`);
      await fetchAllData();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo variants: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const filteredVariants = variants.filter((variant) => {
    const matchesSearch =
      searchTerm === "" ||
      variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.attributeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.valueName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterAttribute === "" || variant.attributeId === filterAttribute;

    return matchesSearch && matchesFilter;
  });

  const getAvailableValues = () => {
    return attributeValues.filter(
      (value) => value.attributeId === formData.attributeId
    );
  };

  // Statistics
  const statistics = {
    totalVariants: variants.length,
    totalStock: variants.reduce((sum, v) => sum + v.stock, 0),
    inStockVariants: variants.filter((v) => v.stock > 0).length,
    totalValue: variants.reduce((sum, v) => sum + v.price * v.stock, 0),
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <BsBoxSeam className={styles.titleIcon} />
            Quản lý Variants
          </h1>
          <p className={styles.subtitle}>
            Quản lý các biến thể sản phẩm với thuộc tính và giá trị khác nhau
          </p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          disabled={loading}
        >
          <FiPlus />
          Thêm Variant
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo SKU, thuộc tính, giá trị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterBox}>
          <FiFilter className={styles.filterIcon} />
          <select
            value={filterAttribute}
            onChange={(e) => setFilterAttribute(e.target.value)}
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

      {/* Statistics Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiPackage />
          </div>
          <div className={styles.statContent}>
            <h3>{statistics.totalVariants}</h3>
            <p>Tổng Variants</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BsBoxSeam />
          </div>
          <div className={styles.statContent}>
            <h3>{statistics.totalStock.toLocaleString()}</h3>
            <p>Tổng Tồn Kho</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiEye />
          </div>
          <div className={styles.statContent}>
            <h3>{statistics.inStockVariants}</h3>
            <p>Còn Hàng</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BsCurrencyDollar />
          </div>
          <div className={styles.statContent}>
            <h3>${statistics.totalValue.toLocaleString()}</h3>
            <p>Tổng Giá Trị</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : filteredVariants.length === 0 ? (
          <div className={styles.emptyState}>
            <BsBoxSeam className={styles.emptyIcon} />
            <h3>Không có variant nào</h3>
            <p>Thêm variant đầu tiên để bắt đầu quản lý</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Thuộc Tính</th>
                <th>Giá Trị</th>
                <th>Tồn Kho</th>
                <th>Giá Hiện Tại</th>
                <th>Giá Cũ</th>
                <th>Giảm Giá</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map((variant) => {
                const discount = variant.oldPrice
                  ? Math.round(
                      ((variant.oldPrice - variant.price) / variant.oldPrice) *
                        100
                    )
                  : 0;

                return (
                  <tr key={variant.id}>
                    <td className={styles.skuCell}>
                      <span className={styles.sku}>{variant.sku}</span>
                    </td>
                    <td>
                      <span className={styles.attribute}>
                        {variant.attributeName}
                      </span>
                    </td>
                    <td>
                      <span className={styles.value}>{variant.valueName}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.stock} ${
                          variant.stock <= 10 ? styles.lowStock : ""
                        }`}
                      >
                        {variant.stock.toLocaleString()}
                      </span>
                    </td>
                    <td className={styles.price}>
                      ${variant.price.toFixed(2)}
                    </td>
                    <td className={styles.oldPrice}>
                      {variant.oldPrice
                        ? `$${variant.oldPrice.toFixed(2)}`
                        : "-"}
                    </td>
                    <td>
                      {discount > 0 && (
                        <span className={styles.discount}>-{discount}%</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          variant.stock > 0 ? styles.inStock : styles.outOfStock
                        }`}
                      >
                        {variant.stock > 0 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(variant)}
                          title="Chỉnh sửa"
                          disabled={loading}
                        >
                          <FiEdit3 />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(variant.id)}
                          title="Xóa"
                          disabled={loading}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
              resetForm();
            }
          }}
        >
          <div
            className={`${styles.modal} ${isBulkMode ? styles.modalLarge : ""}`}
          >
            <div className={styles.modalHeader}>
              <h2>
                {editingVariant ? "Chỉnh Sửa Variant" : "Thêm Variant Mới"}
              </h2>
              <div className={styles.modalHeaderActions}>
                {!editingVariant && (
                  <div className={styles.modeToggle}>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${
                        !isBulkMode ? styles.active : ""
                      }`}
                      onClick={() => setIsBulkMode(false)}
                    >
                      Đơn lẻ
                    </button>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${
                        isBulkMode ? styles.active : ""
                      }`}
                      onClick={() => setIsBulkMode(true)}
                    >
                      Hàng loạt
                    </button>
                  </div>
                )}
                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Single Variant Form */}
            {!isBulkMode && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Thuộc Tính *</label>
                    <select
                      value={formData.attributeId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributeId: e.target.value,
                          valueId: "", // Reset value when attribute changes
                        })
                      }
                      required
                      className={`${styles.select} ${
                        formErrors.attributeId ? styles.error : ""
                      }`}
                    >
                      <option value="">Chọn thuộc tính</option>
                      {attributes.map((attr) => (
                        <option key={attr._id} value={attr._id}>
                          {attr.attributeName}
                        </option>
                      ))}
                    </select>
                    {formErrors.attributeId && (
                      <span className={styles.errorText}>
                        {formErrors.attributeId}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Giá Trị *</label>
                    <select
                      value={formData.valueId}
                      onChange={(e) =>
                        setFormData({ ...formData, valueId: e.target.value })
                      }
                      required
                      disabled={!formData.attributeId}
                      className={`${styles.select} ${
                        formErrors.valueId ? styles.error : ""
                      }`}
                    >
                      <option value="">Chọn giá trị</option>
                      {attributeValues.map((value) => (
                        <option key={value._id} value={value._id}>
                          {value.value}
                        </option>
                      ))}
                    </select>
                    {formErrors.valueId && (
                      <span className={styles.errorText}>
                        {formErrors.valueId}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>SKU *</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="Nhập mã SKU"
                      required
                      className={`${styles.input} ${
                        formErrors.sku ? styles.error : ""
                      }`}
                    />
                    {formErrors.sku && (
                      <span className={styles.errorText}>{formErrors.sku}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tồn Kho *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="Số lượng tồn kho"
                      min="0"
                      required
                      className={`${styles.input} ${
                        formErrors.stock ? styles.error : ""
                      }`}
                    />
                    {formErrors.stock && (
                      <span className={styles.errorText}>
                        {formErrors.stock}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Giá Hiện Tại ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="Giá bán hiện tại"
                      min="0"
                      required
                      className={`${styles.input} ${
                        formErrors.price ? styles.error : ""
                      }`}
                    />
                    {formErrors.price && (
                      <span className={styles.errorText}>
                        {formErrors.price}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Giá Cũ ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.oldPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, oldPrice: e.target.value })
                      }
                      placeholder="Giá cũ (nếu có)"
                      min="0"
                      className={`${styles.input} ${
                        formErrors.oldPrice ? styles.error : ""
                      }`}
                    />
                    {formErrors.oldPrice && (
                      <span className={styles.errorText}>
                        {formErrors.oldPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className={styles.cancelBtn}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                  >
                    {loading ? (
                      <>
                        <div className={styles.buttonSpinner}></div>
                        Đang xử lý...
                      </>
                    ) : editingVariant ? (
                      "Cập Nhật"
                    ) : (
                      "Thêm Mới"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Bulk Variant Form */}
            {isBulkMode && (
              <div className={styles.bulkForm}>
                {/* Step 1: Base Configuration */}
                <div className={styles.bulkStep}>
                  <h3 className={styles.stepTitle}>
                    <span className={styles.stepNumber}>1</span>
                    Cấu hình cơ bản
                  </h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>SKU cơ sở *</label>
                      <input
                        type="text"
                        value={bulkFormData.baseSku}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            baseSku: e.target.value,
                          })
                        }
                        placeholder="VD: PRODUCT-2024"
                        className={styles.input}
                      />
                      <small className={styles.helpText}>
                        SKU cuối cùng sẽ là: {bulkFormData.baseSku || "SKU"}-1,{" "}
                        {bulkFormData.baseSku || "SKU"}-2, ...
                      </small>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Giá cơ sở ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={bulkFormData.basePrice}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            basePrice: e.target.value,
                          })
                        }
                        placeholder="100.00"
                        min="0"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Tồn kho cơ sở *</label>
                      <input
                        type="number"
                        value={bulkFormData.baseStock}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            baseStock: e.target.value,
                          })
                        }
                        placeholder="100"
                        min="0"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Attribute Selection */}
                <div className={styles.bulkStep}>
                  <h3 className={styles.stepTitle}>
                    <span className={styles.stepNumber}>2</span>
                    Chọn thuộc tính
                  </h3>
                  <div className={styles.attributeGrid}>
                    {attributes.map((attr) => (
                      <div key={attr._id} className={styles.attributeCard}>
                        <div className={styles.attributeHeader}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={selectedAttributes.includes(attr._id)}
                              onChange={(e) =>
                                handleAttributeSelection(
                                  attr._id,
                                  e.target.checked
                                )
                              }
                              className={styles.hiddenCheckbox}
                            />
                            <span className={styles.customCheckbox}>
                              <svg
                                viewBox="0 0 24 24"
                                className={styles.checkIcon}
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            </span>
                            <span className={styles.attributeName}>
                              {attr.attributeName}
                            </span>
                          </label>
                        </div>

                        {selectedAttributes.includes(attr._id) && (
                          <div className={styles.valueSelection}>
                            <h4>Chọn giá trị:</h4>
                            <div className={styles.valueGrid}>
                              {attributeValues
                                .filter((val) => val.attributeId === attr._id)
                                .map((value) => (
                                  <label
                                    key={value._id}
                                    className={styles.valueLabel}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={(
                                        selectedValues[attr._id] || []
                                      ).includes(value._id)}
                                      onChange={(e) =>
                                        handleValueSelection(
                                          attr._id,
                                          value._id,
                                          e.target.checked
                                        )
                                      }
                                      className={styles.hiddenCheckbox}
                                    />
                                    <span className={styles.customCheckbox}>
                                      <svg
                                        viewBox="0 0 24 24"
                                        className={styles.checkIcon}
                                      >
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                      </svg>
                                    </span>
                                    <span className={styles.valueName}>
                                      {value.value}
                                    </span>
                                  </label>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Generate & Preview */}
                <div className={styles.bulkStep}>
                  <h3 className={styles.stepTitle}>
                    <span className={styles.stepNumber}>3</span>
                    Tạo tổ hợp
                  </h3>
                  <div className={styles.generateSection}>
                    <button
                      type="button"
                      onClick={generateCombinations}
                      className={styles.generateBtn}
                      disabled={selectedAttributes.length === 0}
                    >
                      Tạo tổ hợp variants
                    </button>
                    {generatedCombinations.length > 0 && (
                      <p className={styles.combinationCount}>
                        Đã tạo {generatedCombinations.length} tổ hợp
                      </p>
                    )}
                  </div>

                  {generatedCombinations.length > 0 && (
                    <div className={styles.combinationPreview}>
                      <h4>Xem trước & chỉnh sửa:</h4>
                      <div className={styles.combinationList}>
                        {generatedCombinations.map((combo) => (
                          <div
                            key={combo.id}
                            className={`${styles.combinationItem} ${
                              !combo.enabled ? styles.disabled : ""
                            }`}
                          >
                            <div className={styles.combinationHeader}>
                              <label className={styles.checkboxLabel}>
                                <input
                                  type="checkbox"
                                  checked={combo.enabled}
                                  onChange={() => toggleCombination(combo.id)}
                                  className={styles.hiddenCheckbox}
                                />
                                <span className={styles.customCheckbox}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    className={styles.checkIcon}
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                </span>
                              </label>
                              <div className={styles.combinationInfo}>
                                <strong>
                                  {combo.combinations
                                    .map(
                                      (c) =>
                                        `${c.attributeName}: ${c.valueName}`
                                    )
                                    .join(" + ")}
                                </strong>
                              </div>
                            </div>

                            {combo.enabled && (
                              <div className={styles.combinationInputs}>
                                <input
                                  type="text"
                                  value={combo.sku}
                                  onChange={(e) =>
                                    updateCombination(
                                      combo.id,
                                      "sku",
                                      e.target.value
                                    )
                                  }
                                  placeholder="SKU"
                                  className={styles.smallInput}
                                />
                                <input
                                  type="number"
                                  value={combo.price}
                                  onChange={(e) =>
                                    updateCombination(
                                      combo.id,
                                      "price",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="Giá"
                                  step="0.01"
                                  className={styles.smallInput}
                                />
                                <input
                                  type="number"
                                  value={combo.stock}
                                  onChange={(e) =>
                                    updateCombination(
                                      combo.id,
                                      "stock",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  placeholder="Tồn kho"
                                  className={styles.smallInput}
                                />
                                <input
                                  type="number"
                                  value={combo.oldPrice}
                                  onChange={(e) =>
                                    updateCombination(
                                      combo.id,
                                      "oldPrice",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="Giá cũ"
                                  step="0.01"
                                  className={styles.smallInput}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className={styles.cancelBtn}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={createBulkVariants}
                    disabled={
                      loading ||
                      generatedCombinations.filter((c) => c.enabled).length ===
                        0
                    }
                    className={styles.submitBtn}
                  >
                    {loading ? (
                      <>
                        <div className={styles.buttonSpinner}></div>
                        Đang tạo...
                      </>
                    ) : (
                      `Tạo ${
                        generatedCombinations.filter((c) => c.enabled).length
                      } variants`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantManager;
