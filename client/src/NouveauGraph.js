import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Bar, Bubble, Doughnut, Line, Pie, Scatter } from "react-chartjs-2";
import { Chart, registerables, CategoryScale } from 'chart.js';
import { useLocation  } from "react-router-dom";
import { List, ListItem, ListItemAvatar, Typography, Button } from "@mui/material";
import Menu from './Menu'
import Demographie from "./Demographie";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import { phText, fioText, planText, creerGraphText, demographieText  } from './Text';
import Chip from '@mui/material/Chip';
import annotationPlugin from "chartjs-plugin-annotation";
import DownloadIcon from '@mui/icons-material/Download';
import { translateDays, translateMonths } from "./Functions";
import axios from "axios";
Chart.register(...registerables);
Chart.register(CategoryScale);
Chart.register(annotationPlugin);

const useStyles = (isDark) =>({
    titre:{
      textAlign:'center', 
      padding:'0px', 
      marginTop:'1px',
      marginBottom:'5px', 
      borderStyle: 'solid',
      backgroundImage: isDark ?  'linear-gradient(to right,'+ DARK_THEME.palette.secondary.main +',#546E7A)': 'linear-gradient(to right,'+ LIGHT_THEME.palette.secondary.main + ', rgb(255, 255, 255))',
      borderStyle: 'none',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    },
      
});

  export default ({lg, dataPatient, setFenetre, fenetre})=>{
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const styles = useStyles(isDark)
    const Item = styled(Paper)(() => ({
    backgroundColor: isDark ? DARK_THEME.palette.secondary.main : LIGHT_THEME.palette.secondary.main,
    padding: '5px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    }));
    const location = useLocation();
    const donneesPassees = location.state;
    const infosGraph = donneesPassees.infosGraph
    console.log(infosGraph)
  
    const date = new Date()
    let plage = [] 
    let plage2 = [] 
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
    const [data, setData] = useState({horaires:[], valeurs:[]})
    const fetchValues = async () =>{
      const pageM1 = infosGraph[0].mesures
      if(infosGraph[0].openAutreM){
        const pageM2 = infosGraph[1].mesures
        const loadDataM1 = await axios.get(`${baseURL}/pages/${pageM1}/${dataPatient.infos[0]}/${endDate}`)
        console.log(loadDataM1.data)
        const loadDataM2 = await axios.get(`${baseURL}/pages/${pageM2}/${dataPatient.infos[0]}/${endDate}`)
        console.log(loadDataM2.data)
        setData([displayDatesRange([loadDataM1, pageM1]), displayDatesRange([loadDataM2, pageM2])])
      }else{
        const loadDataM1 = await axios.get(`${baseURL}/pages/${pageM1}/${dataPatient.infos[0]}/${endDate}`)
        console.log(loadDataM1.data)
        setData(displayDatesRange([loadDataM1, pageM1]))
      }
    }
    useEffect(()=>{
      fetchValues()
    },[])
  
    
    function displayDatesRange(infosMesure){
      let days = {horaires:[], valeurs:[]}
      const mesure = infosMesure[0]
      const nom = infosMesure[1]
      if(nom == 'ePaO2'||nom == 'PaO2'||nom == 'ePOI'||nom == 'OI'|| nom == 'Pressions'||nom == 'pH'){
        mesure.sort(function(a, b) {
          var c = new Date(a[4]);
          var d = new Date(b[4]);
          return c-d;
        });
        mesure.map((h, i)=>{
          const hor = new Date(h[4])
          days.horaires.push(hor)
          days.valeurs.push(h[3])
          if(infosGraph[0].openAutreM && infosMesure[1] == infosGraph[1].mesures){
              plage2.push(h[3])
          }
          else{
            plage.push(h[3])
          } 
        });
      }else{
        mesure.sort(function(a, b) {
          var c = new Date(a[3]);
          var d = new Date(b[3]);
          return c-d;
        });
        mesure.map((h, i)=>{
          const hor = new Date(h[3])
          days.horaires.push(hor)
          days.valeurs.push(h[2])
          if(infosGraph[0].openAutreM && infosMesure[1] == infosGraph[1].mesures){
              plage2.push(h[2])
          }
          else{
            plage.push(h[2])
          } 
        });
      }
    return days
    }
    
    //BORNES
  const vide =[{
      type:'line',
      data: Array(data[0].valeurs.length).fill(0),
      borderColor: 'rgba(0,0,0,0)',
      pointBackgroundColor: 'rgba(0,0,0,0)',      
      legend:{
        display: false,
      },
    }]
  var bornes 
  var pourcentage
  if(infosGraph[0].nbBornes == 1){
    //if(!infosGraph[0].openAutreM){
      bornes=[{
      type:'line',
      data: Array(data[0].valeurs.length).fill(infosGraph[0].bornes[1]),
      borderColor:'rgb(233, 86, 86)',
      fill: infosGraph[0].bornes[0]=='inf'? 'origin' : 'end',
      backgroundColor: 'rgba(229, 115, 115,0.4)',
      pointBackgroundColor: 'rgba(0,0,0,0)',      
      legend:{
        display: false,
      },
    }]
   // }
    pourcentage = infosGraph[0].bornes[0]=='inf'? Math.round(calculConformite(infosGraph[0].bornes[1], null,0) * 100 / data[0].valeurs.length): Math.round(calculConformite(null, infosGraph[0].bornes[1],0) * 100 / data[0].valeurs.length) 
  }
  else if(infosGraph[0].nbBornes == 2){
    //if(!infosGraph[0].openAutreM){
      bornes = [
        {
          type:'line',
          data: Array(data[0].valeurs.length).fill(infosGraph[0].bornes[0]),
          borderColor:'rgb(233, 86, 86)',
          fill:'origin',
          backgroundColor: 'rgba(229, 115, 115,0.2)',
          pointBackgroundColor: 'rgba(0,0,0,0)',
          pointRadius:0,
          legend:{
            display: false,
          },
        },
        {
          type:'line',
          data: Array(data[0].valeurs.length).fill(infosGraph[0].bornes[1]),
          borderColor:'rgb(233, 86, 86)',
          fill:'end',
          backgroundColor: 'rgba(229, 115, 115,0.2)',
          pointBackgroundColor: 'rgba(0,0,0,0)',
          pointRadius:0,        
          legend:{
            display: false,
          },
        },
      ]
    //}
    pourcentage = Math.round(calculConformite(infosGraph[0].bornes[0], infosGraph[0].bornes[1],0) * 100 / data[0].valeurs.length) 
  }
  else{
    bornes = vide
  }

  var pourcentage2
  if(infosGraph[0].openAutreM){
    if(infosGraph[1].nbBornes == 1){
      pourcentage2 = infosGraph[1].bornes[0]=='inf'? Math.round(calculConformite(infosGraph[1].bornes[1], null,1) * 100 / data[0].valeurs.length): Math.round(calculConformite(null, infosGraph[1].bornes[1],1) * 100 / data[0].valeurs.length) 
    }
    else if(infosGraph[1].nbBornes == 2){
      pourcentage2 = Math.round(calculConformite(infosGraph[1].bornes[0], infosGraph[1].bornes[1], 1) * 100 / data[0].valeurs.length) 
    }
  }
    
    const axeBis =  infosGraph[0].openAutreM ?
    {        
      position: 'right',
      grid:{
        display:false,
      },
      ticks: {
        color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
      },
      title:{
        color: isDark ? 'rgba(250,250,250,0.9)' : 'grey',
        display: true,
        text: infosGraph[1].mesures
      }
    } : null;

    const graph = {
      type: infosGraph[0].type == 'area' ? 'line' : infosGraph[0].type,
      labels: data[0].horaires,
      datasets: [
        {
          data: data[0].valeurs,
          borderColor: infosGraph[0].couleur,
          fill: infosGraph[0].type == 'area' || infosGraph[0].type == 'bar'? true : false,
          backgroundColor: infosGraph[0].couleur,
          label: (infosGraph[0].mesures).toUpperCase(),
        },
        infosGraph[0].openAutreM ? {
          data: data[1].valeurs,
          type: infosGraph[1].type == 'area' ? 'line' : infosGraph[1].type,
          borderColor: infosGraph[1].couleur,
          fill: infosGraph[1].type == 'area' || infosGraph[1].type == 'bar'? true : false,
          backgroundColor: infosGraph[1].couleur,
          yAxisID: 'bis',
          label: (infosGraph[1].mesures).toUpperCase(),
        } 
        :
        (infosGraph[0].nbBornes == 0 || infosGraph[0].nbBornes == 1 ? bornes[0]: bornes[0], bornes[1] ),
      ],
    }
  var showBornes
  if(infosGraph[0].openAutreM && infosGraph[0].nbBornes == 1 && infosGraph[1].nbBornes == 1){
    showBornes = {
        annotations: {
          line1: {
            type: 'line',
            yMin: infosGraph[0].bornes[1],
            yMax: infosGraph[0].bornes[1],
            borderColor: infosGraph[0].couleur,
            borderWidth: 2,
          },
          line2: {
            type: 'line',
            yMin: infosGraph[1].bornes[1],
            yMax: infosGraph[1].bornes[1],
            borderColor: infosGraph[1].couleur,
            borderWidth: 2,
            yScaleID: 'bis',
          }
        }
    }
  }else if(infosGraph[0].openAutreM && infosGraph[0].nbBornes == 2 && infosGraph[1].nbBornes == 1){
    showBornes = {
        annotations: {
          line1: {
            type: 'line',
            yMin: infosGraph[0].bornes[0],
            yMax: infosGraph[0].bornes[0],
            borderColor: infosGraph[0].couleur,
            borderWidth: 2,
          },
          line2: {
            type: 'line',
            yMin: infosGraph[0].bornes[1],
            yMax: infosGraph[0].bornes[1],
            borderColor: infosGraph[0].couleur,
            borderWidth: 2,
          },
          line3: {
            type: 'line',
            yMin: infosGraph[1].bornes[1],
            yMax: infosGraph[1].bornes[1],
            borderColor: infosGraph[1].couleur,
            borderWidth: 2,
            yScaleID: 'bis',
          }
        }
    }
  }else if(infosGraph[0].openAutreM && infosGraph[0].nbBornes == 1 && infosGraph[1].nbBornes == 2){
    showBornes = {
        annotations: {
          line1: {
            type: 'line',
            yMin: infosGraph[1].bornes[0],
            yMax: infosGraph[1].bornes[0],
            borderColor: infosGraph[1].couleur,
            borderWidth: 2,
            yScaleID: 'bis',
          },
          line2: {
            type: 'line',
            yMin: infosGraph[1].bornes[1],
            yMax: infosGraph[1].bornes[1],
            borderColor: infosGraph[1].couleur,
            borderWidth: 2,
            yScaleID: 'bis',
          },
          line3: {
            type: 'line',
            yMin: infosGraph[0].bornes[1],
            yMax: infosGraph[0].bornes[1],
            borderColor: infosGraph[0].couleur,
            borderWidth: 2,
          }
        }
    }
  }else if(infosGraph[0].openAutreM && infosGraph[0].nbBornes == 2 && infosGraph[1].nbBornes == 2){
    showBornes = {
        annotations: {
          line1: {
            type: 'line',
            yMin: infosGraph[0].bornes[0],
            yMax: infosGraph[0].bornes[0],
            borderColor: infosGraph[0].couleur,
            borderWidth: 2,
          },
          line2: {
            type: 'line',
            yMin: infosGraph[0].bornes[1],
            yMax: infosGraph[0].bornes[1],
            borderColor: infosGraph[0].couleur,
            borderWidth: 2,
          },
          line3: {
            type: 'line',
            yMin: infosGraph[1].bornes[0],
            yMax: infosGraph[1].bornes[0],
            borderColor: infosGraph[1].couleur,
            borderWidth: 2,
            yScaleID: 'bis',
          },
          line4: {
            type: 'line',
            yMin: infosGraph[1].bornes[1],
            yMax: infosGraph[1].bornes[1],
            borderColor: infosGraph[1].couleur,
            borderWidth: 2,
            yScaleID: 'bis',
          }
        }
    }
  }else{
    showBornes = {}
  }
  const options = {
    elements:{
      point:{
        radius:1,
      },
      line:{
        borderWidth: 1
      }
    },
    plugins: {
      annotation: showBornes,
      datalabels:{
        display: false,
      },  
      legend:{
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
      }           
    },
    scales:{
      x:{   
        grid:{
          display:false,
        },
        type: 'timeseries',
        time: {
          displayFormats:{
            day: 'ddd HH:mm',
            hour: 'ddd HH:mm',
            minute: 'ddd HH:mm',
          },
        },
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
          callback: function(value, index, values) {
            if(index==0)
              return translateDays(value.slice(0,3), lg) + ' ' + value.slice(4) 
            else{
              const d = new Date(values[index-1].value)
              if(String(d).slice(0,3) != value.slice(0,3) ){
                return translateDays(value.slice(0,3), lg) + ' ' + value.slice(4)
              }
              else
                return value.slice(4); 
            } 
          },
        }
      },
      y:{
        grid:{
          display:false
        },
        ticks:{
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
        },
        position: 'left',
        title:{
          display: infosGraph[0].openAutreM ? true : false,
          text: infosGraph[0].mesures,
          color: isDark ? 'rgba(250,250,250,0.9)' : 'grey',
        }
      },
      bis: axeBis,
    }
  }

  function calculConformite(inf,sup,graph){
    let i = 0
    data[graph].valeurs.forEach(v =>{// seulement 1 borne supérieure
      if(inf == null){
        if(v<sup){
          i++
        }
      }else if (sup == null){ // seulement 1 borne inférieure
        if(v>inf){
          i++
        }
      }else{// 2 bornes
        if(v<sup && v>inf){
          i++
        }
      }
    })
    return i
  }
  const conformite = {
    labels: [1],
    datasets: [{
      barThickness: 30,
      fill: true,
      data: [pourcentage],
      backgroundColor: isDark? DARK_THEME.palette.primary.main : LIGHT_THEME.palette.primary.main,
      },{
      barThickness: 30,
      fill: true,
      data:[100],
      backgroundColor: isDark?'#bcaaa4':'rgba(0,150,136,0.2)',
    },],
  }
  const conformite2 = {
    labels: [1],
    datasets: [{
      barThickness: 30,
      fill: true,
      data: [pourcentage2],
      backgroundColor: isDark? DARK_THEME.palette.primary.main : LIGHT_THEME.palette.primary.main,
      },{
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
        display: false,
        stacked: true,
      },
      y: {
        max:100,
        stacked: true,
        display: false          
      }
    }
  }

  function avg(arr) {
    var sum = 0;
    arr.filter(x => x)
    arr.forEach(function (item, idx) {
        sum += parseInt(item);
    });
    return Number.parseFloat(sum/arr.length).toFixed(1);
  }

  const moyenne = avg(data[0].valeurs)
  var moyenne2 = 0
  if(infosGraph[0].openAutreM && infosGraph[1].moyenne){
    moyenne2 = avg(data[1].valeurs)
  }

  function calculMediane(valeurs){
    valeurs.filter(x => x)
    const m = Math.floor(valeurs.length / 2)
    const nums = valeurs.sort((a, b) => a - b);
    if(valeurs.length % 2 !== 0){
      return (Number.parseFloat(nums[m-1]) + Number.parseFloat(nums[m])/2)
    }else{
      return Number.parseFloat(nums[m])
    }
  }

  var mediane = 0
  if(infosGraph[0].mediane){
    mediane = calculMediane(plage) 
  }
    
  var mediane2 = 0

  if(infosGraph[0].openAutreM && infosGraph[1].mediane){
    mediane2 = calculMediane(plage2)
  }

  const download = (event) => {
    const imageLink = document.createElement('a');
    const canvas = document.getElementById('graph');
    imageLink.download = 'newChart-'+ dataPatient.infos[4] +'.png';
    imageLink.href = canvas.toDataURL('image/png',1)
    imageLink.click();
  };
    
  return(
    <div style={styles}>      
      <Grid container spacing={2} >
                                                    {/*DEMOGRAPHIE */}
          <Grid item xs={2} sm={2} md={2}>
            <Demographie lg={lg} infos={dataPatient.infos} hypoxemie={dataPatient.hypoxemie} chambre={dataPatient.chambre}/>
          </Grid>
                                                    {/*Page */}
          <Grid item xs={10} sm={10} md={10} container spacing={1} >
                                                    {/*Menu et tire */}
            <Grid item xs={12} sm={12} md={12}>
                <Menu fenetre={fenetre} setFenetre={setFenetre} lg={lg} state={dataPatient}/>
            </Grid>
            {(data[0].valeurs.length == 0) || (infosGraph[0].openAutreM && data[0].valeurs.length == 0 && data[1].valeurs.length == 0) ?
              <Grid item xs={12} sm={12} md={12}>
                <Typography variant='h4' style={styles.titre}>{infosGraph[0].titre}</Typography>
                <Item>
                  <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                </Item>
              </Grid>
              :
            <Grid item xs={12} sm={12} md={12} container spacing={1} justifyContent='center' alignItems="center">
                
                                                        {/*GRAPH */}
              <Grid id="graph" item xs={9} sm={9} md={9} spacing={1} container justifyContent='center' alignItems="center">
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="h4" style={styles.titre}>{infosGraph[0].titre}</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Item>
                    {(infosGraph[0].type == 'line' || infosGraph[0].type == 'area')?
                      <Line id='graph' options={options} data={graph}/> :
                      infosGraph[0].type == 'bar'?
                      <Bar id='graph' options={options} data={graph}/> :
                      infosGraph[0].type == 'bubble'?
                      <Bubble id='graph' options={options} data={graph}/> :
                      infosGraph[0].type == 'scatter'?
                      <Scatter id='graph' options={options} data={graph}/> :
                      <Typography variant='h1'>N/A</Typography>
                    }
                  </Item>
                  <Grid item xs={12} sm={12} md={12} container justifyContent="flex-end">
                  <Grid item xs={12} sm={12} md={12}><br/></Grid>
                    <Button onClick={download}>Save chart<DownloadIcon/></Button>
                  </Grid>
                </Grid>
              </Grid>
                                                        {/*LEGENDE */}
              <Grid container item xs={3} sm={3} md={3} justifyContent='center' alignItems="center">
              <Grid style={{textAlign:"center"}} item xs={12} sm={12} md={12} container justifyContent='center' alignItems="center" >
                {infosGraph[0].openAutreM && infosGraph[0].nbBornes != 0 && infosGraph[1].nbBornes != 0 ?
                <br/>
                :
                <Grid item xs={8} sm={8} md={8} >
                  <Item >
                      {infosGraph.map((graph, i) =>{
                        return(
                          <List style={{textAlign:'center'}}>  
                            <ListItem key={i}>
                              <ListItemAvatar>
                                <Chip key={i} sx={{ bgcolor: graph.couleur, width: 30, height: 4,}}/>
                              </ListItemAvatar>
                              <Typography variant="h6" style={{margin:'2px 5px 1px 5px'}}>{(graph.mesures).toUpperCase()}</Typography>
                            </ListItem>
                          </List>
                        )
                      })} 
                    </Item>
                  </Grid>
              }
                  <Grid item xs={12} sm={12} md={12}><br/></Grid> 
                  
                {infosGraph[0].openAutreM && infosGraph[0].moyenne && infosGraph[1].moyenne ? //Moyenne
                  <Item style={{textAlign:"center"}}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{marginBottom:'2px'}}>{creerGraphText.moyenne[lg]}s</Typography></Grid>
                      <Grid item xs={6} sm={6} md={6} container flexDirection='row'>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h6" style={{color: infosGraph[0].couleur}}>{(infosGraph[0].mesures).toUpperCase()}</Typography></Grid>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color:infosGraph[0].couleur, fontSize:'50px'}}><strong>{moyenne}</strong></Typography></Grid>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} container flexDirection='row'>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h6" style={{color: infosGraph[1].couleur}}>{(infosGraph[1].mesures).toUpperCase()}</Typography></Grid>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color:infosGraph[1].couleur, fontSize:'50px'}}><strong>{moyenne2}</strong></Typography></Grid>
                      </Grid>
                    </Grid>
                  </Item>
                  :
                  (infosGraph[0].openAutreM && infosGraph[1].moyenne ?
                    <Item style={{textAlign:"center"}}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h5">{creerGraphText.moyenne[lg]} {(infosGraph[1].mesures).toUpperCase()}</Typography></Grid>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color:infosGraph[1].couleur, fontSize:'50px'}}><strong>{moyenne2}</strong></Typography></Grid>
                      </Grid>
                    </Item>
                    :
                    (infosGraph[0].moyenne ?
                      <Item style={{textAlign:"center"}}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={12} md={12}><Typography variant="h5">{creerGraphText.moyenne[lg]} {(infosGraph[0].mesures).toUpperCase()}</Typography></Grid>
                          <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color:infosGraph[0].couleur, fontSize:'50px'}}><strong>{moyenne}</strong></Typography></Grid>
                        </Grid>
                      </Item>
                    :
                    (<Grid><br/></Grid>)
                    )
                  )  
                
                } 
                
                <Grid item xs={12} sm={12} md={12}><br/></Grid>
                {infosGraph[0].openAutreM && infosGraph[0].mediane && infosGraph[1].mediane ? //Medianne
                <Item style={{textAlign:"center"}}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{marginBottom:'2px'}}>{creerGraphText.mediane[lg]}s</Typography></Grid>
                    <Grid item xs={6} sm={6} md={6} container flexDirection='row'>
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h6" style={{color: infosGraph[0].couleur}}>{(infosGraph[0].mesures).toUpperCase()}</Typography></Grid>
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color: infosGraph[0].couleur, fontSize:'50px'}}><strong>{mediane}</strong></Typography></Grid>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} container flexDirection='row'>
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h6" style={{color: infosGraph[1].couleur}}>{(infosGraph[1].mesures).toUpperCase()}</Typography></Grid>
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color: infosGraph[1].couleur, fontSize:'50px'}}><strong>{mediane2}</strong></Typography></Grid>
                    </Grid>
                  </Grid>
                  </Item>
                  :
                  (infosGraph[0].openAutreM && infosGraph[1].mediane ?
                    <Item style={{textAlign:"center"}}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h5">{creerGraphText.mediane[lg]} {(infosGraph[1].mesures).toUpperCase()}</Typography></Grid>
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color:infosGraph[1].couleur, fontSize:'50px'}}><strong>{mediane2}</strong></Typography></Grid>
                    </Grid>
                    </Item>
                    :
                    (infosGraph[0].mediane ?
                      <Item style={{textAlign:"center"}}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h5">{creerGraphText.mediane[lg]} {(infosGraph[0].mesures).toUpperCase()}</Typography></Grid>
                        <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{color:infosGraph[0].couleur, fontSize:'50px'}}><strong>{mediane}</strong></Typography></Grid>
                      </Grid>
                    </Item>
                    :
                    (<Grid><br/></Grid>)
                    )
                  )  
                } 
                <Grid item xs={12} sm={12} md={12}><br/></Grid>
                {infosGraph[0].openAutreM && infosGraph[0].nbBornes != 0 && infosGraph[1].nbBornes != 0  ?
                    <Item>
                      <Grid container spacing={1}> 
                      <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{marginBottom:'2px'}}>{phText.conformite[lg]}</Typography></Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <Typography style={{marginBottom:'3px'}}><strong>{pourcentage}%</strong></Typography>
                            <Bar data={conformite} options={optionsC}></Bar>
                            <Typography style={{marginBottom:'3px', color:infosGraph[0].couleur}}><strong>{(infosGraph[0].mesures).toUpperCase()}</strong></Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <Typography style={{marginBottom:'3px'}}><strong>{pourcentage2}%</strong></Typography>
                            <Bar data={conformite2} options={optionsC}></Bar>
                            <Typography style={{marginBottom:'3px', color:infosGraph[1].couleur}}><strong>{(infosGraph[1].mesures).toUpperCase()}</strong></Typography>
                        </Grid>
                      </Grid>
                    </Item>
                  :
                  (infosGraph[0].openAutreM && infosGraph[1].nbBornes != 0  ?
                      <Item >
                        <Grid container spacing={1} alignItems='center' justifyContent='center'>
                          <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{marginBottom:'2px'}}>{phText.conformite[lg]}</Typography></Grid>
                          <Grid item xs={6} sm={6} md={6}>
                              <Typography style={{marginBottom:'3px'}}><strong>{pourcentage2}%</strong></Typography>
                              <Bar data={conformite} options={optionsC}></Bar>
                              <Typography style={{marginBottom:'3px', color:infosGraph[1].couleur}}><strong>{(infosGraph[1].mesures).toUpperCase()}</strong></Typography>
                          </Grid>
                        </Grid>
                      </Item>
                  :(infosGraph[0].nbBornes != 0 ?
                      <Item>
                        <Grid container spacing={1} alignItems='center' justifyContent='center'>
                          <Grid item xs={12} sm={12} md={12}><Typography variant="h5" style={{marginBottom:'2px'}}>{phText.conformite[lg]}</Typography></Grid>
                          <Grid item xs={6} sm={6} md={6}>
                              <Typography style={{marginBottom:'3px'}}><strong>{pourcentage}%</strong></Typography>
                              <Bar data={conformite} options={optionsC}></Bar>
                              <Typography style={{marginBottom:'3px', color:infosGraph[0].couleur}}><strong>{(infosGraph[0].mesures).toUpperCase()}</strong></Typography>
                          </Grid>
                        </Grid>
                      </Item>
                    :
                    <br/>
                    ))}
                </Grid>

            </Grid>

          </Grid>}
        </Grid>
      </Grid>
    </div>
  );
}