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
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
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
    layout: {
      padding: 0, // Remove any default padding
    },
    scales: {
      x: {
        title: {
          text: "Month",
        },
        grid: {
          display: false, // Hide X-axis grid lines
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
          <Bar data={chartData} options={options} height={300} />
        )}
      </div>
    </div>
  );
};

export default DonationYearChart;
