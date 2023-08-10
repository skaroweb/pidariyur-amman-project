// Setting.js
import React, { useState } from "react";
import { useTitleContext } from "../../context/TitleContext";
import { Form, Button, Col } from "react-bootstrap";
import Toaster from "../../components/util/Toaster";
import { toast } from "react-toastify";

import axios from "axios";

const Setting = () => {
  const { title, setTitle } = useTitleContext();

  const [newTitle, setNewTitle] = useState(title);
  const serverURL = process.env.REACT_APP_SERVER_URL;

  const handleInputChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleSaveTitle = () => {
    // Make an API call to save the title to the backend
    axios
      .put(`${serverURL}/api/setting`, { title: newTitle })
      .then((response) => {
        // The title is successfully saved, update the context with new title
        setTitle(newTitle);
        toast.success(`Title changed successfully`);
      })
      .catch((error) => {
        console.error("Error saving title:", error);
        // Handle errors if needed
      });
  };

  return (
    // <div>
    //   <h2>Title of the page</h2>
    //   <input
    //     type="text"
    //     value={newTitle}
    //     onChange={handleInputChange}
    //     placeholder="Enter title"
    //   />
    //   <button onClick={handleSaveTitle}>Save Title</button>
    // </div>
    <div>
      <h2 className="mb-4">Title of the Page</h2>
      <Form>
        <div className="row">
          <Col md={4} style={{ marginRight: "20px" }}>
            <Form.Group controlId="titleInput">
              <Form.Control
                type="text"
                value={newTitle}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3 mt-lg-0">
            <Button variant="primary" onClick={handleSaveTitle}>
              Save Title
            </Button>
          </Col>
        </div>
      </Form>
      <Toaster />
    </div>
  );
};

export default Setting;
