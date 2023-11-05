import MainHolder from './MainHolder'
import './App.css'
import { Container } from '@mui/material'

function App() {
  
  const holderstyles = {
    display:"flex",
    justifyContent:"center",
    width: "95vw"
  }

  return (
    <div style={holderstyles}>
      <Container maxWidth="xl">
      <MainHolder />
      </Container>
    </div>
  )
}

export default App
 