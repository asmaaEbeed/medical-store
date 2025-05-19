import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import slider1 from "../../assets/images/slider/01.jpg";
import slider2 from "../../assets/images/slider/02.jpg";
import slider3 from "../../assets/images/slider/03.jpg";
import "./Slider.css";
import { Link } from "react-router-dom";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Slider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const slidesRef = useRef([]);
  const captionsRef = useRef([]);
  const progressRef = useRef(null);
  const progressBarRef = useRef(null);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Set loaded state after images are loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const autoPlayTimer = setTimeout(() => {
      if (!isTransitioning) {
        handleNextSlide();
      }
    }, 8000); // 8 seconds per slide

    return () => {
      clearTimeout(autoPlayTimer);
    };
  }, [activeSlide, isTransitioning]);

  // Initialize progress bar animation
  useEffect(() => {
    if (!progressRef.current || !progressBarRef.current) return;

    const duration = 8; // Slide duration in seconds

    // Reset and animate progress bar
    gsap.killTweensOf(progressBarRef.current);
    gsap.fromTo(progressBarRef.current,
      { width: '0%' },
      {
        width: '100%',
        duration: duration,
        ease: "none"
      }
    );

    return () => {
      gsap.killTweensOf(progressBarRef.current);
    };
  }, [activeSlide]);

  // Slides data
  const slides = [
    {
      image: slider1,
      title: "0.3%",
      subtitle: t("slider.slide1.subtitle", "Urea Infusion mild"),
      description: t("slider.slide1.description", "Special formulation that is meant to nourish the skin on the hands and provide it with the protection it needs"),
      color: "#e9c46a",
      cta: t("slider.explore", "Explore"),
      tags: ["Skincare", "Protection", "Nourishment"]
    },
    {
      image: slider2,
      title: t("slider.slide2.heading", "Best Care for young skin"),
      subtitle: t("slider.slide2.subtitle", "Everything you may know"),
      description: t("slider.slide2.description", "Our specially formulated products provide gentle care for young, sensitive skin"),
      color: "#2a9d8f",
      cta: t("slider.readMore", "Read More"),
      tags: ["Young Skin", "Gentle", "Dermatologist Tested"]
    },
    {
      image: slider3,
      title: t("slider.slide3.heading", "Life's better when you're healthy"),
      subtitle: t("slider.slide3.subtitle", "The best way to get your prescription"),
      description: t("slider.slide3.description", "Health is wealth. Our products are designed to enhance your wellbeing and quality of life."),
      color: "#e76f51",
      cta: t("slider.readMore", "Read More"),
      tags: ["Health", "Wellbeing", "Quality"]
    }
  ];

  // Handle slide navigation
  const handlePrevSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const handleNextSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const handleSlideSelect = (index) => {
    if (isTransitioning || index === activeSlide) return;

    setIsTransitioning(true);
    setActiveSlide(index);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  // Animation for slide content
  useGSAP(() => {
    if (!captionsRef.current[activeSlide]) return;

    const elements = {
      subtitle: captionsRef.current[activeSlide].querySelector('.slide-subtitle'),
      title: captionsRef.current[activeSlide].querySelector('.slide-title'),
      description: captionsRef.current[activeSlide].querySelector('.slide-description'),
      cta: captionsRef.current[activeSlide].querySelector('.slide-cta'),
      tags: captionsRef.current[activeSlide].querySelectorAll('.slide-tag'),
      decorations: captionsRef.current[activeSlide].querySelectorAll('.slide-decoration')
    };

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: 0.8
      }
    });

    // Reset all elements
    tl.set([elements.subtitle, elements.title, elements.description, elements.cta, elements.tags], {
      opacity: 0,
      y: 20
    });

    tl.set(elements.decorations, {
      opacity: 0,
      scale: 0.8
    });

    // Animate elements in sequence
    tl.to(elements.subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.6
    })
      .to(elements.title, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.4")
      .to(elements.description, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, "-=0.5")
      .to(elements.cta, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, "-=0.4")
      .to(elements.tags, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.4
      }, "-=0.4")
      .to(elements.decorations, {
        opacity: 1,
        scale: 1,
        stagger: 0.15,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)"
      }, "-=0.8");

    return () => {
      tl.kill();
    };
  }, [activeSlide, isRTL]);

  return (
    <div className={`cinematic-slider ${isRTL ? 'rtl' : 'ltr'} ${isLoaded ? 'loaded' : ''}`}>
      {/* Slides container */}
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={el => slidesRef.current[index] = el}
            className={`slide ${activeSlide === index ? 'active' : ''} ${activeSlide > index ? 'prev' : activeSlide < index ? 'next' : ''}`}
            style={{
              '--slide-color': slide.color,
              zIndex: activeSlide === index ? 2 : 1
            }}
          >
            {/* Background image */}
            <div className="slide-media">
              <img
                src={slide.image}
                alt={slide.title}
                className="slide-image"
              />

              {/* Overlay gradient */}
              <div className="slide-overlay" />
            </div>

            {/* Slide content */}
            <div
              className="slide-content"
              ref={el => captionsRef.current[index] = el}
            >
              <div className="slide-decoration circle"></div>
              <div className="slide-decoration dots"></div>
              <div className="slide-decoration line"></div>

              <div className="slide-text-content">
                <h4 className="slide-subtitle">{slide.subtitle}</h4>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>

                <div className="slide-tags">
                  {slide.tags.map((tag, i) => (
                    <span key={i} className="slide-tag">
                      <Sparkles size={12} />
                      {tag}
                    </span>
                  ))}
                </div>

                <Link to='/blog'
                  className="slide-cta"
                  style={{ '--btn-color': slide.color }}
                >
                  <span>{slide.cta}</span>
                  {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      <div className="slider-controls">
        <button
          className="nav-button prev"
          onClick={handlePrevSlide}
          aria-label="Previous slide"
        >
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>

        <div className="slider-pagination">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => handleSlideSelect(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="dot-inner"></span>
            </button>
          ))}
        </div>

        <button
          className="nav-button next"
          onClick={handleNextSlide}
          aria-label="Next slide"
        >
          {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="slider-progress" ref={progressRef}>
        <div className="progress-bar" ref={progressBarRef}></div>
      </div>

      {/* Slide counter */}
      <div className="slide-counter">
        <span className="current-slide">{(activeSlide + 1).toString().padStart(2, '0')}</span>
        <span className="counter-separator">/</span>
        <span className="total-slides">{slides.length.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default Slider;
