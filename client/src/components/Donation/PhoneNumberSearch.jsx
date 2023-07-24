import React, { useState, useEffect } from "react";
import axios from "axios";

const PhoneNumberSearch = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [showName, setShowName] = useState(false);

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
      (dataItem) => dataItem.phoneNumber === phoneNumber
    );
    return foundData ? foundData.name : null;
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchNumber(value);

    // Filter the suggestions based on the input value
    const filteredSuggestions = data.filter((dataItem) =>
      dataItem.phoneNumber.includes(value)
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
    </div>
  );
};

export default PhoneNumberSearch;
