import React, { useState, useEffect } from "react";
///import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchDonationData } from "../../store/donationSlice";
import { Dropdown, ButtonGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
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
      <Table>
        <thead className="thead-light">
          <tr>
            <th className="border-0">Donation date</th>
            <th className="border-0">Receipt no</th>
            <th className="border-0">Donor Name</th>
            {/* <th className="border-0">Phone Number</th> */}
            <th className="border-0">Donation Type</th>
            <th className="border-0">Amount</th>

            <th className="border-0 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {donationData.map((donation) => (
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
              {/* <td className="border-0">{donation.phoneNumber}</td> */}
              <td className="border-0">{donation.donationType}</td>
              <td className="border-0">{donation.amount}</td>
              <td>
                <div className="d-flex justify-content-evenly">
                  <div>
                    <Link to={`/invoice/${donation._id}`}>
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </Link>
                  </div>

                  <div onClick={() => handleUpdate(donation)}>
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </div>
                  <div onClick={() => handleDelete(donation)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
