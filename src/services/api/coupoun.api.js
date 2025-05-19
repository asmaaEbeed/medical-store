import { privateAxios } from '../config/axios.config';

export const copounsAPI = {
    // Public routes
    getQrCode: async () => await privateAxios.get('/coupon/67fcf3fb9e69dea5c309b99a'),
    
}