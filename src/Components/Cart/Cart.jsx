import { useState, useContext, useEffect } from "react";
import style from "./Cart.module.css";
import TableRow from "./cartComponents/TableRow";
import CartTotal from "./cartComponents/CartTotal";
import { Container, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// Import Context
import CartContext from "../../shop/CartContext";
import CouponContext from "../../shop/CouponContext";
import OrdersContext from "../../shop/OrderContext";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const [selectedList, setSelectedList] = useState([]);


  const { cartList, removeFromCart, updateItemQuantity, cartSubTotal, emptyCart, isLoading, handleDiscount, discount } =
    useContext(CartContext);
  const { handleCouponCode } = useContext(OrdersContext);

  const { qrCode, getQrCode } = useContext(CouponContext);

  useEffect(() => {
    getQrCode();
  }, []);

  const updateQuantity = (id, change) => {
    updateItemQuantity(id, change);
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const handleSelectedList = (checked, id) => {
    const prevList = [...selectedList];
    if (checked) {
      prevList.push(id);
      setSelectedList(prevList);
    } else {
      const newList = prevList.filter((item) => item !== id);
      setSelectedList(newList);
    }
  };
  const handleRemoveFromCart = () => {
    if (selectedList.length > 0)
      removeFromCart(selectedList);
    else
      emptyCart();
  };
  const handleApplyCoupon = (e) => {
    e.stopPropagation();
    if (couponCode === qrCode.coupon.code) {
      toast.dismiss();
      toast.success("Coupon Applied Successfully");
      handleDiscount(qrCode.coupon.amount);
      handleCouponCode(qrCode.coupon.code);
    } else {
      toast.dismiss();
      toast.error("Invalid Coupon Code");
      handleDiscount(0);
    }
  };

  return (
    <div className={style.cartContainer + " py-5"}>
      {cartList.length ? (
        <div className={style.cartTable}>
          <div className={style.tableHeader}>
            <div className="mx-3 d-flex align-items-center ">Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
            <div>Remove</div>
          </div>

          {cartList.map((item) => (
            <TableRow
              handleSelectedList={handleSelectedList}
              item={item}
              key={item._id}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
          <div className="d-flex flex-row-reverse px-5 py-3">
            <button className={`mx-5 btn  transition-btn transition-btn-orange-outline mb-0 text-danger`} onClick={handleRemoveFromCart}>
              {selectedList.length > 0 ? <span className="text-danger">Remove selected</span> : <span className="text-danger">Clear cart</span>}
            </button>
          </div>
          <hr className="m-0" />

          <div className={style.couponSection}>
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            {couponCode ? <button className={style.applyBtn + " transition-btn"} onClick={(e) => { handleApplyCoupon(e) }}>
              <span>Apply coupon</span>
            </button> :
              <button className={"bg-warning-50 px-3 py-2 border-0 rounded-3 cursor-not-allowed"} disabled={!couponCode}>
                <span>Apply coupon</span>
              </button>}
          </div>

          <CartTotal cartSubTotal={cartSubTotal} discount={discount} />
        </div>
      ) : (
        <Container className='bg-light text-center p-5'>
          <div className='bg-white w-50 rounded-4 p-4 mx-auto my-5 shadow-sm'>
            {isLoading ? <div><Spinner animation="grow" variant="warning" /> <h5 className={`${style.loadingTitle} text-warning`}>Loading...</h5></div> : <h5 className={`${style.loadingTitle} text-warning`}>Your Cart is empty...</h5>}
            <p className={style.loadingText}>You can select your prefer products from our <Link to="/products" className="d-block">online store</Link></p>
          </div>
        </Container>
      )}
    </div>
  );
};
export default Cart;
