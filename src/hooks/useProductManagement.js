import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  createProduct,
  getProducts,
  softDeleteProduct,
  updateProduct,
} from "../api/product";
import { getCategories } from "../api/categoris";
import { getBrands } from "../api/brands";
import { getAttributes } from "../api/attribute";

export const useProductManagement = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Generate slug from title
  const generateSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }, []);

  // Format price
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  // Calculate discounted price
  const calculateDiscountedPrice = useCallback((price, discount) => {
    return price - (price * discount) / 100;
  }, []);

  // Fetch functions
  const fetchSubCategories = useCallback(async () => {
    try {
      const res = await getCategories({ limit: 100 });
      setSubCategories(res.data.data.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Không thể tải danh sách danh mục!");
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await getBrands({ limit: 100 });
      setBrands(res.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Không thể tải danh sách thương hiệu!");
    }
  }, []);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const { page = 1, limit = 10, search = "", isTrash = false } = params;

      const res = await getProducts({
        page,
        limit,
        search,
        trash: isTrash ? "true" : "false",
      });

      setProducts(res.data.data.data || []);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttributes = useCallback(async () => {
    try {
      const res = await getAttributes();
      setAttributes(res.data.data || []);
    } catch (error) {
      console.error("Error fetching attributes:", error);
      toast.error("Không thể tải danh sách thuộc tính!");
    }
  }, []);

  // CRUD operations
  const createNewProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      await createProduct(productData);
      toast.success("Thêm sản phẩm thành công!");
      return { success: true };
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm!"
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingProduct = useCallback(async (id, productData) => {
    try {
      setLoading(true);
      await updateProduct(id, productData);
      toast.success("Cập nhật sản phẩm thành công!");
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm!"
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      await softDeleteProduct(id);
      toast.success("Xóa sản phẩm thành công!");
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper functions
  const getBrandName = useCallback(
    (brandId) => {
      if (typeof brandId === "object" && brandId?.name) {
        return brandId.name;
      }
      const brand = brands.find((b) => b._id === brandId);
      return brand ? brand.title : "Không xác định";
    },
    [brands]
  );

  const getSubCategoryName = useCallback(
    (subCategoryId) => {
      if (typeof subCategoryId === "object" && subCategoryId?.title) {
        return subCategoryId.title;
      }
      const subCategory = subCategories.find((sc) => sc._id === subCategoryId);
      return subCategory ? subCategory.title : "Không xác định";
    },
    [subCategories]
  );

  // Validation functions
  const validateProductData = useCallback((productData) => {
    const errors = [];

    if (!productData.title?.trim()) {
      errors.push("Tên sản phẩm là bắt buộc");
    }

    if (!productData.subCategoryId) {
      errors.push("Danh mục là bắt buộc");
    }

    if (!productData.brandId) {
      errors.push("Thương hiệu là bắt buộc");
    }

    if (
      !productData.priceDefault ||
      parseFloat(productData.priceDefault) <= 0
    ) {
      errors.push("Giá sản phẩm phải lớn hơn 0");
    }

    if (
      productData.discountPercentage &&
      (parseFloat(productData.discountPercentage) < 0 ||
        parseFloat(productData.discountPercentage) > 100)
    ) {
      errors.push("Phần trăm giảm giá phải từ 0 đến 100");
    }

    // Validate stock
    if (productData.stockTotal && parseInt(productData.stockTotal) < 0) {
      errors.push("Số lượng tồn kho không được âm");
    }

    // Validate sold count (should not be negative)
    if (productData.soldCount && parseInt(productData.soldCount) < 0) {
      errors.push("Số lượng đã bán không được âm");
    }

    // Validate rating
    if (
      productData.averageRating &&
      (parseFloat(productData.averageRating) < 0 ||
        parseFloat(productData.averageRating) > 5)
    ) {
      errors.push("Đánh giá trung bình phải từ 0 đến 5");
    }

    // Validate rating count
    if (productData.ratingCount && parseInt(productData.ratingCount) < 0) {
      errors.push("Số lượt đánh giá không được âm");
    }

    // Validate variants if any
    if (productData.variants?.length > 0) {
      const invalidVariants = productData.variants.filter(
        (v) => !v.price || parseFloat(v.price) <= 0
      );
      if (invalidVariants.length > 0) {
        errors.push("Tất cả biến thể phải có giá hợp lệ");
      }
    }

    return errors;
  }, []);

  return {
    // State
    loading,
    products,
    subCategories,
    brands,
    attributes,
    totalPages,

    // Fetch functions
    fetchProducts,
    fetchSubCategories,
    fetchBrands,
    fetchAttributes,

    // CRUD operations
    createNewProduct,
    updateExistingProduct,
    deleteProduct,

    // Helper functions
    generateSlug,
    formatPrice,
    calculateDiscountedPrice,
    getBrandName,
    getSubCategoryName,
    validateProductData,
  };
};
