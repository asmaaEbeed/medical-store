// Contact.jsx
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import Styles from "./Contact.module.css";
import Map from "../Map/Map";
import { Helmet } from "react-helmet";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaGlobe,
  FaSpinner,
} from "react-icons/fa";
import BreadCrumb from "../Common/BreadCrumb";

export default function Contact() {
  const breadCrumbData = [
    { name: "Home", link: "/" },
    { name: "Contact", link: "/contact" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.length < 2 ? "Name must be at least 2 characters long" : "";
      case "email":
        return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ? "Please enter a valid email address"
          : "";
      case "subject":
        return value.length < 5 ? "Subject must be at least 5 characters long" : "";
      case "message":
        return value.length < 10 ? "Message must be at least 10 characters long" : "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getFieldError = (name) => {
    if (!touched[name]) return "";
    return validateField(name, formData[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = Object.keys(formData).map((key) => validateField(key, formData[key]));
    if (errors.some((error) => error !== "")) {
      setTouched(
        Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }

    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormData({ name: "", email: "", subject: "", message: "" });
      setTouched({});
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });

      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, isSubmitted: false }));
      }, 5000);
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "Failed to send message. Please try again.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Container className={`${Styles.contactContainer} my-4 px-4`}>
        <Helmet>
          <title>Contact Us - Get in Touch</title>
          <meta
            name="description"
            content="Reach out to us for any inquiries, questions, or support. We're here to help you with your healthcare needs."
          />
        </Helmet>

        <Map />

        <Row className="mt-4">
          <Col md={6} className={Styles.contactDetails}>
            <h2 className={Styles.formHeading}>Get in Touch</h2>
            <p className={Styles.description}>
              We&apos;re here to help and answer any questions you might have. We
              look forward to hearing from you.
            </p>

            <div className={Styles.locationsWrapper}>
              <div className={Styles.contactLocation}>
                <h5 className={Styles.subHeading}>
                  <FaMapMarkerAlt /> Our Location
                </h5>
                <p className={Styles.contactInfo}>
                  <FaMapMarkerAlt /> 22nd Street, Cairo, Egypt
                </p>
                <p className={Styles.contactInfo}>
                  <FaEnvelope /> careplus.eg@example.com
                </p>
                <p className={Styles.contactInfo}>
                  <FaPhone /> +20 123 456 7890
                </p>
                <p className={Styles.contactInfo}>
                  <FaClock /> Mon - Fri: 9:00 AM - 6:00 PM
                </p>
                <p className={Styles.contactInfo}>
                  <FaGlobe /> www.careplus.com
                </p>
              </div>
            </div>
          </Col>

          <Col md={6} className={Styles.formContainer}>
            <h3 className={Styles.formHeading}>Send us a Message</h3>

            {formStatus.isSubmitted && (
              <Alert variant="success" className="mb-4">
                Thank you for your message! We will get back to you soon.
              </Alert>
            )}

            {formStatus.error && (
              <Alert variant="danger" className="mb-4">
                {formStatus.error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              {["name", "email", "subject", "message"].map((field, i) => (
                <Form.Group className="mb-4" controlId={`form${field}`} key={i}>
                  <Form.Control
                    type={field === "message" ? "textarea" : field}
                    as={field === "message" ? "textarea" : "input"}
                    name={field}
                    rows={field === "message" ? 6 : undefined}
                    placeholder={
                      field.charAt(0).toUpperCase() + field.slice(1).replace("message", "Your Message...")
                    }
                    className={`${Styles.inputField} ${
                      getFieldError(field) ? Styles.inputError : ""
                    }`}
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={formStatus.isSubmitting}
                  />
                  {getFieldError(field) && (
                    <Form.Text className={Styles.errorText}>
                      {getFieldError(field)}
                    </Form.Text>
                  )}
                </Form.Group>
              ))}

              <Button
                className={Styles.submitButton}
                type="submit"
                variant="primary"
                disabled={formStatus.isSubmitting}
              >
                {formStatus.isSubmitting ? (
                  <>
                    <FaSpinner className={Styles.spinner} /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
