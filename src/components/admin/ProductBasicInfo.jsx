import { useState, useEffect } from "react";
import styles from "./ProductBasicInfo.module.css";

const ProductBasicInfo = ({
  form,
  onFormChange,
  subCategories = [],
  brands = [],
  generateSlug,
  formatPrice,
  calculateDiscountedPrice,
}) => {
  const [pricePreview, setPricePreview] = useState(null);

  useEffect(() => {
    if (form.priceDefault) {
      const basePrice = parseFloat(form.priceDefault);
      const discount = parseFloat(form.discountPercentage) || 0;

      setPricePreview({
        original: basePrice,
        discounted:
          discount > 0 ? calculateDiscountedPrice(basePrice, discount) : null,
        discount,
      });
    } else {
      setPricePreview(null);
    }
  }, [form.priceDefault, form.discountPercentage, calculateDiscountedPrice]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    const seoTitle = title.length > 60 ? title.substring(0, 60) : title;

    onFormChange({
      ...form,
      title,
      slug,
      seoTitle,
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    onFormChange({ ...form, tags });
  };

  return (
    <div className={styles.basicInfoContainer}>
      {/* Basic Information Section */}
      <div className={styles.formSection}>
        <h5 className={styles.sectionTitle}>Thông tin cơ bản</h5>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>Tên sản phẩm</span>
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={form.title || ""}
              onChange={handleTitleChange}
              placeholder="Nhập tên sản phẩm..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Slug</label>
            <input
              type="text"
              className={`${styles.formInput} ${styles.slugInput}`}
              value={form.slug || ""}
              onChange={(e) => onFormChange({ ...form, slug: e.target.value })}
              placeholder="slug-tu-dong-tao"
              readOnly
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>Danh mục</span>
              <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.formInput}
              value={form.subCategoryId || ""}
              onChange={(e) =>
                onFormChange({ ...form, subCategoryId: e.target.value })
              }
              required
            >
              <option value="">Chọn danh mục...</option>
              {subCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>Thương hiệu</span>
              <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.formInput}
              value={form.brandId || ""}
              onChange={(e) =>
                onFormChange({ ...form, brandId: e.target.value })
              }
              required
            >
              <option value="">Chọn thương hiệu...</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Mô tả ngắn</label>
          <textarea
            rows={3}
            className={styles.formTextarea}
            value={form.shortDescription || ""}
            onChange={(e) =>
              onFormChange({ ...form, shortDescription: e.target.value })
            }
            placeholder="Mô tả ngắn về sản phẩm..."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <span>Mô tả chi tiết</span>
            <span className={styles.required}>*</span>
          </label>
          <textarea
            rows={5}
            className={styles.formTextarea}
            value={form.description || ""}
            onChange={(e) =>
              onFormChange({ ...form, description: e.target.value })
            }
            placeholder="Mô tả chi tiết về sản phẩm..."
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Thông số kỹ thuật</label>
          <textarea
            rows={4}
            className={styles.formTextarea}
            value={form.specifications || ""}
            onChange={(e) =>
              onFormChange({ ...form, specifications: e.target.value })
            }
            placeholder="Kích thước, chất liệu, xuất xứ..."
          />
        </div>
      </div>

      {/* Pricing & Inventory Section */}
      <div className={styles.formSection}>
        <h5 className={styles.sectionTitle}>Giá cả & Kho hàng</h5>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>Giá gốc (VNĐ)</span>
              <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              min="0"
              className={styles.formInput}
              value={form.priceDefault || ""}
              onChange={(e) =>
                onFormChange({ ...form, priceDefault: e.target.value })
              }
              placeholder="0"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phần trăm giảm giá (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={styles.formInput}
              value={form.discountPercentage || ""}
              onChange={(e) =>
                onFormChange({ ...form, discountPercentage: e.target.value })
              }
              placeholder="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số lượng tồn kho</label>
            <input
              type="number"
              min="0"
              className={styles.formInput}
              value={form.stockTotal || ""}
              onChange={(e) =>
                onFormChange({ ...form, stockTotal: e.target.value })
              }
              placeholder="0"
            />
          </div>
        </div>

        {/* Sales & Rating Info (Read-only) */}
        {(form.soldCount > 0 ||
          form.averageRating > 0 ||
          form.ratingCount > 0) && (
          <div className={styles.statsSection}>
            <h6 className={styles.statsTitle}>Thống kê bán hàng</h6>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <label className={styles.statLabel}>Đã bán</label>
                <span className={styles.statValue}>
                  {form.soldCount || 0} sản phẩm
                </span>
              </div>

              <div className={styles.statItem}>
                <label className={styles.statLabel}>Đánh giá trung bình</label>
                <span className={styles.statValue}>
                  {form.averageRating
                    ? `${form.averageRating.toFixed(1)} ⭐`
                    : "Chưa có đánh giá"}
                </span>
              </div>

              <div className={styles.statItem}>
                <label className={styles.statLabel}>Số lượt đánh giá</label>
                <span className={styles.statValue}>
                  {form.ratingCount || 0} lượt
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Price Preview */}
        {pricePreview && (
          <div className={styles.pricePreview}>
            <strong>Giá hiển thị: </strong>
            {pricePreview.discount > 0 ? (
              <div className={styles.pricePreviewContent}>
                <span className={styles.discountedPrice}>
                  {formatPrice(pricePreview.discounted)}
                </span>
                <span className={styles.originalPrice}>
                  {formatPrice(pricePreview.original)}
                </span>
                <span className={styles.discountBadge}>
                  -{pricePreview.discount}%
                </span>
              </div>
            ) : (
              <span className={styles.singlePrice}>
                {formatPrice(pricePreview.original)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* SEO & Others Section */}
      <div className={styles.formSection}>
        <h5 className={styles.sectionTitle}>SEO & Khác</h5>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>SEO Title</label>
            <input
              type="text"
              className={styles.formInput}
              value={form.seoTitle || ""}
              onChange={(e) =>
                onFormChange({ ...form, seoTitle: e.target.value })
              }
              placeholder="Tiêu đề SEO..."
              maxLength="60"
            />
            <small className={styles.helpText}>
              {(form.seoTitle || "").length}/60 ký tự
            </small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tags</label>
            <input
              type="text"
              className={styles.formInput}
              value={(form.tags || []).join(", ")}
              onChange={handleTagsChange}
              placeholder="tag1, tag2, tag3..."
            />
            <small className={styles.helpText}>Phân cách bằng dấu phẩy</small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>SEO Description</label>
          <textarea
            rows={3}
            className={styles.formTextarea}
            value={form.seoDescription || ""}
            onChange={(e) =>
              onFormChange({ ...form, seoDescription: e.target.value })
            }
            placeholder="Mô tả SEO..."
            maxLength="160"
          />
          <small className={styles.helpText}>
            {(form.seoDescription || "").length}/160 ký tự
          </small>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive !== undefined ? form.isActive : true}
              onChange={(e) =>
                onFormChange({ ...form, isActive: e.target.checked })
              }
            />
            <label htmlFor="isActive" className={styles.checkboxLabel}>
              Hiển thị sản phẩm
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
