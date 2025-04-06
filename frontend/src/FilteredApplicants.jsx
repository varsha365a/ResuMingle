import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box
} from "@mui/material";

const FilteredApplicants = () => {
  const [filteredResumes, setFilteredResumes] = useState([]);

  useEffect(() => {
    const fetchFilteredApplicants = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/resumes", { withCredentials: true });
        const allResumes = res.data;

        // Filter logic: check if any score in the array is > 50
        const filtered = allResumes.filter(resume => {
          const scores = resume.userId?.jobCompatibilityScore || [];
          return scores.some(score => score > 50);
        });

        setFilteredResumes(filtered);
      } catch (error) {
        console.error("Error fetching filtered applicants:", error);
      }
    };

    fetchFilteredApplicants();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "#27ae60" }}>
        Filtered Applicants (Score &gt; 50%)
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#2ecc71" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Score</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Resume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResumes.length > 0 ? (
              filteredResumes.map((resume, index) => (
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
                      onClick={() =>
                        window.open(`http://localhost:3000/uploads/${resume.pdfUrl}`, "_blank")
                      }
                    >
                      View Resume
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No filtered applicants found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FilteredApplicants;
