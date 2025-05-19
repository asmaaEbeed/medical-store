import { publicAxios, privateAxios } from '../config/axios.config';

export const blogsAPI = {
    // Public routes
    getAllBlogs: async () => await publicAxios.get('/blog')
}