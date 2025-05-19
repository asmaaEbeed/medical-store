import { useContext, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FiShoppingCart, FiEye, FiHeart, FiArrowRight } from 'react-icons/fi';
import style from './ProductsSlider.module.css'; 
import CartContext from '../../shop/CartContext';
import ProductsContext from '../../shop/ProductsContext';
import UserContext from '../../shop/UserContext';
import { useWishList } from '../../shop/WishListContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FeaturedProductsSlider = ({ title = "Featured Products" }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { productsList, isLoading } = useContext(ProductsContext);
  const { userToken } = useContext(UserContext);
  const { addToWishlist, removeItemFromWishlist, isInWishlist } = useWishList();
  const navigate = useNavigate();

  const featuredProducts = productsList.filter(product => 
    product.featured === true || product.rating >= 4
  ).slice(0, 8);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
    dotsClass: `slick-dots ${style.customDots}`,
  };

  const renderStars = (rating) => (
    <div className={`${style.stars} d-flex gap-1`}>
      {[...Array(5)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={index < rating ? fasStar : farStar}
          className={index < rating ? `${style.starFilled}` : `${style.starEmpty}`}
        />
      ))}
    </div>
  );

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if(!userToken) {
      const currentUrl = window.location.pathname;
      localStorage.setItem('currentUrl', currentUrl);
      navigate('/login', {state: {from: currentUrl}});
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart successfully!`);
  };

  const handleQuickView = (product, e) => {
    e.stopPropagation();
    navigate(`/products/${product._id}`);
  };

  const handleWishlist = (product, e) => {
    e.stopPropagation();
    if(!userToken) {
      const currentUrl = window.location.pathname;
      localStorage.setItem('currentUrl', currentUrl);
      navigate('/login', {state: {from: currentUrl}});
      return;
    }
    
    if (isInWishlist(product._id)) {
      removeItemFromWishlist(product._id);
      toast.warning(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product._id);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  if (isLoading) {
    return (
      <section className={style.featuredSection}>
        <Container>
          <div className={style.sectionHeader}>
            <span className={style.sectionSubtitle}>Discover</span>
            <h2 className={style.sectionTitle}>{title}</h2>
          </div>
          <div className={style.loaderContainer}>
            <div className={style.productLoader}>
              <div className={style.loaderDot}></div>
              <div className={style.loaderDot}></div>
              <div className={style.loaderDot}></div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className={style.featuredSection}>
      <Container>
        <div className={style.sectionHeader}>
          <span className={style.sectionSubtitle}>Discover</span>
          <h2 className={style.sectionTitle}>{title}</h2>
          <p className={style.sectionDescription}>
            Explore our handpicked selection of premium products, chosen for their exceptional quality and popularity.
          </p>
        </div>
        
        <div className={style.sliderWrapper}>
          <Slider {...settings} className={style.productSlider}>
            {featuredProducts.map((product) => (
              <div key={product._id} className={style.slideItem}>
                <div 
                  className={style.productCard}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {/* Product Status Tags */}
                  <div className={style.productTags}>
                    {product.isNew && <span className={`${style.productTag} ${style.tagNew}`}>New</span>}
                    {product.onSale && <span className={`${style.productTag} ${style.tagSale}`}>Sale</span>}
                    {product.stock <= 5 && product.stock > 0 && 
                      <span className={`${style.productTag} ${style.tagLimited}`}>Limited</span>
                    }
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    className={`${style.wishlistButton} ${isInWishlist(product._id) ? style.active : ''}`}
                    onClick={(e) => handleWishlist(product, e)}
                    aria-label={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <FiHeart />
                  </button>
                  
                  {/* Product Image */}
                  <div className={style.productImageContainer}>
                    <img 
                      src={product.mainImage?.path} 
                      alt={product.name} 
                      className={style.productImage}
                    />
                    
                    {/* Hover Actions */}
                    <div 
                      className={style.productActions}
                      style={{ opacity: hoveredProduct === product._id ? 1 : 0 }}
                    >
                      <button 
                        className={`${style.actionButton} ${style.cartButton}`}
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                      </button>
                      
                      <button 
                        className={`${style.actionButton} ${style.viewButton}`}
                        onClick={(e) => handleQuickView(product, e)}
                      >
                        <FiEye />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className={style.productInfo}>
                    <div className={style.productCategory}>{product.category}</div>
                    <h3 className={style.productName}>{product.name}</h3>
                    
                    <div className={style.productMeta}>
                      {renderStars(product.rating)}
                      <div className={style.productPrice}>
                        {product.oldPrice && (
                          <span className={style.oldPrice}>${product.oldPrice.toFixed(2)}</span>
                        )}
                        <span className={style.currentPrice}>${product.price?.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Stock Indicator */}
                    {product.stock <= 10 && product.stock > 0 && (
                      <div className={style.stockIndicator}>
                        <div className={style.stockBar}>
                          <div 
                            className={style.stockLevel} 
                            style={{ width: `${(product.stock / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className={style.stockText}>Only {product.stock} left</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        
        <div className={style.viewAllContainer}>
          <button 
            className={style.viewAllButton}
            onClick={() => navigate('/products')}
          >
            <span>View All Products</span>
            <FiArrowRight />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductsSlider;
