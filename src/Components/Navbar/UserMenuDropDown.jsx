import React, { useContext } from "react";
import classes from "./Navbar.module.css";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaKey,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import UserDashboard from "./../UserDashboard/UserDashboard";
import UserContext from "../../shop/UserContext";
import { useNavigate } from "react-router-dom";
const UserMenuDropDown = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div>
      <ul
        className={`dropdown-menu  dropdown-menu-right shadow border-light shadow-sm  d-none ${classes.dropMenuUser}`}
      >
        <li
          className={`px-2 py-1 d-flex justify-content-between  align-items-center ${true && "border-bottom"}`}
        >
          <Link
            className={`${classes.menuItem} text-decoration-none`}
            to={"/userdashboard"}
          >
            <FaUser /> User Dashboard
          </Link>
        </li>
        <li className="px-2 ">
          <button
            className={`${classes.menuItem} ${classes.logout} py-2 px-4 `}
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenuDropDown;
