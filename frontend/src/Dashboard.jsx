import Axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MyChart from './Charts.jsx'
import '../src/Styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { HiDotsVertical } from "react-icons/hi"

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


  const handleLogout = () => {
    Axios.get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => console.error(err));
  };

  
  return (
    <div>
      <div className="home-container">
        <div className="home-header">
          <h1>Dashboard</h1>
          <div className="buttons">
            <div className="dropdown">
              <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <HiDotsVertical />
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/upload">Home</a></li>
                <li><a className="dropdown-item" href="/posts">Posts</a></li>
                <li><a className="dropdown-item" onClick={ handleLogout }>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className='home-content'>
          <MyChart />
        </div>
      </div>

    </div>
  )
}

export default Dashboard