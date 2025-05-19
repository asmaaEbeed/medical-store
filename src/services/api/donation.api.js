import { publicAxios, privateAxios } from '../config/axios.config';

export const donationAPI = {
    getAllDonation: () => publicAxios.get('/donate'),
    getDonById: (id) => publicAxios.get(`/donate/${id}`),
    donationPayment: (data) => privateAxios.post('/donate/donate-payment', data),
};