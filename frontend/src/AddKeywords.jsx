import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";

const AddKeywords = () => {
    const [role, setRole] = useState("");
    const [keywords, setKeywords] = useState("");
    const [company, setCompany] = useState("");
    const [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/admin", { withCredentials: true })
        .then((response) => {
            setCompany(response.data.company);
            fetchKeywords(response.data.company);
        })
        .catch((error) => console.error("Error fetching admin data:", error));    
    }, []);

    const fetchKeywords = async (company) => {
        try {
            const response = await axios.get(`http://localhost:3000/admin/keywords/${company}`);
            setRolesList(response.data);
        } catch (error) {
            console.error("Error fetching keywords:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!role || !keywords) {
            alert("Please fill in all fields.");
            return;
        }
    
        try {
            await axios.post(
                "http://localhost:3000/admin/add-keywords",
                { company, role, keywords },
                { headers: { "Content-Type": "application/json" }, withCredentials: true } // ✅ Send JSON properly
            );
    
            setRole("");
            setKeywords("");
            fetchKeywords(company);
        } catch (error) {
            console.error("Error adding keywords:", error.response?.data || error.message);
        }
    };
    

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Add Keywords for Roles
            </Typography>
            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Role"
                        variant="outlined"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Keywords (comma-separated)"
                        variant="outlined"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" fullWidth type="submit">
                        Add Keywords
                    </Button>
                </form>
            </Paper>

            {/* Display existing roles and their keywords */}
            <Paper sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6">Existing Roles & Keywords</Typography>
                {rolesList.length > 0 ? (
                    rolesList.map((item, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: "5px" }}>
                            <Typography variant="subtitle1"><strong>Role:</strong> {item.role}</Typography>
                            <Typography variant="body2"><strong>Keywords:</strong> {item.keywords.join(", ")}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">No roles added yet.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default AddKeywords;
