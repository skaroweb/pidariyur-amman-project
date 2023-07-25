import React, { useEffect, useState } from "react";
import { Dropdown, ButtonGroup, Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import "react-bootstrap-typeahead/css/Typeahead.css";
import ReactPaginate from "react-paginate";
import styles from "../Report/Pagination.module.css";

const DonationList = () => {
  const [donationData, setDonationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState("");
  // const [selectedName, setSelectedName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [minAmount, setMinAmount] = useState(""); // State for minimum amount
  const [maxAmount, setMaxAmount] = useState(""); // State for maximum amount
  // New state variables for date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);

  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const params = {};
    if (fromDate && toDate) {
      params.fromDate = fromDate;
      params.toDate = toDate;
    }
    // Make an API request to get all donations
    axios
      .get(`${serverURL}/api/donate`)
      .then((response) => {
        setDonationData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching donations:", error);
        setLoading(false);
      });
  }, [fromDate, toDate]);

  const handleNameChange = (selected) => {
    setSearchName(selected[0]?.name || "");
    // setSelectedName(selected[0]?.name || ""); // Update the selected name
  };

  const handlePhoneChange = (selected) => {
    setSearchPhone(selected[0]?.phoneNumber || "");
    // setSelectedName(
    //   selected[0] ? `${selected[0].phoneNumber} - ${selected[0].name}` : ""
    // );
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
    // Apply filters when searchName, searchPhone, selectedType, minAmount, maxAmount, fromDate, or toDate changes
    const filteredDonations = donationData.filter((donation) => {
      const nameMatch =
        donation.name.toLowerCase().includes(searchName.toLowerCase()) ||
        donation.phoneNumber.includes(searchName);
      const phoneMatch =
        donation.phoneNumber.includes(searchPhone) ||
        donation.phoneNumber.includes(searchPhone.replace(/\s/g, ""));
      const typeMatch =
        selectedType === "All" || donation.donationType === selectedType;
      const amountMatch =
        (minAmount === "" || Number(donation.amount) >= Number(minAmount)) &&
        (maxAmount === "" || Number(donation.amount) <= Number(maxAmount));

      // New date range filtering
      const dateMatch =
        (!fromDate || new Date(donation.createdAt) >= new Date(fromDate)) &&
        (!toDate || new Date(donation.createdAt) <= new Date(toDate));

      return nameMatch && phoneMatch && typeMatch && amountMatch && dateMatch;
    });
    setFilteredData(filteredDonations);
    setCurrentPage(0); // Reset to the first page whenever filters change
  }, [
    searchName,
    searchPhone,
    selectedType,
    minAmount,
    maxAmount,
    fromDate,
    toDate,
    donationData,
  ]);
  console.log(filteredData);

  const getUniqueNames = () => {
    const uniqueNames = [
      ...new Set(donationData.map((donation) => donation.name)),
    ];
    return uniqueNames.map((name) => ({ name }));
  };

  const getUniquePhoneNumbers = () => {
    const uniquePhoneNumbers = [
      ...new Set(donationData.map((donation) => donation.phoneNumber)),
    ];
    return uniquePhoneNumbers.map((phoneNumber) => ({
      phoneNumber,
      label: `${phoneNumber} - ${getDonorName(phoneNumber)}`,
    }));
  };

  const getDonorName = (phoneNumber) => {
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

  const resetFilters = () => {
    setSearchName("");
    //setSelectedName("");
    setSearchPhone("");
    setSelectedType("All");
    setMinAmount("");
    setMaxAmount("");
    setFromDate("");
    setToDate("");
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
          id="name-search"
          labelKey="name"
          onChange={handleNameChange}
          options={getUniqueNames()}
          placeholder="Search by Name"
        />
        <Typeahead
          id="phone-search"
          labelKey={(option) => option.label}
          onChange={handlePhoneChange}
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
        <button onClick={resetFilters}>Deselect</button>
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
              <td className="border-0">{donation.receiptNo}</td>
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
        />
      )}

      <div className={styles.totalAmount}>
        Total Amount: {calculateTotalAmount()}
      </div>
    </div>
  );
};

export default DonationList;
