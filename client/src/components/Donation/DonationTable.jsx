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
            <th className="border-0">Phone Number</th>
            <th className="border-0">Donation Type</th>
            <th className="border-0">Amount</th>

            <th className="border-0">Created At</th>
            <th className="border-0">Action</th>
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
              <td>
                <Dropdown as={ButtonGroup} className="">
                  <Dropdown.Toggle split variant="link">
                    <i
                      className="fa fa-ellipsis-h"
                      aria-hidden="true"
                      style={{ color: "#000" }}
                    ></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/invoice/${donation._id}`}>
                      View
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => handleUpdate(donation)}>
                      Update
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(donation)}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
