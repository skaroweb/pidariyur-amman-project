import React, { useState, useEffect } from "react";
import axios from "axios";

const OverallDetail = () => {
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const [memberCount, setMemberCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  useEffect(() => {
    // Function to fetch member count from the API
    const fetchMemberCount = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/member`);
        setMemberCount(response.data); // Assuming the API response has a field for totalMembers
      } catch (error) {
        console.error("Error fetching member count:", error);
      }
    };

    const fetchDonationCount = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/donate`);
        const donations = response.data; // Assuming the API response contains an array of donations

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Filter donations to get only data for the current year
        const donationsForCurrentYear = donations.filter((donation) => {
          const donationYear = new Date(donation.selectedDate).getFullYear();
          return donationYear === currentYear;
        });

        // Calculate the total donation amount for each donation type in the current year
        const donationAmountsByType = {
          AD: 0,
          NK: 0,
          SD: 0,
          MD: 0,
        };

        if (donationsForCurrentYear.length > 0) {
          donationsForCurrentYear.forEach((donation) => {
            const donationAmount = Number(donation.amount);
            donationAmountsByType[donation.donationType] += donationAmount;
          });
        }

        // Calculate the total donation amount for all types in the current year
        const totalDonationAmount = Object.values(donationAmountsByType).reduce(
          (total, amount) => total + Number(amount),
          0
        );

        // Convert the donation amounts to fixed 2 decimal places strings
        const fixedDonationAmountsByType = {};
        for (const type in donationAmountsByType) {
          fixedDonationAmountsByType[type] =
            donationAmountsByType[type].toFixed(2);
        }

        setDonationCount({
          total: totalDonationAmount.toFixed(2),
          byType: fixedDonationAmountsByType,
        });
      } catch (error) {
        console.error("Error fetching donation count:", error);
      }
    };
    // Fetch data for both member count and donation count
    fetchMemberCount();
    fetchDonationCount();
  }, [serverURL]);

  if (!donationCount || !donationCount.byType) {
    // Render a fallback message or loading indicator if donationCount is not available
    return <div>Loading...</div>;
  }

  // Calculate the total donation amount for all types
  const totalDonationAmount = Object.values(donationCount.byType).reduce(
    (total, amount) => total + parseFloat(amount),
    0
  );

  return (
    <div>
      <div className="d-flex justify-content-evenly flex-wrap mt-5">
        <div className="mb-4 col-xl-4 col-sm-6 col-12">
          <div className="shadow-sm card border-light">
            <div className="card-body">
              <div className="d-block d-xl-flex align-items-center row">
                <div className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0 col-xl-5">
                  <div className="icon icon-shape icon-md icon-shape-secondary rounded me-4 me-sm-0">
                    <i className="fa-solid fa-users fa-2xl"></i>
                  </div>
                </div>
                <div className="px-xl-0 col-xl-7 col-12">
                  <div className="d-none d-sm-block">
                    <h5>Total Members</h5>
                    <h3 className="mb-1">{memberCount.length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 col-xl-4 col-sm-6 col-12">
          <div className="shadow-sm card border-light">
            <div className="card-body">
              <div className="d-block d-xl-flex align-items-center row">
                <div className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0 col-xl-5">
                  <div className="icon icon-shape icon-md icon-shape-secondary rounded me-4 me-sm-0">
                    <i className="fa-solid fa-hand-holding-dollar fa-2xl"></i>
                  </div>
                </div>
                <div className="px-xl-0 col-xl-7 col-12">
                  <div className="d-none d-sm-block">
                    <h5>Current Year Donation</h5>
                    <h3 className="mb-1">
                      <i className="fa-solid fa-indian-rupee-sign"></i>
                      {donationCount.total}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 col-xl-6 col-sm-6 col-12">
          <div className="shadow-sm card border-light">
            <div className="card-body">
              <div className="d-block d-xl-flex align-items-center row">
                <div className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0 col-xl-5">
                  <div className="icon icon-shape icon-md icon-shape-secondary rounded me-4 me-sm-0">
                    <i className="fa-solid fa-circle-dollar-to-slot fa-2xl"></i>
                  </div>
                </div>
                <div className="px-xl-0 col-xl-7 col-12">
                  <div className="d-none d-sm-block">
                    <h5>Donation types</h5>
                    {Object.entries(donationCount.byType).map(
                      ([type, amount]) => {
                        const percentage = (
                          (parseFloat(amount) / totalDonationAmount) *
                          100
                        ).toFixed(2);
                        return (
                          <h6 key={type} className="fw-normal text-gray">
                            {type} -{" "}
                            <i className="fa-solid fa-indian-rupee-sign"></i>{" "}
                            {amount}
                          </h6>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallDetail;
