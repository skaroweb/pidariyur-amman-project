import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleValue } from "../../store/donationSlice";
import Toaster from "../util/Toaster";
import { toast } from "react-toastify";

const DonationForm = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [selectedFromSuggestions, setSelectedFromSuggestions] = useState(false);
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [showName, setShowName] = useState(false);
  const [donationType, setDonationType] = useState("");
  const [amount, setAmount] = useState("");
  const [memberId, setMemberId] = useState(null);

  // Function to format the date to the proper string format for the date input
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [selectedDate, setSelectedDate] = useState(
    getFormattedDate(new Date())
  );
  const dispatch = useDispatch();

  const serverURL = process.env.REACT_APP_SERVER_URL;

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(`${serverURL}/api/counter/`); // Replace "/api/counter" with your API endpoint URL
      setMemberId(response.data.counter);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call the fetchData function when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSelectSuggestion = (selectedName) => {
    setSearchNumber(selectedName); // Clear the search number to avoid showing the phone number in the input field
    setSelectedFromSuggestions(true); // Mark that the user has selected a suggestion
    setName(selectedName);
    setShowName(true); // Show the name when a suggestion is selected
    setSuggestions([]); // Clear the suggestions when a suggestion is selected
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchNumber(value);

    // Filter the suggestions based on phone number or alternate phone number
    const filteredData = data.filter(
      (dataItem) =>
        dataItem.phoneNumber.includes(value) ||
        (dataItem.alternatePhoneNumber &&
          dataItem.alternatePhoneNumber.includes(value))
    );

    // Get unique names associated with the matching phone numbers or alternate phone numbers
    const uniqueNamesWithMemberId = getUniqueNamesWithMemberId(filteredData);

    // Set suggestions to the unique names with memberId or empty array if the input field is empty
    setSuggestions(value === "" ? [] : uniqueNamesWithMemberId);

    // Show the name based on the search result
    const foundName = findNameByPhoneNumber(value);

    if (foundName) {
      setName(foundName);
      setShowName(true);
      setSelectedFromSuggestions(false); // Set to false when the user types and the search result is found
    } else {
      setName("");
      setShowName(false);
    }
  };

  const findNameByPhoneNumber = (phoneNumber) => {
    const foundData = data.find(
      (dataItem) =>
        dataItem.phoneNumber === phoneNumber ||
        dataItem.alternatePhoneNumber === phoneNumber
    );
    return foundData ? foundData.name : null;
  };

  const getUniqueNamesWithMemberId = (filteredData) => {
    const nameMemberIdMap = new Map();
    const uniqueNamesWithMemberId = [];

    filteredData.forEach((dataItem) => {
      // Use the memberId to uniquely identify the data
      if (!nameMemberIdMap.has(dataItem.memberId)) {
        nameMemberIdMap.set(dataItem.memberId, dataItem.name);
        uniqueNamesWithMemberId.push({
          name: dataItem.name,
          memberId: dataItem.memberId,
        }); // Add the name and memberId to the uniqueNamesWithMemberId array
      }
    });

    return uniqueNamesWithMemberId;
  };

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/member/`);
        setData(response.data); // Update the 'data' state with the fetched JSON data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const foundName = findNameByPhoneNumber(searchNumber);
      setName(foundName || "Not Found");
      setShowName(true); // Show the name after pressing Enter
      // Clear the suggestions when the Enter key is pressed
      setSuggestions([]);
    }
  };

  const handleSearchBlur = () => {
    if (searchNumber === "") {
      // If the input field is empty when blurred, reset the name and showName state
      setName("");
      setShowName(false);
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
      const member = data.find((dataItem) => dataItem.name === name);

      // if (!member) {
      //   toast.warn("Member not found.");
      //   return;
      // }

      // Here, you can send the data to your Express API using axios.post
      // Include the userId along with other donation data in the request body

      let number = Number(amount);
      let formattedAmount;

      if (Number.isInteger(number)) {
        formattedAmount = number.toFixed(2);
      } else {
        formattedAmount = number.toFixed(2);
      }

      const requestData = {
        userId: currentUserId,
        memberId:
          name && donationType && amount && selectedDate ? member._id : "", // Include the memberId obtained from the member data
        donarManualId:
          name && donationType && amount && selectedDate ? member.memberId : "",
        name,
        donationType,
        amount: formattedAmount,
        selectedDate,
      };

      // Make the API call using axios
      axios
        .post(`${serverURL}/api/donate/`, requestData)
        .then((response) => {
          console.log("Donation data sent successfully:", response.data);
          // Dispatch the toggleValue action to trigger a re-fetch of donation data
          dispatch(toggleValue());
          fetchData();
          // Reset the form fields after successful submission
          setSearchNumber("");
          setName("");
          setDonationType("");
          setAmount("");
          setSelectedDate(getFormattedDate(new Date()));
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

  return (
    <div>
      <input
        type="number"
        value={(memberId?.seq + 1).toString().padStart(4, "0")}
        disabled
      />
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <input
        type={selectedFromSuggestions ? "text" : "number"}
        value={searchNumber}
        onChange={handleSearchChange}
        // onKeyPress={handleKeyPress}
        // onBlur={handleSearchBlur}
        placeholder="search Name by phone num"
      />
      {suggestions.length > 0 ? (
        <ul>
          {suggestions.map((item) => (
            <li
              key={item.memberId}
              onClick={() => handleSelectSuggestion(item.name)}
            >
              {item.name} - {item.memberId}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {searchNumber.trim() !== "" && !selectedFromSuggestions && "No Found"}
        </div>
      )}
      {/* {showName && name !== "Not Found" && <p>Name: {name}</p>} */}
      <select
        value={donationType}
        onChange={(e) => setDonationType(e.target.value)}
      >
        <option value="">Select Donation Type</option>
        <option value="Anna Dhanam">Anna Dhanam</option>
        <option value="Nithya Kattalai">Nithya Kattalai</option>
        <option value="Special Donation">Special Donation</option>
        <option value="Mangalya Donation">Mangalya Donation</option>
        {/* Add more options if needed */}
      </select>
      <input
        type="number"
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
