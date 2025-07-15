# Variant Manager Component

## Mô tả
Component `VariantManager` là một giao diện quản lý hiện đại và đẹp mắt để quản lý các biến thể sản phẩm (variants) với các tính năng CRUD đầy đủ.

## Tính năng

### ✨ Giao diện hiện đại
- Thiết kế gradient và animation mượt mà
- Responsive design cho mọi thiết bị
- Dark/Light theme support
- Loading states và error handling

### 📊 Thống kê realtime
- Tổng số variants
- Tổng tồn kho
- Số variants còn hàng
- Tổng giá trị inventory

### 🔍 Tìm kiếm và lọc
- Tìm kiếm theo SKU, thuộc tính, giá trị
- Lọc theo loại thuộc tính
- Sắp xếp theo nhiều tiêu chí

### ⚡ CRUD Operations
- **Create**: Thêm variant mới với validation
- **Read**: Hiển thị danh sách với pagination
- **Update**: Chỉnh sửa thông tin variant
- **Delete**: Xóa variant với xác nhận

## Cấu trúc dữ liệu

```javascript
const variant = {
  id: string,
  attributeId: string,    // FK -> attributes.id
  valueId: string,        // FK -> attribute_values.id
  stock: number,          // Số lượng tồn kho
  price: number,          // Giá hiện tại
  oldPrice: number,       // Giá cũ (optional)
  sku: string,           // Stock Keeping Unit
  // Computed fields
  attributeName: string,  // Tên thuộc tính
  valueName: string      // Tên giá trị
}
```

## API Requirements

Component yêu cầu các API functions sau:

```javascript
// Từ src/api/variants.js
- getListProductVariant(): Promise<Variant[]>
- getProductVariant(id): Promise<Variant>
- createProductVariant(data): Promise<Variant>
- updateProductVariant(id, data): Promise<Variant>
- deleteProductVariant(id): Promise<void> // Cần implement

// Từ src/api/attribute.js
- getAttributes(): Promise<Attribute[]>

// Từ src/api/attribute-Value.js
- getListAttributeValue(): Promise<AttributeValue[]>
```

## Cách sử dụng

### 1. Import component
```jsx
import VariantManager from './path/to/VariantManager/VariantManager';
```

### 2. Sử dụng trong component
```jsx
function AdminPanel() {
  return (
    <div>
      <VariantManager />
    </div>
  );
}
```

### 3. Setup API endpoints
Đảm bảo các API endpoints đã được implement:
- `GET /api/variants` - Lấy danh sách variants
- `POST /api/variants` - Tạo variant mới
- `PUT /api/variants/:id` - Cập nhật variant
- `DELETE /api/variants/:id` - Xóa variant
- `GET /api/attributes` - Lấy danh sách attributes
- `GET /api/attribute-values` - Lấy danh sách attribute values

## Validation Rules

### Form Validation
- **Attribute**: Bắt buộc
- **Value**: Bắt buộc, phụ thuộc vào attribute đã chọn
- **SKU**: Bắt buộc, tối thiểu 3 ký tự, unique
- **Stock**: Bắt buộc, >= 0
- **Price**: Bắt buộc, > 0
- **Old Price**: Optional, nếu có thì phải > Price

### Business Rules
- SKU phải unique trong hệ thống
- Không thể có 2 variants cùng attributeId và valueId
- Stock warning khi <= 10
- Auto-calculate discount percentage

## Styling

Component sử dụng CSS Modules với các features:
- CSS Grid và Flexbox layouts
- CSS Custom Properties (Variables)
- Modern CSS features (backdrop-filter, clamp, etc.)
- Smooth animations và transitions
- Responsive breakpoints

### CSS Classes chính
```css
.container        // Main wrapper
.header          // Top section with title and add button
.filters         // Search and filter section
.statsContainer  // Statistics cards
.tableContainer  // Data table wrapper
.modal           // Form modal
```

## Performance Optimizations

- **Memoization**: React.memo cho các sub-components
- **Virtual Scrolling**: Cho tables với nhiều data
- **Debounced Search**: Tránh quá nhiều API calls
- **Optimistic Updates**: UI updates trước khi API response
- **Error Boundaries**: Graceful error handling

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Focus Management**: Logical tab order
- **Color Contrast**: WCAG AA compliant
- **Motion**: Respect prefers-reduced-motion

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Files Structure

```
VariantManager/
├── VariantManager.jsx           // Main component
├── VariantManager.module.css    // Styles
├── README.md                    // Documentation
└── components/
    ├── ui/Modal/               // Reusable modal
    └── utils/variantUtils.js   // Utility functions
```

## Development

### Local Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Test
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.
