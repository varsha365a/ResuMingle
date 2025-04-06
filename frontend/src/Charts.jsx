import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const MyChart = ({ scores }) => {
  // Calculate the total score
  const totalScore = scores.reduce((acc, score) => acc + score.score, 0);
  const maxPossibleScore = 100; // Assuming 100 is the max score
  const jobCompScore = Math.min(totalScore, maxPossibleScore); // Cap at 100
  const remainingScore = maxPossibleScore - jobCompScore; // Remaining portion

  // Data for the bar chart (Breakdown)
  const technicalSkillMatch = (totalScore * 40) / 100;
  const softSkillMatch = (totalScore * 30) / 100;
  const domainKnowledgeMatch = (totalScore * 30) / 100;

  const barChartData = {
    labels: ["Technical Skills", "Soft Skills & Role Fit", "Domain Knowledge"],
    datasets: [
      {
        label: "Score Breakdown",
        data: [technicalSkillMatch, softSkillMatch, domainKnowledgeMatch],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for the pie chart (Total job compatibility score)
  const pieChartData = {
    labels: ["Job Compatibility Score", "Remaining"],
    datasets: [
      {
        data: [jobCompScore, remainingScore],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(200, 200, 200, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(200, 200, 200, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Job Compatibility Score Breakdown",
      },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {/* Bar Chart */}
      <div style={{ width: "60%", height: "400px" }}>
        <h2>Total Score: {totalScore}</h2>
        <h3>Job Compatibility Score Breakdown</h3>
        <Bar data={barChartData} options={chartOptions} />
      </div>

      {/* Pie Chart (Total Job Compatibility Score) */}
      <div style={{ width: "30%", height: "400px" }}>
        <h3>Job Compatibility Score</h3>
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

export default MyChart;
