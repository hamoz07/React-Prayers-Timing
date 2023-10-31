import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
const PrayerCard = ({ image , prayername , prayertiming , badge }) => {

  return (
    <Card sx={{ flex:"1" }} style={{ width: window.innerWidth <= 860 ? "100%" : 245, background:prayername === badge ? "#6b6565" : "#fff"}}>
    <CardMedia
      sx={{ height: 240 }}
      image={image}
      title={`${prayername} photo`}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div" style={{color:prayername === badge ? "#fff" : "#000"}}>
        {prayername === badge ? `${prayername} - upcoming` : prayername}
      </Typography>
      <Typography variant="h4" color="text.secondary">
        {prayertiming}
      </Typography>
    </CardContent>
    
  </Card>
  )
}

export default PrayerCard
