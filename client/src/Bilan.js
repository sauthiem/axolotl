import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale } from 'chart.js';
import { Button, List, ListItem, ListItemAvatar, Typography, CircularProgress } from "@mui/material";
import Menu from './Menu'
import Demographie from "./Demographie";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import { bilanText, demographieText, planText } from "./Text";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chip from '@mui/material/Chip';
import DownloadIcon from '@mui/icons-material/Download';
import { translateDays, translateMonths } from "./Functions";
import axios from "axios";
import { round } from 'lodash';
Chart.register(...registerables);
Chart.register(CategoryScale);
Chart.register(ChartDataLabels);

const useStyles = (isDark) =>({
  legende:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  const [data, setData]= useState([0]) 
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
  const page = 'Bilan'
  const pagePoids = 'Poids'
  const fetchValues = async () =>{
    const loadData = await axios.get(`${baseURL}/pages/${page}/${dataPatient.infos[0]}/${endDate}`)
    console.log(loadData.data)
    const loadPoids = await axios.get(`${baseURL}/pages/${pagePoids}/${dataPatient.infos[0]}/${endDate}`)
    console.log(loadPoids.data)
    setData(displayDatesRange(loadData.data, loadPoids.data))
    setDoneFetching(true)
  }
  
  useEffect(()=>{
    fetchValues()
  },[])

  function displayDatesRange(bilanBDD, poidsBDD){
    let backgroundColorP = []
    let poids=[]
    let bilan=[]
    let horaires=[]
    let ing=[]
    let exc=[]
    let diu=[]
    if(endDate == date.getTime()-604800000){ //seven days
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      for(let i = d.getTime(); i > endDate; i= i-86400000){
        bilan.push(0)
        poids.push(NaN)
        horaires.push(new Date(i))
      }
      horaires.map((h,j)=>{
        bilanBDD.map((b)=>{
          const dB = new Date(b[4]) 
          if(dB.getDate()== h.getDate()){
            if(b[2]=='ing'){
              ing.push(-b[3])
              bilan[j] =+ b[3]
            }
            else if(b[2]=='exc'){
              exc.push(-b[3])
              bilan[j] =- b[3]
            }
            else{
              diu.push(-b[3])
              bilan[j] =- b[3]
            }
          }
        })
        poidsBDD.map((p)=>{
          const dP = new Date(p[3]) 
          if(dP.getDate()== h.getDate())
            poids[j] = p[2]
        })
      })
    }
    else{
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0,0)
      for(let i = d.getTime(); i > endDate; i= i-3600000){
        bilan.push(0)
        poids.push(NaN)
        horaires.push(new Date(i))
      }
      horaires.map((h,j)=>{
        bilanBDD.map((b)=>{
          const dB = new Date(b[4]) 
          if(dB.getDate()== h.getDate() && dB.getHours()== h.getHours()){
            if(b[2]=='ing'){
              ing.push(b[3])
              bilan[j] =+ b[3]
            }
            else if(b[2]=='exc'){
              exc.push(-b[3])
              bilan[j] =- b[3]
            }
            else{
              diu.push(-b[3])
              bilan[j] =- b[3]
            }
          }
        })
        poidsBDD.map((p)=>{
          const dP = new Date(p[3]) 
          if(dP.getDate()== h.getDate())
            poids[j] = p[2]
        })
      })
    }
    bilan.map((x)=>{
      if(x<=0){
        isDark? (backgroundColorP.push('#82B1FF')) :(backgroundColorP.push('#BBDEFB'))
      }
      else{
        isDark? (backgroundColorP.push('#ff80ab')) :(backgroundColorP.push('#ef9a9a'))
      }
    })
    return [horaires, bilan, poids, backgroundColorP, ing, exc, diu]
  } 

  const graph = {
    labels: data[0],
    plugins: [ChartDataLabels],
    datasets: [{
      type: 'line',
      label: bilanText.label1[lg],
      data: data[2],
      borderColor: isDark ? 'rgba(250,250,250,0.9)' : 'grey',
      yAxisID:'poids',
      borderWidth:2,
      datalabels:{
        display: false,
      },
    },
    {
      type:'bar',
      label:'Ingesta',
      data: data[4],
      backgroundColor:'#ef9a9a',
      stack:'Stack 0',
    },{
      type:'bar',
      label:'Excreta',
      data: data[5],
      backgroundColor:'#80cbc4',
      stack:'Stack 1',
    },{
      type:'bar',
      label:'Diurese',
      data: data[6],
      backgroundColor:'#BBDEFB',
      stack:'Stack 1',
    }/* {
      type: 'bar',
      backgroundColor: data[3],
      label: bilanText.label2[lg],
      data: data[1],
      borderColor: 'rgba(245, 245, 245,0.2)'

    } */],
  }

  const options = {
    elements:{
      point:{
        radius:1,
      }
    },
    interaction: {
      intersect: false,
    },
    plugins:{
      legend:{
        display:false,
      }, 
      datalabels:{
        display: fenetre === 3 ? true : false,
        anchor: 'end',
        align: 'end'
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
      }      
    },
    scales:{
      x:{   
        //min: endDate,
        stacked: true,
        grid:{
          display:false,
        },
        type: 'timeseries',
        time: {
          displayFormats: {
            day : 'ddd DD MMM ',
            hour: 'ddd DD MMM HH:mm',
          },
        },
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
          callback: function(value, index, values) {
            if(fenetre !=3){
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
            }
          else{
            return translateDays(value.slice(0,3), lg) + ' ' + value.slice(4,6) + ' '+ translateMonths(value.slice(7,10), lg);
          }
          }, 
        }
      },
      y:{
        stacked: true,
        grid:{
          display:false,
        },
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
        },
        position: 'left',
        title:{
          display: true,
          text: bilanText.text1[lg],
          color: isDark ? 'rgba(250,250,250,0.9)' : 'grey',
        }
      },
      poids:{
        grid:{
          display:false,
        },
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
        },
        position: 'right',
        title:{
          color: isDark ? 'rgba(250,250,250,0.9)' : 'grey',
          display: true,
          text: bilanText.text2[lg]
        }
      }
    }
  }

  const download = (event) => {
    const imageLink = document.createElement('a');
    const canvas = document.getElementById('graph');
    imageLink.download = 'chartI-EBalance-'+ dataPatient.infos[4] +'.jpg';
    imageLink.href = canvas.toDataURL('image/jpg',1)
    imageLink.click();
  };

  return(
    <div style={styles}>      
        <Grid container spacing={2} >
            <Grid item xs={2} sm={2} md={2}>
              <Demographie lg={lg} infos={dataPatient.infos} hypoxemie={dataPatient.hypoxemie} chambre={dataPatient.chambre}/>
            </Grid>
            <Grid item xs={10} sm={10} md={10} container spacing={1} justifyContent='center' alignItems="center">
              <Grid item xs={12} sm={12} md={12}>
                  <Menu fenetre={fenetre} setFenetre={setFenetre} lg={lg} state={dataPatient}/>
              </Grid>
              {data[0].length == 0 ?
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant='h4' style={styles.titre}>{bilanText.titre[lg]}</Typography>
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
                    <Typography variant='h4' style={styles.titre}>{bilanText.titre[lg]}</Typography>
                    <Item>
                      <Bar id="graph" options={options} data={graph}/>
                    </Item>
                      <Grid item xs={12} sm={12} md={12} container justifyContent="flex-end">
                      <Grid item xs={12} sm={12} md={12}><br/></Grid>
                        <Button onClick={download}>Save chart<DownloadIcon/></Button>                     </Grid>
                  </Grid>
                
                  <Grid container item xs={3} sm={3} md={3} justifyContent='center' alignItems="center">
                    <Item >
                      <List >
                          <ListItem style={{textAlign:'center'}}>
                            <ListItemAvatar>
                              <Chip sx={{ bgcolor: (isDark?'rgba(250,250,250,0.9)':'grey'), width: 30, height: 4,}}/>
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}><strong>{bilanText.label1[lg]}</strong></Typography>
                          </ListItem>
                        </List>
                      <Typography textAlign="center"><strong>{bilanText.text1[lg]}</strong></Typography>
                        <List >
                          <ListItem style={{textAlign:'center'}}>
                            <ListItemAvatar>
                              <Chip sx={{ bgcolor: isDark? '#ff80ab' :'#ef9a9a', width: 30, height: 12,}}/>
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}><strong>Ingesta</strong></Typography>
                          </ListItem>

                          <ListItem style={{textAlign:'center'}}>
                            <ListItemAvatar>
                              <Chip sx={{ bgcolor: isDark? '#80cbc4' :'#80cbc4', width: 30, height: 12,}}/>
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}><strong>Excreta</strong></Typography>
                          </ListItem>

                          <ListItem style={{textAlign:'center'}}>
                            <ListItemAvatar>
                              <Chip sx={{ bgcolor: isDark? '#82B1FF' :'#BBDEFB', width: 30, height: 12,}}/>
                            </ListItemAvatar>
                            <Typography style={{margin:'2px 5px 1px 5px'}}><strong>{bilanText.diu[lg]}</strong></Typography>
                          </ListItem>
                        </List>
                      </Item>
                  </Grid>
              </Grid>}
           </Grid>
        </Grid>
    </div>
  );
}