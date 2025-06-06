import { publicAxios, privateAxios } from '../config/axios.config';

export const productsAPI = {
    // Public routes
    getAllProducts: async () => await publicAxios.get('/product/all'),
    
    getProductById: (id) => 
        publicAxios.get(`/product/${id}`),
    
    getProductCategories: () => 
        publicAxios.get('/products/categories'),
    
    searchProducts: (query) => 
        publicAxios.get(`/product?search=${query}`),

    // Private routes (Admin)
    createProduct: (productData) => 
        privateAxios.post('/products', productData),
    
    updateProduct: (id, productData) => 
        privateAxios.put(`/products/${id}`, productData),
    
    deleteProduct: (id) => 
        privateAxios.delete(`/products/${id}`),
    
    uploadProductImage: (id, imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return privateAxios.post(`/products/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
}; 