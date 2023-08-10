import React, { useState, useEffect } from "react";
///import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchDonationData } from "../../store/donationSlice";
import { Table } from "react-bootstrap";
import axios from "axios";
import UpdateDonationModal from "./UpdateDonationModal";
import DeleteConfirmationModal from "./DeleteDonationModal";
import ReactPaginate from "react-paginate";
import styles from "../Report/Pagination.module.css";

const DonationTable = () => {
  const isToggled = useSelector((state) => state.donation.isToggled);
  const donationData = useSelector((state) => state.donation.data);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const serverURL = process.env.REACT_APP_SERVER_URL;
  // State to track the user's authentication status

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the JWT token to get user information (e.g., user ID)
      const decodedToken = parseJwt(token);
      const currentUserId = decodedToken._id;

      // Make an API request to get user data
      axios
        .get(`${serverURL}/api/user/`)
        .then((response) => {
          // Find the user with the currentUserId from the fetched data
          const currentUser = response.data.find(
            (user) => user._id === currentUserId
          );

          if (currentUser) {
            setIsAdmin(currentUser.isAdmin);
            setAdminProfile(currentUser);
          } else {
            console.log("User not found in fetched data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const parseJwt = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      return null;
    }
  };

  const dispatch = useDispatch();

  const handleUpdate = (donation) => {
    setSelectedDonation(donation);
    setShowUpdateModal(true);
  };

  const handleDelete = async (donation) => {
    setSelectedDonation(donation);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    dispatch(fetchDonationData());
  }, [dispatch, isToggled]);

  // ... (rest of the code)
  const reversedDonationData = [...donationData].reverse();
  const filteredListOfDonation =
    adminProfile?.isAdmin !== true
      ? reversedDonationData.filter((obj) => obj.userId === adminProfile?._id)
      : reversedDonationData;

  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const currentData = filteredListOfDonation.slice(
    offset,
    offset + itemsPerPage
  );

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      <h2>Donation Data:</h2>
      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <Table responsive>
              <thead className="thead-light">
                <tr>
                  <th className="border-0" style={{ width: "18%" }}>
                    Date
                  </th>
                  <th className="border-0" style={{ width: "18%" }}>
                    Receipt no
                  </th>
                  <th className="border-0" style={{ width: "24%" }}>
                    Name
                  </th>
                  <th className="border-0" style={{ width: "18%" }}>
                    Type
                  </th>
                  <th className="border-0" style={{ width: "10%" }}>
                    Amount
                  </th>

                  {isAdmin && (
                    <th
                      className="border-0 text-center"
                      style={{ width: "12%" }}
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredListOfDonation.length > 0 ? (
                  currentData.map((donation) => (
                    <tr key={donation._id}>
                      <td className="">
                        {new Date(donation.selectedDate).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="">{donation.donationId}</td>
                      <td className="">{donation.name}</td>
                      {/* <td className="border-0">{donation.phoneNumber}</td> */}
                      <td className="">{donation.donationType}</td>
                      <td className="">{donation.amount}</td>
                      {isAdmin && (
                        <td>
                          <div className="d-flex justify-content-evenly">
                            {/* <div>
                    <Link to={`/invoice/${donation._id}`}>
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </Link>
                  </div> */}

                            <>
                              <div
                                className="cursor"
                                onClick={() => handleUpdate(donation)}
                              >
                                <i
                                  className="fa fa-edit"
                                  aria-hidden="true"
                                ></i>
                              </div>
                              <div
                                className="cursor"
                                onClick={() => handleDelete(donation)}
                              >
                                <i
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                ></i>
                              </div>
                            </>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="border-0 text-center h5">
                      Data Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="paginate">
              {filteredListOfDonation.length > itemsPerPage && (
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={Math.ceil(
                    filteredListOfDonation.length / itemsPerPage
                  )}
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
          </div>
        </div>
      </div>

      {/* Render the UpdateDonationModal component */}
      {selectedDonation && (
        <UpdateDonationModal
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          donationData={selectedDonation}
        />
      )}
      {selectedDonation && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          donationData={selectedDonation}
        />
      )}
    </div>
  );
};

export default DonationTable;
