import axios from "axios"
import React, {useState, useEffect} from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Button, Typography, Grid, CircularProgress, Collapse } from "@mui/material";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import { mainText } from "./Text";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import './App.css';
import { ePaO2Calcul, eOICalcul, OICalcul, determinerHypoxemie } from "./Functions";

const useStyles = (isDark) => ({
  div:{
    textAlign : 'center',
    height: '100vh',
    width: '100%',
    justifyContent:'center',
    paddingTop: '10%'
  }
})

export default ({setChambre, dataPatient, setDataPatient, lg})=>{
  const baseURL = ""
  let history = useNavigate()  
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const styles = useStyles(isDark)
  const [load, setLoad] = useState(false)
  const [bedsList, setBedsList] = useState([])
  
  const fetchBeds = async () =>{
    const data = await axios.get(`${baseURL}/beds`)
    const beds = data.data
    setBedsList(beds)
  }
  useEffect(()=>{
    history('/');
    setDataPatient(null)
    fetchBeds()
  },[])

  const [chambreChoisie, setChambreChoisie] = useState("");
  const [noadmsip, setNoadmsip] = useState("");
  
  const handleChange = (event) => {
    setChambreChoisie(event.target.value)
    const index = bedsList.findIndex(element => element[0] == event.target.value);
    setNoadmsip(bedsList[index][1])
  };

  const onLinkClick = async (e, id) => {
    e.preventDefault();
    setLoad(true)
    const data = await axios.get(`${baseURL}/beds/${noadmsip}`)
    const dataP = data.data
    console.log(dataP[0][0])
    setChambre(chambreChoisie)//niveau app
    setDataPatient({chambre: chambreChoisie, infos: dataP[0][0], hypoxemie: dataP[1]})
    history('/Plan');
};
  return(
    <div className='Background' style={styles.div}> 
        {(typeof bedsList === 'undefined') ? (
        <Typography>{mainText.chargement[lg]}</Typography>
        ) : (
        <Grid container justifyContent='center' alignItems="center">
          <Grid item xs={5} sm={5} md={5}>
            <Paper elevation={3} style={{backgroundColor:isDark? 'rgba(0,0,0, 0.4)':'rgba(255,255,255, 0.4)'}}>
              <Grid container spacing={2} direction='row' justifyContent='center' alignItems="center">
                <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color: isDark? DARK_THEME.palette.text.primary : '#2c387e'}}>{mainText.titre[lg]}</Typography></Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>{mainText.chambre[lg]}</InputLabel>
                    <Select label={mainText.chambre[lg]} value={chambreChoisie} onChange={handleChange} sx={{width: '100%'}}>
                        {bedsList.map((bed, i) => (
                        <MenuItem key={i} value={bed[0]}>{bed[0]} - {bed[2][0]}. {bed[3][0]}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                  <Button variant='contained' onClick={onLinkClick}>OK</Button>    
                </Grid>
              </Grid>
              <Grid item><br/></Grid>
            </Paper>
            <Grid item><br/></Grid>
            <Collapse in={load} timeout="auto" unmountOnExit>
              <CircularProgress color="primary"/>
            </Collapse>
          </Grid>
        </Grid> )}
    </div>    
  );
}

/* const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./db/chinook.db');

let sql = `SELECT DISTINCT Name name FROM playlists
           ORDER BY name`;

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.name);
  });
});

// close the database connection
db.close(); */