
import { createContext, useState } from "react";
import { reviewsAPI } from "../services/api/index";
import { toast } from "react-toastify";

const ReviewContext = createContext();

export const ReviewProvider = (props) => {
    const [reviewList, setReviewList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fetchProductReviews = async (id) => {
        try {
            // const { data } = await orderApi.post("/order", {
            //  cartList,
            // });
            setIsLoading(true);
            const response = await reviewsAPI.getProductReviews(id);
            setIsLoading(false);
            console.log(response.data.reviews);
            setReviewList(response.data.reviews);
        } catch (err) {
            console.log(err.response.data.error);
        }
    };

    const createReview = async (id, data) => {
        try {
            setIsLoading(true);
            const response = await reviewsAPI.createProductRreview(id, data);
            toast.success("Review created successfully");
            setIsLoading(false);
            fetchProductReviews(id);
            console.log(response.data);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            if (err.response.data.error || err.status === 500) {
                toast.dismiss();
                toast.error(err.response.data.error);
            } else
                console.log(err.response.data.error);
        }
    };

    return (
        <ReviewContext.Provider
            value={{
                fetchProductReviews,
                createReview,
                isLoading,
                reviewList,
            }}
        >
            {props.children}
        </ReviewContext.Provider>
    );
};

export default ReviewContext;