// InvoicePage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, ListGroup } from "react-bootstrap";

import axios from "axios";

const SingleMember = () => {
  const { id } = useParams(); // Access the 'id' parameter from the URL

  const [memberData, setmemberData] = useState({});
  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchDonationDetail = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/member/${id}`);
        setmemberData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching donation detail:", error);
      }
    };

    fetchDonationDetail();
  }, [serverURL]);

  if (!memberData) {
    return <div>invalid ID</div>;
  }

  return (
    <>
      <h2>Member Details</h2>
      <Card style={{ width: "60%" }}>
        <Card.Header>
          <Card.Title>Member ID: {memberData.memberId}</Card.Title>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              Name:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.name}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              Member ID:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.memberId}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              Phone Number:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.phoneNumber}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              AlternatePhoneNumber:
            </strong>{" "}
            {memberData.alternatePhoneNumber}
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              Address:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.address}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              District:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.district}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              Aadhaar:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.aadhaar}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              Dob:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.dob}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              JoiningDate:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.joiningDate}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex">
            <strong style={{ display: "inline-block", width: "50%" }}>
              Email:
            </strong>{" "}
            <span style={{ display: "inline-block", width: "50%" }}>
              {memberData.email}
            </span>
          </ListGroup.Item>
          {/* Add more ListGroup.Item components for other properties */}
        </ListGroup>
      </Card>
    </>
  );
};

export default SingleMember;
