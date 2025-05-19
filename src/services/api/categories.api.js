import { publicAxios, privateAxios } from '../config/axios.config';

export const categoriesAPI = {
    // Public routes
    getAllCategories: async () => await publicAxios.get('/category'),
    getCategoryProductsById: async (id) => await publicAxios.get(`/category/${id}`)
}