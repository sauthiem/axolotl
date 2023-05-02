import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, Scale } from 'chart.js';
import { Button, List, ListItem, ListItemAvatar, Typography, CircularProgress } from "@mui/material";
import Menu from './Menu'
import Demographie from "./Demographie";
import ThemeContext from './ThemeContext';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import Slider from '@mui/material/Slider';
import { epfText, eoiText, planText, demographieText } from "./Text";
import annotationPlugin from "chartjs-plugin-annotation";
import Chip from '@mui/material/Chip';
import { calculMediane, calculMedianeij, concatPa02, displayDatesRangeBis, translateDays, translateMonths } from "./Functions";
import axios from "axios";
import SquareIcon from '@mui/icons-material/Square';

Chart.register(annotationPlugin);
Chart.register(...registerables);
Chart.register(CategoryScale);

const useStyles = (isDark) =>({
  legende:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  const [doneFetching, setDoneFetching] = useState(false)

  const [startDate, setStartDate] = useState(date)
  const [stopDate, setStopDate] = useState(date)
  const [dataGraph1, setDataGraph1] = useState([{horaires:[], valeurs:[]},[],[]]);
  const [data, setData] = useState([{horaires:[], valeurs:[]},[],[]])

  const page = 'PaO2'
  const pageE = 'ePaO2'
  const pageFiO2 = 'FiO2'
  let loadDataePaO2=[]
  let loadDataPaO2=[]
  let loadDataFiO2=[]
  const fetchValues = async () =>{
    loadDataPaO2 = await axios.get(`${baseURL}/pages/${page}/${dataPatient.infos[0]}/${endDate}`)
    console.log(loadDataPaO2.data)
    loadDataePaO2 = await axios.get(`${baseURL}/pages/${pageE}/${dataPatient.infos[0]}/${endDate}`)
    console.log(loadDataePaO2.data)
    loadDataFiO2 = await axios.get(`${baseURL}/pages/${pageFiO2}/${dataPatient.infos[0]}/${endDate}`)
    console.log(loadDataFiO2.data)
    setDataGraph1(displayDatesRange((loadDataPaO2.data).concat(loadDataePaO2.data), loadDataFiO2.data, endDate))
    setData(displayDatesRange((loadDataPaO2.data).concat(loadDataePaO2.data), loadDataFiO2.data, date.getTime() - 604800000))
    setDoneFetching(true)
  }
  
  useEffect(()=>{
    fetchValues()
  },[])
  
  function displayDatesRange(tabPaO2, fio2, endDate){
    tabPaO2.sort(function(a, b) {
      var c = new Date(a[4]);
      var d = new Date(b[4]);
      return c-d;
    });
    fio2.sort(function(a, b) {
      var c = new Date(a[3]);
      var d = new Date(b[3]);
      return c-d;
    }); 
    let days = {horaires:[], valeurs:[]}
    let realRatio = []  
    let backgroundColorP = []
    for( var a = 0; a < tabPaO2.length; a++ ){
      const horH = new Date(tabPaO2[a][4])
      if(horH.getTime() >= endDate){
        if(tabPaO2[a][2]==1){//real PaO2
          fio2.map((k,j)=>{
            const horK = new Date(k[3])
            if(horH.getTime() <= horK.getTime() && horK.getTime() < horH.getTime() + 30000){
              days.horaires.push(horH)
              days.valeurs.push(NaN)
              realRatio.push((tabPaO2[a][3]/k[2]) * 100)
              backgroundColorP.push('#00a152')
            }
          })
        }else{//estimated PaO2
          if(days.horaires.length == 0 || 
          horH.getTime() >= (days.horaires[days.horaires.length -1].getTime() + 60000)){ //pas de 1min
            let fen = []
            fio2.map((k,j)=>{
              const horK = new Date(k[3])
              if(horK.getTime() > horH.getTime() && horK.getTime() <= horH.getTime() + 300000){//dans les 5min d'après
                const ratio = (tabPaO2[a][3]*10/k[2]) * 100
                if(!isNaN(ratio)){
                  fen.push(ratio)
                }                
              }
            })
            const med = calculMediane(fen)
            days.horaires.push(horH)
            days.valeurs.push(med) 
            realRatio.push(0)
            backgroundColorP.push('rgba(0,0,0,0)') 
          }
        }
      }
    };
    return [days, realRatio, backgroundColorP]
  } 
  console.log(dataGraph1[1])
  const ligne1 = Array(dataGraph1[0].valeurs.length).fill(100);
  const ligne2 = Array(dataGraph1[0].valeurs.length).fill(300);
  
  function startFetch ({chart}) {
    const {min, max} = chart.scales.x;
    const start = new Date()
    const stop = new Date()
    start.setTime(Math.round(max))
    setStartDate(start)
    stop.setTime(Math.round(min))
    setStopDate(stop)
    setDataGraph1(displayDatesRange((loadDataPaO2.data).concat(loadDataePaO2.data), loadDataFiO2.data, stop.getTime()))
  } 

  function resetZoomChart(){
    setDataGraph1(displayDatesRange((loadDataPaO2.data).concat(loadDataePaO2.data), loadDataFiO2.data, endDate))
  }

  const graph = {
    labels: dataGraph1[0].horaires,  
    datasets: [
      {
        fill: false,
        label: epfText.label1[lg],
        data: dataGraph1[1],
        pointBackgroundColor: dataGraph1[2],
        borderWidth: 0,
        pointStyle: 'rect',
        pointRadius:6
      },
      {
      fill: false,
      label: epfText.label2[lg],
      data: dataGraph1[0].valeurs,
      borderColor: isDark? '#69f0ae': '#3F51B5',
      },
      {
        data: ligne1,
        borderColor:'rgb(255, 91, 79)',
        fill:'origin',
        backgroundColor:'rgba(255, 91, 79,0.5)',
      },
      {
        data: ligne2,
        borderColor:'rgb(255, 213, 79)',
        fill:'-1',
        backgroundColor: 'rgba(255, 213, 79,0.5)'
      },
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
    plugins: {
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
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            overScaleMode:'x',
            mode:'x',
          },
          pinch: {
            enabled: true,
            overScaleMode:'x',
            mode:'x',
          },
          pan:{
            enabled: true,
            overScaleMode:'x',
            mode: 'x',
          },
          onZoomComplete: startFetch
        }
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
        },
      },
      y:{
        min: 0,
        grid: {
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
        },
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
          stepSize: 100,
        }
      }
    }
  }
  
  const graphBIS = {
    labels: data[0].horaires,
    datasets: [{
      fill: true,
      label: epfText.label1[lg],
      data: data[0].valeurs,
      borderColor:isDark? '#b9f6ca':'#3F51B5',
      backgroundColor: isDark? '#69f0ae':'#757de8',
    },],
  } 

  const optionsBIS = {
    elements:{
      point:{
        radius:1,
      },
      line:{
        spanGaps: true,
      }
    },
    plugins: {
      legend:{
        display: false,
      },
      datalabels:{
        display: false,
      },
      annotation: {
        annotations: {
          box1: {
            type: 'box',
            xMin: startDate,
            xMax: stopDate,
            yMin: 0,
            yMax: 600,
            backgroundColor	: 'rgba(23, 105, 170, 0.4)',
            borderColor: 'rgb(23, 105, 170)'
          }
        }
      },      
      zoom: {
        pan:{
          enabled: true,
          mode: 'x',
          threshold:10,
        },
        zoom: {
          mode:'x',
          overScaleMode:'x',
          drag: {
            enabled: true,
            backgroundColor	: 'rgba(23, 105, 170, 0.4)',
            borderColor: 'rgb(23, 105, 170)'
          },
          onZoomComplete: startFetch
        }
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
        grid: {
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
        },
        min: 0,
        ticks: {
          stepSize: 100,
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
      }
      }
    }
  }

  const download = (event) => {
    const imageLink = document.createElement('a');
    const canvas = document.getElementById('graph');
    imageLink.download = 'chartEPF-'+ dataPatient.infos[4] +'.png';
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
          {dataGraph1[0].valeurs.length == 0 ?
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant='h4' style={styles.titre}>{epfText.PF[lg]}</Typography>
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
                <Typography variant="h4" style={styles.titre}>{epfText.PF[lg]}</Typography>
                <Item>
                  <Line id="graph1" options={options} data={graph}/>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Button variant="contained" size="small" onClick={resetZoomChart}>{eoiText.zoom[lg]}</Button>
                      <div><br/></div></div>
                      <Line height='40px' options={optionsBIS} data={graphBIS}/>
                </Item>
              </Grid>
              <Grid container item xs={3} sm={3} md={3} justifyContent='center' alignItems="center">
                <Item style={{textAlign:'center'}}>
                  <Grid style={styles.legende} item xs={12} sm={12} md={12} >
                    <List >
                    <ListItem>
                          <ListItemAvatar>
                            <Chip sx={{ bgcolor: 'rgba(255, 213, 79, 0.5)', width: 30, height: 12,}}/>
                          </ListItemAvatar>
                          <Typography style={{margin:'2px 5px 1px 5px'}}>{epfText.faible[lg]}</Typography>
                        </ListItem>

                        <ListItem>
                          <ListItemAvatar>
                          <Chip sx={{ bgcolor: 'rgba(255, 91, 79, 0.5)', width: 30, height: 12,}}/> 
                          </ListItemAvatar>
                          <Typography style={{margin:'2px 5px 1px 5px'}}>{epfText.severe[lg]}</Typography>
                        </ListItem>

                        <ListItem>
                          <ListItemAvatar>
                          <Chip sx={{ bgcolor: isDark? '#69f0ae':'#3F51B5', width: 30, height: 4,}}/>
                          </ListItemAvatar>
                          <Typography style={{margin:'2px 5px 1px 5px'}}>ePF</Typography>
                        </ListItem>
                        
                        <ListItem style={{textAlign:'center'}}>
                          <ListItemAvatar style={{marginLeft:'10px'}}>
                            <SquareIcon sx={{color: '#00a152'}}></SquareIcon>
                          </ListItemAvatar>
                          <Typography style={{margin:'2px 5px 1px 5px'}}>PF</Typography>
                        </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} style={{textAlign:'center'}}>
                      <Typography variant="h6">{epfText.PF[lg]}</Typography>
                      <Typography variant="h2" style={{marginTop:'2px', marginBottom:'10px', color:'#00a152'}}><strong>{Number.parseFloat((dataGraph1[1].filter(function(x) { return x; })).slice(-1)).toFixed(1)}</strong></Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} style={{textAlign:'center'}}>
                      <Typography variant="h6">{epfText.EPF[lg]}</Typography>
                      <Typography variant="h2" style={{marginTop:'2px', marginBottom:'10px', color:isDark? '#69f0ae': '#3F51B5'}}><strong>{Number.parseFloat((dataGraph1[0].valeurs.filter(function(x) { return x; })).slice(-1)).toFixed(1)}</strong></Typography>
                  </Grid>
                </Item>
              </Grid>
            </Grid>}
        </Grid>
    </Grid>
  </div>
  );
}     