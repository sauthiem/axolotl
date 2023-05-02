import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Chart, registerables, CategoryScale } from 'chart.js';
import { Chip, List, ListItem, ListItemAvatar, Typography } from "@mui/material";
import ThemeContext from './ThemeContext';
import { demographieText } from './Text';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
//IMAGES
//import Avatar from "./images/avatar1.png";
import AvatarLIGHT from "./images/avatarLIGHT.png";
import AvatarDARK from "./images/avatarDARK.png";
import pastilleJaune from "./images/jaune.png";
import pastilleRouge from "./images/rouge.png";
import { calculAge } from "./Functions";

Chart.register(...registerables);
Chart.register(CategoryScale);


export default ({chambre, infos, hypoxemie, lg})=>{
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const date = new Date()
  const months = demographieText.nomMois[lg]
  let month = months[date.getMonth()];
  const HH = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const Item = styled(Paper)(() => ({
    backgroundColor: isDark ? DARK_THEME.palette.primary.main : LIGHT_THEME.palette.primary.main,
    paddingBottom: '5px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    }));
  const age = calculAge(infos[3])
  return(
    <div>      
      <Grid container spacing={2} >
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" style={{textAlign:'center', marginBottom:'10px'}}>{demographieText.titre[lg]}</Typography>
            <Item>
              <div style={{textAlign:'center', paddingBottom:'10px', paddingTop:'10px'}}>
                 <img src={isDark ? AvatarDARK : AvatarLIGHT} height="80" width="80" alt="Avatar"/>
                <Typography>{demographieText.lit[lg]}<strong>{chambre}</strong></Typography>
                <Typography>{demographieText.dossier[lg]}<strong>{infos[5]}</strong></Typography>
                <Typography>{demographieText.nom[lg]}<strong>{infos[1].charAt(0).toUpperCase()}{infos[2].charAt(0).toUpperCase()}</strong></Typography>                
            { age[0] == '0' && age[1] == '1' ?
                <Typography>{demographieText.age[lg]}<strong>1 {demographieText.moisjour[lg][0]} {demographieText.moisjour[lg][1]} {age[2]} {demographieText.jours[lg]}</strong></Typography>
                : age[0] == '0' && age[1] < '4' ?
                <Typography>{demographieText.age[lg]}<strong>{age[1]} {demographieText.mois[lg]} {demographieText.anmois[lg][1]} {age[2]} {demographieText.jours[lg]}</strong></Typography>
                : age[0] == '0' && age[1] > '3' ?
                  <Typography>{demographieText.age[lg]}<strong>{age[1]} {demographieText.mois[lg]}</strong></Typography>
                : age[0] < '2'?
                <Typography>{demographieText.age[lg]}<strong>1 {demographieText.anmois[lg][0]} {demographieText.anmois[lg][1]} {age[1]} {demographieText.mois[lg]}</strong></Typography>
                : age[1] == '0' ?
                <Typography>{demographieText.age[lg]}<strong>{age[2]} {demographieText.jours[lg]}</strong></Typography>
                : 
                <Typography>{demographieText.age[lg]}<strong>{age[0]} {demographieText.ans[lg]}</strong></Typography>
                }
                <Typography>{demographieText.sexe[lg]}<strong>{infos[4]}</strong></Typography>
                <Typography>{demographieText.pMesure[lg]}<strong>{infos[6]== 'None' ? '--' :infos[6]} kg</strong></Typography>
                <Typography>{demographieText.pIdeal[lg]}<strong>{infos[7]== 'None' ? '--' :infos[7]} kg</strong></Typography>
                <Typography>{demographieText.taille[lg]}<strong>{infos[8]== 'None' ? '--' :infos[8]} cm</strong></Typography>
              </div>
            </Item>
            <div style={{textAlign:'center', marginTop:'10px'}}><Typography>{demographieText.date[lg]}<strong>{date.getDate()} {month} {date.getFullYear()}</strong></Typography>
            <Typography>{demographieText.heure[lg]}<strong>{HH}:{mm}</strong></Typography></div>
            <div style={{textAlign:'center', marginTop:'15px'}}>
              <Chip sx={{ bgcolor: hypoxemie.slice(-1)[0] == 0 ? "#ffea00" : 'rgb(233, 86, 86)', width: 50, height: 50, borderRadius: '50%',}}/>
              <Typography variant="h6">{demographieText.hypoxemie[lg]}<strong><br/>{ hypoxemie.slice(-1)[3]==0 ? demographieText.faible[lg] : demographieText.severe[lg]}</strong></Typography>
            </div>
            <Grid item xs={12} sm={12} md={12}><br/></Grid>
            {/* <Item style={{backgroundColor:"rgba(225, 245, 254,0.3)"}}> 
              <Typography align="center" variant='h6'>Recommandations</Typography>
              <List>
                <ListItem><Typography>pH a augmenté</Typography></ListItem>
              </List>
            </Item> */}
          </Grid>
      </Grid>
    </div>
  );
}