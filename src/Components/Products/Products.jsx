import  { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Container,
  Row,
  Col,
  Pagination,
  Spinner,
} from "react-bootstrap";

import style from "./Products.module.css";
import slide1 from "../../assets/images/slid1.jpg";
import slide2 from "../../assets/images/slid2.jpg";
import slide3 from "../../assets/images/slid3.jpg";
import slide4 from "../../assets/images/slid4.jpg";
import Slider from "../Slider/Slider";
import CartContext from "../../shop/CartContext";
import { useWishList } from "../../shop/WishListContext";
import ProductsContext from "../../shop/ProductsContext";
import UserContext from "../../shop/UserContext";
import ProductsSection from "./ProductsSection";
import ProductsFilter from "./ProductsFilter";
import BreadCrumb from "../Common/BreadCrumb";
import { useNavigate } from 'react-router-dom';

const Products = () => {
const { addToCart } = useContext(CartContext);
const { addToWishlist, removeItemFromWishlist, isInWishlist } = useWishList();
const { productsList, isLoading } = useContext(ProductsContext);
const { userToken } = useContext(UserContext);
const navigate = useNavigate();

const handleWishlist = (product, e) => {
  e.stopPropagation();
  console.log(product);
  if (isInWishlist(product._id)) {
    removeItemFromWishlist(product._id);
    toast.warning(`${product.name} removed from wishlist`);
  } else {
    addToWishlist(product._id);
    toast.success(`${product.name} added to wishlist`);
  }
};

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if(!userToken) {
      const currentUrl = window.location.pathname;
      localStorage.setItem('currentUrl', currentUrl);
      navigate('/login', {state: {from: currentUrl}});
      return
    }
    // toast.dismiss();
    // toast.success(`added to cart successfuly!`);
    addToCart(product);
  };
  const slideData = [
    {
      id: 1,
      title: "Original Products",
      image: slide1,
    },
    {
      id: 2,
      title: "Top Care",
      image: slide2,
    },
    {
      id: 3,
      title: "Medicinal Chemistry",
      image: slide3,
    },
    {
      id: 4,
      title: "Best Prices",
      image: slide4,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(productsList);
  // const [currentProducts, setCurrentProducts] = useState(productsList);
  const productsPerPage = 6;


  useEffect(() => {
 
    setFilteredProducts(productsList);
    // setCurrentProducts(productsList);
  }, [productsList]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilteredProducts = (products) => setFilteredProducts(products);

  const breadCrumbData = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
  ];
  return (
    <>
      {/* ===============Navigate Line============ */}
      <BreadCrumb breadCrumbData={breadCrumbData} />
      {/* ===================Hero Section================== */}
      <Container fluid className={`${style.sliderBackground}`}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          pauseOnHover
          theme="colored"
        />

        <Row>
          <Col
            md={4}
            className="d-flex flex-column justify-content-center ps-5"
          >
            <h1 className="display-3 fw-bold mb-4">
              Your Health, Our Priority
            </h1>
            <p className="lead mb-4">
              Discover premium pharmaceutical products carefully selected for
              your wellbeing
            </p>
          </Col>
          <Col md={8}>
            <Slider slideData={slideData} />
          </Col>
        </Row>
      </Container>
      {/* ==================Products title Part================== */}
      <Container fluid className={`${style.mainContainer} mt-1 pt-4`}>
        <Row className="gy-5 mt-1">
          {/* ================= side menue ================== */}

          <ProductsFilter
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            handleFilteredProducts={handleFilteredProducts}
            currentProducts={productsList}
          />
          {/* ================display products=============== */}
          {!isLoading ? <Col md={8} className="px-4">
            <div className="d-flex align-items-center mb-4">
              <h3 className=" mb-0">
                {selectedCategory === "all" && "All Products"}
                {selectedCategory === "latest" && "Latest Products"}
                {selectedCategory === "popular" && "Popular Products"}
                {selectedCategory === "sale" && "Sale Products"}
              </h3>
              <span
                className={`${style.categoryBadge} rounded-3 ms-3 px-3 py-1 text-white`}
              >
                {filteredProducts.length} Products
              </span>
            </div>
            {/* ================= Products Cards ================== */}
            <ProductsSection
              currentProducts={currentProducts}
              handleAddToCart={handleAddToCart}
              handleWishlist={handleWishlist}  
            />

            {currentProducts.length > 0 && (
              <Row className="my-5">
                <Col>
                  <Pagination className="justify-content-center gap-2">
                    {Array.from({
                      length: Math.ceil(
                        filteredProducts.length / productsPerPage
                      ),
                    }).map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                        className={`${style.categoryBadge} rounded-circle`}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </Col>
              </Row>
            )}
          </Col> :<Col md={8} className="px-4 text-center"><Spinner animation="grow" variant="info" /><h5>Loading...</h5></Col>  }
        </Row>
      </Container>
    </>
  );
};

export default Products;
