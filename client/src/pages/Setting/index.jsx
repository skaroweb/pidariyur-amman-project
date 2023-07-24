import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toggleValue } from "../../store/toggleSlice";

const Setting = () => {
  const dispatch = useDispatch();

  const [updatedTitle, setUpdatedTitle] = useState("");

  const handleSubmit = async (e) => {
    dispatch(toggleValue());
    const serverURL = process.env.REACT_APP_SERVER_URL;
    e.preventDefault();

    try {
      // Send a PUT request to update the title in the backend
      await axios.put(`${serverURL}/api/title/`, {
        title: updatedTitle,
      });

      // Optionally, you can handle success messages or page navigation here
    } catch (error) {
      // Handle errors, such as displaying an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={updatedTitle}
        onChange={(e) => setUpdatedTitle(e.target.value)}
      />
      <button type="submit">Update Title</button>
    </form>
  );
};

export default Setting;
