import { createBrowserRouter } from 'react-router-dom';
import clienRoutes from './clienRoutes';
import adminRoutes from './adminRoutes';
import LayoutAdmin from '../components/Layout/LayoutAdmin';
import LayoutClient from '../components/Layout/LayoutClien';

import Login from '../page/Login';

import NotFound from '../components/NotFound';

const routerApp = createBrowserRouter([
    //layout Clien
    {
        path: '/',
        element: <LayoutClient  />,
        children: clienRoutes
    },
    //layout Admin
    {
        path: '/admin',
        element: <LayoutAdmin />,
        children: adminRoutes
    },
    //layout Empty
    {
        path: '/login',
        element: <Login />

    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default routerApp;