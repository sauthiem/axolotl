import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale } from 'chart.js';
import Menu from './Menu'
import Demographie from "./Demographie";
import { Chip, List, ListItem, ListItemAvatar, Typography, Button, CircularProgress } from "@mui/material";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import { pmoyText, planText, demographieText } from "./Text";
import DownloadIcon from '@mui/icons-material/Download';
import { translateDays, translateMonths } from "./Functions";
import axios from "axios";

Chart.register(...registerables);
Chart.register(CategoryScale);

const useStyles = (isDark) =>({
    titre:{
      textAlign:'center', 
      padding:'0px', 
      marginBottom:'5px', 
      borderStyle: 'solid',
      backgroundImage: isDark ?  'linear-gradient(to right,'+ DARK_THEME.palette.secondary.main +',#546E7A)': 'linear-gradient(to right,'+ LIGHT_THEME.palette.secondary.main + ', rgb(255, 255, 255))',
      borderStyle: 'none',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    },
       
});

export default ({lg, setFenetre, fenetre, dataPatient})=>{
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const styles = useStyles(isDark)
  const Item = styled(Paper)(() => ({
  backgroundColor: isDark ? DARK_THEME.palette.secondary.main : LIGHT_THEME.palette.secondary.main,
  padding: '5px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
  }));
  const date = new Date()
  const baseURL = ""
  let plage = [] 
  const [data, setData]= useState([0]) 
  const [doneFetching, setDoneFetching] = useState(false)

  let endDate = 0
  if(fenetre === 0){
    endDate = date.getTime()- 28800000  //8h en moins
  }
  if(fenetre === 1){
    endDate = date.getTime()-86400000 //24h en moins
  }
  if(fenetre === 2){
    endDate = date.getTime()-172800000 //48h en moins
  }
  if(fenetre === 3){ //7 jours
    endDate = date.getTime()-604800000 //7j en moins
  } 
  const page = 'Pressions'
  const fetchValues = async () =>{
    const loadData = await axios.get(`${baseURL}/pages/${page}/${dataPatient.infos[0]}/${endDate}`)
    const values = loadData.data
    console.log(values)
    setData(displayDatesRange(values))
    setDoneFetching(true)
  }
  
  useEffect(()=>{
    fetchValues()
  },[])
 
  function displayDatesRange(mesure){
    let mawp = []
    let peep = []
    let horodates = []
    mesure.map((h, i)=>{
      horodates.push(h[4])
      if(h[2]=='MAwP'){
        mawp.push(h[3])
        peep.push(NaN)
        if(!isNaN(h[3]))
          plage.push(h[3])
      }
      if(h[2]=='PEEP'){
        peep.push(h[3])
        mawp.push(NaN)
      }
    });
    return [horodates, mawp, peep]
  } 

  function calculMediane(valeurs){
    valeurs.filter(x => x)
    const m = Math.floor(valeurs.length / 2),
    nums = valeurs.sort((a, b) => a - b);
    if(valeurs.length % 2 !== 0){
      console.log()
      return (Number.parseFloat(nums[m-1]) + Number.parseFloat(nums[m]))/2
    }else{
      return Number.parseFloat(nums[m])
    }
  }

  const mediane = calculMediane(plage)

  const graph = {
    labels: data[0],
    datasets: [{
      data: data[1],
      label: 'MAwP',
      borderColor:isDark? '#ff5252':'#ef9a9a',
      },{
        data: data[2],
        label: 'PEEP',
        borderColor:isDark? '#536dfe':'#3f51b5',
      }
    ],
  }

  const options = {
    elements:{
      point:{
        radius:1,
      },
      line:{
          spanGaps: true,
        }
    },
    scales:{
      x:{   
        grid:{
          display:false,
        },
        type: 'time',
        time: {
          displayFormats: {
            day : 'ddd DD MMM HH:mm',
            hour: 'ddd DD MMM HH:mm',
            minute: 'ddd DD MMM HH:mm',
          },
          stepSize: 2,
          },
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
          callback: function(value, index, values) {
            if(index==0)
              return translateDays(value.slice(0,3), lg) + ' ' + value.slice(4,6) + ' '+ translateMonths(value.slice(7,10), lg) + ' ' + value.slice(11);
            else{
              const d = new Date(values[index-1].value)
              if(String(d).slice(0,3) != value.slice(0,3) ){
                return translateDays(value.slice(0,3), lg) + ' ' + value.slice(4,6) + ' ' + translateMonths(value.slice(7,10), lg) + ' ' + value.slice(11);
              }
              else
                return value.slice(11); 
            }
          },
        }
      },
      y:{
        ticks: {
          stepSize: 5,
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
        },
        grid: {
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
        }
      }
    },
    plugins:{
      legend:{
        display:false,
      },
      datalabels:{
        display: false,
      },
      tooltip:{
        callbacks:{
          afterBody: function(context){
            const d = new Date(context[0].label) 
            const hyp = dataPatient.hypoxemie.find(element => Date.parse(element[3]) >= d.getTime() && Date.parse(element[3]) <= d.getTime() + 300000)
            if(!hyp){
              return demographieText.hypoxemie[lg] +' '+ demographieText.na[lg]
            }else{
              if(hyp[0] == 0){
                return lg =='en' ?  demographieText.faible[lg] +' '+ demographieText.hypoxemie[lg].toLowerCase() : demographieText.hypoxemie[lg] +' '+ demographieText.faible[lg].toLowerCase()
              }else{
                return lg =='en' ?  demographieText.severe[lg] +' '+ demographieText.hypoxemie[lg].toLowerCase() : demographieText.hypoxemie[lg] +' '+ demographieText.severe[lg].toLowerCase()
              }
            }
            
          }
        }
      },
    }
  }

  const download = (event) => {
    const imageLink = document.createElement('a');
    const canvas = document.getElementById('graph');
    imageLink.download = 'chartMAWP-'+ dataPatient.infos[4] +'.png';
    imageLink.href = canvas.toDataURL('image/png',1)
    imageLink.click();
  };

  return(
    <div style={styles}>      
      <Grid container spacing={2} >
          <Grid item xs={2} sm={2} md={2}>
            <Demographie lg={lg} infos={dataPatient.infos} hypoxemie={dataPatient.hypoxemie} chambre={dataPatient.chambre}/>
          </Grid>
          <Grid item xs={10} sm={10} md={10} container spacing={1}>
            <Grid item xs={12} sm={12} md={12}>
                <Menu fenetre={fenetre} setFenetre={setFenetre} lg={lg} state={dataPatient}/>
            </Grid>
            {data[0].length == 0 ?
              <Grid item xs={12} sm={12} md={12}>
                <Typography variant='h4' style={styles.titre}>{pmoyText.titre[lg]}</Typography>
                <Item>
                {!doneFetching ?
                    <div>
                      <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                      <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                    </div>                  
                    :
                    <div>
                      <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                    </div>}                
                </Item>
              </Grid>
              :
              <Grid item xs={12} sm={12} md={12} container spacing={1} justifyContent='center' alignItems="center">                              
                <Grid item xs={9} sm={9} md={9}>
                  <Typography variant='h4' style={styles.titre}>{pmoyText.titre[lg]}</Typography>
                  <Item>
                    <Line id="graph" options={options} data={graph}/>
                  </Item>
                  <Grid item xs={12} sm={12} md={12} container justifyContent="flex-end">
                  <Grid item xs={12} sm={12} md={12}><br/></Grid>
                    <Button onClick={download}>Save chart<DownloadIcon/></Button>
                  </Grid>
                </Grid>
                <Grid container item xs={3} sm={3} md={3} justifyContent='center' alignItems="center">
                <Grid style={{textAlign:"center"}} item xs={12} sm={12} md={12} >
                  <Item style={{textAlign:'center'}}>
                    <Grid style={styles.legende} item xs={12} sm={12} md={12} >
                    <List >
                      <ListItem>
                        <ListItemAvatar>
                          <Chip sx={{ bgcolor: isDark?'#536dfe':'#3f51b5', width: 30, height: 4,}}/>
                        </ListItemAvatar>
                        <Typography style={{margin:'2px 5px 1px 5px'}}>PEEP</Typography>
                      </ListItem>

                      <ListItem>
                        <ListItemAvatar>
                        <Chip sx={{ bgcolor: isDark? '#ff5252':'#ef9a9a', width: 30, height: 4,}}/> 
                        </ListItemAvatar>
                        <Typography style={{margin:'2px 5px 1px 5px'}}>{pmoyText.text2[lg]}</Typography>
                      </ListItem>
                    </List>
                  </Grid>
                  </Item>
                  </Grid>
                  <Grid><br/></Grid>
                  <Grid style={{textAlign:"center"}} item xs={12} sm={12} md={12} >
                    <Item>
                      <Typography variant="h5" style={{color:isDark? '#e53935':'#ef9a9a'}}>MAwP {pmoyText.mediane[lg]}</Typography>
                      <Item style={{ color:isDark? '#ff5252':'#ef9a9a', marginTop:'8px'}}> 
                        <Typography variant="h5"><strong>{mediane}</strong> </Typography>
                        <Typography variant="h5">cmH<sub>2</sub>O</Typography>
                      </Item>
                    </Item>
                  </Grid>
                </Grid>
              </Grid>}
          </Grid>
      </Grid>
    </div>
  );
}