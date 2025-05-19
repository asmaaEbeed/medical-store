import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CartDropDownMenu = ({ classes, cartList, removeFromCart, getCartItems }) => {
  return (
    <>
      <ul
        className={`dropdown-menu  dropdown-menu-right shadow border-light shadow-sm  d-none ${classes.dropMenuCart}`}
      >
        {!cartList.length && (
          <li className={`px-2 py-1 fst-italic text-center text-muted`}>
            Your cart is empty
          </li>
        )}
        {cartList.length > 0 &&
          cartList.map((item, index) => (
            <li
              className={`px-3 py-1 d-flex justify-content-between  align-items-center ${cartList.length - 1 !== index && "border-bottom"}`}
              key={item._id}
            >
                
              <img
                src={item.image}
                className={`${classes.cartDropDownImage} flex-shrink-0`}
              />
              <div className="flex-grow-1">
                <h6>{item.name}</h6>
                <h6>
                  {item.discount !== 0 && (
                    <span className=" text-muted fw-bold mb-0">
                      {item.price - item.discount}$
                    </span>
                  )}
                  <small
                    className={` ${item.discount && `text-decoration-line-through text-secondary`} ms-2`}
                  >
                    {item.price}$
                  </small>
                  <small className=" text-muted ms-2">
                    {item.quantity && `(x ${item.quantity})`}
                  </small>
                </h6>
              </div>
              <div
                className="text-danger text-end fw-bold"
                onClick={() => {
                  removeFromCart([item._id]);
                }}
              >
                <i className="bx bx-x"></i>
              </div>
            </li>
          ))}
        <li className="px-3 my-2">
          <Link
            className={`btn bg-warning-400 transition-btn d-block transition-btn-orange-outline border-white rounded-3 text-lowercase ${classes.readMore}`}
            to={"/cart"} onClick={getCartItems}
          >
            <span>Cart & Checkout </span>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default CartDropDownMenu;
