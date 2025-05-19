
import { createContext, useState } from "react";
import { copounsAPI } from "../services/api/index";


const CouponContext = createContext();

export const CouponProvider = (props) => {
    const [qrCode, setQrCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const getQrCode = async () => {
        try {
            // const { data } = await orderApi.post("/order", {
            //  cartList,
            // });
            setIsLoading(true);
            const response = await copounsAPI.getQrCode();
            setIsLoading(false);
            console.log(response);
             setQrCode(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <CouponContext.Provider
            value={{
                getQrCode,
                qrCode,
                isLoading
            }}
        >
            {props.children}
        </CouponContext.Provider>
    );
};

export default CouponContext;