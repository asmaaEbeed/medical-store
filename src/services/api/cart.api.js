import { publicAxios, privateAxios } from '../config/axios.config';

export const cartAPI = {
    getCart: () => privateAxios.get('/cart'),
    addEditToCart: (data) => privateAxios.post('/cart', data),
    removeItemsFromCart: (data) =>  privateAxios.delete('/cart', {data: data}),
    clearCart: () => privateAxios.delete('/cart/clear'),
};