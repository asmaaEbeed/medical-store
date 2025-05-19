import React, { useEffect, useState } from "react";
import style from "./Products.module.css";
import { Col, Row, Card, Badge, Modal, Button } from "react-bootstrap";
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
import QuickViewModal from "./QuickViewModal";
import { Link, useNavigate } from "react-router";
import truncateText from "../Common/truncateText";
import { useWishList } from "../../shop/WishListContext";
const ProductsSection = ({
  currentProducts,
  handleAddToCart,
  handleWishlist,
}) => {
  const { isInWishlist } = useWishList();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  const handleQuickView = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowModal(true);
  };
  const toggle = () => setShowModal(!showModal);

  return (
    <>
      <Row className="g-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <Col md={6} lg={4} key={product._id}>
              <Card
                className={`${style.productCard} border-0 overflow-hidden`}
                style={{ height: "370px" }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <div className="position-relative" style={{ height: "220px" }}>
                  <Card.Img
                    src={product.mainImage.path}
                    alt={product.name}
                    className={`${style.productImage} object-fit-cover border border-1 rounded-5 h-100 w-100 `}
                  />
                  {product.stock < 1 ? (
                    <div
                      className={`${style.cardOverlayOutStock} text-white  border border-1 rounded-5 h-100 w-100 d-flex align-items-center justify-content-center`}
                    >
                      <h4>Out of Stock</h4>
                    </div>
                  ) : (
                    product.isDeleted ? <div
                    className={`${style.cardOverlayOutStock} text-white  border border-1 rounded-5 h-100 w-100 d-flex align-items-center justify-content-center`}
                  >
                    <h4>Not Available now</h4>
                  </div> :<div
                      className={`${style.cardOverlay}  border border-1 rounded-5 h-100 w-100`}
                    ></div>
                  )}

                  <div className="position-absolute start-0 top-0 p-3 d-flex flex-column gap-3">
                    {product.discount > 0 && (
                      <Badge bg="danger" className={style.badge}>
                        -{product.discount}%
                      </Badge>
                    )}

                    {product.category === "latest" && (
                      <Badge bg="warning" className={style.badge}>
                        NEW
                      </Badge>
                    )}
                  </div>
                  <div className="position-absolute start-0 bottom-0 p-3" data-toggle="tooltip" data-placement="top" title="Order by whatsapp">
                      <a
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        href={`https://wa.me/+201000277028?text=Hello, I'm interested in product "${product.name}" with Price ${product.price}.\n \nCould you please provide more details?\n, Is there currently any discount or available coupon for this product? Thank you!`}
                      >
                        <i className={`${style.whatsappIcon} fa-brands fa-whatsapp fs-4`}></i>
                      </a>
                  </div>
                  <div></div>
                  {(product.stock > 0 && product.isDeleted === false) && (
                    <div className={style.iconMenu}>
                      <div className="d-flex flex-column align-items-start gap-3">
                        <FiHeart
                          className={`${style.icon} ${isInWishlist(product.id) ? style.active : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWishlist(product, e);
                          }}
                        />
                        <FiEye
                          className={style.icon}
                          onClick={(e) => handleQuickView(product, e)}
                        />
                        <FiShoppingCart
                          className={style.icon}
                          onClick={(e) => handleAddToCart(product, e)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Card.Body
                  className="p-3 d-flex flex-column justify-content-between"
                  style={{ height: "150px" }}
                >
                  <div>
                    <Card.Title className="fw-bold  mb-1">
                      {product.name}
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {truncateText(product.description)}
                    </Card.Text>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="h5  fw-bold mb-0">
                        ${parseFloat(product.priceAfterDiscount.toFixed(2))}
                      </span>
                      {product.discount > 0 && (
                        <small className="text-muted text-decoration-line-through ms-2">
                          ${parseFloat(product.price.toFixed(2))}
                          {/* {(
                            product.price *
                            (1 + product.discount / 100)
                          ).toFixed(2)} */}
                        </small>
                      )}
                    </div>

                    <small
                      className={`border-0 rounded-3 text-white px-2 ${product.category === "popular" ? style.categoryBadge : "bg-warning"}`}
                    >
                      {product.category}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5 border border-1">
            <h4 className="fw-bold">No Products Found</h4>
            <p className="text-muted fs-5">
              Try adjusting your search or filter criteria
            </p>
          </Col>
        )}
      </Row>

      {/* ================= Modal part =============== */}
      <QuickViewModal
        showModal={showModal}
        toggle={toggle}
        selectedProduct={selectedProduct}
        handleAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductsSection;
