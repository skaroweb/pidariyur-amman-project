import React, { useState, useEffect } from "react";
///import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchDonationData } from "../../store/donationSlice";
import { Table } from "react-bootstrap";
import axios from "axios";
import UpdateDonationModal from "./UpdateDonationModal";
import DeleteConfirmationModal from "./DeleteDonationModal";

const DonationTable = () => {
  const isToggled = useSelector((state) => state.donation.isToggled);
  const donationData = useSelector((state) => state.donation.data);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  // console.log("isToggled:", isToggled);
  // console.log("donationData:", donationData);

  const [isAdmin, setIsAdmin] = useState(false);
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

  //const [donationData, setDonationData] = useState([]);
  // const serverURL = process.env.REACT_APP_SERVER_URL;

  // useEffect(() => {
  //   const fetchDonationData = async () => {
  //     try {
  //       const response = await axios.get(`${serverURL}/api/donate/`);
  //       setDonationData(response.data); // Update the 'donationData' state with the fetched data
  //       // console.log(response);
  //     } catch (error) {
  //       console.error("Error fetching donation data:", error);
  //     }
  //   };

  //   fetchDonationData();
  // }, []);

  useEffect(() => {
    dispatch(fetchDonationData());
  }, [dispatch, isToggled]);

  // ... (rest of the code)

  return (
    <div>
      <h2>Donation Data:</h2>
      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <Table responsive>
              <thead className="thead-light">
                <tr>
                  <th className="border-0">Donation date</th>
                  <th className="border-0">Receipt no</th>
                  <th className="border-0">Donor Name</th>
                  {/* <th className="border-0">Phone Number</th> */}
                  <th className="border-0">Donation Type</th>
                  <th className="border-0">Amount</th>

                  {isAdmin && <th className="border-0 text-center">Action</th>}
                </tr>
              </thead>
              <tbody>
                {donationData.map((donation) => (
                  <tr key={donation._id}>
                    <td className="">
                      {new Date(donation.selectedDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                              <i className="fa fa-edit" aria-hidden="true"></i>
                            </div>
                            <div
                              className="cursor"
                              onClick={() => handleDelete(donation)}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </div>
                          </>
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
