import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import styles from "../Report/Pagination.module.css";
import "./DonationList.css";
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
      <h2>Donations Filter</h2>

      <ExcelReport items={filteredData} />

      <div className="filter-container">
        <div className="overall_filter">
          <div className="auto_complete_control">
            <label>Filter by phone number:</label>
            <input
              className="form-control"
              type={isNumberInput ? "number" : "text"}
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search phone number or alternate phone number"
            />
            {searchResults ? (
              <div className="auto_complete">
                {searchResults.map((member) => (
                  <div
                    key={member._id}
                    onClick={() => handleSelectMember(member._id, member.name)}
                  >
                    {member.name} - {member.memberId}
                  </div>
                ))}
              </div>
            ) : (
              <div>{searchQuery.trim() !== "" && "No Found"}</div>
            )}
          </div>

          <div>
            <label>Filter by donation type:</label>
            <select
              className="d-md-inline form-select"
              onChange={handleTypeChange}
              value={selectedType}
            >
              <option value="All">All</option>
              <option value="AD">AD</option>
              <option value="NK">NK</option>
              <option value="SD">SD</option>
              <option value="MD">MD</option>
            </select>
          </div>
          <div>
            <label>Filter by Min Amount:</label>
            <input
              className="form-control"
              type="number"
              placeholder="Min Amount"
              value={minAmount}
              onChange={(e) => handleAmountChange(e, "min")}
            />
          </div>
          <div>
            <label>Filter by Max Amount:</label>
            <input
              className="form-control"
              type="number"
              placeholder="Max Amount"
              value={maxAmount}
              onChange={(e) => handleAmountChange(e, "max")}
            />
          </div>
          <div>
            <label>Filter by from date:</label>
            <input
              className="form-control"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              placeholder="From Date"
            />
          </div>
          <div>
            <label>Filter by to date:</label>
            <input
              className="form-control"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              placeholder="To Date"
            />
          </div>
        </div>

        <button
          className="btn btn-secondary mt-2 mb-2"
          onClick={handleDeselect}
        >
          Clear
        </button>
      </div>

      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <Table responsive>
              <thead className="thead-light">
                <tr>
                  <th className="border-0">Donation Date</th>
                  <th className="border-0">Receipt no</th>
                  <th className="border-0">Donor Name</th>
                  <th className="border-0">Member Id</th>
                  <th className="border-0">Donation Type</th>
                  <th className="border-0">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((donation) => (
                  <tr key={donation._id}>
                    <td className="border-0">
                      {new Date(donation.selectedDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="border-0">{donation.donationId}</td>
                    <td className="border-0">{donation.name}</td>
                    <td className="border-0">{donation.donarManualId}</td>
                    <td className="border-0">{donation.donationType}</td>
                    <td className="border-0">{donation.amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="paginateTotal">
            <div className="paginate">
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
            </div>

            <div className="totalAmount">
              Total Donation Amount:
              <span>
                {" "}
                <i className="fa-solid fa-indian-rupee-sign"></i>{" "}
                {calculateTotalAmount().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationList;
