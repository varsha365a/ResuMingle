import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Typography, Box
} from "@mui/material";

const AllApplicants = () => {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get("http://localhost:3000/admin/resumes", { withCredentials: true });
                console.log("Fetched Resumes:", res.data);
                setResumes(res.data);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        };
        fetchApplicants();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "#2c3e50" }}>
                All Applicants
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#34495e" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Score</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Resume</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumes.length > 0 ? (
                            resumes.map((resume, index) => (
                                <TableRow key={index}>
                                    <TableCell>{resume.userId?.username || "N/A"}</TableCell>
                                    <TableCell>{resume.userId?.email || "N/A"}</TableCell>
                                    <TableCell>{resume.role}</TableCell>
                                    <TableCell>
                                        {resume.userId?.jobCompatibilityScore?.length > 0
                                            ? resume.userId.jobCompatibilityScore.join(", ")
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => window.open(`http://localhost:3000/uploads/${resume.pdfUrl}`, "_blank")}
                                        >
                                            View Resume
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No applicants found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AllApplicants;
