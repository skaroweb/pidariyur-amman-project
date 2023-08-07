// InvoicePage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import { useSelector } from "react-redux";
import axios from "axios";
import ComponentToImage from "../../components/util/ComponentToImage";

const InvoicePage = () => {
  const { id } = useParams(); // Access the 'id' parameter from the URL

  //const donationData = useSelector((state) => state.donation.data);
  //const invoice = donationData.find((donation) => donation._id === invoiceId);
  const [invoice, setInvoice] = useState({});
  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchDonationDetail = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/donate/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching donation detail:", error);
      }
    };

    fetchDonationDetail();
  }, [serverURL]);

  if (!invoice) {
    return <div>Invoice not found or invalid ID</div>;
  }

  return (
    <div>
      <h2>Invoice Details</h2>

      <ComponentToImage>
        <p>Receipt No: {invoice.donationId}</p>
        <p>Donor Name: {invoice.name}</p>
        <p>Phone Number: {invoice.phoneNumber}</p>
        <p>Donation Type: {invoice.donationType}</p>
        <p>Amount: {invoice.amount}</p>
        <p>
          Created At:{" "}
          {new Date(invoice.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </ComponentToImage>
      {/* Add other invoice details here */}
    </div>
  );
};

export default InvoicePage;
