import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom"; // استخدم react-router-dom بدلاً من react-router
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAirFreshener,
  faBaby,
  faCapsules,
  faMicroscope,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import style from "./About.module.css";
import BreadCrumb from "../Common/BreadCrumb";
import { Helmet } from "react-helmet";

export default function About() {
  const breadCrumbData = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
  ];

  const PRODUCTS = [
    {
      icon: <FontAwesomeIcon icon={faAirFreshener} size="xl" />,
      title: "Skin Care",
      description:
        "Keep your skin healthy and glowing with our premium selection of dermatologist-approved products. From daily essentials to specialized treatments.",
      link: "#",
    },
    {
      icon: <FontAwesomeIcon icon={faMicroscope} size="xl" />,
      title: "Medical Devices",
      description:
        "State-of-the-art medical equipment designed for precision and reliability. Trust our advanced technology for accurate diagnostics and care.",
      link: "#",
    },
    {
      icon: <FontAwesomeIcon icon={faBaby} size="xl" />,
      title: "Baby Care",
      description:
        "Gentle and safe products specially formulated for your little one's delicate needs. Pediatrician-recommended and hypoallergenic.",
      link: "#",
    },
    {
      icon: <FontAwesomeIcon icon={faCapsules} size="xl" />,
      title: "Supplements",
      description: "Boost your health with our premium selection of dietary supplements.",
      link: "#",
    },
  ];

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Helmet>
        <title>About Us - Your Trusted Healthcare Partner</title>
        <meta
          name="description"
          content="Learn about our commitment to quality healthcare products and services. Discover our story, values, and dedication to your well-being."
        />
      </Helmet>

      <header className={`${style.home} d-flex justify-content-center align-items-center text-white text-center`}>
        <div className={`${style.fadeIn}`}>
          <h1 className={`${style.mainTitle}`}>About Us</h1>
          <nav className={`${style.smallText} d-flex align-items-center justify-content-center`}>
            <NavLink to="/" className={`${style.navLink} text-decoration-none py-3 px-3 d-block`}>
              HOME
            </NavLink>
            <span className={`${style.divider}`}>&#8725;</span>
            <span>ABOUT US</span>
          </nav>
        </div>
      </header>

      <Container>
        <Row className={`${style.services} ${style.slideUp}`}>
          {PRODUCTS.map((product, index) => (
            <Col key={index} lg={3} md={6} className={`${style.serviceCard} ${style.fadeIn}`}>
              <div className={`${style.cardBody} shadow-lg rounded-4`}>
                <div className={`${style.icons} shadow-sm d-flex justify-content-center align-items-center`}>
                  {product.icon}
                </div>
                <h6 className={`${style.cardTitle} text-dark`}>{product.title}</h6>
                <p className={`${style.cardDescription} text-muted`}>
                  {product.description}
                </p>
                <Link to={product.link} className={`${style.viewMore} text-primary`}>
                  View more <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="mt-5">
        <Row className={`${style.slideIn} gy-5`}>
          <Col md={6}>
            <div className={`${style.firstItem} rounded-5`}></div>
          </Col>
          <Col md={6}>
            <div className={`${style.secondItem} rounded-5 d-flex align-items-center`}>
              <div className={`${style.contentBox}`}>
                <h3>People Come First, We Provide Best Quality Care</h3>
                <p>
                  At our core, we believe in putting people first. Our commitment to quality care drives everything we do. We
                  understand that healthcare is personal, and we're dedicated to providing the best possible products and services
                  to support your health journey.
                </p>
                <Button className={`${style.btn} btn bg-warning-400 border-0 p-2 mt-4`}>
                  Learn More <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Button>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className={`${style.thirdItem} rounded-5 d-flex align-items-center bg-primary-50`}>
              <div className={`${style.contentBox}`}>
                <h3>Why Choose Us</h3>
                <p>
                  We stand out in the healthcare industry through our unwavering commitment to quality, innovation, and customer
                  satisfaction. Our team of experts works tirelessly to bring you the best healthcare solutions.
                </p>
                <ul className={`${style.checkList} text-primary-900`}>
                  <li>Free & Fast Delivery</li>
                  <li>Secure Checkout</li>
                  <li>Easy Order Tracking</li>
                  <li>24/7 Customer Support</li>
                  <li>Quality Guaranteed</li>
                </ul>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className={`${style.fourthItem} rounded-5`}></div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
