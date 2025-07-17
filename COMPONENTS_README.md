# Components Documentation

Sau khi tối ưu, dự án đã được tách thành các components nhỏ và có thể tái sử dụng. Dưới đây là hướng dẫn sử dụng các components mới:

## 🏗️ Cấu trúc Components

### 1. **ProductBasicInfo** (`src/components/admin/ProductBasicInfo.jsx`)

Component quản lý thông tin cơ bản của sản phẩm.

**Props:**

- `form`: Object chứa dữ liệu form sản phẩm
- `onFormChange`: Function để cập nhật form
- `subCategories`: Array danh sách danh mục con
- `brands`: Array danh sách thương hiệu
- `generateSlug`: Function tạo slug từ title
- `formatPrice`: Function format giá tiền
- `calculateDiscountedPrice`: Function tính giá sau giảm

**Tính năng:**

- Tự động tạo slug khi nhập tên sản phẩm
- Preview giá sau khi giảm giá
- Validation form theo real-time
- SEO optimization fields

### 2. **ProductImageUpload** (`src/components/admin/ProductImageUpload.jsx`)

Component upload và quản lý hình ảnh sản phẩm.

**Props:**

- `images`: Array các URL hình ảnh hiện tại
- `onImagesChange`: Function callback khi thay đổi hình ảnh
- `maxFiles`: Số lượng file tối đa (mặc định: 10)
- `maxSizePerFile`: Kích thước file tối đa (mặc định: 5MB)

**Tính năng:**

- Drag & drop upload
- Preview hình ảnh realtime
- Validation kích thước và số lượng file
- Đánh dấu ảnh chính (thumbnail)
- Xóa hình ảnh đã chọn

### 3. **ProductVariantManager** (`src/components/admin/ProductVariantManager.jsx`)

Component quản lý biến thể sản phẩm (size, color, v.v.).

**Props:**

- `variants`: Array các biến thể hiện tại
- `onVariantsChange`: Function callback khi thay đổi biến thể
- `attributes`: Array thuộc tính có sẵn
- `formatPrice`: Function format giá tiền

**Tính năng:**

- Thêm/xóa biến thể
- Auto-generate SKU
- Quick edit trong bảng
- Validation giá và số lượng
- Hiển thị preview biến thể

### 4. **ProductTableRow** (`src/components/admin/ProductTableRow.jsx`)

Component hiển thị một dòng trong bảng sản phẩm.

**Props:**

- `product`: Object thông tin sản phẩm
- `index`: Số thứ tự
- `currentPage`, `limit`: Cho pagination
- `onEdit`, `onDelete`: Callback functions
- `formatPrice`, `calculateDiscountedPrice`: Helper functions
- `getBrandName`, `getSubCategoryName`: Helper functions

### 5. **Pagination** (`src/components/admin/Pagination.jsx`)

Component phân trang có thể tái sử dụng.

**Props:**

- `currentPage`: Trang hiện tại
- `totalPages`: Tổng số trang
- `onPageChange`: Function callback khi chuyển trang
- `disabled`: Disable toàn bộ pagination

**Tính năng:**

- Smart pagination với dots (...)
- Responsive design
- Keyboard navigation
- Loading state support

### 6. **LoadingSpinner** (`src/components/ui/LoadingSpinner.jsx`)

Component loading spinner đa dạng.

**Props:**

- `size`: "small" | "medium" | "large"
- `message`: Text hiển thị
- `overlay`: Hiển thị dạng overlay toàn màn hình
- `className`: CSS class tùy chỉnh

**Tính năng:**

- Multiple spinner styles
- Responsive sizes
- Overlay mode
- Customizable messages

## 🔧 Custom Hook

### **useProductManagement** (`src/hooks/useProductManagement.js`)

Hook tổng hợp tất cả logic quản lý sản phẩm.

**Returns:**

```javascript
{
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
    validateProductData;
}
```

## 📝 Cách sử dụng

### Ví dụ sử dụng trong component:

```jsx
import { useProductManagement } from "../../../hooks/useProductManagement";
import ProductBasicInfo from "../../../components/admin/ProductBasicInfo";
import ProductImageUpload from "../../../components/admin/ProductImageUpload";
import ProductVariantManager from "../../../components/admin/ProductVariantManager";
import Pagination from "../../../components/admin/Pagination";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

function YourComponent() {
  const {
    loading,
    products,
    subCategories,
    brands,
    attributes,
    totalPages,
    // ... other values
  } = useProductManagement();

  const [form, setForm] = useState({
    /* initial form state */
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Render components
  return (
    <div>
      {loading ? (
        <LoadingSpinner size="large" />
      ) : (
        <>
          <ProductBasicInfo
            form={form}
            onFormChange={setForm}
            subCategories={subCategories}
            brands={brands}
            // ... other props
          />

          <ProductImageUpload
            images={form.images}
            onImagesChange={(images) => setForm({ ...form, images })}
          />

          <ProductVariantManager
            variants={form.variants}
            onVariantsChange={(variants) => setForm({ ...form, variants })}
            attributes={attributes}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
```

## 🎨 CSS Modules

Tất cả components đều sử dụng CSS Modules để tránh xung đột CSS và dễ dàng customize:

- Responsive design
- Consistent color scheme
- Smooth animations
- Accessibility support
- Cross-browser compatibility

## 🔄 Benefits của việc tách components:

1. **Reusability**: Có thể tái sử dụng ở nhiều nơi
2. **Maintainability**: Dễ bảo trì và debug
3. **Testability**: Dễ test từng component riêng biệt
4. **Performance**: Lazy loading và code splitting
5. **Separation of Concerns**: Mỗi component có trách nhiệm riêng
6. **Type Safety**: Dễ dàng thêm TypeScript sau này

## 🚀 Performance Optimizations:

- **useCallback** và **useMemo** để tránh re-render không cần thiết
- **Lazy loading** cho các component lớn
- **Virtual scrolling** cho danh sách dài
- **Debouncing** cho search và filter
- **Image optimization** với lazy loading
- **Bundle splitting** theo feature

## 📱 Responsive Design:

Tất cả components đều được thiết kế responsive:

- Mobile-first approach
- Flexible grid system
- Touch-friendly interactions
- Optimized for different screen sizes
