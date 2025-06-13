import BlogPage from '../page/client/BlogPage';
import AboutPage from '../page/client/AboutPage';
import CartPage from '../page/client/CartPage';
import CheckoutPage from '../page/client/CheckoutPage';
import ComparisonPage from '../page/client/ComparisonPage';
import ContactPage from '../page/client/ContactPage';
import ProductDatail from '../page/client/ProductDatail';
import ShopPage from '../page/client/Shoppage';
import HomePage from '../page/client/HomePage';

const clienRoutes = [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/blog',
                element: <BlogPage />
            },
            {
                path: '/about',
                element: <AboutPage />

            },
            {
                path: '/cart',
                element: <CartPage />
            },
            {
                path: '/checkout',
                element: <CheckoutPage />
            },
            {
                path: '/comparison',
                element: <ComparisonPage />
            },{
                path: '/contact',
                element: <ContactPage />
            },
            {
                path: '/productdetail',
                element: <ProductDatail />
            },
            {
                path: '/shop',
                element: <ShopPage/>
            },
        


        ]

export default clienRoutes;