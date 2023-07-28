import React, { useEffect, useState, useRef } from "react";
import { Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import "react-bootstrap-typeahead/css/Typeahead.css";
import ReactPaginate from "react-paginate";
import styles from "../Report/Pagination.module.css";

const DonationList = () => {
  const [donationData, setDonationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [minAmount, setMinAmount] = useState(""); // State for minimum amount
  const [maxAmount, setMaxAmount] = useState(""); // State for maximum amount
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // State variable for selected memberId
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // Ref for the Typeahead component
  const phoneTypeaheadRef = useRef();

  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    // Fetch the donation list from the server
    axios
      .get(`${serverURL}/api/donate`)
      .then((response) => {
        setDonationData(response.data);
        setFilteredData(response.data); // Initialize filtered data with all data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching donations:", error);
        setLoading(false);
      });
  }, [serverURL]);

  useEffect(() => {
    // Apply filters whenever the selectedMemberId or donationData changes
    const filteredDonations = donationData.filter((donation) => {
      // Use the selectedMemberId for filtering
      const memberMatch = selectedMemberId
        ? donation.memberId === selectedMemberId
        : true;
      return memberMatch;
    });
    setFilteredData(filteredDonations);
  }, [selectedMemberId, donationData]);

  const getUniquePhoneNumbers = () => {
    // Modify the function to return unique phone numbers
    const uniquePhoneNumbers = Array.from(
      new Set(donationData.map((donation) => donation.phoneNumber))
    );
    return uniquePhoneNumbers.map((phoneNumber) => ({
      phoneNumber,
      memberId: getMemberIdFromPhoneNumber(phoneNumber),
      label: `${phoneNumber} - ${getDonorName(phoneNumber)}`,
    }));
  };

  const getMemberIdFromPhoneNumber = (phoneNumber) => {
    const donation = donationData.find(
      (donation) => donation.phoneNumber === phoneNumber
    );
    return donation ? donation.memberId : "";
  };

  const handlePhoneNumberChange = (selected) => {
    // Extract the selected memberId
    const selectedMemberId = selected[0]?.memberId || "";

    // Use the memberId for filtering
    setSelectedMemberId(selectedMemberId);
  };
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleAmountChange = (event, type) => {
    const amount = event.target.value;
    if (type === "min") {
      setMinAmount(amount);
    } else if (type === "max") {
      setMaxAmount(amount);
    }
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  useEffect(() => {
    // Apply filters when searchPhone, selectedType, minAmount, maxAmount, fromDate, or toDate changes
    const filteredDonations = donationData.filter((donation) => {
      const phoneMatch =
        donation.phoneNumber.includes(searchPhone) ||
        donation.phoneNumber.includes(searchPhone.replace(/\s/g, ""));
      const typeMatch =
        selectedType === "All" || donation.donationType === selectedType;
      const amountMatch =
        (minAmount === "" || Number(donation.amount) >= Number(minAmount)) &&
        (maxAmount === "" || Number(donation.amount) <= Number(maxAmount));

      // New date range filtering
      const createdAt = new Date(donation.createdAt);
      const fromDateFilter = fromDate ? createdAt >= new Date(fromDate) : true;

      // Modify toDateFilter logic to include donations on the toDate date
      const nextDayOfToDate = new Date(toDate);
      nextDayOfToDate.setDate(nextDayOfToDate.getDate() + 1); // Add one day to toDate
      const toDateFilter = toDate ? createdAt < nextDayOfToDate : true;

      return (
        phoneMatch && typeMatch && amountMatch && fromDateFilter && toDateFilter
      );
    });

    setFilteredData(filteredDonations);
    setCurrentPage(0); // Reset to the first page whenever filters change
  }, [
    searchPhone,
    selectedType,
    minAmount,
    maxAmount,
    fromDate,
    toDate,
    donationData,
  ]);

  const getDonorName = (phoneNumber) => {
    // Here, you need to find the member based on the phoneNumber and get the name
    const donor = donationData.find(
      (donation) => donation.phoneNumber === phoneNumber
    );
    return donor ? donor.name : "";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const itemsPerPage = 2;
  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDeselect = () => {
    setSearchPhone("");
    setSelectedType("All");
    setMinAmount("");
    setMaxAmount("");
    setFromDate("");
    setToDate("");
    setSelectedMemberId("");
    phoneTypeaheadRef.current.clear();

    // Reset filteredData to show all donations (initialize with all data)
    setFilteredData(donationData);
    setCurrentPage(0);
  };
  const calculateTotalAmount = () => {
    // Calculate the total amount based on the filteredData
    const totalAmount = filteredData.reduce((total, donation) => {
      return total + Number(donation.amount);
    }, 0);

    return totalAmount;
  };

  return (
    <div>
      <h2>Donations Table</h2>
      <div className="filter-container">
        <Typeahead
          ref={phoneTypeaheadRef}
          id="phone-search"
          labelKey={(option) => option.label}
          onChange={handlePhoneNumberChange}
          options={getUniquePhoneNumbers()}
          placeholder="Search by Phone Number"
        />
        <select onChange={handleTypeChange} value={selectedType}>
          <option value="All">All</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="Type 3">Type 3</option>
        </select>

        <div>
          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) => handleAmountChange(e, "min")}
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) => handleAmountChange(e, "max")}
          />
        </div>
        <div>
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            placeholder="From Date"
          />
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            placeholder="To Date"
          />
        </div>
        <button onClick={handleDeselect}>Deselect</button>
      </div>
      <Table>
        <thead className="thead-light">
          <tr>
            <th className="border-0">Receipt no</th>
            <th className="border-0">Donor Name</th>
            <th className="border-0">Phone Number</th>
            <th className="border-0">Donation Type</th>
            <th className="border-0">Amount</th>
            <th className="border-0">Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((donation) => (
            <tr key={donation._id}>
              <td className="border-0">{donation.donationId}</td>
              <td className="border-0">{donation.name}</td>
              <td className="border-0">{donation.phoneNumber}</td>
              <td className="border-0">{donation.donationType}</td>
              <td className="border-0">{donation.amount}</td>
              <td className="border-0">
                {new Date(donation.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {filteredData.length > 2 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={handlePageChange}
          containerClassName={styles.pagination_ul}
          previousLinkClassName={styles.paginationLink}
          nextLinkClassName={styles.paginationLink}
          disabledClassName={styles.paginationDisabled}
          activeClassName={styles.paginationActive}
          forcePage={currentPage} // Set the active page
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
        />
      )}

      <div className={styles.totalAmount}>
        Total Amount: {calculateTotalAmount()}
      </div>
    </div>
  );
};

export default DonationList;
