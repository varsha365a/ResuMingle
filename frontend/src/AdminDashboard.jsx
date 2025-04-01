import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Paper, Box } from "@mui/material";
import FilteredApplicants from "./FilteredApplicants";
import AllApplicants from "./AllApplicants";
import AddKeywords from "./AddKeywords";

const AdminDashboard = () => {
    const [adminCompany, setAdminCompany] = useState(""); 
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [displayText, setDisplayText] = useState(""); 

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminRes = await axios.get("http://localhost:3000/admin", { withCredentials: true });
                setAdminCompany(adminRes.data.company);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchAdminData();
    }, []);

    useEffect(() => {
        if (adminCompany) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayText(adminCompany.substring(0, i));
                i++;
                if (i > adminCompany.length) clearInterval(interval);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [adminCompany]);

    const renderContent = () => {
        switch (selectedComponent) {
            case "Filtered Applicants":
                return <FilteredApplicants />;
            case "All Applicants":
                return <AllApplicants />;
            case "Add Keywords":
                return <AddKeywords />;
            default:
                return (
                    <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center", mt: 5 }}>
                        Welcome! Select an option from the sidebar.
                    </Typography>
                );
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#121212" }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 240,
                    p: 2,
                    bgcolor: "rgba(255, 255, 255, 0.1)", 
                    backdropFilter: "blur(10px)",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    height: "90vh",
                    m: 2,
                }}
            >
                {["Filtered Applicants", "All Applicants", "Add Keywords"].map((text) => (
                    <Button
                        key={text}
                        variant={selectedComponent === text ? "contained" : "outlined"}
                        sx={{
                            textTransform: "none",
                            fontSize: 16,
                            fontWeight: "bold",
                            width: "100%",
                            borderRadius: "8px",
                            transition: "0.3s",
                            color: "#fff",
                            backgroundColor: selectedComponent === text ? "#ff6b6b" : "transparent",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            "&:hover": { backgroundColor: "#ff6b6b", color: "white" },
                        }}
                        onClick={() => setSelectedComponent(text)}
                    >
                        {text}
                    </Button>
                ))}

                {/* Logout Button */}
                <Button
                    variant="contained"
                    color="error"
                    sx={{
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: "bold",
                        width: "100%",
                        mt: "auto",
                        borderRadius: "8px",
                    }}
                    onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                >
                    Logout
                </Button>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, p: 3 }}>
                {/* Large Floating Gradient Header */}
                <AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none", mb: 2 }}>
                    <Toolbar sx={{ justifyContent: "center" }}>
                        <Typography
                            variant="h2"
                            sx={{
                                textAlign: "center",
                                background: "linear-gradient(45deg, #ff6b6b, #f06595)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontWeight: "bold",
                                letterSpacing: 2,
                                animation: "fadeIn 1s ease-in-out",
                                fontSize: "3rem",
                            }}
                        >
                            {displayText}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Component Rendering Section */}
                <Paper
                    sx={{
                        p: 3,
                        height: "100%",
                        boxShadow: 3,
                        borderRadius: "10px",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        color: " #fff",
                    }}
                >
                    {renderContent()}
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
