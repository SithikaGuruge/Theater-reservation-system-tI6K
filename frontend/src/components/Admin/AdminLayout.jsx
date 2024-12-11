import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import AdminNavBar from "./AdminNavbar";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Footer from "../Footer/Footer";

const AdminLayout = ({ children }) => {
  const [isNavBarVisible, setIsNavBarVisible] = useState(true);

  const toggleNavBar = () => {
    setIsNavBarVisible((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginLeft: isNavBarVisible ? "250px" : "0px",
        transition: "margin-left 0.3s",
      }}
    >
      {isNavBarVisible && <AdminNavBar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={toggleNavBar}
          sx={{
            position: "fixed",
            top: 10,
            left: isNavBarVisible ? "180px" : "10px",
            transition: "left 0.3s",

            zIndex: 2000,
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          {isNavBarVisible ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminLayout;
