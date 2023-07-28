import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
import { toggleValue } from "../../store/donationSlice";
import { useDispatch } from "react-redux";

const UpdateDonationModal = ({ show, handleClose, donationData }) => {
  const dispatch = useDispatch();
  const serverURL = process.env.REACT_APP_SERVER_URL;

  // Initialize the state with the donationData prop
  const [updateData, setUpdateData] = useState({
    donationType: donationData.donationType,
    amount: donationData.amount,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the updated data to the server-side API
      await axios.put(
        `${serverURL}/api/donate/${donationData._id}`,
        updateData
      );

      // Dispatch the toggleValue action to trigger a re-fetch of donation data
      dispatch(toggleValue());

      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating donation:", error);
    }
  };

  // Reset the state when the donationData prop changes
  useEffect(() => {
    setUpdateData({
      donationType: donationData.donationType,
      amount: donationData.amount,
    });
  }, [donationData]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Donation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formDonationType">
            <Form.Label>Donation Type</Form.Label>
            <Form.Control
              as="select"
              name="donationType"
              value={updateData.donationType}
              onChange={handleInputChange}
            >
              <option value="">Select Donation Type</option>
              <option value="Anna Dhanam">Anna Dhanam</option>
              <option value="Nithya Kattalai">Nithya Kattalai</option>
              <option value="Special Donation">Special Donation</option>
              <option value="Mangalya Donation<">Mangalya Donation</option>
              {/* Add more options if needed */}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              name="amount"
              value={updateData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default UpdateDonationModal;
