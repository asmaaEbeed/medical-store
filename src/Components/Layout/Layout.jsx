import { useState } from "react";
import Navigationbar from "../Navbar/Navigationbar";
import Footer from "../Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "../../shop/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductProvider } from "../../shop/ProductsContext";
import { WishListProvider } from "../../shop/WishListContext";
import { OrderProvider } from "../../shop/OrderContext";
import { Offline } from "react-detect-offline";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import styles from "./Layout.module.css";
import { BlogsProvider } from "../../shop/BlogsContext";
import { CouponProvider } from "../../shop/CouponContext";
import ChatBot from "../ChatPot/ChatBot";

import DonationChatbot from "../Donation/DonationChatbot";


import { ReviewProvider } from "../../shop/ReviewContext";
import { Button } from "react-bootstrap";
import ThemeSwitcher from "./ThemeSwitcher";
import { FaCog } from "react-icons/fa";

function Layout() {
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const routesWithoutNav = ["/login", "/forgetpassword", "/resetpassword", "/signup", "/success/", "/cancel/"];
  const location = useLocation();
  const myRoute = location.pathname;
  const toggleThemeSwitcher = () => {
    setShowThemeSwitcher(!showThemeSwitcher);
  };
  return (
      <WishListProvider>

        <CouponProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <ReviewProvider>
                  <BlogsProvider>
                    <ToastContainer />
                    <Navigationbar />
                    <DonationChatbot />
                    <Offline>
                      <div className={styles.offlineContainer}>
                        <div className={styles.offlineContent}>
                          <span className={styles.warningIcon}>
                            <ExclamationTriangleFill />
                          </span>
                          <p className={styles.offlineMessage}>
                            You are currently offline. Please check your internet
                            connection!
                          </p>
                        </div>
                      </div>
                    </Offline>
                    <Outlet />

                    <Footer />
                    <ThemeSwitcher show={showThemeSwitcher} toggle={toggleThemeSwitcher} />
                    {!routesWithoutNav.includes(myRoute) &&<Button variant="primary" onClick={toggleThemeSwitcher} className={styles.themeSwitcherButton}>
                      <FaCog className={styles.faSpin} size={24} /></Button>}
                    <ChatBot />
                  </BlogsProvider>
                </ReviewProvider>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </CouponProvider>

      </WishListProvider>
  );
}

export default Layout;
