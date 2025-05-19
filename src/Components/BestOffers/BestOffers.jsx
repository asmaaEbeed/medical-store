import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Container } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import style from './BestOffers.module.css';
import img1 from '../../assets/images/offers/1.jpg';
import img2 from '../../assets/images/offers/2.jpg';
import img3 from '../../assets/images/offers/3.jpg';
import img4 from '../../assets/images/offers/4.jpg';
import img5 from '../../assets/images/offers/5.jpg';
import img6 from '../../assets/images/offers/6.jpg';
import { useNavigate } from 'react-router-dom';

const BestOffers = () => {
  const navigate = useNavigate();
  
  const sliderRef = React.useRef(null);
  
  const offers = [
    {
      id: 1,
      image: img1,
      price: 37,
      oldPrice: 76,
      title: 'Best skin care!',
      promotional: false
    },
    {
      id: 2,
      image: img2,
      title: 'Best skin summer care care!',
      promotional: true
    },
    {
      id: 3,
      image: img3,
      price: 37,
      oldPrice: 76,
      title: 'Best skin care!',
      promotional: false
    },
    {
      id: 4,
      image: img4,
      title: 'Best skin summer care care!',
      promotional: true
    },
    {
      id: 5,
      image: img5,
      price: 37,
      oldPrice: 76,
      title: 'Best skin care!',
      promotional: false
    },
    {
      id: 6,
      image: img6,
      title: 'Best skin summer care care!',
      promotional: true
    }
  ];
  
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  
  const next = () => {
    sliderRef.current.slickNext();
  };
  
  const previous = () => {
    sliderRef.current.slickPrev();
  };
  
  const handleViewMore = () => {
    navigate('/products');
  };

  return (
    <Container className="my-5">
      <div className={style.headerContainer}>
        <h2 className={style.title}>Best offers</h2>
        <div className={style.navigationButtons}>
          <button className={style.navButton} onClick={previous}>
            <ChevronLeft size={20} />
          </button>
          <button className={style.navButton} onClick={next}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className={style.sliderContainer}>
        <Slider ref={sliderRef} {...settings}>
          {offers.map((offer) => (
            <div key={offer.id} className={style.slideWrapper}>
              <div className={`${style.offerCard} ${offer.promotional ? style.promotional : ''}`}>
                {!offer.promotional ? (
                  <div className={style.priceTag}>
                    <div className={style.oldPrice}>Before ${offer.oldPrice}</div>
                    <div className={style.newPrice}>${offer.price}</div>
                  </div>
                ) : (
                  <div className={style.promotionalTag}>PROMOTIONAL</div>
                )}
                <img src={offer.image} alt={offer.title} className={style.offerImage} />
                <h3 className={style.offerTitle}>{offer.title}</h3>
                <button 
                  className={style.viewMoreBtn} 
                  onClick={handleViewMore}
                >
                  View more
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </Container>
  );
};

export default BestOffers;