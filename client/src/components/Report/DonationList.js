import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import styles from "../Report/Pagination.module.css";
import ExcelReport from "../util/ExcelReport";

const DonationList = () => {
  const [donationData, setDonationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [memberData, setMemberData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    axios
      .get(`${serverURL}/api/member`)
      .then((response) => {
        setMemberData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        setLoading(false);
      });

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
  }, [serverURL]);

  useEffect(() => {
    const filteredDonations = donationData.filter((donation) => {
      const memberMatch =
        selectedMemberId === "" || donation.memberId === selectedMemberId;

      const typeMatch =
        selectedType === "All" || donation.donationType === selectedType;
      const amountMatch =
        (minAmount === "" || Number(donation.amount) >= Number(minAmount)) &&
        (maxAmount === "" || Number(donation.amount) <= Number(maxAmount));

      const createdAt = new Date(donation.createdAt);
      const fromDateFilter = fromDate ? createdAt >= new Date(fromDate) : true;

      const nextDayOfToDate = new Date(toDate);
      nextDayOfToDate.setDate(nextDayOfToDate.getDate() + 1);
      const toDateFilter = toDate ? createdAt < nextDayOfToDate : true;

      return (
        memberMatch &&
        typeMatch &&
        amountMatch &&
        fromDateFilter &&
        toDateFilter
      );
    });

    setFilteredData(filteredDonations);
    setCurrentPage(0);
  }, [
    selectedType,
    minAmount,
    maxAmount,
    fromDate,
    toDate,
    donationData,
    selectedMemberId,
  ]);

  // Create a flag to determine whether the input should be "number" or "text"
  const isNumberInput = searchQuery === "" || !isNaN(searchQuery);

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

  const handleDeselect = () => {
    setSelectedType("All");
    setMinAmount("");
    setMaxAmount("");
    setFromDate("");
    setToDate("");
    setSelectedMemberId("");
    setSearchQuery("");
    setSearchResults([]);
    setFilteredData(donationData);
    setCurrentPage(0);
  };

  const calculateTotalAmount = () => {
    const totalAmount = filteredData.reduce((total, donation) => {
      return total + Number(donation.amount);
    }, 0);

    return totalAmount;
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);

    if (value.trim() === "") {
      // If the search input is empty, clear the auto-suggestions
      setSearchResults(null);
    } else {
      // Filter member data based on the search query
      const filteredMembers = memberData.filter(
        (member) =>
          member.phoneNumber.includes(value) ||
          member.alternatePhoneNumber.includes(value)
      );

      setSearchResults(filteredMembers.length > 0 ? filteredMembers : null);
    }
  };

  const handleSelectMember = (memberId, name) => {
    setSelectedMemberId(memberId);
    setSearchQuery(name);
    setSearchResults([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const itemsPerPage = 5;
  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      <h2>Donations Table</h2>
      <div className="filter-container">
        <select onChange={handleTypeChange} value={selectedType}>
          <option value="All">All</option>
          <option value="Anna Dhanam">Anna Dhanam</option>
          <option value="Nithya Kattalai">Nithya Kattalai</option>
          <option value="Special Donation">Special Donation</option>
          <option value="Mangalya Donation">Mangalya Donation</option>
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
        <input
          type={isNumberInput ? "number" : "text"}
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search phone number or alternate phone number"
        />
        {searchResults ? (
          <ul>
            {searchResults.map((member) => (
              <li
                key={member._id}
                onClick={() => handleSelectMember(member._id, member.name)}
              >
                {member.name} - {member.memberId}
              </li>
            ))}
          </ul>
        ) : (
          <div>{searchQuery.trim() !== "" && "No Found"}</div>
        )}

        <button onClick={handleDeselect}>Clear</button>
      </div>
      <ExcelReport items={filteredData} />
      <Table>
        <thead className="thead-light">
          <tr>
            <th className="border-0">Receipt no</th>
            <th className="border-0">Donor Name</th>
            <th className="border-0">Member Id</th>
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
              <td className="border-0">{donation.donarManualId}</td>
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
      {filteredData.length > itemsPerPage && (
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
          forcePage={currentPage}
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
