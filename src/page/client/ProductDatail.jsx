import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../../api/product'

const ProductDatail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await getProduct(id)
        setProduct(response.data.data)
        setLoading(false)
      } catch {
        setError('Failed to fetch product')
        setLoading(false)
      }
    }
    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return <div>Loading product details...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!product) {
    return <div>No product found</div>
  }

  return (
    <>
      <div className="breadcrumbsmini">
        <nav className="breadcrumbs">
          <ul className="breadcrumbs__list">
            <li className="breadcrumbs__item">
              <a href="/" className="breadcrumbs__link">
                Home
              </a>
              <span className="breadcrumbs__separator">
                <i className="fa-solid fa-chevron-right" />
              </span>
            </li>
            <li className="breadcrumbs__item">
              <a href="/shop" className="breadcrumbs__link">
                Shop
              </a>
              <span className="breadcrumbs__separator">
                <i className="fa-solid fa-chevron-right" />
              </span>
            </li>
            <li className="breadcrumbs__item">
              <span className="breadcrumbs__current">{product.title}</span>
            </li>
          </ul>
        </nav>
        <div className="breadcrumbs__divider" />
      </div>
      <div className="product-detail-container">
        {/* Left Side: Product Images */}
        <div className="product-images">
          <div className="thumbnail-gallery">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="thumbnail"
                />
              ))
            ) : (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="thumbnail"
              />
            )}
          </div>
          <div className="main-image">
            <img src={product.thumbnail} alt={product.title} />
          </div>
        </div>
        {/* Right Side: Product Details */}
        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">Rp {Number(product.currentPrice).toLocaleString()}</p>
          <div className="product-rating">
            <span className="stars">★★★★★ </span>
            <span className="reviews">| {product.reviewsCount || 0} Customer Review</span>
          </div>
          <p className="product-description-short">{product.shortDescription || product.description}</p>
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="product-options">
              <div className="size-selection">
                <p>Size</p>
                <div className="size-buttons">
                  {product.sizes.map((size, idx) => (
                    <button key={idx} className="size-btn">{size}</button>
                  ))}
                </div>
              </div>
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="color-selection">
                  <p>Color</p>
                  <div className="color-options">
                    {product.colors.map((color, idx) => (
                      <span
                        key={idx}
                        className="color-circle"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Add to Cart and Compare */}
          <div className="product-actions">
            <div className="quantity-selector">
              <button className="quantity-btn">-</button>
              <span className="quantity">1</span>
              <button className="quantity-btn">+</button>
            </div>
            <button className="add-to-cart">Add To Cart</button>
            <button className="compare-btn">+ Compare</button>
          </div>
          {/* Additional Info */}
          <div className="product-meta">
            <p>
              <strong>SKU</strong> : {product.sku || 'N/A'}
            </p>
            <p>
              <strong>Category</strong>: {product.category || 'N/A'}
            </p>
            <p>
              <strong>Tags</strong>: {product.tags ? product.tags.join(', ') : 'N/A'}
            </p>
            <p>
              <strong>Share</strong>:
              <a href="#">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in" />
              </a>
              <a href="#">
                <i className="fab fa-twitter" />
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Tabs Section */}
      <div className="product-tabs">
        <div className="tabs-header">
          <span className="tab active">Description</span>
          <span className="tab">Additional Information</span>
          <span className="tab">Reviews [{product.reviewsCount || 0}]</span>
        </div>
        <div className="tabs-content">
          <p>{product.description}</p>
          <p>{product.additionalInformation}</p>
        </div>
      </div>
      {/* Additional Images */}
      <div className="additional-images">
        {product.additionalImages && product.additionalImages.length > 0 && product.additionalImages.map((img, idx) => (
          <img key={idx} src={img} alt={`Additional Image ${idx + 1}`} />
        ))}
      </div>
      <div className="container-product">
        <h1>Related Products</h1>
        <div className="products-grid">
          {/* Related products could be rendered here */}
        </div>
        <button className="show-more">
          <a href="/shop">Show More</a>
        </button>
      </div>
    </>
  )
}

export default ProductDatail
