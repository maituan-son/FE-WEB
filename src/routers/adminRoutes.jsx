import { List } from "lucide-react";
import Dashboard from "../page/admin/Dashboard";
import Profile from "../page/admin/Profile";
import SetTings from "../page/admin/SetTings";
import Listproducts from "../page/admin/Products/Listproducts";
import ListCategoris from "../page/admin/Categories/ListCategoris";

const adminRoutes = [
            {
                 index: true,
                element: <Dashboard />
            },
            {
                path: 'settings',
                element: <SetTings />
            },
            {
                path: 'profile',
                element: <Profile />
            },
            // router product 
            {
                path: 'products',
                element: <Listproducts/>
            },
            {
                path: 'categories',
                element: <ListCategoris />
            }

        ]
export default adminRoutes;