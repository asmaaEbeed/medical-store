import React, { useContext, useEffect, useState } from "react";
import { Col, Modal, Row, Button } from "react-bootstrap";
import TableRow from "../../Cart/cartComponents/TableRow";
// import context
import CartContext from "../../../shop/CartContext";
import OrdersContext from "../../../shop/OrderContext";
import styled from '../CheckOut.module.css';

const BuyConfirmationModal = ({
  modal,
  toggle,
  buyingData,
  resetData,
  selectedAddress,
  selectedPayment,
  addressList,
}) => {
  const { cartList, cartSubTotal, discount } =
    useContext(CartContext);
  const { handleOrder } = useContext(OrdersContext);
  const [deliveryDate, setDeliveryDate] = useState("");
  // const [confirmedCode, setConfirmedCode] = useState("");


  // To set Delivery date after 3 days
  let threeDaysLater;
  let today;
  useEffect(() => {
    if (modal) {
      today = new Date();
      threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      const formattedDate = `${threeDaysLater.getDate().toString().padStart(2, "0")}-${(threeDaysLater.getMonth() + 1).toString().padStart(2, "0")}-${threeDaysLater.getFullYear()}`;
      setDeliveryDate(formattedDate);

      // const randomCode = Math.floor(10000000 + Math.random() * 90000000)
      //   .toString()
      //   .padStart(8, "0");
      // setConfirmedCode(randomCode);
    }
  }, [modal]);

  const confrimOrder = () => {
    const addressData = addressList.find(
      (address) => address.id === selectedAddress
    );
    const data = {
      address: `${addressData.street},  ${addressData.city}, ${addressData.country}`,
      phone: `${addressData.mobile}`,
      paymentMethod: selectedPayment === "cash-on-delivery" ? "cash" : "card",
    }
    // Send to context
    handleOrder(data);
  };

  return (
    <Modal show={modal} onHide={toggle} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">
          Order confirmation
          {/* <span className="text-success">{confirmedCode}</span> */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={`${styled.buyConfirmBody}`}>
          {cartList.map((item) => (
            <TableRow item={item} key={item._id} noAction={true} />
          ))}
        </div>
        {discount > 0 && (
          <Row className="align-items-center justify-content-center text-center p-1 border-bottom bg-warning-100 ">
            <Col sm={6}>
              <p className="m-0">Coupon Discount</p>
            </Col>

            <Col sm={6}>
              <p className="m-0">- {discount * cartSubTotal / 100}</p>
            </Col>
          </Row>
        )}
        <Row className="align-items-center justify-content-center text-center p-1 border-bottom bg-success-50 ">

          <Col sm={6} className="border-end">
            <p className="fw-bold m-0">Total</p>
          </Col>
          <Col>
            <p className="m-0">{cartSubTotal - (discount * cartSubTotal / 100)}</p>
          </Col>
        </Row>
        <Row className="px-4 py-0">
          <Col sm={6} className="border-end py-2">
            <h6 className="mb-3">Your order will delivered to</h6>
            <p className="mb-2">
              <span className="fw-bold">
                <i className="bx bx-user px-1"></i>
                {buyingData.address.fullName}
              </span>
            </p>
            <p className="mb-2">
              <span className="fw-bold">
                <i className="bx bx-phone px-1"></i>
                {buyingData.address.mobile}
              </span>
            </p>
            <p className="mb-1">
              <span className="fw-bold">
                {" "}
                <i className="bx bx-map px-1"></i>
                {buyingData.address.street}, {buyingData.address.building},{" "}
                {buyingData.address.city}, {buyingData.address.country}
              </span>
            </p>
          </Col>
          <Col sm={6} className=" py-2">
            <h6 className="mb-4">Your Order Will delivery by</h6>
            <p className="mb-1">
              <span className="fw-bold">
                <i className="bx bx-calendar px-1"></i>
                {deliveryDate}
              </span>
            </p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            confrimOrder();
            toggle();
            //resetData()
          }}
          className="bg-cyan-500 border-0"
        >
          Confirm
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            toggle();
            //resetData()
          }}
          className="bg-warning-350 border-0"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyConfirmationModal;