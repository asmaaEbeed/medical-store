import Logo from "../../assets/images/Logo.png";
import classes from "./Navbar.module.css";
import { Link, useLocation } from "react-router-dom";
import TopContactNav from "./TopContactNav";
import CartContext from "../../shop/CartContext";
import { useContext, useEffect } from "react";
import { UserContext } from "../../shop/UserContext";
import { FaUser } from "react-icons/fa";
import { Button } from "react-bootstrap";
import SearchInput from "./SearchInput";
import CartDropDownMenu from "./CartDropDownMenu";
import UserMenuDropDown from "./UserMenuDropDown";

const TopNav = () => {
  const { cartCount, cartList, removeFromCart, getCartItems } = useContext(CartContext);
  const { userToken } = useContext(UserContext);
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {path !== "/login" && <TopContactNav />}
      <div>
        <div className="container my-2 p-0 d-block d-md-none w-100">
          <SearchInput />
        </div>
        <div className="container d-flex py-2 justify-content-between">
          {/* Logo */}
          <div className="logo" style={{ width: "100px" }}>
            <img src={Logo} alt="Care +" className="w-100" />
          </div>
          <div className="d-none d-md-block w-50">
            <SearchInput />
          </div>

          {path !== "/login" ? (
            <div className="d-flex align-content-center align-items-center">
              {/* Wishlist */}
              <Link to="/wishlist" className="mr-md-1 mx-1">
                <i className="fa-regular fa-heart text-primary-1000"></i>
              </Link>

              {/* User icon since user is logged in */}
              <div className={`${classes.userIconContainer} position-relative h-100 d-flex`}>
                <Link
                  to="/userdashboard"
                  className={`${classes.userIcon} mx-md-4 mx-4`}
                >
                  <FaUser size={20} />
                </Link>
                {userToken && <UserMenuDropDown />}
              </div>

              {/* Cart */}
              <div className="position-relative">
                <Link
                  className={`${classes.cartBtn} text-decoration-none position-relative p-3 mx-md-0 mx-3 bg-primary-1000 rounded-circle text-center d-flex align-items-center justify-content-center`}
                  onClick={getCartItems} to="/cart"
                >
                  <span className={`${classes.cartCount} position-absolute`}>
                    {cartCount}
                  </span>
                  <i className="bx bx-shopping-bag text-white fs-lg"></i>
                </Link>
                {userToken && (
                  <CartDropDownMenu
                    classes={classes}
                    cartList={cartList}
                    removeFromCart={removeFromCart}
                    getCartItems={getCartItems}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="d-flex align-content-center align-items-center">
              {/* Only show login/signup buttons when no user is logged in */}
              <Link to="/login" className="mx-md-2 mx-2">
                <Button variant="outline-primary" className="text-uppercase">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="mx-md-2 mx-2">
                <Button variant="outline-primary" className="text-uppercase">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopNav;
