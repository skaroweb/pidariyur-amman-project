import React, { useState } from "react";
import axios from "axios";
import Toaster from "../util/Toaster";
import { toast } from "react-toastify";

const FormComponent = () => {
  const serverURL = process.env.REACT_APP_SERVER_URL;
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
    } catch (error) {
      //setError(error.response.data.message);
      toast.warn(error.response.data.message);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="alternatePhoneNumber">Alternate Phone Number:</label>
          <input
            type="tel"
            id="alternatePhoneNumber"
            name="alternatePhoneNumber"
            value={formData.alternatePhoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="aadhaar">Aadhaar:</label>
          <input
            type="text"
            id="aadhaar"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="district">District:</label>
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            defaultValue={""} // Set the defaultValue to empty
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="joiningDate">Joining Date:</label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            defaultValue={""} // Set the defaultValue to empty
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <Toaster />
    </>
  );
};

export default FormComponent;
