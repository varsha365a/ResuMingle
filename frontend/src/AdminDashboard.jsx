import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const AdminDashboard = () => {
    const [resumes, setResumes] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        window.location.href = "/login"; 
    };

    useEffect(() => {
        axios.get("http://localhost:3000/admin/resumes", {
            withCredentials: true, 
        })
        .then(response => setResumes(response.data))
        .catch(error => console.error(error));
    }, []);    

    return (
        <div>
            <AppBar position="static" style={{ backgroundColor: "#2c3e50" }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Admin Dashboard - Resume Management
                    </Typography>
                    <Button color="inherit" onClick={ handleLogout }>Logout</Button>
                </Toolbar>
            </AppBar>

            <TableContainer component={Paper} style={{ marginTop: "20px", maxWidth: "90%", margin: "auto" }}>
                <Table>
                    <TableHead style={{ backgroundColor: "#34495e" }}>
                        <TableRow>
                            <TableCell style={{ color: "white" }}>Name</TableCell>
                            <TableCell style={{ color: "white" }}>Email</TableCell>
                            <TableCell style={{ color: "white" }}>Company</TableCell>
                            <TableCell style={{ color: "white" }}>Role</TableCell>
                            <TableCell style={{ color: "white" }}>Resume</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumes.map((resume, index) => (
                            <TableRow key={index}>
                                <TableCell>{resume.userId?.username}</TableCell>
                                <TableCell>{resume.userId?.email}</TableCell>
                                <TableCell>{resume.company}</TableCell>
                                <TableCell>{resume.role}</TableCell>
                                <TableCell>

                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => {
                                        window.open(`http://localhost:3000/uploads/${resume.pdfUrl}`, "_blank");
                                    }}
                                >
                                    View Resume
                                </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AdminDashboard;
