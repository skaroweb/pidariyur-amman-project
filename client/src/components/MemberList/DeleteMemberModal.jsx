import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteMemberModal = ({ member, show, onHide, onDelete }) => {
  const handleDelete = () => {
    // Call the onDelete function with the member's ID
    onDelete(member._id);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the member: {member.name}?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteMemberModal;
