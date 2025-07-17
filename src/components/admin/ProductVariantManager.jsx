import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import styles from "./ProductVariantManager.module.css";
import { getListAttributeValueByAttributeId } from "../../api/attribute-Value";

const ProductVariantManager = ({
  variants = [],
  onVariantsChange,
  attributes = [],
  formatPrice,
}) => {
  const [attributeValues, setAttributeValues] = useState([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState("");
  const [newVariant, setNewVariant] = useState({
    attributeId: "",
    valueId: "",
    stock: "",
    price: "",
    oldPrice: "",
    sku: "",
  });

  const fetchAttributeValues = useCallback(async (attributeId) => {
    if (!attributeId) return;
    try {
      const res = await getListAttributeValueByAttributeId(attributeId);
      setAttributeValues(res.data.data || []);
    } catch (error) {
      console.error("Error fetching attribute values:", error);
      toast.error("Không thể tải danh sách giá trị thuộc tính!");
    }
  }, []);

  useEffect(() => {
    if (selectedAttributeId) {
      fetchAttributeValues(selectedAttributeId);
    }
  }, [selectedAttributeId, fetchAttributeValues]);

  const getAttributeName = (attributeId) => {
    const attr = attributes.find((a) => a._id === attributeId);
    return attr ? attr.attributeName : "Unknown";
  };

  const getValueName = (valueId) => {
    const value = attributeValues.find((v) => v._id === valueId);
    return value ? value.value : "Unknown";
  };

  const getAvailableValues = (attributeId) => {
    return attributeValues.filter((v) => v.attributeId === attributeId);
  };

  const generateSKU = (attributeId, valueId) => {
    const attr = attributes.find((a) => a._id === attributeId);
    const value = attributeValues.find((v) => v._id === valueId);

    if (attr && value) {
      const attrCode =
        attr.attributeCode ||
        attr.attributeName.toLowerCase().replace(/\s/g, "");
      const valueCode = value.value.toLowerCase().replace(/\s/g, "");
      return `${attrCode}-${valueCode}-${Date.now().toString().slice(-4)}`;
    }
    return `SKU-${Date.now().toString().slice(-6)}`;
  };

  const handleAddVariant = () => {
    if (!newVariant.attributeId || !newVariant.valueId) {
      toast.error("Vui lòng chọn thuộc tính và giá trị!");
      return;
    }

    if (!newVariant.price || parseFloat(newVariant.price) <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ!");
      return;
    }

    // Check for duplicate
    const exists = variants.some(
      (v) =>
        v.attributeId === newVariant.attributeId &&
        v.valueId === newVariant.valueId
    );

    if (exists) {
      toast.error("Biến thể này đã tồn tại!");
      return;
    }

    const variant = {
      id: Date.now().toString(),
      attributeId: newVariant.attributeId,
      valueId: newVariant.valueId,
      stock: parseInt(newVariant.stock) || 0,
      price: parseFloat(newVariant.price) || 0,
      oldPrice: parseFloat(newVariant.oldPrice) || 0,
      sku:
        newVariant.sku ||
        generateSKU(newVariant.attributeId, newVariant.valueId),
    };

    const updatedVariants = [...variants, variant];
    onVariantsChange(updatedVariants);

    // Reset form
    setNewVariant({
      attributeId: "",
      valueId: "",
      stock: "",
      price: "",
      oldPrice: "",
      sku: "",
    });
    setSelectedAttributeId("");
    setShowVariantForm(false);
    toast.success("Đã thêm biến thể mới!");
  };

  const handleRemoveVariant = (variantId) => {
    const updatedVariants = variants.filter((v) => v.id !== variantId);
    onVariantsChange(updatedVariants);
    toast.success("Đã xóa biến thể!");
  };

  const handleUpdateVariant = (variantId, field, value) => {
    const updatedVariants = variants.map((variant) => {
      if (variant.id === variantId) {
        return {
          ...variant,
          [field]: ["stock"].includes(field)
            ? parseInt(value) || 0
            : ["price", "oldPrice"].includes(field)
            ? parseFloat(value) || 0
            : value,
        };
      }
      return variant;
    });
    onVariantsChange(updatedVariants);
  };

  const resetForm = () => {
    setShowVariantForm(false);
    setSelectedAttributeId("");
    setNewVariant({
      attributeId: "",
      valueId: "",
      stock: "",
      price: "",
      oldPrice: "",
      sku: "",
    });
  };

  return (
    <div className={styles.variantManager}>
      <div className={styles.sectionHeader}>
        <h5 className={styles.sectionTitle}>Biến thể sản phẩm</h5>
        <span className={styles.variantCount}>{variants.length} biến thể</span>
      </div>

      {/* Current Variants List */}
      {variants.length > 0 && (
        <div className={styles.currentVariantsList}>
          <div className={styles.variantsList}>
            {variants.map((variant, index) => (
              <div key={variant.id || index} className={styles.variantItem}>
                <div className={styles.variantDetails}>
                  <div className={styles.variantInfo}>
                    <span className={styles.variantLabel}>
                      {getAttributeName(variant.attributeId)}:{" "}
                      {getValueName(variant.valueId)}
                    </span>
                    <span className={styles.variantSku}>
                      SKU: {variant.sku}
                    </span>
                  </div>
                  <div className={styles.variantPricing}>
                    <span className={styles.variantPrice}>
                      {formatPrice
                        ? formatPrice(variant.price || 0)
                        : `${variant.price || 0} VNĐ`}
                    </span>
                    <span className={styles.variantStock}>
                      Kho: {variant.stock || 0}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(variant.id)}
                  className={styles.deleteVariantBtn}
                  title="Xóa biến thể"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Variant Section */}
      <div className={styles.addVariantSection}>
        {!showVariantForm ? (
          <button
            type="button"
            className={styles.addVariantBtn}
            onClick={() => setShowVariantForm(true)}
          >
            <FiPlus />
            Thêm biến thể mới
          </button>
        ) : (
          <div className={styles.variantForm}>
            <div className={styles.variantFormHeader}>
              <h6>Thêm biến thể mới</h6>
            </div>

            <div className={styles.variantFormRow}>
              <div className={styles.variantFormGroup}>
                <label>Thuộc tính *</label>
                <select
                  value={newVariant.attributeId}
                  onChange={(e) => {
                    const attributeId = e.target.value;
                    setSelectedAttributeId(attributeId);
                    setNewVariant({
                      ...newVariant,
                      attributeId,
                      valueId: "",
                      sku: "",
                    });
                  }}
                  className={styles.variantFormSelect}
                >
                  <option value="">Chọn thuộc tính...</option>
                  {attributes.map((attr) => (
                    <option key={attr._id} value={attr._id}>
                      {attr.attributeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.variantFormGroup}>
                <label>Giá trị *</label>
                <select
                  value={newVariant.valueId}
                  onChange={(e) => {
                    const valueId = e.target.value;
                    setNewVariant({
                      ...newVariant,
                      valueId,
                      sku: valueId
                        ? generateSKU(newVariant.attributeId, valueId)
                        : "",
                    });
                  }}
                  className={styles.variantFormSelect}
                  disabled={!newVariant.attributeId}
                >
                  <option value="">Chọn giá trị...</option>
                  {getAvailableValues(newVariant.attributeId).map((value) => (
                    <option key={value._id} value={value._id}>
                      {value.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.variantFormGroup}>
                <label>Giá cũ (VNĐ)</label>
                <input
                  type="number"
                  min="0"
                  value={newVariant.oldPrice}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      oldPrice: e.target.value,
                    })
                  }
                  placeholder="0"
                  className={styles.variantFormInput}
                />
              </div>

              <div className={styles.variantFormGroup}>
                <label>Giá bán (VNĐ) *</label>
                <input
                  type="number"
                  min="0"
                  value={newVariant.price}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      price: e.target.value,
                    })
                  }
                  placeholder="0"
                  className={styles.variantFormInput}
                  required
                />
              </div>

              <div className={styles.variantFormGroup}>
                <label>Tồn kho</label>
                <input
                  type="number"
                  min="0"
                  value={newVariant.stock}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      stock: e.target.value,
                    })
                  }
                  placeholder="0"
                  className={styles.variantFormInput}
                />
              </div>

              <div className={styles.variantFormGroup}>
                <label>SKU</label>
                <input
                  type="text"
                  value={newVariant.sku}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      sku: e.target.value,
                    })
                  }
                  placeholder="Mã SKU tự động"
                  className={styles.variantFormInput}
                />
              </div>
            </div>

            <div className={styles.variantFormActions}>
              <button
                type="button"
                onClick={resetForm}
                className={styles.cancelVariantBtn}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddVariant}
                className={styles.saveVariantBtn}
                disabled={
                  !newVariant.attributeId ||
                  !newVariant.valueId ||
                  !newVariant.price
                }
              >
                <FiPlus />
                Thêm biến thể
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Edit Variants */}
      {variants.length > 0 && (
        <div className={styles.quickEditVariants}>
          <h6>Chỉnh sửa nhanh</h6>
          <div className={styles.variantsTable}>
            <div className={styles.variantTableHeader}>
              <span>Thuộc tính</span>
              <span>Giá trị</span>
              <span>SKU</span>
              <span>Giá cũ</span>
              <span>Giá bán</span>
              <span>Kho</span>
              <span>Hành động</span>
            </div>

            {variants.map((variant, index) => (
              <div key={variant.id || index} className={styles.variantRow}>
                <span className={styles.variantAttribute}>
                  {getAttributeName(variant.attributeId)}
                </span>

                <span className={styles.variantValue}>
                  {getValueName(variant.valueId)}
                </span>

                <input
                  type="text"
                  value={variant.sku || ""}
                  onChange={(e) =>
                    handleUpdateVariant(variant.id, "sku", e.target.value)
                  }
                  placeholder="SKU..."
                  className={styles.variantInput}
                />

                <input
                  type="number"
                  min="0"
                  value={variant.oldPrice || ""}
                  onChange={(e) =>
                    handleUpdateVariant(variant.id, "oldPrice", e.target.value)
                  }
                  placeholder="0"
                  className={styles.variantInput}
                />

                <input
                  type="number"
                  min="0"
                  value={variant.price || ""}
                  onChange={(e) =>
                    handleUpdateVariant(variant.id, "price", e.target.value)
                  }
                  placeholder="0"
                  className={styles.variantInput}
                  required
                />

                <input
                  type="number"
                  min="0"
                  value={variant.stock || ""}
                  onChange={(e) =>
                    handleUpdateVariant(variant.id, "stock", e.target.value)
                  }
                  placeholder="0"
                  className={styles.variantInput}
                />

                <button
                  type="button"
                  onClick={() => handleRemoveVariant(variant.id)}
                  className={styles.deleteVariantBtn}
                  title="Xóa biến thể"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantManager;
