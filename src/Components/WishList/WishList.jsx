import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useWishList } from '../../shop/WishListContext';
import { FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useContext, useEffect, useState } from 'react';
import CartContext from '../../shop/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import style from './Wishlist.module.css';
// Import context
import WishListContext from '../../shop/WishListContext';
import UserContext from '../../shop/UserContext';

import WishListSections from './WishListSections';

export default function Wishlist() {
  // fetch context
  const { wishlistItems, removeItemFromWishlist, fetchWishlist, loading } = useContext(WishListContext);
  const { addToCart } = useContext(CartContext);
  const { userToken } = useContext(UserContext);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Fetch wishlist when component mounts
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        await fetchWishlist();
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist items");
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!userToken) {
      // If user is not logged in save the current URL in local storage and after login redirect back to the current page
      const currentUrl = window.location.pathname;
      localStorage.setItem('currentUrl', currentUrl);
      navigate('/login', { state: { from: currentUrl } });
      return
    }
    // toast.dismiss();
    // toast.success(`added to cart successfuly!`);
    addToCart(product);
  };

  // Show loading state
  if (isLoading || loading) {
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
      <Container>
        <Link
          className={`btn bg-warning-50 transition-btn w-25 transition-btn-orange-outline border-white rounded-3 text-lowercase d-inline`}
          to={"/products"}
        >
          <span className='text-secondary'>Back to products</span>
        </Link>
        <Col xs={12} className="my-4">
          <div className="d-flex align-items-center ">
            <h2 className="mb-0 mx-3">My Wishlist</h2>
            <span className={style.badge + " bg-warning-400"}>
              {wishlistItems.length} items
            </span>
          </div>
        </Col>
        <Card>
          <Card.Body>

            <WishListSections wishlistItems={wishlistItems} removeItemFromWishlist={removeItemFromWishlist} colSize={3}/>
          </Card.Body>
        </Card>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />      </Container>
    </div>
  );
}
