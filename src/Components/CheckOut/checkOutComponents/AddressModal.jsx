import React, { useEffect, useState } from "react";
import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import {
  Formik,
  Form as FormikForm,
  useFormikContext,
  useFormik,
} from "formik";

import * as yup from "yup";

const AddressModal = ({ modal, toggle, handleAddress }) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const data = await response.json();
        setCountries(data.data);
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };

    fetchCountries();
  }, []);


  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      country: "",
      mobile: "",
      city: "",
      street: "",
      building: "",
      // terms: false,
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Please enter full name."),
      country: yup.string().required("Please select a country."),
      mobile: yup
        .string()
        .min(11, "Mobile number must not valid")
        .matches(/01?[0125][0-9]{8}$/, "Invalid Egyptian phone number")
        .required("Mobile number is required"),
      city: yup.string().required("Please enter a city."),
      street: yup.string().required("Please enter a street name."),
      building: yup.string().required("Please enter building number."),
      // terms: yup.bool().oneOf([true], "You must accept the terms."),
    }),
    onSubmit: (values) => {
      handleAddress(values);
      validation.resetForm();
      toggle();
    },
  });


  useEffect(() => {
    if(validation.values.country === '') return
    const country = countries.filter(country => country.country === validation.values.country)
    setCities(country[0].cities)
  }, [validation.values.country])
  
  return (
    <Modal show={modal} onHide={toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Delivery Information</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <Modal.Body>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" className="mb-2">
              <Form.Label>Full Name</Form.Label>
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

            <Form.Group as={Col} md="12" className="mb-2">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={validation.values.mobile}
                onChange={validation.handleChange}
                isValid={validation.touched.mobile && !validation.errors.mobile}
                isInvalid={!!validation.errors.mobile}
              />
              <Form.Control.Feedback type="invalid">
                {validation.errors.mobile}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" className="mb-2">
              <Form.Label>Country</Form.Label>
              <Form.Select
                name="country"
                value={validation.values.country}
                onChange={validation.handleChange}
                isValid={validation.touched.country && !validation.errors.country}
                isInvalid={validation.touched.country && !!validation.errors.country}
              >
                <option value="" disabled>
                  Please select country
                </option>
                {countries.map(({ country }) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validation.errors.country}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>City</Form.Label>
              <Form.Select
                name="city"
                value={validation.values.city}
                onChange={validation.handleChange}
                isValid={validation.touched.city && !validation.errors.city}
                isInvalid={validation.touched.city && !!validation.errors.city}
                disabled={!validation.values.country}
              >
                <option>Select country</option>
                {cities.length && cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                )) }
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validation.errors.city}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={validation.values.street}
                onChange={validation.handleChange}
                isInvalid={!!validation.errors.street}
              />
              <Form.Control.Feedback type="invalid">
                {validation.errors.street}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Building</Form.Label>
              <Form.Control
                type="text"
                name="building"
                value={validation.values.building}
                onChange={validation.handleChange}
                isInvalid={!!validation.errors.building}
              />
              <Form.Control.Feedback type="invalid">
                {validation.errors.building}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          {/* <Form.Group className="mb-3">
            <Form.Check
              name="terms"
              label="Agree to terms and conditions"
              onChange={validation.handleChange}
              isInvalid={!!validation.errors.terms}
              feedback={validation.errors.terms}
              feedbackType="invalid"
            />
          </Form.Group> */}
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" className="bg-cyan-500">Submit</Button>
          <Button variant="secondary" onClick={toggle} className="bg-warning-350">
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};



export default AddressModal;