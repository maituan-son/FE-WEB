import React from 'react'

const ProductDatail = () => {
  return (
    <>
  <div className="breadcrumbsmini">
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <a href="#" className="breadcrumbs__link">
            Home
          </a>
          <span className="breadcrumbs__separator">
            <i className="fa-solid fa-chevron-right" />
          </span>
        </li>
        <li className="breadcrumbs__item">
          <a href="#" className="breadcrumbs__link">
            Shop
          </a>
          <span className="breadcrumbs__separator">
            <i className="fa-solid fa-chevron-right" />
          </span>
        </li>
        <li className="breadcrumbs__item">
          <span className="breadcrumbs__current">Asgaard sofa</span>
        </li>
      </ul>
    </nav>
    <div className="breadcrumbs__divider" />
  </div>
  <div className="product-detail-container">
    {/* Left Side: Product Images */}
    <div className="product-images">
      <div className="thumbnail-gallery">
        <img
          src="./src/assets/img/Asgaard3.png"
          alt="Thumbnail 1"
          className="thumbnail"
        />
        <img
          src="./src/assets/img/Mayasofa.png"
          alt="Thumbnail 2"
          className="thumbnail"
        />
        <img
          src="./src/assets/img/Outdoorsofa2.png"
          alt="Thumbnail 3"
          className="thumbnail"
        />
        <img
          src="./src/assets/img/Outdoorsofa_21.png"
          alt="Thumbnail 4"
          className="thumbnail"
        />
      </div>
      <div className="main-image">
        <img src="./src/assets/img/Asgaard3.png" alt="Asgaard Sofa" />
      </div>
    </div>
    {/* Right Side: Product Details */}
    <div className="product-info">
      <h1 className="product-title">Asgaard sofa</h1>
      <p className="product-price">Rs. 250,000.00</p>
      <div className="product-rating">
        <span className="stars">★★★★★ </span>
        <span className="reviews">| 5 Customer Review</span>
      </div>
      <p className="product-description-short">
        Setting the bar as one of the loudest speakers in its class, the Kilburn
        is a compact, stout-hearted hero with a well-balanced audio which boasts
        a clear midrange and extended highs for a sound.
      </p>
      {/* Size Selection */}
      <div className="product-options">
        <div className="size-selection">
          <p>Size</p>
          <div className="size-buttons">
            <button className="size-btn">L</button>
            <button className="size-btn">XL</button>
            <button className="size-btn">XS</button>
          </div>
        </div>
        {/* Color Selection */}
        <div className="color-selection">
          <p>Color</p>
          <div className="color-options">
            <span
              className="color-circle"
              style={{ backgroundColor: "#816DFA" }}
            />
            <span
              className="color-circle"
              style={{ backgroundColor: "#000000" }}
            />
            <span
              className="color-circle"
              style={{ backgroundColor: "#B88E2F" }}
            />
          </div>
        </div>
      </div>
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
          <strong>SKU</strong> : SS001
        </p>
        <p>
          <strong>Category</strong>: Sofa
        </p>
        <p>
          <strong>Tags</strong>: Sofa, Chair, Home, Shop
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
      <span className="tab">Reviews [5]</span>
    </div>
    <div className="tabs-content">
      <p>
        Embodying the raw, wayward spirit of rock ‘n’ roll, the Kilburn portable
        active stereo speaker takes the unmistakable look and sound of Marshall,
        unplugs the chords, and takes the show on the road.
      </p>
      <p>
        Weighing in under 7 pounds, the Kilburn is a lightweight piece of
        vintage styled engineering. Setting the bar as one of the loudest
        speakers in its class, the Kilburn is a compact, stout-hearted hero with
        a well-balanced audio which boasts a clear midrange and extended highs
        for a sound that is both articulate and pronounced. The analogue knobs
        allow you to fine tune the controls to your personal preferences while
        the guitar-influenced leather strap enables easy and stylish travel.
      </p>
    </div>
  </div>
  {/* Additional Images */}
  <div className="additional-images">
    <img src="/./src/assets/img/Cloud1.png" alt="Additional Image 1" />
    <img src="/./src/assets/img/Cloud21.png" alt="Additional Image 2" />
  </div>
  <div className="container-product">
    <h1>Related Products</h1>
    <div className="products-grid">
      {/* Product 1 */}
      <div className="product-card">
        <div className="product-tag tag-discount">-30%</div>
        <div className="product-image">
          <img src="././src/assets/img/sp1.png" alt="Syltherine" />
        </div>
        <div className="product-info">
          <h3 className="product-name">Syltherine</h3>
          <p className="product-description">Stylish cafe chair</p>
          <div className="product-price">
            <span className="current-price">Rp 2.500.000</span>
            <span className="original-price">Rp 3.500.000</span>
          </div>
        </div>
        {/* Hover Overlay */}
        <div className="hover-overlay">
          <button className="add-to-cart">Add to cart</button>
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
      {/* Product 2 */}
      <div className="product-card">
        <div className="product-image">
          <img src="././src/assets/img/sp2.png" alt="Leviosa" />
        </div>
        <div className="product-info">
          <h3 className="product-name">Leviosa</h3>
          <p className="product-description">Stylish cafe chair</p>
          <div className="product-price">
            <span className="current-price">Rp 2.500.000</span>
          </div>
        </div>
        {/* Hover Overlay */}
        <div className="hover-overlay">
          <button className="add-to-cart">Add to cart</button>
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
      {/* Product 3 */}
      <div className="product-card">
        <div className="product-tag tag-discount">-50%</div>
        <div className="product-image">
          <img src="././src/assets/img/sp3.png" alt="Lolito" />
        </div>
        <div className="product-info">
          <h3 className="product-name">Lolito</h3>
          <p className="product-description">Luxury big sofa</p>
          <div className="product-price">
            <span className="current-price">Rp 7.000.000</span>
            <span className="original-price">Rp 14.000.000</span>
          </div>
        </div>
        {/* Hover Overlay */}
        <div className="hover-overlay">
          <button className="add-to-cart">Add to cart</button>
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
      {/* Product 4 */}
      <div className="product-card">
        <div className="product-tag tag-new">New</div>
        <div className="product-image">
          <img src="././src/assets/img/sp4.png" alt="Respira" />
        </div>
        <div className="product-info">
          <h3 className="product-name">Respira</h3>
          <p className="product-description">Outdoor bar table and stool</p>
          <div className="product-price">
            <span className="current-price">Rp 500.000</span>
          </div>
        </div>
        {/* Hover Overlay */}
        <div className="hover-overlay">
          <button className="add-to-cart">Add to cart</button>
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
    </div>
    <button className="show-more">
      <a href="./shop">Show More</a>
    </button>
  </div>
</>

  )
}

export default ProductDatail