import React from 'react'

const CheckoutPage = () => {
  return (
  <>
  <section id="breadcrumb">
    <div className="infors">
      <img className="logo" src="./src/assets/images/logo.png" alt="Logo" />
      <div className="title">Checkout</div>
      <div className="detail">
        <span>Home</span>
        <img className="step" src="./src/assets/icons/chevron-right.svg" alt="step" />
        <span>Checkout</span>
      </div>
    </div>
  </section>
  <section id="checkOut">
    <div className="container">
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div id="billingDetails">
            <div className="title">Billing details</div>
            <form action="">
              {/* 1 Name */}
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 ml-4">
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
              {/* 2 Company Name (Optional) */}
              <div className="form-group">
                <label htmlFor="companyName">Company Name (Optional)</label>
                <input
                  id="companyName"
                  type="text"
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* 3 Country / Region */}
              <div className="form-group">
                <label htmlFor="countryRegion">Country / Region</label>
                <select id="countryRegion" className="form-control">
                  <option value={1}>Sri Lanka</option>
                  <option value={2}>USA</option>
                  <option value={3}>Japan</option>
                </select>
              </div>
              {/* 4 Street address */}
              <div className="form-group">
                <label htmlFor="streetAddress">Street address</label>
                <input
                  id="streetAddress"
                  type="text"
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* 5 Town / City */}
              <div className="form-group">
                <label htmlFor="townCity">Town / City</label>
                <input
                  id="townCity"
                  type="text"
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* 6 Province */}
              <div className="form-group">
                <label htmlFor="province">Province</label>
                <select id="province" className="form-control">
                  <option value={1}>Western Province</option>
                  <option value={2}>Central Province</option>
                  <option value={3}>Southern Province</option>
                </select>
              </div>
              {/* 7 ZIP code */}
              <div className="form-group">
                <label htmlFor="zipCode">ZIP code</label>
                <input
                  id="zipCode"
                  type="text"
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* 8 Phone */}
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="text"
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* 9 Email address */}
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder=""
                />
              </div>
              <div className="form-group">
                <input
                  id="emailInformation "
                  type="email"
                  className="form-control"
                  placeholder="Additional information"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mt-sm-4">
          <div id="inforsSummary">
            <div className="infors-summary-wrap">
              <div className="row  w-full">
                <div className="col-xl-6 col-lg-12 col-md-6 col-sm-6">
                  <div className="product">
                    <span className="title">Product</span>
                    <span className="name">Asgaard sofa X1</span>
                    <span className="subtotal">Subtotal</span>
                    <span className="total">Total</span>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-12 col-md-6 col-sm-6 ">
                  <div className="content">
                    <span className="title">Subtotal</span>
                    <span className="product-price">Rs. 250,000.00</span>
                    <span className="product-subtotal">Rs. 250,000.00</span>
                    <span className="last-price">Rs. 250,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="paymentMethod">
            <div className="d-flex align-items-center gap-3">
              <span className="dot" />
              <p className="title">Direct Bank Transfer</p>
            </div>
            <p className="desctription">
              Make your payment directly into our bank account. Please use your
              Order ID as the payment reference. Your order will not be shipped
              until the funds have cleared in our account.
            </p>
            <div className="payment-method-options">
              {/* <select name="paymentMethod">
                          <option value="1">Direct Bank Transfer</option>
                          <option value="2">Cash On Delivery</option>
                      </select> */}
              <div className="form-check">
                {" "}
                {/* checked */}
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod1"
                />
                <label className="form-check-label" htmlFor="paymentMethod1">
                  Direct Bank Transfer
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod2"
                />
                <label className="form-check-label" htmlFor="paymentMethod2">
                  Cash On Delivery
                </label>
              </div>
            </div>
            <p className="note">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our <a href="">privacy policy</a>.
            </p>
            <div className="w-full d-flex justify-center">
              <button id="placeOrder" className="btn">
                Place order
              </button>
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

  )
}

export default CheckoutPage