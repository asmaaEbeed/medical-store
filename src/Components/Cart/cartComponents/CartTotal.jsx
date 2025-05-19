import React from "react";
import style from "../Cart.module.css";
import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import { useContext } from "react";
const CartTotal = ({ cartSubTotal, checkoutBtnNonVisible, proceedBuy, errorAlert, discount }) => {
  
  return (
    <div className={style.cartTotals}>
      <h3>Cart totals</h3>
      <div className={style.totalsRow}>
        <span>Subtotal</span>
        <span>${cartSubTotal.toFixed(2)}</span>
      </div>
      {discount > 0 && <div className={style.totalsRow}>
        <span>Discount</span>
        <span>% {discount}</span>
      </div>}
      <div className={style.totalsRow}>
        <span>Total</span>
        <span>${discount > 0 ? (cartSubTotal - (cartSubTotal * discount) / 100).toFixed(2) : cartSubTotal.toFixed(2)}</span>
      </div>
      {!checkoutBtnNonVisible &&<Link className={style.checkoutBtn + " transition-btn"} to={'/checkout'}>
        <span>Proceed to checkout</span>
      </Link>}
      {errorAlert && <Alert className="alert alert-danger mb-0 my-4">Please fill all data</Alert>}
      {checkoutBtnNonVisible &&<Button className={style.checkoutBtn + " transition-btn bg-primary-1000 border-0"} onClick={proceedBuy}>
        <span>Proceed to Buy</span>
      </Button>}
    </div>
  );
};

export default CartTotal;
