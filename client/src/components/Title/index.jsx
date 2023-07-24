import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import styles from "./styles.module.css";
const Title = () => {
  const isToggled = useSelector((state) => state.toggle);
  const serverURL = process.env.REACT_APP_SERVER_URL;
  // State to store the fetched data
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to fetch data using Axios
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/title/`);
        setData(response.data); // Set the fetched data in the state
        console.log(isToggled);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(); // Call the fetchData function when the component mounts
  }, [isToggled]); // The empty dependency array makes this useEffect run only once (on component mount)
  return (
    <div>
      <h1 className={`text-center pt-3 pb-3 ${styles.heading}`}>
        {data.map((title) => title.title)}
      </h1>
    </div>
  );
};
export default Title;
