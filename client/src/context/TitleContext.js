import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TitleContext = createContext();

export const useTitleContext = () => {
  return useContext(TitleContext);
};

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    // Fetch the title from the API and set it in the context on initial load
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/setting`)
      .then((response) => {
        setTitle(response.data.title);
      })
      .catch((error) => {
        console.error("Error fetching title:", error);
      });
  }, []);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
