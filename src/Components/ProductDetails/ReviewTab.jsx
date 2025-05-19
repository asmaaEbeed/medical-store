import React, { useEffect, useContext, useState, useRef } from 'react'
import { Form, Row, Image, Col, Button } from 'react-bootstrap'
import UserContext from '../../shop/UserContext';
import ReviewContext from '../../shop/ReviewContext';
import { toast } from 'react-toastify';
import CustomerReviews from './CustomerReviews';

const ReviewTab = ({ product }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const { userToken } = useContext(UserContext);
    const { createReview, fetchProductReviews, isLoading, reviewList } = useContext(ReviewContext);


    useEffect(() => {
        console.log(product);
        fetchProductReviews(product._id);
    }, [product])

    // Handle star rating selection
    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating);
    }

    // Handle mouse hover on stars
    const handleMouseEnter = (hoveredRating) => {
        setHoverRating(hoveredRating);
    }

    // Handle mouse leave from stars
    const handleMouseLeave = () => {
        setHoverRating(0);
    }

    // Generate star rating display
    const renderStars = () => {
        const stars = [];
        const currentRating = hoverRating || rating;

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    onClick={() => handleRatingClick(i)}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        cursor: 'pointer',
                        color: i <= currentRating ? '#ffc107' : 'gray',
                        fontSize: '24px',
                        marginRight: '2px'
                    }}
                >
                    {i <= currentRating ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    }

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.dismiss();
            toast.warning('Please select a rating');
            return;
        }
        const reviewData = {
            rate: rating,
            comment: document.getElementById('review-comment').value,
        }
        createReview(product._id, reviewData);
        // setRating(0);
        // document.getElementById('review-comment').value = '';
    }

    return (
        <>
            {/* <h2 className='my-5'>1 review for {product.name}</h2> */}

            <h3 className='my-4 py-3'>Add a review</h3>
            {userToken ? <Form onSubmit={(e) => handleReviewSubmit(e)}>
                <Form.Group className="mb-3">
                    <Form.Label>Your Rating <span className='text-danger'>*</span> {rating > 0 && <span>({rating} star{rating !== 1 ? 's' : ''})</span>}</Form.Label>
                    <div className="d-flex">
                        <div className="me-2">
                            {renderStars()}
                        </div>
                    </div>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Your Review *"
                        required
                        id="review-comment"
                    />
                </Form.Group>
                <Row>
                    {/* <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Your Name *"
                                required
                            />
                        </Form.Group>
                    </Col> */}
                    {/* <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Your Email *"
                                required
                            />
                        </Form.Group>
                    </Col> */}
                </Row>
                <Form.Group className="mb-3">
                    {/* <Form.Check
                        type="checkbox"
                        label="Save my name, email, and website in this browser for the next time I comment."
                    /> */}
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button type="submit" disabled={isLoading} className='bg-warning-400 transition-btn transition-btn-orange-outline border-white rounded-3 border-1' ><span>Submit</span></Button>
                </div>
            </Form> : <p>Please login to add a review</p>}
            <hr />

            <CustomerReviews reviewList={reviewList} />
        </>
    )
}
export default ReviewTab
