import React from "react";
import { NavLink } from "react-router-dom";
import style from "./BreadCrumb.module.css";

const BreadCrumb = ({ breadCrumbData }) => {
  return (
    <div className={`${style.topNavigate} d-flex align-items-center py-2 px-5`}>
      {breadCrumbData.map((item, index) => (
        <NavLink
          to={item.link}
          className={`${style.navLink} text-decoration-none py-3 d-block`}
          key={index}
        >
          {item.name}
          {index < breadCrumbData.length - 1 && <span className={`${style.divider}`}>&#8725;</span>}
        </NavLink>
      ))}
    </div>
  );
};

export default BreadCrumb;
