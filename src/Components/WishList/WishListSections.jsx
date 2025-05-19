import React, { useContext} from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import style from './WishList.module.css';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import CartContext from '../../shop/CartContext';
import { toast } from 'react-toastify';

const WishListSections = ({wishlistItems, removeItemFromWishlist, colSize}) => {

  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = (product, e) => {
    addToCart(product);
    removeItemFromWishlist(product._id);
    toast.success('Added to cart successfully!');
  }
  return (
    <div>{/* Check if wishlistItems exists and has length */}
    {!wishlistItems || wishlistItems.length === 0 ? (
      <Row className="justify-content-center my-5">
        <Col md={colSize ? colSize : 6}>
          <Card className={`border-0 shadow-sm ${style.card}`}>
            <Card.Header className={`bg-warning text-white border-0 ${style.header}`}>
              <h2 className="mb-0 fs-4">My Wishlist</h2>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <div className={style.emptyIcon}>
                <i className="bi bi-heart text-danger"></i>
              </div>
              <h4 className="mb-3">Your wishlist is empty</h4>
              <p className="text-muted mb-0">Start adding your favorite items to the wishlist</p>
              <Button
                variant="warning"
                className="mt-4 text-white"
                onClick={() => navigate('/products')}
              >
                Browse Products
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    ) : (
      <Row>
        
        {wishlistItems.map((product) => (
          <Col key={product.id} md={6} lg={4} className="mb-4">
            <Card className={`h-100 border-0 ${style.card}`}>
              <div className="position-relative overflow-hidden">
                <Card.Img
                  variant="top"
                  src={product.mainImage?.path || product.image}
                  className={`${style.productImage} py-2`}
                  style={{ height: '150px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                  }}
                />
              </div>
              <Card.Body className="d-flex flex-column p-4">
                <Card.Title className="h5 mb-2">{product.name}</Card.Title>
                <Card.Text className="fw-bold mb-3 fs-5">
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
                </Card.Text>
                <div className={`mt-auto ${style.buttonGroup}`}>

                  <Button
                    className={`bg-warning-400 transition-btn transition-btn-orange-outline border-white rounded-3 border-1`}
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <span><FiShoppingCart className="me-2" />
                      Add to Cart</span>
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="rounded-3"
                    onClick={async () => {
                      await removeItemFromWishlist(product._id);
                      toast.error(`${product.name} removed from wishlist`);
                    }}
                  >
                    <FiTrash2 className="me-2" />
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )}</div>
  )
}

export default WishListSections