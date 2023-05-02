import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale } from 'chart.js';
import { Button, List, ListItem, ListItemAvatar, Typography, CircularProgress } from "@mui/material";
import Menu from './Menu'
import Demographie from "./Demographie";
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import { demographieText, eoiText, planText } from "./Text";
import annotationPlugin from "chartjs-plugin-annotation";
import Chip from '@mui/material/Chip';
import { calculMediane, translateDays, translateMonths } from "./Functions";
import axios from "axios";
import SquareIcon from '@mui/icons-material/Square';

Chart.register(annotationPlugin);
Chart.register(...registerables);
Chart.register(CategoryScale);
Chart.register(zoomPlugin);

const useStyles = (isDark) =>({
  legende:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center'
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
  const [data, setData] = useState([{horaires:[], valeurs:[]},[],[]]);
  let loadDataOI=[]
  let loadDataeOI=[]
  const page = 'OI'
  const pageE = 'eOI'
  const fetchValues = async () =>{
    loadDataOI = await axios.get(`${baseURL}/pages/${page}/${dataPatient.infos[0]}/${endDate}`)
    console.log(loadDataOI.data)
    loadDataeOI = await axios.get(`${baseURL}/pages/${pageE}/${dataPatient.infos[0]}/${endDate}`)
    console.log(loadDataeOI.data)
    setDataGraph1(displayDatesRange((loadDataeOI.data).concat(loadDataOI.data), endDate))
    setData(displayDatesRange((loadDataeOI.data).concat(loadDataOI.data), date.getTime() - 604800000));
    setDoneFetching(true)
  }
  
  useEffect(()=>{
    fetchValues()
  },[])

function displayDatesRange(tab, endDate){
  tab.sort(function(a, b) {
    var c = new Date(a[4]);
    var d = new Date(b[4]);
    return c-d;
  });
  let days = {horaires:[], valeurs:[]}
  let realOI = []  
  let backgroundColorP = []
  for( var a = 0; a < tab.length; a++ ){
      const horH = new Date(tab[a][4])
      if(horH.getTime() >= endDate){
        if(tab[a][2]==1){
          days.horaires.push(horH)
          days.valeurs.push(NaN)
          realOI.push(tab[a][3])
          backgroundColorP.push('#00a152')
        }else{
          if(days.horaires.length == 0 || horH.getTime() >= (days.horaires[days.horaires.length -1].getTime() + 60000)){
            let fen = []
            for( var k = 0; k < tab.length; k++ ){
                const horK = new Date(tab[k][4])
                if(horK.getTime() > horH.getTime() && horK.getTime() <= horH.getTime() + 300000){//dans les 5min d'après
                    fen.push(tab[k][3])
                }
            }
            const med = calculMediane(fen)
            days.horaires.push(horH)
            days.valeurs.push(med) 
            realOI.push(0)
            backgroundColorP.push('rgba(0,0,0,0)') 
          }
        }
        
      } 
  }; 
  return [days, realOI, backgroundColorP]
}

  function startFetch ({chart}) {
    const {min, max} = chart.scales.x;
    const start = new Date()
    const stop = new Date()
    start.setTime(Math.round(max))
    setStartDate(start)
    stop.setTime(Math.round(min))
    setStopDate(stop)
    setDataGraph1(displayDatesRange((loadDataeOI.data).concat(loadDataOI.data), stop.getTime()))
  } 

  function resetZoomChart(){
    setDataGraph1(displayDatesRange((loadDataeOI.data).concat(loadDataOI.data), endDate))
  }

  const ligne1 = Array(dataGraph1[0].valeurs.length).fill(4);
  const ligne2 = Array(dataGraph1[0].valeurs.length).fill(6);

  const eOIGraph = {
    labels: dataGraph1[0].horaires,  
    datasets: [
      {
        fill: false,
        label: eoiText.label1[lg],
        data: dataGraph1[1],
        pointBackgroundColor:dataGraph1[2],
        borderWidth: 0,
        pointStyle: 'rect',
        pointRadius:6
      },
      {
      fill: false,
      label: eoiText.label2[lg],
      data: dataGraph1[0].valeurs,
      borderColor: isDark? '#69f0ae': '#3F51B5',
      },
      {
        data: ligne1,
        borderColor:'rgb(255, 213, 79)',
        fill:'+1',
        backgroundColor: 'rgba(255, 213, 79,0.5)',
        pointRadius:0,
      },
      {
        data: ligne2,
        borderColor:'rgb(255, 91, 79)',
        fill: 'end',
        backgroundColor: 'rgba(255, 91, 79, 0.5)',
        pointRadius:0,
      },
  ],
  }


  const options = {
    animation: false,
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
        }
      },
      y:{
        min: 0,
        ticks: {
          stepSize: 2,
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
        },
        grid: {
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
        }
      }
    }
  }

  const eOIGraphBIS = {
    labels: data[0].horaires,
    datasets: [{
      fill: true,
      label: eoiText.label2[lg],
      data: data[0].valeurs,
      borderColor:isDark? '#b9f6ca':'#3F51B5',
      backgroundColor: isDark? '#69f0ae':'#757de8',
    },
  ],
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
            yMax: 16,
            backgroundColor	: 'rgba(23, 105, 170, 0.4)',
            borderColor: 'rgb(23, 105, 170)'
          }
        }
      },       
    },
    scales:{
      x:{  
        grid:{
          display:false,
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
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
          font:{
            size:10
          },
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
        min: 0,
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
          stepSize: 2,
        },
        grid: {
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
        }
      }
    }
  }
  const download = (event) => {
    const imageLink = document.createElement('a');
    const canvas = document.getElementById('graph');
    imageLink.download = 'chartEOI-'+ dataPatient.infos[4] +'.png';
    imageLink.href = canvas.toDataURL('image/png',1)
    imageLink.click();
  };

  return(
    <div style={styles}>      
      <Grid container spacing={2}>
          <Grid item xs={2} sm={2} md={2}>
            <Demographie lg={lg} infos={dataPatient.infos} hypoxemie={dataPatient.hypoxemie} chambre={dataPatient.chambre}/>
          </Grid>
          <Grid item xs={10} sm={10} md={10} container spacing={1}>
            <Grid item xs={12} sm={12} md={12}>
                <Menu fenetre={fenetre} setFenetre={setFenetre} lg={lg} state={dataPatient}/>
            </Grid>
            {dataGraph1[0].valeurs.length == 0 ?
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant='h4' style={styles.titre}>{eoiText.titre[lg]}</Typography>
                  <Item>
                  {!doneFetching ?
                    <div>
                      <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                      <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                    </div>                  
                    :
                    <div>
                      <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                    </div>}                  </Item>
                </Grid>
                :
                <Grid item xs={12} sm={12} md={12} container spacing={1} justifyContent='center' alignItems="center">
                  <Grid item xs={9} sm={9} md={9}>
                    <Typography variant="h4" style={styles.titre}>{eoiText.titre[lg]}</Typography>
                    <Item>
                      <Line options={options} data={eOIGraph}/>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button variant="contained" size="small" onClick={resetZoomChart}>{eoiText.zoom[lg]}</Button>
                      <div><br/></div></div>
                      <Line height='40px' options={optionsBIS} data={eOIGraphBIS}/>
                    </Item>
                  </Grid>
                  <Grid container item xs={3} sm={3} md={3} justifyContent='center' alignItems="center">
                    <Item style={{textAlign:'center'}}>
                      <Grid style={styles.legende} item xs={12} sm={12} md={12} >
                        <List >
                          <ListItem>
                            <ListItemAvatar>
                              <Chip sx={{ bgcolor: 'rgba(255, 91, 79, 0.5)', width: 30, height: 12,}}/> 
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}>{eoiText.severe[lg]}</Typography>
                          </ListItem>

                          <ListItem>
                          <ListItemAvatar>
                              <Chip sx={{ bgcolor: 'rgba(255, 213, 79, 0.5)', width: 30, height: 12,}}/>
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}>{eoiText.faible[lg]}</Typography>
                          </ListItem>

                          <ListItem>
                            <ListItemAvatar>
                              <Chip sx={{ bgcolor: isDark? '#69f0ae':'#3F51B5', width: 30, height: 4,}}/>
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}>eOI</Typography>
                          </ListItem>

                          <ListItem>
                            <ListItemAvatar style={{marginLeft:'10px'}}>
                              <SquareIcon sx={{color: '#00a152'}} fontSize="small"></SquareIcon>
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}>OI</Typography>
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} style={{textAlign:'center'}}>
                        <Typography variant="h6">{eoiText.IO[lg]}</Typography>
                        <Typography variant="h2" style={{marginTop:'2px', marginBottom:'10px',color:'#00a152'}}><strong>{Number.parseFloat((dataGraph1[1].filter(function(x) { return x; })).slice(-1)).toFixed(1)}</strong></Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} style={{textAlign:'center'}}>
                        <Typography variant="h6">{eoiText.EIO[lg]}</Typography>
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