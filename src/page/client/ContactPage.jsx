import React from 'react'

const ContactPage = () => {
  return (
   <>
  <div className="hero-section">
    <div className="breadcrumb-container">
      <img src="./src/assets/img/logo.png" alt="" />
      <h1 className="page-title">CONTACT</h1>
      <nav className="breadcrumb">
        <ol>
          <li>
            <a href="/">HOME</a>
          </li>
          <li className="current">Contact</li>
        </ol>
      </nav>
    </div>
  </div>
  <div className="contact">
    <header className="header">
      <h1>Get In Touch With Us</h1>
      <p>
        For More Information About Our Product &amp; Services, Please Feel Free
        To Drop Us An Email. Our Staff Always Be There To Help You Out. Do Not
        Hesitate!
      </p>
    </header>
    <div className="content">
      <div className="contact-info">
        <div className="info-item">
          <div className="icon">
            <i className="fas fa-map-marker-alt" />
          </div>
          <div className="details">
            <h3>Address</h3>
            <p>236 5th SE Avenue, New York NY10000, United States</p>
          </div>
        </div>
        <div className="info-item">
          <div className="icon">
            <i className="fas fa-phone-alt" />
          </div>
          <div className="details">
            <h3>Phone</h3>
            <p>Mobile: +(84) 546-6789</p>
            <p>Hotline: +(84) 456-6789</p>
          </div>
        </div>
        <div className="info-item">
          <div className="icon">
            <i className="far fa-clock" />
          </div>
          <div className="details">
            <h3>Working Time</h3>
            <p>Monday-Friday: 9:00 - 22:00</p>
            <p>Saturday-Sunday: 9:00 - 21:00</p>
          </div>
        </div>
      </div>
      <div className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Your name</label>
          <input type="text" id="name" placeholder="Abc" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" placeholder="Abc@def.com" />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" placeholder="This is an optional" />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Hi! I'd like to ask about"
            defaultValue={""}
          />
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </div>
    </div>
  </div>
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

export default ContactPage