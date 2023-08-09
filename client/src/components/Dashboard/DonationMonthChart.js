import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const DonationMonthChart = () => {
  const [chartData, setChartData] = useState({});
  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    // Fetch donation data from the API
    axios
      .get(`${serverURL}/api/donate`)
      .then((response) => {
        const donations = response.data;
        const monthlyDonations = getMonthlyDonations(donations);

        // Prepare the chart data
        const data = {
          labels: Object.keys(monthlyDonations),
          datasets: [
            {
              label: "Donations",
              data: Object.values(monthlyDonations),
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

  const getMonthlyDonations = (donations) => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Initialize monthlyDonations with zero values for all months
    const monthlyDonations = {};
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString("en", { month: "long" })
    );
    months.forEach((month) => {
      monthlyDonations[month] = 0.0;
    });

    // Filter donations for the current year
    const currentYearDonations = donations.filter((donation) => {
      const year = new Date(donation.selectedDate).getFullYear();
      return year === currentYear;
    });

    // Group donations by month and update monthlyDonations
    currentYearDonations.forEach((donation) => {
      const month = new Date(donation.selectedDate).toLocaleString("en", {
        month: "long",
      });
      monthlyDonations[month] += parseFloat(donation.amount);
    });

    return monthlyDonations;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
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
      <h2>Monthly Donations for {new Date().getFullYear()}</h2>
      <div style={{ width: "100%", margin: "auto" }}>
        {Object.keys(chartData).length > 0 && (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default DonationMonthChart;
