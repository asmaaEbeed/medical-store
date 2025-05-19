import { publicAxios, privateAxios } from '../config/axios.config';

export const orderAPI = {
    addOrder: (data) => privateAxios.post('/order', data),
    cancelOrder: (data) => {console.log(data.body); return privateAxios.patch(`/order/${data.id}`, data.body)}
};

