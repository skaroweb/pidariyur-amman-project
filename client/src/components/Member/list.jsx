import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Col } from "react-bootstrap"; // Import Bootstrap card and grid components
import UpdateMemberModal from "./UpdateMemberModal"; // Import the modal component
import DeleteMemberModal from "./DeleteMemberModal"; // Import the modal component
import { useSelector, useDispatch } from "react-redux";
import { fetchMemberData } from "../../store/memberSlice";
import ReactPaginate from "react-paginate";
import styles from "../Report/Pagination.module.css";

const List = () => {
  const isToggled = useSelector((state) => state.member.isToggled);
  const memberData = useSelector((state) => state.member.data);
  // const [memberData, setMemberData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const serverURL = process.env.REACT_APP_SERVER_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMember, setDeleteMember] = useState(null);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleShowModal = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setSelectedMember(null);
    setShowModal(false);
  };

  const handleShowDeleteModal = (member) => {
    setDeleteMember(member);
    setShowDeleteModal(true);
  };

  const handleHideDeleteModal = () => {
    setDeleteMember(null);
    setShowDeleteModal(false);
  };

  const handleUpdateMember = async (updatedMemberData) => {
    const filteredDataRes = await axios.get(`${serverURL}/api/donate/`);

    const filteredData = filteredDataRes.data.filter(
      (obj) => obj.memberId === updatedMemberData._id
    );

    await Promise.all(
      filteredData.map((donation) =>
        axios.put(`${serverURL}/api/donate/${donation._id}`, {
          name: updatedMemberData.name,
          phoneNumber: updatedMemberData.phoneNumber,
        })
      )
    );
    // Make an API call to update the member data
    axios
      .put(
        `${serverURL}/api/member/${updatedMemberData._id}`,
        updatedMemberData
      )
      .then((response) => {
        // Handle the successful update (e.g., show a success message)
        console.log("Member data updated:", response.data);

        // Close the modal
        handleHideModal();

        // Refresh the member list after deletion
        // fetchMemberList();
        dispatch(fetchMemberData());
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error updating member data:", error);
      });
  };

  const handleDeleteMember = async () => {
    if (!deleteMember) return;

    const filteredDataRes = await axios.get(`${serverURL}/api/donate/`);

    const filteredData = filteredDataRes.data.filter(
      (obj) => obj.memberId === deleteMember._id
    );

    await Promise.all(
      filteredData.map((donation) =>
        axios.delete(`${serverURL}/api/donate/${donation._id}`)
      )
    );

    // Make an API call to delete the member
    axios
      .delete(`${serverURL}/api/member/${deleteMember._id}`)
      .then((response) => {
        // Handle the successful deletion (e.g., show a success message)
        console.log("Member deleted:", response.data);

        // Close the delete modal
        handleHideDeleteModal();

        // Refresh the member list after deletion
        // fetchMemberList();
        dispatch(fetchMemberData());
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error deleting member:", error);
      });
  };

  // const fetchMemberList = () => {
  //   // Fetch the member list from the server
  //   axios
  //     .get(`${serverURL}/api/member`)
  //     .then((response) => {
  //       setMemberData(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching member list:", error);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   fetchMemberList();
  // }, []);

  useEffect(() => {
    dispatch(fetchMemberData());
  }, [dispatch, isToggled]);

  // const formatDate = (dateString) => {
  //   if (!dateString) {
  //     // Return an empty string if the dateString is empty
  //     return "";
  //   }
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  const filteredMembers = memberData
    .filter((member) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(lowerCaseQuery) ||
        member.phoneNumber.includes(searchQuery) ||
        member.alternatePhoneNumber.includes(searchQuery)
      );
    })
    .reverse();

  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const currentData = filteredMembers.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      <h2>Member List:</h2>
      {/* Search Input */}
      <Col sm={3} className="mb-3">
        <input
          type="text"
          placeholder="Search by name or phone number"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Col>
      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <Table responsive>
              <thead className="thead-light">
                <tr>
                  <th className="border-0" style={{ width: "15%" }}>
                    Name
                  </th>
                  <th className="border-0" style={{ width: "13%" }}>
                    Member Id
                  </th>
                  <th className="border-0" style={{ width: "20%" }}>
                    Phone Number
                  </th>
                  <th className="border-0" style={{ width: "25%" }}>
                    Address
                  </th>

                  <th className="border-0" style={{ width: "15%" }}>
                    District
                  </th>
                  {isAdmin && (
                    <th
                      className="text-center border-0"
                      style={{ width: "12%" }}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  currentData.map((member) => (
                    <tr style={{ verticalAlign: "middle" }} key={member._id}>
                      <td>{member.name}</td>
                      <td>{member.memberId}</td>
                      <td>{member.phoneNumber}</td>
                      <td>{member.address}</td>
                      <td>{member.district}</td>
                      {isAdmin && (
                        <td>
                          <div className="d-flex justify-content-evenly">
                            <div>
                              <Link
                                style={{ color: "#212529" }}
                                to={`/members/${member._id}`}
                              >
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              </Link>
                            </div>

                            <div
                              className="cursor"
                              onClick={() => handleShowModal(member)}
                            >
                              <i className="fa fa-edit" aria-hidden="true"></i>
                            </div>
                            <div
                              className="cursor"
                              onClick={() => handleShowDeleteModal(member)}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </div>
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
              {filteredMembers.length > itemsPerPage && (
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={Math.ceil(filteredMembers.length / itemsPerPage)}
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
      {selectedMember && (
        <UpdateMemberModal
          member={selectedMember}
          show={showModal}
          onHide={handleHideModal}
          onUpdate={handleUpdateMember}
        />
      )}
      {deleteMember && (
        <DeleteMemberModal
          member={deleteMember}
          show={showDeleteModal}
          onHide={handleHideDeleteModal}
          onDelete={handleDeleteMember}
        />
      )}
    </div>
  );
};

export default List;
