// Utility functions for VariantManager

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const calculateDiscount = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

export const getStockStatus = (stock) => {
  if (stock <= 0) return { status: 'out-of-stock', label: 'Hết hàng', color: 'red' };
  if (stock <= 10) return { status: 'low-stock', label: 'Sắp hết', color: 'orange' };
  return { status: 'in-stock', label: 'Còn hàng', color: 'green' };
};

export const validateVariantForm = (formData) => {
  const errors = {};
  
  if (!formData.attributeId) {
    errors.attributeId = 'Vui lòng chọn thuộc tính';
  }
  
  if (!formData.valueId) {
    errors.valueId = 'Vui lòng chọn giá trị';
  }
  
  if (!formData.sku || formData.sku.trim() === '') {
    errors.sku = 'SKU không được để trống';
  } else if (formData.sku.length < 3) {
    errors.sku = 'SKU phải có ít nhất 3 ký tự';
  }
  
  if (!formData.stock || formData.stock < 0) {
    errors.stock = 'Số lượng tồn kho phải >= 0';
  }
  
  if (!formData.price || formData.price <= 0) {
    errors.price = 'Giá phải > 0';
  }
  
  if (formData.oldPrice && parseFloat(formData.oldPrice) <= parseFloat(formData.price)) {
    errors.oldPrice = 'Giá cũ phải lớn hơn giá hiện tại';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateSKU = (attributeName, valueName, timestamp = Date.now()) => {
  const attr = attributeName.substring(0, 3).toUpperCase();
  const val = valueName.substring(0, 3).toUpperCase();
  const time = timestamp.toString().slice(-4);
  return `${attr}-${val}-${time}`;
};

export const sortVariants = (variants, sortBy = 'sku', sortOrder = 'asc') => {
  return [...variants].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export const filterVariants = (variants, filters) => {
  return variants.filter(variant => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        variant.sku,
        variant.attributeName,
        variant.valueName
      ].join(' ').toLowerCase();
      
      if (!searchableFields.includes(searchTerm)) return false;
    }
    
    // Attribute filter
    if (filters.attributeId && variant.attributeId !== filters.attributeId) {
      return false;
    }
    
    // Stock status filter
    if (filters.stockStatus) {
      const status = getStockStatus(variant.stock).status;
      if (status !== filters.stockStatus) return false;
    }
    
    // Price range filter
    if (filters.minPrice && variant.price < filters.minPrice) return false;
    if (filters.maxPrice && variant.price > filters.maxPrice) return false;
    
    return true;
  });
};

export const getVariantStatistics = (variants) => {
  const stats = {
    totalVariants: variants.length,
    totalStock: 0,
    totalValue: 0,
    inStockVariants: 0,
    lowStockVariants: 0,
    outOfStockVariants: 0,
    averagePrice: 0,
    highestPrice: 0,
    lowestPrice: 0,
    attributeBreakdown: {},
    priceRanges: {
      under50: 0,
      between50and100: 0,
      between100and200: 0,
      over200: 0
    }
  };
  
  if (variants.length === 0) return stats;
  
  let totalPrice = 0;
  stats.highestPrice = variants[0].price;
  stats.lowestPrice = variants[0].price;
  
  variants.forEach(variant => {
    // Stock calculations
    stats.totalStock += variant.stock;
    stats.totalValue += variant.price * variant.stock;
    
    const stockStatus = getStockStatus(variant.stock);
    if (stockStatus.status === 'in-stock') stats.inStockVariants++;
    else if (stockStatus.status === 'low-stock') stats.lowStockVariants++;
    else stats.outOfStockVariants++;
    
    // Price calculations
    totalPrice += variant.price;
    if (variant.price > stats.highestPrice) stats.highestPrice = variant.price;
    if (variant.price < stats.lowestPrice) stats.lowestPrice = variant.price;
    
    // Price range breakdown
    if (variant.price < 50) stats.priceRanges.under50++;
    else if (variant.price < 100) stats.priceRanges.between50and100++;
    else if (variant.price < 200) stats.priceRanges.between100and200++;
    else stats.priceRanges.over200++;
    
    // Attribute breakdown
    if (!stats.attributeBreakdown[variant.attributeName]) {
      stats.attributeBreakdown[variant.attributeName] = 0;
    }
    stats.attributeBreakdown[variant.attributeName]++;
  });
  
  stats.averagePrice = totalPrice / variants.length;
  
  return stats;
};

export const exportToCSV = (variants) => {
  const headers = ['SKU', 'Attribute', 'Value', 'Stock', 'Price', 'Old Price', 'Discount %'];
  const csvContent = [
    headers.join(','),
    ...variants.map(variant => [
      variant.sku,
      variant.attributeName,
      variant.valueName,
      variant.stock,
      variant.price,
      variant.oldPrice || '',
      calculateDiscount(variant.oldPrice, variant.price)
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `variants_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
