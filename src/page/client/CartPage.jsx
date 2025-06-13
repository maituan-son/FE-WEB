import React from 'react'

const CartPage = () => {
  return (
    <div><>
  <section id="breadcrumb">
    <div className="infors">
      <img className="logo" src="./src/assets/images/logo.png" alt="Logo" />
      <div className="title">Cart</div>
      <div className="detail">
        <span>Home</span>
        <img className="step" src="./src/assets/icons/chevron-right.svg" alt="step" />
        <span>Cart</span>
      </div>
    </div>
  </section>
  <section id="cartPage" className="container">
    <div className="cart-page-wrap">
      <div className="row">
        <div className="col-xl-8 col-lg-12 col-md-12 col-12 pr-4">
          <div className="cart-table">
            <div className="cart-table-head">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <span />
            </div>
            <div className="cart-list">
              <div className="cart-table-row">
                <div className="cart-item">
                  <div className="cart-product">
                    <img
                      className="logo"
                      src="./src/assets/images/cart-item.png"
                      alt="cart"
                    />
                    <div className="cart-item-title">Asgaard sofa</div>
                  </div>
                  <div className="price"> Rs. 250,000.00</div>
                  <div className="quantity">
                    <input type="number" defaultValue={1} />
                  </div>
                  <div className="subtotal">Rs. 250,000.00</div>
                  <div id="delete-item">
                    <img
                      className="btn"
                      src="./src/assets/icons/bin.svg"
                      alt="cart"
                    />
                  </div>
                </div>
                <div className="cart-list-line" />
                <div className="cart-item">
                  <div className="cart-product">
                    <img
                      className="logo"
                      src="./src/assets/images/cart-item.png"
                      alt="cart"
                    />
                    <div className="cart-item-title">Asgaard sofa</div>
                  </div>
                  <div className="price"> Rs. 250,000.00</div>
                  <div className="quantity">
                    <input type="number" defaultValue={1} />
                  </div>
                  <div className="subtotal">Rs. 250,000.00</div>
                  <div id="delete-item">
                    <img
                      className="btn"
                      src="./src/assets/icons/bin.svg"
                      alt="cart"
                    />
                  </div>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-12 col-md-12 col-12 d-flex">
          <div id="cart-summary">
            <div className="title">Cart Totals</div>
            <div className="cart-summary-infors">
              <div className="title">Subtotal</div>
              <div className="content">Rs. 250,000.00</div>
              <div className="title">Total</div>
              <div className="content" id="lastPrice">
                Rs. 250,000.00
              </div>
            </div>
            <div className="cart-summary-actions">
              <a href="/checkout" id="check-out" className="btn">
                Check Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div className="services">
    <section className="features">
      <div className="container">
        <div className="features__grid">
          <div className="feature">
            <div className="feature__icon">
              <img src="./src/assets/img/trophy1.png" alt="" />
            </div>
            <div className="feature__content">
              <h3 className="feature__title">High Quality</h3>
              <p className="feature__description">crafted from top materials</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature__icon">
              <img src="./src/assets/img/guarantee.png" alt="" />
            </div>
            <div className="feature__content">
              <h3 className="feature__title">Warranty Protection</h3>
              <p className="feature__description">Over 2 years</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature__icon">
              <img src="./src/assets/img/shipping.png" alt="" />
            </div>
            <div className="feature__content">
              <h3 className="feature__title">Free Shipping</h3>
              <p className="feature__description">Order over 150 $</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature__icon">
              <img src="./src/assets/img/customer-support.png" alt="" />
            </div>
            <div className="feature__content">
              <h3 className="feature__title">24 / 7 Support</h3>
              <p className="feature__description">Dedicated support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</>
</div>
  )
}

export default CartPage