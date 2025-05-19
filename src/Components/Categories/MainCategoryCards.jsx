import React, { useRef, useContext, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import classes from "./Categories.module.css";
import ProductsContext from "../../shop/ProductsContext";
import Trend from "./Trend";
import ProductsSlider from "../ProductsSlider/ProductsSlider";

// Import images
import SupplimentImg from "../../assets/images/category/category-cover-suppliment.jpg";
import MakeupImg from "../../assets/images/category/category-cover-makeup.jpg";
import BabyCareImg from "../../assets/images/category/category-cover-baby-care.jpg";
import MedicalDeviceImg from "../../assets/images/category/category-cover-blood-sugar-meter.jpg";

import { categoriesAPI } from "../../services/api/index";


const CATEGORIES = [
  { id: 1, name: "Suppliment", image: SupplimentImg, duration: 0.8 },
  { id: 2, name: "SkinCare", image: MakeupImg, duration: 1 },
  { id: 3, name: "BabyCare", image: BabyCareImg, duration: 1.5 },
  { id: 4, name: "MedicalDevice", image: MedicalDeviceImg, duration: 2 },
];


const MainCategoryCards = () => {
  const { bestSellersProducts: products } = useContext(ProductsContext);

  const containerRef = useRef();
  const cardsRef = useRef([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await categoriesAPI.getAllCategories();
        
        setCategories(response.data.categories);
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useGSAP(() => {
    // Create a timeline for sequential animations
    const tl = gsap.timeline();

    // Animate each card with its specific duration
    cardsRef.current.forEach((card, index) => {
      if (card) {
        tl.fromTo(
          card,
          { 
            scale: 0.1, 
            rotation: -180,
            opacity: 0 
          },
          {
            scale: 1,
            rotation: "+=180",
            opacity: 1,
            duration: CATEGORIES[index].duration,
            ease: "power2.out",
          },
          index === 0 ? 0 : "-=1" // Overlap animations except for the first one
        );
      }
    });

    return () => tl.kill();
  }, { scope: containerRef });

  return (
    <Container>
      {!isLoading && !error ? <Row className="p-0 m-0" ref={containerRef}>
        {categories.map((item, index) => (
          <Col
            lg={3}
            xs={6}
            className="position-relative mb-3"
            key={item.id}
            ref={el => cardsRef.current[index] = el}
          >
            <Link
              to={`/categories/${item._id}`}
              className={`rounded-3 position-relative overflow-hidden d-block ${classes.hoverTranslate}`}
            >
              <img
                src={item.Image.path}
                alt={item.name}
                className="img-fluid w-100 rounded-3"
              />
              <div
                className={`${classes.blur_text} ${classes.categoryTitle} px-4 py-2 rounded-3 mx-2`}
              >
                <p className={`my-1 ${classes.textShadow}`}>{item.name}</p>
                <h6
                  className={`${classes.textShadow} ${classes.hoverPseudo} d-inline`}
                >
                  View More
                </h6>
              </div>
            </Link>
          </Col>
        ))}
      </Row> : <div className="mx-auto text-center my-5" style={{ height: "100px" }}>
        <Spinner animation="grow" variant="warning" />
        <h6 className="mx-2 my-2">Loading...</h6>
      </div>}
      <Trend />
      <ProductsSlider products={products} title="Best Sellers" />
    </Container>
  );
};

export default MainCategoryCards;
