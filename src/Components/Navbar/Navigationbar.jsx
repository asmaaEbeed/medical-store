import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import classes from "./Navbar.module.css";
import { Nav, NavItem } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useTranslation } from 'react-i18next';
import { useContext } from "react";
import { UserContext } from "../../shop/UserContext";

export default function Navigationbar() {
  const [activeLink, setActiveLink] = React.useState("home");
  const location = useLocation();
  const myRoute = location.pathname;
  const { t } = useTranslation();
  const { userToken } = useContext(UserContext);

  const routesWithoutNav = ["/login", "/forgetpassword", "/resetpassword", "/signup", "/success/", "/cancel/"];

  return (
    <div className={`${classes.navigationContainer}`}>
      {!routesWithoutNav.includes(myRoute) &&<TopNav />}
      {!routesWithoutNav.includes(myRoute) && (
        <Navbar
          expand="lg"
          className={`${classes.navContainer} border-top border-2 p-md-0 d-flex justify-content-center align-content-center text-uppercase`}
        >
          <Container className={`p-0 ${classes.mt_2_neg}`}>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="m-2 outline-none border-0"
            />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-between"
            >
              <Nav expand="lg">
                <NavItem>
                  <NavLink
                    to="/"
                    className={`${classes.navLink} ${myRoute === "/" ? classes.activeLink : ""} text-decoration-none fw-bold text-primary-1000 py-3 px-3 d-block`}
                  >
                    {t('nav.home')}
                  </NavLink>
                </NavItem>
                <NavLink
                  to="/products"
                  end
                  className={`${classes.navLink} ${myRoute.startsWith("/products") ? classes.activeLink : ""} text-decoration-none fw-bold text-primary-1000 py-3 px-3 d-block`}
                >
                  {t('nav.products')}
                </NavLink>
                <NavLink
                  to="/categories"
                  className={`${classes.navLink} ${myRoute.startsWith("/categories") ? classes.activeLink : ""} text-decoration-none fw-bold text-primary-1000 py-3 px-3 d-block`}
                >
                  {t('nav.categories')}
                </NavLink>
                <NavLink
                  to="/about"
                  className={`${classes.navLink} ${myRoute === "/about" ? classes.activeLink : ""} text-decoration-none fw-bold text-primary-1000 py-3 px-3 d-block`}
                >
                  {t('nav.about')}
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setActiveLink("contact")}
                  className={`${classes.navLink} ${myRoute === "/contact" ? classes.activeLink : ""} text-decoration-none fw-bold text-primary-1000 py-3 px-3 d-block`}
                >
                  {t('nav.contact')}
                </NavLink>


                <NavLink
                  to="/blog"
                  onClick={() => setActiveLink("blog")}
                  className={`${classes.navLink} ${myRoute === "/blog" ? classes.activeLink : ""} text-decoration-none fw-bold text-primary-1000 py-3 px-3 d-block`}
                >
                  {t('nav.blog')}
                </NavLink>

                <NavLink
                  to="/donation"
                  onClick={() => setActiveLink("donation")}
                  className={`${classes.navLink} ${myRoute === "/donation" ? classes.activeLink : ""} text-decoration-none fw-bold text-primary-1000 py-3 px-3 d-block`}
                >
                  {t('nav.donation')}
                </NavLink>
              </Nav>
              <Link
                className={`btn bg-warning-400 transition-btn d-lg-block d-none transition-btn-orange-outline border-white rounded-3 text-lowercase ${classes.readMore}`}
                to={"/contact"}
              >
                <span>{t('nav.contactUs')}</span>
              </Link>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </div>
  );
}