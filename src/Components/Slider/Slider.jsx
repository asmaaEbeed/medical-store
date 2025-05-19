import { Container, Row, Col } from "react-bootstrap";
import { gsap } from "gsap";
import { useState, useRef, useCallback, useEffect} from "react";
import style from "./Slider.module.css";

export default function Slider({slideData}) {
    const [currentSlide, setCurrentSlide] = useState(3);
    const slideRef = useRef([]);
    const intervalRef = useRef(null);

    const removeActiveClasses = useCallback(() => {
        return new Promise((resolve) => {
            if (slideRef.current) {
                slideRef.current.forEach((slide) => {
                    if (slide) {
                        gsap.killTweensOf(slide);
                        gsap.to(slide, {
                            flex: 1,
                            ease: "none",
                            duration: 0.5
                        });
                    }
                });
            }
            setTimeout(() => resolve(), 100);
        });
    }, []);

    const setActiveSlide = useCallback((index) => {
        removeActiveClasses().then(() => {
            const slide = slideRef.current[index];
            gsap.to(slide, {
                flex: 10,
                duration: 2.5,
                ease: "power4.outIn",
            });
            setCurrentSlide(index);
        });
    }, [removeActiveClasses]);

    const startAutoPlay = useCallback(() => {
        intervalRef.current = setInterval(() => {
            setCurrentSlide((slide) => (slide + 1) % slideData.length);
        }, 6000);
    }, []);

    const resetAutoPlay = useCallback(() => {
        clearInterval(intervalRef.current);
        startAutoPlay();
    }, [startAutoPlay]);

    useEffect(() => {
        setActiveSlide(currentSlide);
        startAutoPlay();

        return () => clearInterval(intervalRef.current);
    }, [currentSlide, setActiveSlide, startAutoPlay]);

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs={11} className={style.slider}>
                    {slideData.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${style.slide} ${index === currentSlide ? style.active : ''}`}
                            ref={el => slideRef.current[index] = el}
                            onClick={() => {
                                setActiveSlide(index);
                                resetAutoPlay();
                            }}
                        >
                            <h2 className="text-white">{item.title}</h2>
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                style={{objectFit: 'cover'}}
                            />
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    );
}