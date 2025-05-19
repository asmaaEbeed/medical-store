import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import WishListContext from '../../../shop/WishListContext';
import { FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useContext, useEffect } from 'react';
import CartContext from '../../../shop/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import style from '../UserDashboard.module.css';
import WishListSections from '../../WishList/WishListSections';

export default function Wishlist() {

  const { wishlistItems, removeItemFromWishlist, fetchWishlist, loading } = useContext(WishListContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch wishlist when component mounts
    fetchWishlist();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    removeItemFromWishlist(product._id);
    toast.success('Added to cart successfully!');
  };

  // Show loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your wishlist...</p>
      </Container>
    );
  }

  return (
    <div className={style.wishlistPage}>
      <ToastContainer />
      <Container>
        {/* <Button 
          variant="outline-warning" 
          className={`mb-4 ${style.backButton}`}
          onClick={() => navigate('/products')}
        >
          <FiArrowLeft className="me-2" />
          Back to Products
        </Button> */}
        <WishListSections wishlistItems={wishlistItems} removeItemFromWishlist={removeItemFromWishlist} colSize={12}/>
        
        {/* Check if wishlistItems exists and has length */}
        {/* {!wishlistItems || wishlistItems.length === 0 ? (
          <Row className="justify-content-center">
            <Col md={6}>
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={12} className="mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="mb-0">My Wishlist</h2>
                <span className={style.badge}>
                  {wishlistItems.length} items
                </span>
              </div>
            </Col>
            {wishlistItems.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className={`h-100 border-0 ${style.card}`}>
                  <div className="position-relative overflow-hidden">
                    <Card.Img 
                      variant="top" 
                      src={product.mainImage.path} 
                      className={style.productImage}
                      style={{ height: '220px', objectFit: 'contain' }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="h5 mb-2">{product.name}</Card.Title>
                    <Card.Text className="text-warning fw-bold mb-3 fs-5">
                      ${product.price}
                    </Card.Text>
                    <div className={`mt-auto ${style.buttonGroup}`}>
                      <Button 
                        variant="warning" 
                        className="text-white rounded-3 mx-2"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FiShoppingCart className="me-2" />
                        +
                      </Button>
                      <Button 
                        variant="outline-danger"
                        className="rounded-3"
                        onClick={async () => {
                          await removeItemFromWishlist(product._id);
                          toast.error(`${product.name} removed from wishlist`);
                        }}
                      >
                        <FiTrash2 className="m-1" />
                        
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )} */}
      </Container>
    </div>
  );
}
