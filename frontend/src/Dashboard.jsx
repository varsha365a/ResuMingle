import Axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MyChart from './Charts.jsx'
import '../src/Styles.css'

const Dashboard = () => {
  const navigate = useNavigate()
  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get('http://localhost:3000/auth/verify')
    .then(res => {
      if(res.data.status){

      }else{
        navigate('/')
      }
  })
  },[]);
  
  return (
    <div>
      <div className="home-container">
        <div className="home-header">
          <h1>Dashboard</h1>

        </div>
      </div>

      <div className="dssef">
        <MyChart />
      </div>
    </div>
  )
}

export default Dashboard