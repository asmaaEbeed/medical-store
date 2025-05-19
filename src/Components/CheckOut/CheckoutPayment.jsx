import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import PaymentModal from "./checkOutComponents/PaymentModal";

const CheckoutPayment = ({ selectedPayment, handleSelectedPayment, handleVisaData, errorAlert }) => {
  const [visaData, setVisaData] = useState({
    visaNumber: "",
    cvvData: "",
    month: "",
    year: "",
    fullName: "",
    visaSecureNumber: "",
  });
  const [modal, setModal] = useState(false);
  const togglePayment = () => setModal(!modal);
  //   {
  //     "fullName": "sdsd",
  //     "cardNumber": "4545454545",
  //     "expirationMonth": "11",
  //     "expirationYear": "2025",
  //     "cardNumberSecure": "45*****545"
  // }
  const secureNumber = (num) => {
    const numStr = num.toString();
    const firstTwo = numStr.slice(0, 2);
    const lastThree = numStr.slice(-3);
    const middle = "*".repeat(numStr.length - 5);
    return firstTwo + middle + lastThree;
  };
  const handleVisaPayment = (data) => {
    const secure = secureNumber(data.cardNumber);
    setVisaData({
      cvvData: "",
      visaNumber: data.cardNumber,
      month: data.expirationMonth,
      year: data.expirationYear,
      fullName: data.fullName,
      visaSecureNumber: secure,
    });
  };

  useEffect(() => {
    handleVisaData(visaData)
  }, [visaData])
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="fw-bold mx-2">Select Payment Method:</div>
      </CardHeader>
      <CardBody>
        <div className="my-3">
          <Form.Check
            label={"Cash on Delivery"}
            name="payment"
            type={"radio"}
            checked={selectedPayment === "cash-on-delivery"}
            // defaultChecked={(index === (addressList.length - 1)) ? true : false}
            value={selectedPayment}
            onChange={() => {
              handleSelectedPayment("cash-on-delivery");
            }}
          />
          <Form.Check
            label={"visa"}
            className="pt-3"
            name="payment"
            type={"radio"}
            checked={selectedPayment === "visa"}
            // defaultChecked={(index === (addressList.length - 1)) ? true : false}
            value={selectedPayment}
            onChange={() => {
              handleSelectedPayment("visa");
            }}
          />
          {/* <Button
            type="button"
            className="text-primary-1000 bg-transparent border-0 text-primary-1000 text-decoration-underline"
            onClick={togglePayment}
          >
            <i className="bx bx-plus"></i>
            <span>Add New payment</span>
          </Button> */}
        </div>
        {visaData.visaNumber !== "" && (
          <Row>
            <Form.Group as={Col} sm="8" className="my-2">
              <Form.Control
                type="text"
                name="fullName"
                value={visaData.visaSecureNumber}
                readOnly
              />
            </Form.Group>
            <Form.Group as={Col} sm="4" className="my-2">
              <Form.Control
                type="text"
                name="fullName"
                placeholder="CVV"
                value={visaData.cvvData || ""}
                onChange={(e) => {
                  const cvv = e.target.value;
                  if (/^\d{1,3}$/.test(cvv)) {
                    setVisaData({ ...visaData, cvvData: cvv });
                  } else {
                    setVisaData({
                      ...visaData,
                      cvvData: cvv.replace(/[^0-9]/g, ""),
                    });
                  }
                }}
                maxLength={3}
                pattern="[0-9]*"
                className={`${
                  errorAlert && visaData.cvvData === "" ? "is-invalid" : ""
                }`}
              />
            </Form.Group>
          </Row>
        )}
        {/* <Button
          type="button"
          className="text-primary-1000 bg-transparent border-0 text-primary-1000 text-decoration-underline pt-4"
          onClick={togglePayment}
        >
          <i className="bx bx-plus"></i>
          <span>Add New Address</span>
        </Button> */}
        <PaymentModal
          modal={modal}
          toggle={togglePayment}
          handlePayment={handleVisaPayment}
        />
      </CardBody>
    </Card>
  );
};

export default CheckoutPayment;