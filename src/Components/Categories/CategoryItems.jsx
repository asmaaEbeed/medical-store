import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Container, Pagination, Row, Col, Spinner } from "react-bootstrap";
import ProductsSection from "../Products/ProductsSection";
import ProductsContext from "../../shop/ProductsContext";
import CartContext from "../../shop/CartContext";
import style from "../Products/Products.module.css";
import ProductsFilter from "../Products/ProductsFilter";
import { useLocation } from "react-router-dom";
import BreadCrumb from "./../Common/BreadCrumb";

const CategoryItems = () => {
  const location = useLocation();
  const {
    handleProductsCatList,
    catProducts,
    productsList,
    catData,
    catDataLoading,
  } = useContext(ProductsContext);
  const { addToCart } = useContext(CartContext);

  const categoryId = location.pathname.split("/")[2];

  useEffect(() => {
    handleProductsCatList(categoryId);

    // Add productsList as dependencies to handleProductsCatList after page reload it takes time to fetch products list to handle category list after fetch products data
  }, [location.pathname, productsList]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productsPerPage = 6;

  useEffect(() => {
    catProducts && setFilteredProducts(catProducts);
  }, [catProducts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts =
    filteredProducts.length > 0
      ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
      : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilteredProducts = (products) => setFilteredProducts(products);
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const breadCrumbData = [
    { name: "Home", link: "/" },
    { name: "Categories", link: "/categories" },
    { name: catData.name, link: location.pathname },
  ];

  return (
    <Container>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Row className="gy-5 mt-1">
        {/* ================= side menue ================== */}

        <ProductsFilter
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          handleFilteredProducts={handleFilteredProducts}
          currentProducts={catProducts}
        />
        {/* ================display products=============== */}
        <Col md={8} className="px-4">
          {/* ================= Products Cards ================== */}
          {catDataLoading ? (
            <div
              className="mx-auto text-center my-5"
              style={{ height: "100px" }}
            >
              <Spinner animation="grow" variant="warning" />
              <h6 className="mx-2 my-2">Loading...</h6>
            </div>
          ) : (
            <div>
              <div className="d-flex align-items-center mb-4">
                <h3 className=" mb-0">
                  {/* {selectedCategory === "all" &&
                `All ${window.location.pathname.split("/")[2]} Products`} */}
                  {selectedCategory === "all" && `All ${catData.name} Products`}
                  {selectedCategory === "latest" && "Latest Products"}
                  {selectedCategory === "popular" && "Popular Products"}
                  {selectedCategory === "sale" && "Sale Products"}
                </h3>
                <span
                  className={`${style.categoryBadge} rounded-3 ms-3 px-3 py-1 text-white`}
                >
                  {catDataLoading ? 0 : filteredProducts.length} Products
                </span>
              </div>
              <ProductsSection
                currentProducts={currentProducts}
                handleAddToCart={handleAddToCart}
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
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryItems;
