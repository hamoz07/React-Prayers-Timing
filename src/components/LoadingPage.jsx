import React from 'react'

const LoadingPage = (city) => {
  return (
    <div  className='spinner-container' style={{ minHeight: "100vh",background: city ? "rgb(128 128 128 / 85%)" : "gray" }}>
      <div className="spinner"></div>
    </div>
  )
}

export default LoadingPage
