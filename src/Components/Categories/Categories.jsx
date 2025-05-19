import classes from "./Categories.module.css";
import MainCategoryCards from "./MainCategoryCards";
import style from "../Products/Products.module.css";
import { NavLink } from "react-router-dom";
import BreadCrumb from "../Common/BreadCrumb";
export default function Categories() {
  const breadCrumbData = [
    { name: "Home", link: "/" },
    { name: "Categories", link: "/categories" },
  ];
  return (
    <>
      {/* ===============Navigate Line============ */}
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <MainCategoryCards />
    </>
  );
}
