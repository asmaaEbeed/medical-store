import React, { useEffect, useContext, useState } from "react";
import style from "./Products.module.css";
import {
  Col,
  Card,
  InputGroup,
  Nav,
  Pagination,
  Form,
  Modal,
} from "react-bootstrap";
import {
  FiSearch,
  FiShoppingCart,
  FiEye,
  FiShoppingBag,
  FiStar,
  FiHeart,
  FiPercent,
  FiPackage,
  FiDroplet,
} from "react-icons/fi";
import ProductsContext from "../../shop/ProductsContext";
import { use } from "react";

const ProductsFilter = ({
  handleCategoryChange,
  selectedCategory,
  handleFilteredProducts,
  currentProducts
}) => {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(10000);

  const [filteredProducts, setFilteredProducts] = useState(currentProducts);

  useEffect(() => {
    setFilteredProducts(
        currentProducts
        .filter(
          (product) =>
            selectedCategory === "all" || product.category === selectedCategory
        )
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((product) => product.price <= priceRange)
    );
  }, [selectedCategory, searchQuery, priceRange]);

  useEffect(() => {
    
    handleFilteredProducts(filteredProducts);
  }, [filteredProducts]);

  return (
    <Col md={4} className={``}>
      <Card>
        <Card.Body className={`${style.sideNav} border-2 p-4`}>
          <InputGroup className="mb-4">
            <InputGroup.Text className="text-muted">
              <FiSearch size={18} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <div className="mb-4">
            <h5 className="mb-3 fw-bold">
              <FiPackage className="me-2" />
              Price Range
            </h5>
            <div className="d-flex justify-content-between mb-2">
              <small className="text-muted">$0</small>
              <small className="text-muted">${priceRange}</small>
            </div>
            <Form.Range
              min="0"
              max="10000"
              step="100"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                const percent = ((e.target.value - 5) / 95) * 100;
                e.target.style.setProperty("--value-percent", `${percent}%`);
              }}
              className={`${style.priceRange}`}
            />
          </div>

          <div>
            <h5 className="mb-3 fw-bold">
              <FiShoppingBag className="me-2" />
              Products
            </h5>
            <Nav className="flex-column">
              {[
                {
                  key: "all",
                  icon: <FiDroplet size={18} />,
                  label: "All Products",
                },
                {
                  key: "latest",
                  icon: <FiStar size={18} />,
                  label: "Latest Products",
                },
                {
                  key: "popular",
                  icon: <FiHeart size={18} />,
                  label: "Popular Products",
                },
                {
                  key: "sale",
                  icon: <FiPercent size={18} />,
                  label: "Sale Products",
                },
              ].map((category) => (
                <Nav.Link
                  key={category.key}
                  onClick={() => handleCategoryChange(category.key)}
                  className={`mb-2 d-flex align-items-center ${
                    selectedCategory === category.key
                      ? `${style.categoryBadge} active text-white`
                      : "text-dark"
                  }`}
                >
                  <span className="me-2">{category.icon}</span>
                  {category.label}
                </Nav.Link>
              ))}
            </Nav>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductsFilter;
