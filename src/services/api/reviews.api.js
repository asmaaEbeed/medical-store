import { publicAxios, privateAxios } from '../config/axios.config';

export const reviewsAPI = {
    // Public routes
    getProductReviews: async (productId) => await publicAxios.get(`/product/${productId}/reviews`),
    
    

    // Private routes (Admin)
    createProductRreview: (id, data) => 
        privateAxios.post(`/product/${id}/reviews`, data),

}