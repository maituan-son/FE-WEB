import React, { useState, useEffect } from 'react';
import { getProducts } from '../../api/product';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((response) => {
    
        
        setProducts(response.data.data || []);
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  }, []);

  const renderPrice = (product) => {
    const currentPrice = Number(product.currentPrice);
    const originalPrice = Number(product.originalPrice);
    if (!isNaN(originalPrice) && originalPrice > currentPrice) {
      return (
        <div className="product-price">
          <span className="current-price">Rp {currentPrice.toLocaleString()}</span>
          <span className="original-price">Rp {originalPrice.toLocaleString()}</span>
        </div>
      );
    }
    if (!isNaN(currentPrice)) {
      return (
        <div className="product-price">
          <span className="current-price">Rp {currentPrice.toLocaleString()}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <>
        <section id="homePage">
          <div id="homeBanner" className="row p-0">
            <div className="col-xl-6 col-lg-6 col-md-4 p-0 col-hire" />
            <div className="d-ms-m-4 col-ms-12 col-md-8 col-xl-6 col-lg-6 d-sm-w-100 p-0 d-flex justify-content-start align-items-center">
              <div className="quick-infor d-lg-mr-3 d-md-mr-2 d-sm-mx-2">
                <span className="status">New Arrival</span>
                <span className="title">Discover Our New Collection</span>
                <div className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                  tellus, luctus nec ullamcorper mattis.
                </div>
                <a href="./shop" id="buyNow" className="btn">
                  BUY Now
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="category">
          <div className="header">
            <h1>Browse The Range</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="grid">
            <div className="category">
              <img src="./src/assets/img/image100.png" alt="Dining" />
              <p>Dining</p>
            </div>
            <div className="category">
              <img src="./src/assets/img/image101.png" alt="Living" />
              <p>Living</p>
            </div>
            <div className="category">
              <img src="./src/assets/img/image106.png" alt="Bedroom" />
              <p>Bedroom</p>
            </div>
          </div>
        </div>
        <div className="container-product">
          <h1>Our Products</h1>
          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                {product.discount && (
                  <div className={`product-tag ${product.discount > 0 ? 'tag-discount' : 'tag-new'}`}>
                    {product.discount > 0 ? `-${product.discount}%` : 'New'}
                  </div>
                )}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
              
                  <p className="product-description">{product.description.slice(0, 40)}...</p>
                  {renderPrice(product)}
                </div>
                <div className="hover-overlay">
                  <button className="add-to-cart">
                    <a href="productdetail">Add to cart</a>
                  </button>
                  <div className="action-buttons">
                    <button className="action-button">
                      <i className="fas fa-share-alt" /> Share
                    </button>
                    <button className="action-button">
                      <i className="fas fa-exchange-alt" /> Compare
                    </button>
                    <button className="action-button">
                      <i className="far fa-heart" /> Like
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="show-more">
            <a href="./shop">Show More</a>
          </button>
        </div>
      </>
    </div>
  );
};

export default HomePage;
