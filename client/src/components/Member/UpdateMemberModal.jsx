import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

const UpdateMemberModal = ({ member, show, onHide, onUpdate }) => {
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
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={updatedMemberData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Alternate Phone Number:</label>
              <input
                type="text"
                className="form-control"
                name="alternatePhoneNumber"
                value={updatedMemberData.alternatePhoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Birth (DOB):</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                defaultValue={
                  updatedMemberData.dob
                    ? new Date(updatedMemberData.dob).toISOString().slice(0, 10)
                    : ""
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Joined Date:</label>
              <input
                type="date"
                className="form-control"
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
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <label className="form-label">Phone Number:</label>
              <input
                type="text"
                className="form-control"
                name="phoneNumber"
                value={updatedMemberData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Aadhaar:</label>
              <input
                type="text"
                className="form-control"
                name="aadhaar"
                value={updatedMemberData.aadhaar}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={updatedMemberData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">District:</label>
              <input
                type="text"
                className="form-control"
                name="district"
                value={updatedMemberData.district}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <div className="mb-3">
            <label className="form-label">Address:</label>
            <textarea
              className="form-control"
              name="address"
              value={updatedMemberData.address}
              onChange={handleInputChange}
            />
          </div>
        </Row>
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
