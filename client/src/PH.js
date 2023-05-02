import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale } from 'chart.js';
import { Chip, List, ListItem, ListItemAvatar, Typography, Button, CircularProgress } from "@mui/material";
import Menu from './Menu'
import Demographie from "./Demographie";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import Slider from '@mui/material/Slider';
import { demographieText, phText, planText } from './Text';
import DownloadIcon from '@mui/icons-material/Download';
import { calculConformite, displayPH, translateDays, translateMonths } from "./Functions";
import axios from "axios";
Chart.register(...registerables);
Chart.register(CategoryScale);

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
    const [data, setData]= useState([[],[],[]]) 
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
    const page = 'pH'
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
      let art = []
      let vei = []
      let cap = []
      let horodates = []
      mesure.map((h, i)=>{
        horodates.push(h[4])
        if(h[2]=='pH_ART'){
          art.push(h[3])
          vei.push(NaN)
          cap.push(NaN)
        }
        if(h[2]=='pH_VEI'){
          art.push(NaN)
          vei.push(h[3])
          cap.push(NaN)
        }else{
          art.push(NaN)
          vei.push(NaN)
          cap.push(h[3])
        }
      });
      return [horodates, art, vei, cap]
    } 
    
    //BORNES
  const borneSUP =  (dataPatient.hypoxemie.slice(-1)[0] === 0 ? 7.45 : 7.3);
  const borneINF = (dataPatient.hypoxemie.slice(-1)[0] === 0 ? 7.3 : 7.2);
  const ligne1 = Array(data[0].length).fill(borneINF);
  const ligne2 = Array(data[0].length).fill(borneSUP);
    const graph = {
      labels: data[0],
      datasets: [
        {
          label: "pH artériel",
          data: data[1],
          borderColor:isDark?'#00e676':'#2e7d32',
          pointBackgroundColor: isDark?'#00e676':'#2e7d32',
          /* tooltip:{
            callbacks:{
              afterBody: function(dataIndex){
                console.log(dataIndex)
                if(tabHyp[dataIndex] == 0){
                  return 'Hypoxémie faible/modéré'
                }else{
                  return 'Hypoxémie sévère'
                }
              }
            }
          }    */  
        },
        {
          label: "pH veineux",
          data: data[2],
          borderColor:isDark? '#0091ea':'#039be5',
          pointBackgroundColor: isDark?'#0091ea':'#039be5',
          /* tooltip:{
            callbacks:{
              afterBody: function(dataIndex){
                console.log(dataIndex)
                if(tabHyp[dataIndex] == 0){
                  return 'Hypoxémie faible/modéré'
                }else{
                  return 'Hypoxémie sévère'
                }
              }
            }
          }   */ 
        },
        {
          label: "pH capillaire",
          data: data[3],
          borderColor:isDark?'#DE3163':'#DE3163',
          pointBackgroundColor: isDark?'#DE3163':'#DE3163',
          /* tooltip:{
            callbacks:{
              afterBody: function(dataIndex){
                console.log(dataIndex)
                if(tabHyp[dataIndex] == 0){
                  return 'Hypoxémie faible/modéré'
                }else{
                  return 'Hypoxémie sévère'
                }
              }
            }
          }    */
        },
        {
          data: ligne1,
          borderColor:'rgb(233, 86, 86)',
          fill:false,
          pointBackgroundColor: 'rgba(0,0,0,0)',
          pointRadius: 0,
        },
        {
          data: ligne2,
          borderColor:'rgb(233, 86, 86)',
          fill:'-1',
          backgroundColor: 'rgba(66, 215, 165,0.4)',
          pointBackgroundColor: 'rgba(0,0,0,0)',
          pointRadius: 0,
        }
      ],
    }
  
    const options = {
      elements:{
        point:{
          radius:2,
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
          grid:{
            display:false
          },
          ticks:{
            color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
          }
        }
      }
    }

    const pourcentage = calculConformite(data[1].concat(data[2]).concat(data[3]), borneINF, borneSUP) 
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
      var i = 0
      arr.filter(x => x)
      arr.forEach(function (item, idx) {
        if(!isNaN(item)){
          sum += Number.parseFloat(item);
          i++
        }
      });
      return Number.parseFloat(sum/i).toFixed(2);
    }
    
    const moyenne = avg(data[1].concat(data[2]).concat(data[3]))

    const download = (event) => {
      const imageLink = document.createElement('a');
      const canvas = document.getElementById('graph');
      imageLink.download = 'chart'+ dataPatient.pH.art[0].nom +'-'+ dataPatient.infos[4] +'.png';
      imageLink.href = canvas.toDataURL('image/png',1)
      imageLink.click();
    };
    
    return(
      <div style={styles}>      
        <Grid container spacing={2} >
                                                      {/*DEMOGRAPHIE */}
            <Grid item xs={2} sm={2} md={2}>
              <Demographie lg={lg} infos={dataPatient.infos} hypoxemie={[0,1]} chambre={dataPatient.chambre}/>
            </Grid>
                                                      {/*Page */}
            <Grid item xs={10} sm={10} md={10} container spacing={1} >
                                                      {/*Menu et tire */}
              <Grid item xs={12} sm={12} md={12}>
                  <Menu fenetre={fenetre} setFenetre={setFenetre} lg={lg} state={dataPatient}/>
              </Grid> 
                                                        {/*GRAPH */}
              {data[0].length == 0 ?
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant='h4' style={styles.titre}>{phText.titre[lg]}</Typography>
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
                    <Typography variant="h4" style={styles.titre}>{phText.titre[lg]}</Typography>
                    <Item>
                      <Line id="graph" options={options} data={graph}/>
                    </Item>
                      <Grid item xs={12} sm={12} md={12} container justifyContent="flex-end">
                      <Grid item xs={12} sm={12} md={12}><br/></Grid>
                        <Button onClick={download}>Save chart<DownloadIcon/></Button>
                      </Grid>
                  </Grid>
                                                            {/*LEGENDE */}
                <Grid container item xs={3} sm={3} md={3} justifyContent='center' alignItems="center">
                <Grid style={{textAlign:"center"}} item xs={12} sm={12} md={12} >
                  <Item style={{textAlign:'center'}}>
                    <Grid style={styles.legende} item xs={12} sm={12} md={12} >
                    <List >
                      <ListItem>
                        <ListItemAvatar>
                          <Chip sx={{ bgcolor: isDark?'#00e676':'#2e7d32', width: 30, height: 4,}}/>
                        </ListItemAvatar>
                        <Typography style={{margin:'2px 5px 1px 5px'}}>{phText.art[lg]}</Typography>
                      </ListItem>

                      <ListItem>
                        <ListItemAvatar>
                        <Chip sx={{ bgcolor: isDark? '#0091ea':'#039be5', width: 30, height: 4,}}/> 
                        </ListItemAvatar>
                        <Typography style={{margin:'2px 5px 1px 5px'}}>{phText.vei[lg]}</Typography>
                      </ListItem>

                      <ListItem>
                        <ListItemAvatar>
                        <Chip sx={{ bgcolor: isDark?'#DE3163':'#DE3163', width: 30, height: 4,}}/>
                        </ListItemAvatar>
                        <Typography style={{margin:'2px 5px 1px 5px'}}>{phText.cap[lg]}</Typography>
                      </ListItem>
                    </List>
                  </Grid>
                  </Item>
                  <Grid><br/></Grid>
                  <Grid style={{textAlign:"center"}} item xs={12} sm={12} md={12} >
                    <Item style={{textAlign:"center"}}>
                      <Typography variant="h5" style={{marginBottom:'3px'}}>{phText.moyen[lg]}</Typography>
                      <Typography variant="h5" style={{marginTop:'2px', color:isDark?'#00e676':'#2e7d32', fontSize:'50px'}}><strong>{moyenne}</strong></Typography>
                      </Item>
                      <Grid><br/></Grid>
                      <Item >
                          <Typography>{phText.conformite[lg].toUpperCase()}</Typography>
                          <Typography style={{marginBottom:'3px'}}><strong>{pourcentage}%</strong></Typography>
                          <Bar data={conformite} options={optionsC}></Bar>
                          <br/>
                      </Item>
                  </Grid>
                </Grid>
                </Grid>

              </Grid>}
            </Grid>

        </Grid>
      </div>
    );
  }