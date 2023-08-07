import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const DonationYearChart = () => {
  const [chartData, setChartData] = useState({});
  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    // Fetch donation data from the API
    axios
      .get(`${serverURL}/api/donate`)
      .then((response) => {
        const donations = response.data;
        const yearlyDonations = getYearlyDonations(donations);
        // Prepare the chart data
        const data = {
          labels: Object.keys(yearlyDonations),
          datasets: [
            {
              label: "Donations",
              data: Object.values(yearlyDonations),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        };

        setChartData(data);
      })
      .catch((error) => {
        console.error("Error fetching donation data:", error);
      });
  }, [serverURL]);

  console.log(chartData);

  const getYearlyDonations = (donations) => {
    // Group donations by year
    const yearlyDonations = {};
    donations.forEach((donation) => {
      const year = new Date(donation.selectedDate).getFullYear();
      if (yearlyDonations.hasOwnProperty(year)) {
        yearlyDonations[year] += Number(donation.amount);
      } else {
        yearlyDonations[year] = Number(donation.amount);
      }
    });
    return yearlyDonations;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Rupee",
        },
      },
    },
  };

  return (
    <div>
      <h2>Yearly Donations</h2>
      <div style={{ width: "100%", margin: "auto" }}>
        {Object.keys(chartData).length > 0 && (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default DonationYearChart;
