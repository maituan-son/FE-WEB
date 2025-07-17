import { FiEdit2, FiTrash2, FiImage, FiEye, FiStar } from "react-icons/fi";
import styles from "./ProductTableRow.module.css";

const ProductTableRow = ({
  product,
  index,
  currentPage,
  limit,
  onEdit,
  onDelete,
  formatPrice,
  calculateDiscountedPrice,
  getBrandName,
  getSubCategoryName,
}) => {
  const handleView = () => {
    window.open(`/product/${product.slug}`, "_blank");
  };

  return (
    <tr key={product._id}>
      <td data-label="STT">{index + 1 + (currentPage - 1) * limit}</td>
      <td data-label="Ảnh" className={styles.imageCell}>
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>
            <FiImage />
          </div>
        )}
      </td>
      <td data-label="Tên sản phẩm" className={styles.titleCell}>
        <div className={styles.productInfo}>
          <span className={styles.productTitle}>{product.title}</span>
          <small className={styles.productDescription}>
            {product.shortDescription?.length > 50
              ? `${product.shortDescription.substring(0, 50)}...`
              : product.shortDescription}
          </small>
        </div>
      </td>
      <td data-label="Danh mục" className={styles.categoryCell}>
        <span className={styles.categoryName}>
          {getSubCategoryName(product.subCategoryId)}
        </span>
      </td>
      <td data-label="Thương hiệu" className={styles.brandCell}>
        <span className={styles.brandName}>
          {getBrandName(product.brandId)}
        </span>
      </td>
      <td data-label="Giá" className={styles.priceCell}>
        <div className={styles.priceInfo}>
          {product.discountPercentage > 0 ? (
            <>
              <span className={styles.discountedPrice}>
                {formatPrice(
                  calculateDiscountedPrice(
                    product.priceDefault,
                    product.discountPercentage
                  )
                )}
              </span>
              <span className={styles.originalPrice}>
                {formatPrice(product.priceDefault)}
              </span>
              <span className={styles.discountBadge}>
                -{product.discountPercentage}%
              </span>
            </>
          ) : (
            <span className={styles.price}>
              {formatPrice(product.priceDefault)}
            </span>
          )}
        </div>
      </td>
      <td data-label="Kho" className={styles.stockCell}>
        <span
          className={`${styles.stockBadge} ${
            product.stockTotal > 10
              ? styles.inStock
              : product.stockTotal > 0
              ? styles.lowStock
              : styles.outOfStock
          }`}
        >
          {product.stockTotal || 0}
        </span>
      </td>
      <td data-label="Đánh giá" className={styles.ratingCell}>
        <div className={styles.ratingInfo}>
          <div className={styles.stars}>
            <FiStar />
            <span>{product.averageRating?.toFixed(1) || "0.0"}</span>
          </div>
          <small>({product.ratingCount || 0} đánh giá)</small>
        </div>
      </td>
      <td data-label="Trạng thái" className={styles.statusCell}>
        <span
          className={`${styles.statusBadge} ${
            product.isActive ? styles.active : styles.inactive
          }`}
        >
          {product.isActive ? "Hiển thị" : "Ẩn"}
        </span>
      </td>
      <td data-label="Hành động" className={styles.actionCell}>
        <div className={styles.actionButtons}>
          <button
            className={styles.viewButton}
            onClick={handleView}
            title="Xem sản phẩm"
          >
            <FiEye />
          </button>
          <button
            className={styles.editButton}
            onClick={() => onEdit(product)}
            title="Chỉnh sửa"
          >
            <FiEdit2 />
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(product._id)}
            title="Xóa"
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
