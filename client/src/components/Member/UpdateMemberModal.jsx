// UpdateMemberModal.js

import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const UpdateMemberModal = ({ member, memberData, show, onHide, onUpdate }) => {
  const [updatedMemberData, setUpdatedMemberData] = useState({ ...member });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Call the onUpdate function with the updated member data
    onUpdate(updatedMemberData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={updatedMemberData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={updatedMemberData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Alternate Phone Number:</label>
          <input
            type="text"
            name="alternatePhoneNumber"
            value={updatedMemberData.alternatePhoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Aadhaar:</label>
          <input
            type="text"
            name="aadhaar"
            value={updatedMemberData.aadhaar}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={updatedMemberData.address}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>District:</label>
          <input
            type="text"
            name="district"
            value={updatedMemberData.district}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={updatedMemberData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date of Birth (DOB):</label>
          <input
            type="date"
            name="dob"
            defaultValue={
              updatedMemberData.dob
                ? new Date(updatedMemberData.dob).toISOString().slice(0, 10)
                : ""
            }
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Joined Date:</label>
          <input
            type="date"
            name="joiningDate"
            defaultValue={
              updatedMemberData.joiningDate
                ? new Date(updatedMemberData.joiningDate)
                    .toISOString()
                    .slice(0, 10)
                : ""
            }
            onChange={handleInputChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateMemberModal;
