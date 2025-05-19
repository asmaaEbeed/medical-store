import React, { useEffect, useState } from "react";
import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import {
  Formik,
  Form as FormikForm,
  useFormikContext,
  useFormik,
} from "formik";

import * as yup from "yup";
import meeza from "../../../assets/images/meeza.jpg";
import visa from "../../../assets/images/visa.jpg";
import style from "../CheckOut.module.css";
const PaymentModal = ({ modal, toggle, handlePayment }) => {
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      cardNumber: "",
      expirationMonth: "",
      expirationYear: "",
      // terms: false,
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Please enter full name."),
      cardNumber: yup
        .string()
        .matches(/^\d{9,}/, "Card Number must contain digits only.")
        .required("Card number is required"),
      expirationMonth: yup.string().required("Please select month."),
      expirationYear: yup.string().required("Please select year."),
      // terms: yup.bool().oneOf([true], "You must accept the terms."),
    }),
    onSubmit: (values) => {
      handlePayment(values);
      validation.resetForm();
      toggle();
    },
  });

  return (
    <Modal show={modal} onHide={toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Accept Major of payment method</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <Modal.Body>
          <div className="text-center mb-5 border-bottom">
            Amazon accepts all major credit and debit cards:
            <div>
              <img src={visa} alt="visa" className={`${style.paymentImg} m-3`} />
              <img src={meeza} alt="meeza" className={`${style.paymentImg} m-3`} />
            </div>
          </div>
          <Row className="mb-3">
            <Form.Label as={Col} md="4">
              Name on card
            </Form.Label>
            <Form.Group as={Col} md="8" className="mb-2">
              <Form.Control
                type="text"
                name="fullName"
                value={validation.values.fullName}
                onChange={validation.handleChange}
                isValid={validation.touched.fullName}
                isInvalid={!!validation.errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {validation.errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label as={Col} md="4">
              Card Number
            </Form.Label>
            <Form.Group as={Col} md="8" className="mb-2">
              <Form.Control
                type="text"
                name="cardNumber"
                value={validation.values.cardNumber}
                onChange={validation.handleChange}
                isValid={
                  validation.touched.cardNumber && !validation.errors.cardNumber
                }
                isInvalid={!!validation.errors.cardNumber}
              />
              <Form.Control.Feedback type="invalid">
                {validation.errors.cardNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Label as={Col} md="4">
              Expiration Month
            </Form.Label>
            <Form.Group as={Col} md="4">
              <Form.Control
                name="expirationMonth"
                as="select"
                value={validation.values.expirationMonth}
                onChange={validation.handleChange}
                isValid={
                  validation.touched.expirationMonth &&
                  !validation.errors.expirationMonth
                }
                isInvalid={
                  validation.touched.expirationMonth &&
                  !!validation.errors.expirationMonth
                }
              >
                <option disabled value={""}>
                  Select Month
                </option>
                {[
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Form.Control>

              <Form.Control.Feedback type="invalid">
                {validation.errors.expirationMonth}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="expirationYear">
              <Form.Control
                as="select"
                value={validation.values.expirationYear}
                onChange={validation.handleChange}
                isValid={
                  validation.touched.expirationYear &&
                  !validation.errors.expirationYear
                }
                isInvalid={
                  validation.touched.expirationYear &&
                  !!validation.errors.expirationYear
                }
              >
                <option value="">Select Year</option>
                {Array.from(
                  { length: 10 },
                  (_, i) => new Date().getFullYear() + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validation.errors.expirationYear}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" className="bg-cyan-500 border-0">Submit</Button>
          <Button variant="secondary" onClick={toggle} className="bg-warning-350 border-0">
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PaymentModal;