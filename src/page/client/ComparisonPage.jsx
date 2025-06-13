import React from 'react'

const ComparisonPage = () => {
  return (
<>
  <section id="breadcrumb">
    <div className="infors">
      <img className="logo" src="./src/assets/images/logo.png" alt="Logo" />
      <div className="title">Product Comparison</div>
      <div className="detail">
        <span>Home</span>
        <img className="step" src="./src/assets/icons/chevron-right.svg" alt="step" />
        <span>Product Comparison</span>
      </div>
    </div>
  </section>
  <section id="comparison-page">
    <div className="container">
      {/* <div class="row">
          <div class="col-xl-3 col-md-6 col-12">Cột 1</div>
          <div class="col-xl-3 col-md-6 col-12">Cột 2</div>
          <div class="col-xl-3 col-md-6 col-12">Cột 3</div>
          <div class="col-xl-3 col-md-6 col-12">Cột 4</div>
      </div> */}
      <div className="comparison-page__head">
        <div className="row">
          <div className="col-xl-3 col-md-6 col-12">
            <div className="redirect d-flex flex-column ">
              <span className="title">
                Go to Product page for more Products
              </span>
              <a href="./shop">View More</a>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 col-12">
            <div className="comparison-item-wrap">
              <div className="comparison-item">
                <div className="product-img">
                  <img src="./src/assets/images/cart-item.png" alt="cart" />
                </div>
                <span className="title">Outdoor Sofa Set</span>
                <span className="price">Rs. 224,000.00</span>
                <div className="value">
                  <span className="ratio">4.2</span>
                  <div className="stars">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star-half-stroke" />
                  </div>
                  <div className="line" />
                  <span className="review-count">145 Review</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 col-12">
            <div className="comparison-item-wrap">
              <div className="comparison-item">
                <div className="product-img">
                  <img src="./src/assets/images/cart-item.png" alt="cart" />
                </div>
                <span className="title">Outdoor Sofa Set</span>
                <span className="price">Rs. 224,000.00</span>
                <div className="value">
                  <span className="ratio">4.2</span>
                  <div className="stars">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star-half-stroke" />
                  </div>
                  <div className="line" />
                  <span className="review-count">145 Review</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 col-12">
            <div className="addition-comparison-product">
              <div className="title">Add A Product</div>
              <div className="selected">
                <select
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option selected="">Open this select menu</option>
                  <option value={1}>One</option>
                  <option value={2}>Two</option>
                  <option value={3}>Three</option>
                </select>
                <img
                  src="./src/assets/icons/fa-chevron-down.svg"
                  alt="cart"
                  className="fa-chevron-down"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="comparison-page__content">
        <div className="product-comparison-infors">
          <div className="rows">
            {/* 1 */}
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <div className="title">General </div>
                  <div className="infor-list">
                    <div className="infor-item">Sales Package</div>
                    <div className="infor-item">Model Number</div>
                    <div className="infor-item">Secondary Material</div>
                    <div className="infor-item">Configuration</div>
                    <div className="infor-item">Upholstery Material</div>
                    <div className="infor-item">Upholstery Color</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <span className="title  visible-hidden">General</span>
                  <div className="infor-list">
                    <div className="infor-item">Sales Package</div>
                    <div className="infor-item">Model Number</div>
                    <div className="infor-item">Secondary Material</div>
                    <div className="infor-item">Configuration</div>
                    <div className="infor-item">Upholstery Material</div>
                    <div className="infor-item">Upholstery Color</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <span className="title  visible-hidden">General</span>
                  <div className="infor-list">
                    <div className="infor-item">1 sectional sofa</div>
                    <div className="infor-item">TFCBLIGRBL6SRHS</div>
                    <div className="infor-item">Solid Wood</div>
                    <div className="infor-item">L-shapeddiv&gt;</div>
                    <div className="infor-item">Fabric + Cotton</div>
                    <div className="infor-item">Bright Grey &amp; Lion</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="visible-hidden" />
              </div>
            </div>
            {/* 2 */}
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <div className="title">Product </div>
                  <div className="infor-list">
                    <div className="infor-item">Filling Material</div>
                    <div className="infor-item">Finish Type</div>
                    <div className="infor-item">Adjustable Headrest</div>
                    <div className="infor-item">Maximum Load Capacity</div>
                    <div className="infor-item">Origin of Manufacture</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <span className="title  visible-hidden">Product</span>
                  <div className="infor-list">
                    <div className="infor-item">Foam</div>
                    <div className="infor-item">Bright Grey &amp; Lion</div>
                    <div className="infor-item">No</div>
                    <div className="infor-item">280 KG</div>
                    <div className="infor-item">India</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <span className="title  visible-hidden">Product</span>
                  <div className="infor-list">
                    <div className="infor-item">Matte</div>
                    <div className="infor-item">Bright Grey &amp; Lion</div>
                    <div className="infor-item">yes</div>
                    <div className="infor-item">300 KG</div>
                    <div className="infor-item">India</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="visible-hidden" />
              </div>
            </div>
            {/* 3 */}
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <div className="title">Product </div>
                  <div className="infor-list">
                    <div className="infor-item">Width</div>
                    <div className="infor-item">Height</div>
                    <div className="infor-item">Depth</div>
                    <div className="infor-item">Weight</div>
                    <div className="infor-item">Seat Height</div>
                    <div className="infor-item">Leg Height</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <span className="title  visible-hidden">Product</span>
                  <div className="infor-list">
                    <div className="infor-item">265.32 cm</div>
                    <div className="infor-item">76 cm</div>
                    <div className="infor-item">167.76 cm</div>
                    <div className="infor-item">45 KG</div>
                    <div className="infor-item">41.52 cm</div>
                    <div className="infor-item">5.46 cm</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="product-comparison-infor-item">
                  <span className="title  visible-hidden">Product</span>
                  <div className="infor-list">
                    <div className="infor-item">265.32 cm</div>
                    <div className="infor-item">76 cm</div>
                    <div className="infor-item">167.76 cm</div>
                    <div className="infor-item">65 KG</div>
                    <div className="infor-item">41.52 cm</div>
                    <div className="infor-item">5.46 cm</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="visible-hidden" />
              </div>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  </section>
</>


  )
}

export default ComparisonPage