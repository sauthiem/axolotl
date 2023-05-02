import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale } from 'chart.js';
import { Typography, Button, CircularProgress } from "@mui/material";
import Menu from './Menu'
import Demographie from "./Demographie";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import { spoText, planText, demographieText } from "./Text";
import DownloadIcon from '@mui/icons-material/Download';
import { translateDays, translateMonths } from "./Functions";
import axios from "axios"

Chart.register(...registerables);
Chart.register(CategoryScale);

const useStyles = (isDark) =>({
  legende:{
    textAlign:'center',
  },
  titre:{
    textAlign:'center', 
    padding:'0px',  
    marginTop:'3px',
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
  const [data, setData]= useState({horaires:[], valeurs:[]}) 
  const [doneFetching, setDoneFetching] = useState(false)

  var endDate = 0
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
    endDate = date.getTime()- 604800000 //7j en moins
  } 
  const page = 'SpO2'
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
    let days = {horaires:[], valeurs:[]}
      mesure.map((h, i)=>{
        if(h[2]){
          days.horaires.push(h[3])
          days.valeurs.push(h[2])
        }
      });
    return days
  }

  //BORNES
  const borneSUP =  97;
  const borneINF = (dataPatient.hypoxemie.slice(-1)[0] === 0 ? 92 : 88);
  const ligne1 = Array(data.valeurs.length).fill(borneINF);
  const ligne2 = Array(data.valeurs.length).fill(borneSUP);

  const graph = {
    labels: data.horaires,
    datasets: [
      {
        data: data.valeurs,
        borderWidth: 1,
        pointRadius:0,
        borderColor:'rgba(0,0,0,0)',
        fill: {
          target: {value: borneSUP}, //au dessus
          above: 'rgb(233, 86, 86)', 
          below: 'rgba(0,0,0,0)'   
          },
      },
      {
        data: data.valeurs,//en dessous
        borderWidth: 1,
        pointRadius:0,
        borderColor:'rgba(0,0,0,0)',
        fill: {
          target: {value: borneINF},
          above: 'rgba(0,0,0,0)', 
          below: 'rgb(233, 86, 86)'   
          },
      },
      {
        data: data.valeurs, //dedans
        borderWidth: 1,
        pointRadius:0,
        borderColor:'rgba(0,0,0,0)',
        fill: {
          target: {value: borneSUP},
          above: 'rgba(0,0,0,0)', 
          below: isDark?'rgb(66, 215, 165)':'rgba(66, 215, 165,0.5)'   
          }, 
      },
      {
        data: ligne1,
        borderColor:'rgb(233, 86, 86)',
        fill:false,
        pointBackgroundColor: 'rgba(0,0,0,0)',
        pointRadius:0
      },
      {
        data: ligne2,
        borderColor:'rgb(233, 86, 86)',
        fill:'-1',
        backgroundColor: 'rgba(66, 215, 165,0.1)',
        pointBackgroundColor: 'rgba(0,0,0,0)',
        pointRadius:0
      }
    ],
  }

  

  const options = {
    elements:{
      point:{
        radius:1,
      }, 
    },
    plugins:{
      legend:{
        display: false,
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
        max:100,
        grid:{
          display:false
        },
        ticks: {
          stepSize: 5,
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
      }
      }
    }
  }
  function calculConformite(inf,sup){
    let i = 0
    data.valeurs.forEach(v =>{
      if(v<sup && v>inf){
        i++
      }
    })
    return i
  }
  const pourcentage = Math.round(calculConformite(borneINF, borneSUP) * 100 / data.valeurs.length)
  const conformite = {
    labels: [1],
    datasets: [{
      barThickness: 30,
      fill: true,
      data: [pourcentage],
      backgroundColor: isDark? DARK_THEME.palette.primary.main : LIGHT_THEME.palette.primary.main,
      },
      {
      barThickness: 30,
      fill: true,
      data:[100],
      backgroundColor: isDark?'#bcaaa4':'rgba(0,150,136,0.2)',
    },],
  }
  
  const optionsC ={
    plugins: {
      legend:{
        display: false,
      },
      datalabels:{
        display: false,
      }, 
      tooltip:{
        enabled: false,
      }       
    },
    scales: {
      x: {
        display:false,
        stacked: true,
      },
      y: {
        max:100,
        display:false,
        stacked: true,
      }
    }
  }

  const download = (event) => {
    const imageLink = document.createElement('a');
    const canvas = document.getElementById('graph');
    imageLink.download = 'chart SpO2 -'+ dataPatient.infos[4] +'.png';
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
            {data.valeurs.length == 0 ?
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant='h4' style={styles.titre}>{spoText.titre[lg]}</Typography>
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
                <Typography variant="h4" style={styles.titre}>{spoText.titre[lg]}</Typography>
                <Item>
                  <Line id="graph" options={options} data={graph}/>
                </Item>
                <Grid item xs={12} sm={12} md={12} container justifyContent="flex-end">
                      <Grid item xs={12} sm={12} md={12}><br/></Grid>
                        <Button onClick={download}>Save chart<DownloadIcon/></Button>
                      </Grid>
              </Grid>
              <Grid container item xs={3} sm={3} md={3} justifyContent='center' alignItems="center">
                <Grid item xs={11} sm={11} md={11} style={{textAlign:'center'}}>
                  <Item>
                    <Grid item xs={12} sm={12} md={12} container direction="row">
                      <Grid style={styles.legende} item xs={6} sm={6} md={6}>
                          <Typography variant="h6" style={{marginTop:'1px'}}>{spoText.text1[lg]}</Typography>
                          <Typography variant="h4" style={{color:'primary', marginBottom:'1px'}}>{(borneSUP+borneINF)/2}%</Typography>
                      </Grid>
                      <Grid style={styles.legende} item xs={6} sm={6} md={6}>
                          <Typography variant="h5" style={{color:'rgb(233, 86, 86)', marginBottom:'1px'}}><strong> {borneSUP}%</strong> </Typography>
                          <Typography variant="h5" style={{color:'rgb(66, 215, 165)', marginTop:'1px', marginBottom:'1px'}}><strong>|</strong></Typography>
                          <Typography variant="h5" style={{color:'rgb(233, 86, 86)', marginTop:'1px'}}><strong> {borneINF}%</strong></Typography>
                      </Grid>
                    </Grid>
                  </Item>
                <Grid item xs={12} sm={12} md={12}><br/></Grid>
                <Item >
                  <Grid style={styles.legende} item xs={12} sm={12} md={12} >
                      <Typography><strong>{spoText.conformite[lg].toUpperCase()}</strong></Typography>
                      <Typography style={{marginBottom:'3px'}}><strong>{pourcentage}%</strong></Typography>
                      <Bar data={conformite} options={optionsC}></Bar>
                      <br/>
                  </Grid>
                </Item>
              </Grid>
            </Grid>
          </Grid>}
        </Grid>
      </Grid>
    </div>
  );
}