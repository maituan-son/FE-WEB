import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./ListProducts.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiImage,
  FiEye,
  FiPlus,
  FiPackage,
  FiTag,
  FiStar,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import {
  createProduct,
  getProducts,
  softDeleteProduct,
  updateProduct,
} from "../../../api/product";
import { getCategories } from "../../../api/categoris"; // API cho subcategories
import { getBrands } from "../../../api/brands"; // API cho brands
import { createAttribute } from "../../../api/attribute";
import { createAttributeValue } from "../../../api/attribute-Value";

function ListProducts() {
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isTrash] = useState(false);

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
    seoTitle: "",
    seoDescription: "",
    tags: [],
    variants: [],
    isActive: true,
    stockTotal: "",
  });

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for image upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // State for variants management
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
    attributeId: "",
    valueId: "",
    stock: "",
    price: "",
    oldPrice: "",
    sku: "",
  });

  // Fetch data functions
  const fetchSubCategories = useCallback(async () => {
    try {
      const res = await getCategories({ limit: 100 });
      setSubCategories(res.data.data.data || []);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await getBrands({ limit: 100 });

      setBrands(res.data.data || []);
    } catch (error) {
      console.log("Error fetching brands:", error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProducts({
        page: currentPage,
        limit,
        search: searchTerm,
        trash: isTrash ? "true" : "false",
      });
      console.log("Fetched products:", res.data.data.data);
      setProducts(res.data.data.data);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, isTrash]);

  const fetchAttributes = useCallback(async () => {
    try {
      // Mock data - thay bằng API thật
      setAttributes([
        { id: "1", name: "Màu sắc", attributeCode: "color" },
        { id: "2", name: "Kích thước", attributeCode: "size" },
        { id: "3", name: "Chất liệu", attributeCode: "material" },
      ]);
    } catch (error) {
      console.log("Error fetching attributes:", error);
    }
  }, []);

  const fetchAttributeValues = useCallback(async () => {
    try {
      // Mock data - thay bằng API thật
      setAttributeValues([
        { id: "v1", attributeId: "1", name: "Đỏ" },
        { id: "v2", attributeId: "1", name: "Xanh" },
        { id: "v3", attributeId: "1", name: "Vàng" },
        { id: "v4", attributeId: "2", name: "S" },
        { id: "v5", attributeId: "2", name: "M" },
        { id: "v6", attributeId: "2", name: "L" },
        { id: "v7", attributeId: "2", name: "XL" },
        { id: "v8", attributeId: "3", name: "Cotton" },
        { id: "v9", attributeId: "3", name: "Polyester" },
      ]);
    } catch (error) {
      console.log("Error fetching attribute values:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSubCategories();
    fetchBrands();
    fetchAttributes();
    fetchAttributeValues();
  }, [
    fetchProducts,
    fetchSubCategories,
    fetchBrands,
    fetchAttributes,
    fetchAttributeValues,
  ]);

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
      seoTitle: "",
      seoDescription: "",
      tags: [],
      variants: [], // Reset variants
      isActive: true,
      stockTotal: "",
    });
    setEditId(null);
    setSelectedFiles([]);
    setImagePreviews([]);
    // Reset variant form
    setShowVariantForm(false);
    setNewVariant({
      attributeId: "",
      valueId: "",
      stock: "",
      price: "",
      oldPrice: "",
      sku: "",
    });
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
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        tags: product.tags || [],
        variants: product.variants || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        stockTotal: product.stockTotal || "",
      });
      setImagePreviews(product.images || []);
      setEditId(product._id);
    } else {
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
        seoTitle: "",
        seoDescription: "",
        tags: [],
        variants: [],
        isActive: true,
        stockTotal: "",
      });
      setImagePreviews([]);
      setEditId(null);
    }
    setSelectedFiles([]);
    setShow(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    const seoTitle = title.length > 60 ? title.substring(0, 60) : title;
    setForm({ ...form, title, slug, seoTitle });
  };

  // Handle image uploads
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (index < form.images.length) {
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  // Handle tags
  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setForm({ ...form, tags });
  };

  // Variant management functions
  const handleAddVariant = () => {
    if (!newVariant.attributeId || !newVariant.valueId) {
      toast.error("Vui lòng chọn thuộc tính và giá trị!");
      return;
    }

    // Check for duplicate
    const exists = form.variants.some(
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

    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));

    // Reset form
    setNewVariant({
      attributeId: "",
      valueId: "",
      stock: "",
      price: "",
      oldPrice: "",
      sku: "",
    });

    setShowVariantForm(false);
    toast.success("Đã thêm biến thể mới!");
  };

  const handleRemoveVariant = (variantId) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== variantId),
    }));
    toast.success("Đã xóa biến thể!");
  };

  const handleUpdateVariant = (variantId, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) => {
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
      }),
    }));
  };

  const generateSKU = (attributeId, valueId) => {
    const attr = attributes.find((a) => a.id === attributeId);
    const value = attributeValues.find((v) => v.id === valueId);

    if (attr && value) {
      const attrCode =
        attr.attributeCode || attr.name.toLowerCase().replace(/\s/g, "");
      const valueCode = value.name.toLowerCase().replace(/\s/g, "");
      return `${attrCode}-${valueCode}-${Date.now().toString().slice(-4)}`;
    }
    return "";
  };

  const getAttributeName = (attributeId) => {
    const attr = attributes.find((a) => a.id === attributeId);
    return attr ? attr.name : "Unknown";
  };

  const getValueName = (valueId) => {
    const value = attributeValues.find((v) => v.id === valueId);
    return value ? value.name : "Unknown";
  };

  const getAvailableValues = (attributeId) => {
    return attributeValues.filter((v) => v.attributeId === attributeId);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Validate required fields
      if (
        !form.title ||
        !form.subCategoryId ||
        !form.brandId ||
        !form.priceDefault
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      // Validate variants if any
      if (form.variants.length > 0) {
        const invalidVariants = form.variants.filter(
          (v) => !v.price || v.price <= 0
        );
        if (invalidVariants.length > 0) {
          toast.error("Tất cả biến thể phải có giá hợp lệ!");
          return;
        }
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
        variants: form.variants.map((variant) => ({
          attributeId: variant.attributeId,
          valueId: variant.valueId,
          stock: parseInt(variant.stock) || 0,
          price: parseFloat(variant.price) || 0,
          oldPrice: parseFloat(variant.oldPrice) || 0,
          sku: variant.sku || "",
        })),
      };

      if (editId) {
        await updateProduct(editId, productData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(productData);
        toast.success("Thêm sản phẩm thành công!");
      }

      fetchProducts();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        setLoading(true);
        await softDeleteProduct(id);
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts();
      } catch {
        toast.error("Có lỗi xảy ra khi xóa!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper functions
  const getBrandName = (brandId) => {
    if (typeof brandId === "object" && brandId?.name) {
      return brandId.name;
    }
    const brand = brands.find((b) => b._id === brandId);
    return brand ? brand.title : "Không xác định";
  };

  const getSubCategoryName = (subCategoryId) => {
    if (typeof subCategoryId === "object" && subCategoryId?.title) {
      return subCategoryId.title;
    }
    const subCategory = subCategories.find((sc) => sc._id === subCategoryId);
    return subCategory ? subCategory.title : "Không xác định";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  if (loading && products.length === 0) {
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
                    <tr key={product._id}>
                      <td data-label="STT">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
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
                      <td
                        data-label="Tên sản phẩm"
                        className={styles.titleCell}
                      >
                        <div className={styles.productInfo}>
                          <span className={styles.productTitle}>
                            {product.title}
                          </span>
                          <small className={styles.productDescription}>
                            {product.shortDescription?.length > 50
                              ? `${product.shortDescription.substring(
                                  0,
                                  50
                                )}...`
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
                            <span>
                              {product.averageRating?.toFixed(1) || "0.0"}
                            </span>
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
                            onClick={() =>
                              window.open(`/product/${product.slug}`, "_blank")
                            }
                            title="Xem sản phẩm"
                          >
                            <FiEye />
                          </button>
                          <button
                            className={styles.editButton}
                            onClick={() => handleShow(product)}
                            title="Chỉnh sửa"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleSoftDelete(product._id)}
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
              {/* Basic Information */}
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
                      value={form.title}
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
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      placeholder="slug-tu-dong-tao"
                      required
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
                      value={form.subCategoryId}
                      onChange={(e) =>
                        setForm({ ...form, subCategoryId: e.target.value })
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
                      value={form.brandId}
                      onChange={(e) =>
                        setForm({ ...form, brandId: e.target.value })
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
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm({ ...form, shortDescription: e.target.value })
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
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
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
                    value={form.specifications}
                    onChange={(e) =>
                      setForm({ ...form, specifications: e.target.value })
                    }
                    placeholder="Kích thước, chất liệu, xuất xứ..."
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
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
                      value={form.priceDefault}
                      onChange={(e) =>
                        setForm({ ...form, priceDefault: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Phần trăm giảm giá (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className={styles.formInput}
                      value={form.discountPercentage}
                      onChange={(e) =>
                        setForm({ ...form, discountPercentage: e.target.value })
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
                      value={form.stockTotal}
                      onChange={(e) =>
                        setForm({ ...form, stockTotal: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Price Preview */}
                {form.priceDefault && (
                  <div className={styles.pricePreview}>
                    <strong>Giá hiển thị: </strong>
                    {form.discountPercentage > 0 ? (
                      <>
                        <span className={styles.discountedPricePreview}>
                          {formatPrice(
                            calculateDiscountedPrice(
                              parseFloat(form.priceDefault),
                              parseFloat(form.discountPercentage)
                            )
                          )}
                        </span>
                        <span className={styles.originalPricePreview}>
                          {formatPrice(parseFloat(form.priceDefault))}
                        </span>
                        <span className={styles.discountBadgePreview}>
                          -{form.discountPercentage}%
                        </span>
                      </>
                    ) : (
                      <span className={styles.pricePreview}>
                        {formatPrice(parseFloat(form.priceDefault))}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Images */}
              <div className={styles.formSection}>
                <h5 className={styles.sectionTitle}>Hình ảnh sản phẩm</h5>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Upload ảnh</label>
                  <div className={styles.imageUploadContainer}>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className={styles.fileInput}
                      hidden
                    />
                    <label
                      htmlFor="imageUpload"
                      className={styles.fileInputLabel}
                    >
                      <FiUpload className={styles.uploadIcon} />
                      <span>Chọn ảnh từ máy tính</span>
                      <small>JPG, PNG, WebP - Tối đa 5MB mỗi ảnh</small>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className={styles.imagePreviewContainer}>
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className={styles.imagePreview}>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className={styles.previewImage}
                          />
                          <button
                            type="button"
                            className={styles.removeImageButton}
                            onClick={() => removeImage(index)}
                          >
                            <FiX />
                          </button>
                          {index === 0 && (
                            <span className={styles.thumbnailBadge}>
                              Ảnh chính
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Variants Section - THÊM NGAY SAU PHẦN IMAGES */}
              <div className={styles.formSection}>
                <h5 className={styles.sectionTitle}>Biến thể sản phẩm</h5>

                {/* Current Variants List */}
                {form.variants.length > 0 && (
                  <div className={styles.currentVariantsList}>
                    <h6>
                      Danh sách biến thể hiện tại ({form.variants.length})
                    </h6>
                    <div className={styles.variantsList}>
                      {form.variants.map((variant, index) => (
                        <div
                          key={variant.id || index}
                          className={styles.variantItem}
                        >
                          <div className={styles.variantDetails}>
                            <span>
                              <strong>Thuộc tính:</strong>{" "}
                              {getAttributeName(variant.attributeId)}
                            </span>
                            <span>
                              <strong>Giá trị:</strong>{" "}
                              {getValueName(variant.valueId)}
                            </span>
                            <span>
                              <strong>SKU:</strong> {variant.sku}
                            </span>
                            <span>
                              <strong>Giá:</strong>{" "}
                              {formatPrice(variant.price || 0)}
                            </span>
                            <span>
                              <strong>Kho:</strong> {variant.stock || 0}
                            </span>
                          </div>
                          <div className={styles.variantActions}>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(variant.id)}
                              className={styles.deleteVariantBtn}
                              title="Xóa biến thể"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Variant Button */}
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
                      <h6>Thêm biến thể mới</h6>

                      <div className={styles.variantFormRow}>
                        <div className={styles.variantFormGroup}>
                          <label>Thuộc tính *</label>
                          <select
                            value={newVariant.attributeId}
                            onChange={(e) => {
                              const attributeId = e.target.value;
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
                              <option key={attr.id} value={attr.id}>
                                {attr.name}
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
                            {getAvailableValues(newVariant.attributeId).map(
                              (value) => (
                                <option key={value.id} value={value.id}>
                                  {value.name}
                                </option>
                              )
                            )}
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
                          onClick={() => {
                            setShowVariantForm(false);
                            setNewVariant({
                              attributeId: "",
                              valueId: "",
                              stock: "",
                              price: "",
                              oldPrice: "",
                              sku: "",
                            });
                          }}
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
                {form.variants.length > 0 && (
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

                      {form.variants.map((variant, index) => (
                        <div
                          key={variant.id || index}
                          className={styles.variantRow}
                        >
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
                              handleUpdateVariant(
                                variant.id,
                                "sku",
                                e.target.value
                              )
                            }
                            placeholder="SKU..."
                            className={styles.variantInput}
                          />

                          <input
                            type="number"
                            min="0"
                            value={variant.oldPrice || ""}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "oldPrice",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className={styles.variantInput}
                          />

                          <input
                            type="number"
                            min="0"
                            value={variant.price || ""}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "price",
                                e.target.value
                              )
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
                              handleUpdateVariant(
                                variant.id,
                                "stock",
                                e.target.value
                              )
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

              {/* SEO & Others */}
              <div className={styles.formSection}>
                <h5 className={styles.sectionTitle}>SEO & Khác</h5>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>SEO Title</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.seoTitle}
                      onChange={(e) =>
                        setForm({ ...form, seoTitle: e.target.value })
                      }
                      placeholder="Tiêu đề SEO..."
                      maxLength="60"
                    />
                    <small className={styles.helpText}>
                      {form.seoTitle.length}/60 ký tự
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Tags</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.tags.join(", ")}
                      onChange={handleTagsChange}
                      placeholder="tag1, tag2, tag3..."
                    />
                    <small className={styles.helpText}>
                      Phân cách bằng dấu phẩy
                    </small>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SEO Description</label>
                  <textarea
                    rows={3}
                    className={styles.formTextarea}
                    value={form.seoDescription}
                    onChange={(e) =>
                      setForm({ ...form, seoDescription: e.target.value })
                    }
                    placeholder="Mô tả SEO..."
                    maxLength="160"
                  />
                  <small className={styles.helpText}>
                    {form.seoDescription.length}/160 ký tự
                  </small>
                </div>

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
                      Hiển thị sản phẩm
                    </label>
                  </div>
                </div>
              </div>
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
                disabled={loading || uploadingImages}
              >
                {loading || uploadingImages ? (
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
