import React from "react";
import style from "./Products.module.css";
import { Modal, Row, Col, Button, Badge } from "react-bootstrap";
import { FiShoppingCart } from "react-icons/fi";

const QuickViewModal = ({
  showModal,
  toggle,
  selectedProduct,
  handleAddToCart,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={toggle}
      centered
      size="sm"
      className={style.quickViewModal}
    >
      <Modal.Header closeButton className="border border-0 mb-0 pb-0">
        <Modal.Title className="mb-0 pb-0">Quick View</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pt-1">
        {selectedProduct && (
          <Row className="g-2">
            <Col xs={12}>
              <img
                src={selectedProduct?.mainImage?.path}
                alt={selectedProduct.name}
                className={`object-fit-cover border border-1 rounded-3 h-100 w-100 `}
              />
            </Col>
            <Col xs={12}>
              <h4 className="mb-2">{selectedProduct.name}</h4>
              <p className="text-muted small mb-3">
                {selectedProduct.description}
              </p>

              <div className="d-flex align-items-center gap-2 mb-3">
                <h5 className="mb-0">${selectedProduct.price}</h5>
                {selectedProduct.discount > 0 && (
                  <>
                    <small className="text-decoration-line-through text-muted">
                      $
                      {(
                        selectedProduct.price *
                        (1 + selectedProduct.discount / 100)
                      ).toFixed(2)}
                    </small>
                    <Badge bg="danger" className="ms-auto">
                      -{selectedProduct.discount}%
                    </Badge>
                  </>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(selectedProduct, e);
                  toggle();
                }}
              >
                <FiShoppingCart className="me-2" />
                Add to Cart
              </Button>
            </Col>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;
