import React from 'react';
import { Link } from "react-router-dom"

/**
 * 404页面
 */

const NotFound = () => {
  return (
    <center>
      <h1>404!页面找不到了！</h1>
      <p><Link to="/home">回家</Link></p>
    </center>
  )
}

export default NotFound;
