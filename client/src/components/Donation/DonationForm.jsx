import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleValue } from "../../store/donationSlice";
import Toaster from "../util/Toaster";
import { toast } from "react-toastify";

const DonationForm = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [showName, setShowName] = useState(false);
  const [donationType, setDonationType] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchNumber(value);

    // Filter the suggestions based on both phoneNumber and alternatePhoneNumber
    // const filteredSuggestions = data.filter(
    //   (dataItem) =>
    //     dataItem.phoneNumber.includes(value) ||
    //     dataItem.alternatePhoneNumber.includes(value)
    // );

    // Get unique phone number labels and set suggestions accordingly
    const uniquePhoneNumbers = getUniquePhoneNumbers();
    const filteredUniqueSuggestions = uniquePhoneNumbers.filter((suggestion) =>
      suggestion.label.includes(value)
    );

    // Set suggestions to the filtered data or empty array if the input field is empty
    setSuggestions(value === "" ? [] : filteredUniqueSuggestions);

    // Hide the name while typing
    setShowName(false);

    // Clear the name if the input field is empty
    if (value === "") {
      setName("");
    }
  };

  const handleSelectSuggestion = (phoneNumber, alternatePhoneNumber) => {
    setSearchNumber(phoneNumber);

    // Show the name based on the selected phoneNumber
    const selectedMember = data.find(
      (dataItem) =>
        dataItem.phoneNumber === phoneNumber ||
        dataItem.alternatePhoneNumber === phoneNumber
    );

    if (selectedMember) {
      const selectedName = selectedMember.name || "Not Found";
      setName(selectedName);
      setShowName(true); // Show the name when a suggestion is selected
    } else {
      setName("Not Found");
      setShowName(false);
    }

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

      // // Find the member based on the provided phone number to get the memberId
      const member = data.find(
        (dataItem) =>
          dataItem.phoneNumber === searchNumber ||
          dataItem.alternatePhoneNumber === searchNumber
      );

      // if (!member) {
      //   toast.warn("Member not found.");
      //   return;
      // }

      // Here, you can send the data to your Express API using axios.post
      // Include the userId along with other donation data in the request body
      const requestData = {
        userId: currentUserId,
        memberId:
          name && donationType && searchNumber && amount && selectedDate
            ? member._id
            : "", // Include the memberId obtained from the member data
        phoneNumber: searchNumber,
        name,
        donationType,
        amount,
        selectedDate,
      };

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
          setSelectedDate("");
          setShowName(false);
        })
        .catch((error) => {
          console.error("Error sending donation data:", error);
          toast.warn(error.response.data.message);
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

  // Helper function to get unique phone number labels
  const getUniquePhoneNumbers = () => {
    const uniquePhoneNumbers = [];
    const phoneNumberSet = new Set();

    data.forEach((dataItem) => {
      if (!phoneNumberSet.has(dataItem.phoneNumber)) {
        phoneNumberSet.add(dataItem.phoneNumber);
        uniquePhoneNumbers.push({
          label: dataItem.phoneNumber,
          name: dataItem.name,
        });
      }

      if (
        dataItem.alternatePhoneNumber &&
        !phoneNumberSet.has(dataItem.alternatePhoneNumber)
      ) {
        phoneNumberSet.add(dataItem.alternatePhoneNumber);
        uniquePhoneNumbers.push({
          label: dataItem.alternatePhoneNumber,
          name: dataItem.name,
        });
      }
    });

    return uniquePhoneNumbers;
  };

  return (
    <div>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <input
        type="number"
        value={searchNumber}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter phone number"
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.label}
              onClick={() =>
                handleSelectSuggestion(suggestion.label, suggestion.name)
              }
            >
              {`${suggestion.label} - ${suggestion.name}`}
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
        <option value="Anna Dhanam">Anna Dhanam</option>
        <option value="Nithya Kattalai">Nithya Kattalai</option>
        <option value="Special Donation">Special Donation</option>
        <option value="Mangalya Donation<">Mangalya Donation</option>
        {/* Add more options if needed */}
      </select>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleSubmit}>Submit</button>
      <Toaster />
    </div>
  );
};

export default DonationForm;
