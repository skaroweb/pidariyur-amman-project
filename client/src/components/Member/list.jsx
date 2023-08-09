import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap"; // Import Bootstrap card and grid components
import UpdateMemberModal from "./UpdateMemberModal"; // Import the modal component
import DeleteMemberModal from "./DeleteMemberModal"; // Import the modal component
import { useSelector, useDispatch } from "react-redux";
import { fetchMemberData } from "../../store/memberSlice";

const List = () => {
  const isToggled = useSelector((state) => state.member.isToggled);
  const memberData = useSelector((state) => state.member.data);
  // const [memberData, setMemberData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const serverURL = process.env.REACT_APP_SERVER_URL;

  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMember, setDeleteMember] = useState(null);
  const dispatch = useDispatch();

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

  const formatDate = (dateString) => {
    if (!dateString) {
      // Return an empty string if the dateString is empty
      return "";
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h2>Member List</h2>

      {/* <Row>
        {memberData.map((member) => (
          <Col key={member._id} lg={4} md={6} sm={12} className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title>{member.name}</Card.Title>
              </Card.Header>

              <Card.Body>
                <Card.Text>
                  <strong>Member Id:</strong> {member.memberId}
                </Card.Text>
                <Card.Text>
                  <strong>Name:</strong> {member.name}
                </Card.Text>
                <Card.Text>
                  <strong>Phone Number:</strong> {member.phoneNumber}
                </Card.Text>
                <Card.Text>
                  <strong>Alternate Phone Number:</strong>{" "}
                  {member.alternatePhoneNumber}
                </Card.Text>
                <Card.Text>
                  <strong>Aadhaar:</strong> {member.aadhaar}
                </Card.Text>
                <Card.Text>
                  <strong>Address:</strong> {member.address}
                </Card.Text>
                <Card.Text>
                  <strong>District:</strong> {member.district}
                </Card.Text>
                <Card.Text>
                  <strong>Date of Birth (DOB):</strong> {formatDate(member.dob)}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {member.email}
                </Card.Text>
                <Card.Text>
                  <strong>Joined Date:</strong> {formatDate(member.joiningDate)}
                </Card.Text>
              </Card.Body>
              {isAdmin && (
                <Card.Footer>
                  <button onClick={() => handleShowModal(member)}>
                    Update Member
                  </button>
                  <button onClick={() => handleShowDeleteModal(member)}>
                    Delete Member
                  </button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row> */}
      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <Table responsive>
              <thead className="thead-light">
                <tr>
                  <th className="border-0">Name</th>
                  <th className="border-0">Member Id</th>
                  <th className="border-0">Phone Number</th>
                  <th className="border-0" style={{ width: "25%" }}>
                    Address
                  </th>

                  <th>District</th>
                  {isAdmin && <th className="text-center border-0">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {memberData.map((member) => (
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
                ))}
              </tbody>
            </Table>
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