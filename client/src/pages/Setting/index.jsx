// Setting.js
import React, { useState } from "react";
import { useTitleContext } from "../../context/TitleContext";
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
      })
      .catch((error) => {
        console.error("Error saving title:", error);
        // Handle errors if needed
      });
  };

  return (
    <div>
      <h2>Title of the page</h2>
      <input
        type="text"
        value={newTitle}
        onChange={handleInputChange}
        placeholder="Enter title"
      />
      <button onClick={handleSaveTitle}>Save Title</button>
    </div>
  );
};

export default Setting;
