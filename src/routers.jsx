import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import About from "./Components/About/About";
import Home from "./Components/Home/Home.jsx";
import Cart from "./Components/Cart/Cart";
import Categories from "./Components/Categories/Categories";
import Contact from "./Components/Contact/Contact";
import Login from "./Components/Login/Login";
import NotFound from "./Components/NotFound/NotFound";
import Products from "./Components/Products/Products";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import CheckOut from "./Components/CheckOut/CheckOut";
import CategoryItems from "./Components/Categories/CategoryItems.jsx";
import Payment from "./Components/Payment/Payment";
import SignUp from "./Components/SignUp/SignUp";
import Blog from "./Components/Blog/Blog";
import WishList from "./Components/WishList/WishList";
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import ChatBot from "./Components/ChatPot/ChatBot";
import { ProtectedRoute } from "./Components/ProtectedRoute/ProtectedRoute";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword.jsx";
import ResetPassword from "./Components/ResetPassword/ResetPassword.jsx";
import SuccessPayment from "./Components/Payment/SuccessPayment.jsx";
import CancelPayment from "./Components/Payment/CancelPayment.jsx";
import DonationsList from "./Components/Donation/DonationsList";
export const routers = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      // Public routes (authentication-related, accessible without token)
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgetpassword", element: <ForgetPassword /> },
      { path: "resetpassword", element: <ResetPassword /> },
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "blog", element: <Blog /> },
      { path: "categories", element: <Categories /> },
      { path: "categories/:catName", element: <CategoryItems /> },
      { path: "contact", element: <Contact /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetails /> },
      // Protected routes (everything else requires a token)
      { path: "cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: "wishlist", element: <ProtectedRoute><WishList /></ProtectedRoute> },
      { path: "userdashboard", element: <ProtectedRoute><UserDashboard /></ProtectedRoute> },
      { path: "checkout", element: <ProtectedRoute><CheckOut /></ProtectedRoute> },
      { path: "payment", element: <ProtectedRoute><Payment /></ProtectedRoute> },
      // chatbot
      // {path: "chatbot", element: <ChatBot />},
        // Donation
        { path: "donation", element: <DonationsList /> },
    
      { path: "success/:orderId", element: <ProtectedRoute><SuccessPayment /></ProtectedRoute> },
      { path: "cancel/:orderId", element: <ProtectedRoute><CancelPayment /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);