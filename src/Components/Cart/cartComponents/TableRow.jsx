import React, { useEffect } from "react";
import style from "../Cart.module.css";
const TableRow = (props) => {
  const { item, updateQuantity, removeItem, noAction, handleSelectedList } = props;
  

  

  return (
    <div key={item._id} className={style.cartItem}>
      <div className={style.productInfo}>
        {!noAction && <input
          type="checkbox"
          className={style.productCheckbox}
          onChange={(e) => handleSelectedList(e.target.checked, item._id)}
        />}
        <img className={style.productImage + " mx-1"} src={item.image} />
        <div className={style.productName}>{item.name}</div>
      </div>
      <div className={style.price}>${item.price}</div>
      <div className={style.quantity}>
        {!noAction && (
          <button
            onClick={() => item.quantity > 1 && updateQuantity(item._id, -1)}
          >
            <i className="bx bx-chevron-left"></i>
          </button>
        )}
        <span>{item.quantity}</span>
        {!noAction && (
          <button onClick={() => updateQuantity(item._id, 1)}>
            <i className="bx bx-chevron-right"></i>
          </button>
        )}
      </div>
      <div className={style.subtotal}>${item.subTotal.toFixed(2)}</div>
      <div className={style.subtotal}>
        {!noAction && (
          <button
            onClick={() => removeItem([item._id])}
            className={`${style.removeBtn} text-danger fw-bold  `}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default TableRow;
