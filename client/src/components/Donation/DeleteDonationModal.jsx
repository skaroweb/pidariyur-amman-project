import React from "react";
import { Modal, Button } from "react-bootstrap";
import { toggleValue } from "../../store/donationSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const DeleteConfirmationModal = ({ show, handleClose, donationData }) => {
  const dispatch = useDispatch();
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      // Send the delete request to the server-side API
      await axios.delete(`${serverURL}/api/donate/${donationData._id}`);

      // Dispatch the toggleValue action to trigger a re-fetch of donation data
      dispatch(toggleValue());

      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating donation:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the donation for {donationData.name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
