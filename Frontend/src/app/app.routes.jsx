import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";
import AppLayout from "./Applayout";
import OrderSuccess from "../features/cart/pages/OrderSuccess";
import AccountSettings from "../features/account/pages/AccountSettings";
import WishlistPage from "../features/account/pages/WishlistPage";
import OrderHistory from "../features/account/pages/OrderHistory";

export const routes = createBrowserRouter([

    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Protected><Home /></Protected>,
            },
            {
                path: "/product/:productId",
                element: <Protected><ProductDetail /></Protected>
            },
            {
                path: "/cart",
                element: <Protected> <Cart /></Protected>
            },
            {
                path: "/order-success",
                element: <Protected><OrderSuccess /></Protected>
            },
            {
                path: "/account",
                element: <Protected><AccountSettings /></Protected>
            },
            {
                path: "/account/wishlist",
                element: <Protected><WishlistPage /></Protected>
            },
            {
                path: "/account/orders",
                element: <Protected><OrderHistory /></Protected>
            },
            {
                path: "/seller",
                children: [
                    {
                        path: "/seller/create-product",

                        element: <Protected role="seller" >
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "/seller/dashboard",
                        element: <Protected role="seller" >
                            <Dashboard />
                        </Protected>
                    },
                    {
                        path: "/seller/product/:productId",
                        element: <Protected role="seller" >
                            <SellerProductDetails />
                        </Protected>
                    }
                ]
            }
        ]
    }


])