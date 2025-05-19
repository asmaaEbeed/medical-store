import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
// import { format } from 'date-fns';
import './CustomerReviews.css';

const CustomerReviews = ({ reviewList }) => {
    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= rating ? 'filled' : 'empty'}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    // Function to format date
    //   const formatDate = (dateString) => {
    //     try {
    //       return format(new Date(dateString), 'MMM dd, yyyy');
    //     } catch (error) {
    //       return dateString;
    //     }
    //   };

    // Function to get the first letter of email for avatar
    const getInitial = (email) => {
        return email ? email.charAt(0).toUpperCase() : '';
    };

    if (!reviewList || reviewList.length === 0) {
        return (
            <div className="reviews-container">
                <h3 className="reviews-title">Customer Reviews</h3>
                <div className="no-reviews">
                    <p>No reviews yet. Be the first to review this product!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-container">
            <h3 className="reviews-title">Customer Reviews</h3>
            <div className="reviews-summary">
                <Badge bg="primary" className="reviews-count">
                    {reviewList.length} {reviewList.length === 1 ? 'Review' : 'Reviews'}
                </Badge>
                <div className="average-rating">
                    {renderStars(
                        Math.round(
                            reviewList.reduce((acc, review) => acc + review.rate, 0) / reviewList.length
                        )
                    )}
                </div>
            </div>

            <div className="reviews-list">
                {reviewList.map((review) => (
                    <Card key={review._id} className="review-card">
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={3} className="review-user-info">
                                    {/* <div className="user-avatar">
                                        {review.createdBy.email && getInitial(review.createdBy.email)}
                                    </div> */}
                                    <div className="user-details">
                                        <div className="user-avatar"><img className='avatar img-fluid' src='https://cdn-icons-png.flaticon.com/512/149/149071.png' alt="avatar" /></div>
                                        <div className="review-date">{new Date(review.createdAt)
                                            .toISOString()
                                            .slice(0, 10)}</div>
                                    </div>
                                </Col>
                                <Col xs={12} md={9} className="review-content">
                                    <div className="review-rating">
                                        {renderStars(review.rate)}
                                        <span className="rating-text">{review.rate}/5</span>
                                    </div>
                                    <div className="review-comment">
                                        {review.comment}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CustomerReviews;
