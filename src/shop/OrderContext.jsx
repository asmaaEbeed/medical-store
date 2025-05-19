import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { orderAPI } from "../services/api";
import { toast } from "react-toastify";
import CartContext from "./CartContext";
import { useNavigate } from 'react-router-dom';

const OrdersContext = createContext();

export const OrderProvider = (props) => {
  const navigate = useNavigate();
  const { cartList, getCartItems } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState("");

  const handleOrder = async (orderData) => {
    try {
      console.log(orderData);
      // Prepare cart items for the order
      const cartItems = prepareCartItems();
      console.log("after prepare", cartItems);
      orderData.products = cartItems;
      // check if had coupon code or not
      if (couponCode) {
        orderData.couponCode = couponCode;
      }

      // Send the order to the API
      const response = await orderAPI.addOrder(orderData);
      console.log(response);
      console.log(response.data?.order?.paymentMethod);

      // Handle different payment methods
      if (response?.data?.order?.paymentMethod === 'cash') {
        // For cash payments (pay on delivery)
        setTimeout(() => {
          navigate('/cart');
        }, 2000);
        toast.success("Order placed successfully! Pay on delivery.");
        getCartItems();

      } else if (response?.data?.order?.paymentMethod === 'card') {
        // For card payments (redirect to Stripe)
        toast.success("Redirecting you to payment gateway...");


        // Redirect to the payment URL
        window.location.href = response.data.url;

        // Note: The following line won't execute due to the redirect
        getCartItems();
      }
    } catch (err) {
      console.error("Error placing order:", err.response.data.error);
      if (err.response.data.error) {
        toast.error(err.response.data.error);
      } else { toast.error("Failed to place order. Please try again."); }
    }
  };

  const prepareCartItems = () => {
    console.log(cartList);
    const cartItems = cartList.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      name: item.name,
      productPrice: item.price,
      // finalPrice: item.price - item.discount,
      finalPrice: Number(parseFloat(item.priceAfterDiscount).toFixed(2)),
    }));
    return cartItems;
  };
  const handleCouponCode = (code) => {
    setCouponCode(code);
  };

  return (
    <OrdersContext.Provider
      value={{
        handleOrder,
        handleCouponCode
      }}
    >
      {props.children}
    </OrdersContext.Provider>
  );
};

export default OrdersContext;