import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleValue } from "../../store/donationSlice";

const DonationForm = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [showName, setShowName] = useState(false);
  const [donationType, setDonationType] = useState("");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/member/`);
        setData(response.data); // Update the 'data' state with the fetched JSON data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [serverURL]); // Fetch data whenever the serverURL changes

  const findNameByPhoneNumber = (phoneNumber) => {
    const foundData = data.find(
      (dataItem) =>
        dataItem.phoneNumber === phoneNumber ||
        dataItem.alternatePhoneNumber === phoneNumber
    );
    return foundData ? foundData.name : null;
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchNumber(value);

    // Filter the suggestions based on the input value
    const filteredSuggestions = data.filter(
      (dataItem) =>
        dataItem.phoneNumber.includes(value) ||
        dataItem.alternatePhoneNumber.includes(value)
    );

    // Set suggestions to the filtered data or empty array if the input field is empty
    setSuggestions(value === "" ? [] : filteredSuggestions);

    // Hide the name while typing
    setShowName(false);

    // Clear the name if the input field is empty
    if (value === "") {
      setName("");
    }
  };

  const handleSelectSuggestion = (phoneNumber) => {
    setSearchNumber(phoneNumber);
    const selectedName = findNameByPhoneNumber(phoneNumber);
    setName(selectedName || "Not Found");
    setShowName(true); // Show the name when a suggestion is selected
    // Clear the suggestions when a suggestion is selected
    setSuggestions([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const foundName = findNameByPhoneNumber(searchNumber);
      setName(foundName || "Not Found");
      setShowName(true); // Show the name after pressing Enter
      // Clear the suggestions when the Enter key is pressed
      setSuggestions([]);
    }
  };

  const handleSubmit = () => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the JWT token to get user information (e.g., user ID)
      const decodedToken = parseJwt(token);
      const currentUserId = decodedToken._id;

      // Here, you can send the data to your Express API using axios.post
      // Include the userId along with other donation data in the request body
      const requestData = {
        userId: currentUserId,
        phoneNumber: searchNumber,
        name,
        donationType,
        amount,
        //amount: `Rs ${amount}`, // Add the symbol before the amount
      };
      //console.log(requestData);

      // Make the API call using axios
      axios
        .post(`${serverURL}/api/donate/`, requestData)
        .then((response) => {
          console.log("Donation data sent successfully:", response.data);
          // Dispatch the toggleValue action to trigger a re-fetch of donation data
          dispatch(toggleValue());
          // Reset the form fields after successful submission
          setSearchNumber("");
          setName("");
          setDonationType("");
          setAmount("");
          setShowName(false);
        })
        .catch((error) => {
          console.error("Error sending donation data:", error);
        });
    } else {
      console.log("User not logged in. Unable to submit donation.");
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      return null;
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchNumber}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter phone number"
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.phoneNumber}
              onClick={() => handleSelectSuggestion(suggestion.phoneNumber)}
            >
              {`${suggestion.phoneNumber} - ${suggestion.name}`}
            </li>
          ))}
        </ul>
      )}
      {showName && name !== "Not Found" && <p>Name: {name}</p>}
      <select
        value={donationType}
        onChange={(e) => setDonationType(e.target.value)}
      >
        <option value="">Select Donation Type</option>
        <option value="Type 1">Type 1</option>
        <option value="Type 2">Type 2</option>
        <option value="Type 3">Type 3</option>
        {/* Add more options if needed */}
      </select>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DonationForm;
