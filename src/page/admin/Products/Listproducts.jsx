import { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./ListProducts.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiImage,
  FiEye,
  FiPlus,
  FiPackage,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";

// Custom hooks and components
import { useProductManagement } from "../../../hooks/useProductManagement";
import ProductBasicInfo from "../../../components/admin/ProductBasicInfo";
import ProductImageUpload from "../../../components/admin/ProductImageUpload";
import ProductVariantManager from "../../../components/admin/ProductVariantManager";
import ProductTableRow from "../../../components/admin/ProductTableRow";
import Pagination from "../../../components/admin/Pagination";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

function ListProducts() {
  // State loading khi submit sản phẩm
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm] = useState("");
  const [limit] = useState(10);
  const [isTrash] = useState(false);

  // Use custom hook for product management
  const {
    loading,
    products,
    subCategories,
    brands,
    attributes,
    totalPages,
    fetchProducts,
    fetchSubCategories,
    fetchBrands,
    fetchAttributes,
    createNewProduct,
    updateExistingProduct,
    deleteProduct,
    generateSlug,
    formatPrice,
    calculateDiscountedPrice,
    getBrandName,
    getSubCategoryName,
    validateProductData,
  } = useProductManagement();

  const [form, setForm] = useState({
    title: "",
    thumbnail: "",
    images: [],
    description: "",
    shortDescription: "",
    specifications: "",
    priceDefault: "",
    discountPercentage: "",
    slug: "",
    brandId: "",
    subCategoryId: "",
    soldCount: 0,
    averageRating: 0,
    ratingCount: 0,
    seoTitle: "",
    seoDescription: "",
    tags: [],
    variants: [],
    isActive: true,
    stockTotal: "",
  });

  // State for image upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchProducts({
          page: currentPage,
          limit,
          search: searchTerm,
          isTrash,
        }),
        fetchSubCategories(),
        fetchBrands(),
        fetchAttributes(),
      ]);
    };
    loadData();
  }, [currentPage, limit, searchTerm, isTrash]);

  // Reset form when modal closes
  const resetForm = () => {
    setForm({
      title: "",
      thumbnail: "",
      images: [],
      description: "",
      shortDescription: "",
      specifications: "",
      priceDefault: "",
      discountPercentage: "",
      slug: "",
      brandId: "",
      subCategoryId: "",
      soldCount: 0,
      averageRating: 0,
      ratingCount: 0,
      seoTitle: "",
      seoDescription: "",
      tags: [],
      variants: [],
      isActive: true,
      stockTotal: "",
    });
    setSelectedFiles([]);
    setEditId(null);
  };

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = (product = null) => {
    if (product) {
      setForm({
        title: product.title || "",
        thumbnail: product.thumbnail || "",
        images: product.images || [],
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        specifications: product.specifications || "",
        priceDefault: product.priceDefault || "",
        discountPercentage: product.discountPercentage || "",
        slug: product.slug || "",
        brandId: product.brandId?._id || product.brandId || "",
        subCategoryId:
          product.subCategoryId?._id || product.subCategoryId || "",
        soldCount: product.soldCount || 0,
        averageRating: product.averageRating || 0,
        ratingCount: product.ratingCount || 0,
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        tags: product.tags || [],
        variants: product.variants || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        stockTotal: product.stockTotal || "",
      });
      setEditId(product._id);
    } else {
      resetForm();
    }
    setShow(true);
  };

  // Handle image uploads
  const handleImagesChange = (updatedImages, files = []) => {
    setForm((prev) => ({ ...prev, images: updatedImages }));
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  // Handle variants change
  const handleVariantsChange = (updatedVariants) => {
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Validate product data
      const validationErrors = validateProductData(form);
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
        setSubmitting(false);
        return;
      }

      // Upload images if any
      let imageUrls = [...form.images];
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        // Here you would upload images to your server
        // const uploadedUrls = await uploadImages(selectedFiles);
        // imageUrls = [...imageUrls, ...uploadedUrls];
      }

      const productData = {
        ...form,
        images: imageUrls,
        thumbnail: imageUrls[0] || form.thumbnail,
        priceDefault: parseFloat(form.priceDefault),
        discountPercentage: parseFloat(form.discountPercentage) || 0,
        stockTotal: parseInt(form.stockTotal) || 0,
        soldCount: parseInt(form.soldCount) || 0,
        averageRating: parseFloat(form.averageRating) || 0,
        ratingCount: parseInt(form.ratingCount) || 0,
        variants: form.variants.map((variant) => ({
          attributeId: variant.attributeId,
          valueId: variant.valueId,
          stock: parseInt(variant.stock) || 0,
          price: parseFloat(variant.price) || 0,
          oldPrice: parseFloat(variant.oldPrice) || 0,
          sku: variant.sku || "",
        })),
      };

      let result;
      if (editId) {
        result = await updateExistingProduct(editId, productData);
      } else {
        result = await createNewProduct(productData);
      }

      if (result.success) {
        await fetchProducts({
          page: currentPage,
          limit,
          search: searchTerm,
          isTrash,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setUploadingImages(false);
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const result = await deleteProduct(id);
      if (result.success) {
        await fetchProducts({
          page: currentPage,
          limit,
          search: searchTerm,
          isTrash,
        });
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <LoadingSpinner size="large" message="Đang tải danh sách sản phẩm..." />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <h2 className={styles.pageTitle}>Quản lý sản phẩm</h2>
          <p className={styles.pageSubtitle}>Quản lý sản phẩm của cửa hàng</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.addButton} onClick={() => handleShow()}>
            <FiPlus className={styles.buttonIcon} />
            Thêm sản phẩm mới
          </button>
          <Link to="/admin/products/trash" className={styles.trashButton}>
            <FiTrash2 className={styles.buttonIcon} />
            Thùng rác
          </Link>
        </div>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <FiPackage size={64} className={styles.emptyIcon} />
            <h3>Chưa có sản phẩm nào</h3>
            <p>Hãy thêm sản phẩm đầu tiên của bạn</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Thương hiệu</th>
                    <th>Giá</th>
                    <th>Kho</th>
                    <th>Đánh giá</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <ProductTableRow
                      key={product._id}
                      product={product}
                      index={index}
                      currentPage={currentPage}
                      limit={limit}
                      onEdit={handleShow}
                      onDelete={handleSoftDelete}
                      formatPrice={formatPrice}
                      calculateDiscountedPrice={calculateDiscountedPrice}
                      getBrandName={getBrandName}
                      getSubCategoryName={getSubCategoryName}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              disabled={loading}
            />
          </>
        )}

        {/* Modal Form */}
        <Modal
          show={show}
          onHide={handleClose}
          className={styles.customModal}
          size="xl"
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              {editId ? "Cập nhật" : "Thêm mới"} sản phẩm
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body className={styles.modalBody}>
              {/* Basic Product Information */}
              <ProductBasicInfo
                form={form}
                onFormChange={setForm}
                subCategories={subCategories}
                brands={brands}
                generateSlug={generateSlug}
                formatPrice={formatPrice}
                calculateDiscountedPrice={calculateDiscountedPrice}
              />

              {/* Image Upload Section */}
              <div className={styles.formSection}>
                <ProductImageUpload
                  images={form.images}
                  onImagesChange={handleImagesChange}
                  maxFiles={10}
                />
              </div>

              {/* Product Variants */}
              <ProductVariantManager
                variants={form.variants}
                onVariantsChange={handleVariantsChange}
                attributes={attributes}
                formatPrice={formatPrice}
              />
            </Modal.Body>

            <Modal.Footer className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.modalButton} ${styles.secondaryButton}`}
                onClick={handleClose}
                disabled={loading || uploadingImages}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`${styles.modalButton} ${styles.primaryButton}`}
                disabled={submitting || uploadingImages}
              >
                {submitting || uploadingImages ? (
                  <span className={styles.loadingText}>
                    <div className={styles.miniSpinner}></div>
                    {uploadingImages
                      ? "Đang upload ảnh..."
                      : editId
                      ? "Đang cập nhật..."
                      : "Đang thêm..."}
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

export default ListProducts;
