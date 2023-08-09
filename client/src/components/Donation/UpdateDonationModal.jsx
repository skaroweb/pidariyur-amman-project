import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
import { toggleValue } from "../../store/donationSlice";
import { useDispatch } from "react-redux";

const UpdateDonationModal = ({ show, handleClose, donationData }) => {
  const dispatch = useDispatch();
  const serverURL = process.env.REACT_APP_SERVER_URL;

  // Convert the date to the "YYYY-MM-DD" format before setting it in the state
  const initialSelectedDate = donationData.selectedDate
    ? new Date(donationData.selectedDate).toISOString().split("T")[0]
    : "";

  // Initialize the state with the donationData prop
  const [updateData, setUpdateData] = useState({
    donationType: donationData.donationType,
    amount: donationData.amount,
    selectedDate: initialSelectedDate, // Pre-fill the date field with the specific date
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
      selectedDate: initialSelectedDate, // Update the selected date in the state
    });
  }, [donationData, initialSelectedDate]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Donation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          {/* Add the date input field */}
          <Form.Group className="mb-1" controlId="formSelectedDate">
            <Form.Label>Donation Date</Form.Label>
            <Form.Control
              type="date"
              name="selectedDate"
              value={updateData.selectedDate}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-1" controlId="formDonationType">
            <Form.Label>Donation Type</Form.Label>
            <Form.Control
              as="select"
              name="donationType"
              value={updateData.donationType}
              onChange={handleInputChange}
            >
              <option value="">Select Donation Type</option>
              <option value="AD">AD</option>
              <option value="NK">NK</option>
              <option value="SD">SD</option>
              <option value="MD">MD</option>
              {/* Add more options if needed */}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-2" controlId="formAmount">
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
