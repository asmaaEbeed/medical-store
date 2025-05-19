import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { cartAPI } from "../services/api";
import { toast } from "react-toastify";

const CartContext = createContext();
export const CartProvider = (props) => {
  const { userToken } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [cartList, setCartList] = useState([]);

  const [cartCount, setCartCount] = useState(0);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const getCartItems = async () => {
    try {
      const res = await cartAPI.getCart();
      if (res.status === 200) {
        setIsLoading(false);
        const cartItems = res.data.cart.products.map((item) => {
          return {
            _id: item.productId._id,
            name: item.productId.name,
            category: "",
            price: item.productId.price,
            discount: 0,
            image: item.productId.mainImage.path,
            description: "",
            quantity: item.quantity,
            subTotal: item.productId.price * item.quantity,
            priceAfterDiscount: item.productId.priceAfterDiscount,

          };
        });
        setCartList(cartItems);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      getCartItems();
    }
  }, [userToken]);

  const addToCart = async (product) => {
    if (!userToken) return;
    const cartCpy = [...cartList];
    const productIndex = cartCpy.findIndex((item) => item._id === product._id);
    // Check If item already exist in cart
    if (productIndex !== -1) {
      // Increase quantity and send request to server with new quantity
      const res = await cartAPI.addEditToCart({
        productId: product._id,
        quantity: ++cartCpy[productIndex].quantity,
      });
      if (res.status === 200) {
        toast.dismiss();
        toast.success(res.data.message);
        cartCpy[productIndex].subTotal += product.priceAfterDiscount;
        setCartList(cartCpy);
      }
    } else {
      try {
        const res = await cartAPI.addEditToCart({
          productId: product._id,
          quantity: 1,
        });
        if (res.status === 200) {
          toast.dismiss();
          toast.success(res.data.message);
          cartCpy.push({
            ...product,
            quantity: 1,
            subTotal: product.priceAfterDiscount,
            image: product.mainImage.path,
          });
          setCartList(cartCpy);
        }
      } catch (err) {
        console.log(err.response.data.error);
        toast.dismiss();
        toast.error(err.response.data.error);
      }
    }
  };

  const removeFromCart = async (ids) => {
    try {
      const res = await cartAPI.removeItemsFromCart({ productIds: ids });
      if (res.status === 200) {
        toast.success(res.data.message);
        const cartItems = res.data.cart.products.map((item) => {
          return {
            _id: item.productId._id,
            name: item.productId.name,
            category: "",
            price: item.productId.price,
            discount: 0,
            image: item.productId.mainImage.path,
            description: "",
            quantity: item.quantity,
            subTotal: item.productId.price * item.quantity,
            
          };
        });
        setCartList(cartItems);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const updateItemQuantity = async (id, change) => {
    const cartCpy = [...cartList];
    const productIndex = cartCpy.findIndex((item) => item._id === id);
    try {
      const res = await cartAPI.addEditToCart({
        productId: id,
        quantity: cartCpy[productIndex].quantity + change,
      });
    } catch (err) {
      console.log(err);
    }
    setCartList((items) =>
      items.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
              subTotal: item.price * (item.quantity + change),
            }
          : item
      )
    );
  };

  const emptyCart = async () => {
    try {
      const res = await cartAPI.clearCart();
      if (res.status === 200) {
        toast.dismiss();
        toast.success(res.data.message);
        setCartList([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Calculate cart items count and sub total
  useEffect(() => {
    setCartCount(cartList.reduce((acc, item) => acc + item.quantity, 0));
    setCartSubTotal(cartList.reduce((acc, item) => acc + item.subTotal, 0));
  }, [cartList]);

  // handle discount
  const handleDiscount = (discountMount) => {
    setDiscount(discountMount);

  };

  return (
    <CartContext.Provider
      value={{
        cartList,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        cartCount,
        cartSubTotal,
        emptyCart,
        getCartItems,
        isLoading,
        handleDiscount,
        discount
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContext;
