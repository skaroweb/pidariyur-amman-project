import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleValue } from "../../store/memberSlice";
import Toaster from "../util/Toaster";
import { toast } from "react-toastify";
import styles from "./styles.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";

const FormComponent = () => {
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    aadhaar: "",
    address: "",
    district: "",
    dob: "", // Set the date fields to empty initially
    email: "",
    joiningDate: "", // Set the date fields to empty initially
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your Express backend with the form data
      await axios.post(`${serverURL}/api/member/`, formData);
      console.log("Form data sent successfully!");
      dispatch(toggleValue());
      // Reset the form fields after successful submission
      setFormData({
        name: "",
        phoneNumber: "",
        alternatePhoneNumber: "",
        aadhaar: "",
        address: "",
        district: "",
        dob: "", // Reset the date fields to empty
        email: "",
        joiningDate: "", // Reset the date fields to empty
      });
      toast.success("Member added successfully");
    } catch (error) {
      //setError(error.response.data.message);
      toast.warn(error.response.data.message);
    }
  };
  return (
    <>
      <h2>Member Form:</h2>
      <Form className={styles.form} onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Name:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="text"
              controlid="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Col>
          <Col sm={1}>
            <span className={styles.error}>* </span>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Phone Number:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="tel"
              controlid="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Col>
          <Col sm={1}>
            <span className={styles.error}>* </span>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Alternate Phone Number:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="tel"
              controlid="alternatePhoneNumber"
              name="alternatePhoneNumber"
              value={formData.alternatePhoneNumber}
              onChange={handleChange}
            />
          </Col>
          <Col sm={1}></Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Aadhaar:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="text"
              controlid="aadhaar"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
            />
          </Col>
          <Col sm={1}></Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Address:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              as="textarea"
              controlid="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Col>
          <Col sm={1}>
            <span className={styles.error}>* </span>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            District:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="text"
              controlid="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />
          </Col>
          <Col sm={1}>
            <span className={styles.error}>* </span>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Date of Birth:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="date"
              controlid="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              defaultValue={""} // Set the defaultValue to empty
            />
          </Col>
          <Col sm={1}></Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Email:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="email"
              controlid="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Col>
          <Col sm={1}></Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={4}>
            Joined Date:
          </Form.Label>
          <Col sm={7}>
            <Form.Control
              type="date"
              controlid="joiningDate"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              defaultValue={""} // Set the defaultValue to empty
            />
          </Col>
          <Col sm={1}></Col>
        </Form.Group>
        <div className={styles.error}>* Required field </div>
        <Button
          className={`${styles.member_submit}  mt-4`}
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
      </Form>

      <Toaster />
    </>
  );
};

export default FormComponent;
