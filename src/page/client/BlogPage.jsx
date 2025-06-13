import React from 'react'

const BlogPage = () => {
  return (
    <div>
        <>
  <div className="hero-section">
    <div className="breadcrumb-container">
      <img src="./src/assets/img/logo.png" alt="" />
      <h1 className="page-title">Blog</h1>
      <nav className="breadcrumb">
        <ol>
          <li>
            <a href="/">HOME</a>
          </li>
          <li className="current">Blog</li>
        </ol>
      </nav>
    </div>
  </div>
  <div className="container-blog">
    {/* Main Content */}
    <div className="main-content">
      {/* Post 1 */}
      <div className="post">
        <img src="././src/assets/img/blog-1.png" alt="Laptop on wooden table" />
        <div className="post-meta">
          <div className="icons">
            <i className="bx bxs-user" />
            <span className="author">Admin</span>
          </div>
          <div className="icons">
            <i className="bx bxs-calendar-alt" />
            <span className="date">14 Oct 2022</span>
          </div>
          <div className="icons">
            <i className="bx bxs-purchase-tag" />
            <span className="">Wood</span>
          </div>
        </div>
        <h2>Going all-in with millennial design</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris
          vitae ultricies leo integer malesuada nunc. In nulla posuere
          sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices
          mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis
          molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit
          libero. Pellentesque elit ullamcorper dignissim cras tincidunt.
          Pharetra et ultrices neque ornare aenean euismod elementum.
        </p>
        <a href="#" className="read-more">
          Read More
        </a>
      </div>
      {/* Post 2 */}
      <div className="post">
        <img src="././src/assets/img/blog-2.png" alt="Hands writing in notebook" />
        <div className="post-meta">
          <div className="icons">
            <i className="bx bxs-user" />
            <span className="author">Admin</span>
          </div>
          <div className="icons">
            <i className="bx bxs-calendar-alt" />
            <span className="date">14 Oct 2022</span>
          </div>
          <div className="icons">
            <i className="bx bxs-purchase-tag" />
            <span className="">Handmade</span>
          </div>
        </div>
        <h2>Exploring new ways of decorating</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris
          vitae ultricies leo integer malesuada nunc. In nulla posuere
          sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices
          mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis
          molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit
          libero. Pellentesque elit ullamcorper dignissim cras tincidunt.
          Pharetra et ultrices neque ornare aenean euismod elementum.
        </p>
        <a href="#" className="read-more">
          Read More
        </a>
      </div>
      {/* Post 3 */}
      <div className="post">
        <img
          src="././src/assets/img/blog-3.png"
          alt="Desk with coffee and notebook"
        />
        <div className="post-meta">
          <div className="icons">
            <i className="bx bxs-user" />
            <span className="author">Admin</span>
          </div>
          <div className="icons">
            <i className="bx bxs-calendar-alt" />
            <span className="date">14 Oct 2022</span>
          </div>
          <div className="icons">
            <i className="bx bxs-purchase-tag" />
            <span className="">Wood</span>
          </div>
        </div>
        <h2>Handmade pieces that took time to make</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris
          vitae ultricies leo integer malesuada nunc. In nulla posuere
          sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices
          mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis
          molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit
          libero. Pellentesque elit ullamcorper dignissim cras tincidunt.
          Pharetra et ultrices neque ornare aenean euismod elementum.
        </p>
        <a href="#" className="read-more">
          Read More
        </a>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <a href="#" className="page active">
          1
        </a>
        <a href="#" className="page">
          2
        </a>
        <a href="#" className="page">
          3
        </a>
        <a href="#" className="next">
          Next
        </a>
      </div>
    </div>
    {/* Sidebar */}
    <div className="sidebar">
      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" />
        <i className="bx bx-search" />
      </div>
      {/* Categories */}
      <div className="categories">
        <h3>Categories</h3>
        <ul>
          <li>
            {" "}
            <span>2</span>
          </li>
          <li>
            Design <span>8</span>
          </li>
          <li>
            Handmade <span>7</span>
          </li>
          <li>
            Interior <span>1</span>
          </li>
          <li>
            Wood <span>6</span>
          </li>
        </ul>
      </div>
      {/* Recent Posts */}
      <div className="recent-posts">
        <h3>Recent Posts</h3>
        <div className="recent-post">
          <img src="././src/assets/img/post1.png" alt="Recent Post 1" />
          <div className="post-info">
            <h4>Going all-in with millennial design</h4>
            <span>03 Aug 2022</span>
          </div>
        </div>
        <div className="recent-post">
          <img src="././src/assets/img/post2.png" alt="Recent Post 2" />
          <div className="post-info">
            <h4>Exploring new ways of decorating</h4>
            <span>03 Aug 2022</span>
          </div>
        </div>
        <div className="recent-post">
          <img src="././src/assets/img/post3.png" alt="Recent Post 3" />
          <div className="post-info">
            <h4>Handmade pieces that took time to make</h4>
            <span>03 Aug 2022</span>
          </div>
        </div>
        <div className="recent-post">
          <img src="././src/assets/img/post4.png" alt="Recent Post 4" />
          <div className="post-info">
            <h4>Modern home in Milan</h4>
            <span>03 Aug 2022</span>
          </div>
        </div>
        <div className="recent-post">
          <img src="././src/assets/img/post5.png" alt="Recent Post 5" />
          <div className="post-info">
            <h4>Colorful office redesign</h4>
            <span>03 Aug 2022</span>
          </div>
        </div>
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

    </div>
  )
}

export default BlogPage