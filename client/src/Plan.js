import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale } from 'chart.js';
import { Link } from "react-router-dom";
import Menu from './Menu'
import Demographie from "./Demographie";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import { calculConformite, displayDatesRange, displayPF, displayPH, displayPressions, translateDays} from "./Functions";
import { LinearProgress, CircularProgress, Typography} from "@mui/material";
import { bilanText, eoiText, epfText, planText, fioText, pmoyText, spoText, vtText } from "./Text";
import axios from "axios";

Chart.register(...registerables);
Chart.register(CategoryScale);

const useStyles = (isDark) =>( {
    titre:{
      textAlign:'center', 
      padding:'0px', 
      marginBottom:'5px', 
      marginTop:'0px',
      borderStyle: 'solid',
      backgroundImage: isDark ?  'linear-gradient(to right,'+ DARK_THEME.palette.secondary.main +',#546E7A)': 'linear-gradient(to right,'+ LIGHT_THEME.palette.secondary.main + ', rgb(255, 255, 255))',
      borderColor: isDark ? 'rgba(250,250,250,0.3) rgba(250,250,250,0.3) rgba(250,250,250,0.3)' + DARK_THEME.palette.secondary.main : 'white white white' + LIGHT_THEME.palette.secondary.main,
      borderLeftStyle: 'solid',
    },
    bigGrid: {
      gridAutoRows: '1fr',
    }, 
});

export default ({lg, setFenetre, fenetre, dataPatient}) => {
  
  const date = new Date() 
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const styles = useStyles(isDark)
  const Item = styled(Paper)(() => ({
    backgroundColor: isDark ? DARK_THEME.palette.secondary.main : LIGHT_THEME.palette.secondary.main,
    padding: '5px 5px 10px 5px',
    marginBottom: '3px',
    height: '90%',
    borderStyle: 'solid',
    borderWidth: '5px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
  }));
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
  const [displayEOI, setDisplayEOI]= useState({horaires:[], valeurs:[]})
  const [displayPF_, setDisplayPF_]= useState({horaires:[], valeurs:[]})
  const [displayFiO2, setDisplayFiO2]= useState({horaires:[], valeurs:[]})
  const [displayMAwP, setDisplayMAwP]= useState([[],[],[],[]])
  const [displaySpO2, setDisplaySpO2]= useState({horaires:[], valeurs:[]})
  const [displayPH_, setDisplayPH_]= useState([[],[],[],[]])
  const [displayVT, setDisplayVT]= useState({horaires:[], valeurs:[]})
  const [displayBilan, setDisplayBilan]= useState({horaires:[], valeurs:[]})
  //const [displayPoids, setDisplayPoids]= useState({horaires:[], valeurs:[]})  

  const fetchValues = async () =>{
    let loadeOI = await axios.get(`${baseURL}/pages/eOI/${dataPatient.infos[0]}/${endDate}`)
    setDisplayEOI(displayDatesRange(loadeOI.data, true))

    let loadePaO2 = await axios.get(`${baseURL}/pages/ePaO2/${dataPatient.infos[0]}/${endDate}`)
    let loadFiO2 = await axios.get(`${baseURL}/pages/FiO2/${dataPatient.infos[0]}/${endDate}`)
    setDisplayPF_(displayPF(loadePaO2.data, loadFiO2.data))
    setDisplayFiO2(displayDatesRange(loadFiO2.data, false))
  
    let loadMAwP = await axios.get(`${baseURL}/pages/Pressions/${dataPatient.infos[0]}/${endDate}`)
    setDisplayMAwP(displayPressions(loadMAwP.data))
    
    let loadSpO2 = await axios.get(`${baseURL}/pages/SpO2/${dataPatient.infos[0]}/${endDate}`)
    setDisplaySpO2(displayDatesRange(loadSpO2.data, false))
    
    let loadPH = await axios.get(`${baseURL}/pages/pH/${dataPatient.infos[0]}/${endDate}`)
    setDisplayPH_(displayPH(loadPH.data))
    
    let loadVt = await axios.get(`${baseURL}/pages/Vt/${dataPatient.infos[0]}/${endDate}`)
    setDisplayVT(displayDatesRange(loadVt.data, false))
    
    let loadBilan = await axios.get(`${baseURL}/pages/Bilan/${dataPatient.infos[0]}/${endDate}`)
    setDisplayBilan(displayDatesRange(loadBilan.data, true))
    
    setDoneFetching(true)

    /* let loadPoids = await axios.get(`${baseURL}/pages/Poids/${dataPatient.infos[0]}/${endDate}`)
    setDisplayPoids(displayDatesRange(loadPoids.data, false)) */
  }
  useEffect(()=>{
    fetchValues()
  },[])

  const hyp = dataPatient.hypoxemie.slice(-1)[3]
  var conformiteEOI = displayEOI.valeurs.length == 0 ? 100 : calculConformite(displayEOI.valeurs, null, 6)
  var conformitePF = displayPF_.valeurs.length == 0 ? 100 : calculConformite(displayPF_.valeurs, 10, null)
  var conformiteSpO2 = displaySpO2.valeurs.length == 0 ? 100 : calculConformite(displaySpO2.valeurs, hyp == 0 ? 92:88, 97)
  var conformitePH = displayPH_[0].length == 0 ? 100 : calculConformite(displayPH_[1].concat(displayPH_[2]).concat(displayPH_[3]), hyp == 0 ? 7.3:7.2, hyp == 0 ? 7.45:7.3)
  var conformiteVT = displayVT.valeurs.length == 0 ? 100 : calculConformite(displayVT.valeurs, hyp== 0 ? 6 : 4, hyp== 0 ? 8:6)
  var conformiteBilan = displayBilan.valeurs.length == 0 ? 100 : calculConformite(displayVT.valeurs, null, 0)
  console.log(displayPH_)
   ///CREATION DES GRAPHS

  const optionsLegend = {
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
    },
    scales:{
      y:{
        ticks: {
          color: isDark ? 'rgba(250,250,250,0.9)' : 'black',
        },
        grid: {
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
        }
      },
      x:{      
        type: 'timeseries',
        time: {
          displayFormats:{
            day: 'ddd HH:mm',
            hour: 'ddd HH:mm',
            minute: 'ddd HH:mm',
            second: 'ddd HH:mm'
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
        },
        grid: {
          color: isDark ? 'rgba(250,250,250,0.1)' : 'rgba(50,50,50,0.1)',
        }
      },
    }
  }

  const eOIGraph = {
    labels: displayEOI.horaires,
    datasets: [{
      fill: true,
      label: "eOI",
      data: displayEOI.valeurs,
      borderColor: isDark? '#69f0ae':'#a5d6a7',
      backgroundColor: isDark? '#69f0ae':'#a5d6a7',
    },],
  }
  
  const RatioGraph = {
    labels: displayPF_.horaires,
    datasets: [
      {
      fill: true,
      label: "PaO2/FiO2",
      data: displayPF_.valeurs,
      borderColor: isDark? '#0091ea':'#039be5',
      backgroundColor: isDark? '#0091ea':'#039be5',
    },
    ],
  }
    
  const SaturationGraph = {
      labels: displaySpO2.horaires,
      datasets: [{
        fill: true,
        label: "SpO2",
        data: displaySpO2.valeurs,
        borderColor:isDark? '#ff3d00':'#ff7043',
        backgroundColor: isDark? '#ff6e40':'#ff8a65',        
      },],
    }

  const MawPGraph = {
    labels: displayMAwP[0],
    datasets: [{
      data: displayMAwP[1],
      label: 'MAwP',
      borderColor:isDark? '#ff5252':'#ef9a9a',
      },{
        data: displayMAwP[2],
        label: 'PEEP',
        borderColor:isDark? '#536dfe':'#3f51b5',
      }],
    }
  const OxygeneGraph = {
    labels: displayFiO2.horaires,
    datasets: [{
      label: fioText.titre[lg],
      data: displayFiO2.valeurs,
      borderColor:isDark?'#0091ea':'#01579b',
    },],
  }
  const VolCourGraph = {
    labels: displayVT.horaires,
    datasets: [{
      fill: true,
      label: vtText.titre[lg],
      data:  displayVT.valeurs,
      borderColor:'#ff784e',
      backgroundColor:'#ff784e',
    },],
  }
  
  const pHGraph = {
    labels: displayPH_[0],
    datasets: [{
      label: "pH artériel",
      data: displayPH_[1],
      borderColor:isDark?'#00c853':'#2e7d32',
    },
    {
      label: "pH veineux",
      data: displayPH_[2],
      borderColor:isDark? '#0091ea':'#039be5',
    },
    {
      label: "pH capillaire",
      data: displayPH_[3],
      borderColor:isDark?'#DE3163':'#DE3163',
    }],
  }
  
  const BilanGraph = {
    labels: displayBilan.horaires,
    datasets: [{
      fill: {
        target: {value: 0},
        above: isDark? '#ff8a80':'#ef9a9a',   
        below: isDark? '#82B1FF':'#BBDEFB'  
      },
      label: bilanText.text1[lg],
      data:displayBilan.valeurs,
      borderColor: 'rgba(245, 245, 245,0.1)'
    },],
  }
  
  return(
    <div style={styles}>      
      <Grid container spacing={2} >
          <Grid item xs={2} sm={2} md={2}>
            <Demographie lg={lg} infos={dataPatient.infos} hypoxemie={dataPatient.hypoxemie} chambre={dataPatient.chambre}/>
          </Grid>
          <Grid item xs={10} sm={10} md={10} container spacing={1} style={styles.bigGrid} >
            
            <Grid item xs={12} sm={12} md={12}>
            <Menu fenetre={fenetre} setFenetre={setFenetre} lg={lg} state={dataPatient}/><br/>
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <Link style={{textDecoration: 'none', color:'black'}} to="/EOI">
                <Item style={{borderColor: conformiteEOI > 50 ? '#80cbc4' : 'rgb(233, 86, 86)'}}>
                  <Typography style={styles.titre} variant='h6'>{eoiText.titre[lg]}</Typography>
                  <div>
                  {displayEOI.valeurs.length == 0 && !doneFetching ?
                    <div style={{marginTop:'15%'}}>
                    <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                    <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                  </div>
                  :
                  displayEOI.valeurs.length == 0 && doneFetching ?
                  <div style={{marginTop:'25%'}}>
                    <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                  </div>
                  :
                    <Line data={eOIGraph} options={optionsLegend} />}
                  </div>
                </Item>
              </Link>
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <Link style={{textDecoration: 'none', color:'black'}} to="/EPF">
                <Item style={{borderColor:conformitePF > 50 ? '#80cbc4' : 'rgb(233, 86, 86)'}}>
                  <Typography style={styles.titre} variant='h6'>{epfText.PF[lg]}</Typography>
                  <div>
                  {displayPF_.valeurs.length == 0 && !doneFetching ?
                    <div style={{marginTop:'15%'}}>
                    <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                    <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                  </div>
                  :
                  displayPF_.valeurs.length == 0 && doneFetching ?
                  <div style={{marginTop:'25%'}}>
                    <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                  </div>
                  :
                    <Line options={optionsLegend} data={RatioGraph} />}
                </div>
                </Item>
              </Link>  
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <Link style={{textDecoration: 'none', color:'black'}} to="/SPO">
                <Item style={{borderColor:conformiteSpO2 > 50 ? '#80cbc4' : 'rgb(233, 86, 86)'}}>
                <Typography style={styles.titre} variant='h6'>{spoText.titre[lg]}</Typography>
                <div>
                {displaySpO2.valeurs.length == 0 && !doneFetching ?
                  <div style={{marginTop:'15%'}}>
                  <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                  <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                </div>
                :
                displaySpO2.valeurs.length == 0 && doneFetching ?
                <div style={{marginTop:'25%'}}>
                <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
              </div>
              :
                    <Line data={SaturationGraph} options={optionsLegend}/>} 
                </div>
                </Item>
              </Link>
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <Link style={{textDecoration: 'none', color:'black'}} to="/PMOY">
                <Item style={{borderColor:'#80cbc4'}}>
                <Typography style={styles.titre} variant='subtitle1'>{pmoyText.text2[lg]}</Typography>
                <div>
                {displayMAwP[0].length == 0 && !doneFetching ?
                  <div style={{marginTop:'15%'}}>
                  <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                  <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                </div>
                :
                 displayMAwP[0].length == 0 && doneFetching ?
                 <div style={{marginTop:'25%'}}>
                    <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                </div>
               :
                    <Line data={MawPGraph} options={optionsLegend}/>}
                </div>
                </Item>
              </Link>
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <Link style={{textDecoration: 'none', color:'black'}} to="/FIO">
                <Item style={{borderColor:'#80cbc4'}}>
                <Typography style={styles.titre} variant='h6'>{fioText.titre[lg]}</Typography>
                <div>
                {displayFiO2.valeurs.length == 0 && !doneFetching ?
                  <div style={{marginTop:'15%'}}>
                  <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                  <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                </div>
                :
                  displayFiO2.valeurs.length == 0 && doneFetching ?
                  <div style={{marginTop:'25%'}}>
                    <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                  </div>
                  :
                    <Line data={OxygeneGraph} options={optionsLegend}/>}
                </div>
                </Item>
              </Link>
            </Grid>   
            <Grid item xs={3} sm={3} md={3}>
              <Link style={{textDecoration: 'none', color:'black'}} to="/VT">
                <Item style={{borderColor: conformiteVT > 50 ? '#80cbc4' : 'rgb(233, 86, 86)'}}>
                  <Typography style={styles.titre} variant='h6'>{vtText.titre[lg]}</Typography>
                  <div >
                  {displayVT.valeurs.length == 0 && !doneFetching ?
                    <div style={{marginTop:'15%'}}>
                      <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                      <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                    </div>
                  :
                  displayVT.valeurs.length == 0 && doneFetching ?
                  <div style={{marginTop:'25%'}}>
                    <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                  </div>
                  :
                    <Line data={VolCourGraph} options={optionsLegend}/>}
                  </div>
                </Item>
              </Link>
            </Grid> 
            <Grid item xs={3} sm={3} md={3}>
              <Link style={{textDecoration: 'none', color:'black'}} to="/PH">
                <Item style={{borderColor: conformitePH > 50 ? '#80cbc4' : 'rgb(233, 86, 86)'}}>
                  <Typography style={styles.titre} variant='h6'>pH</Typography>
                  <div>
                  {displayPH_[0].length == 0 && !doneFetching ?
                    <div style={{marginTop:'15%'}}>
                      <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                      <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                    </div>
                  :
                  displayPH_[0].length == 0 && doneFetching ?
                  <div style={{marginTop:'25%'}}>
                    <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                  </div>
                  :
                    <Line data={pHGraph} options={optionsLegend} />}
                  </div>
                </Item>
              </Link>
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <Link style={{textDecoration: 'none', color:'black'}} to="/Bilan">
                <Item style={{borderColor:conformiteBilan > 50 ? '#80cbc4' : 'rgb(233, 86, 86)'}}>
                  <Typography style={styles.titre} variant='h6'>{bilanText.titre[lg]}</Typography>
                  <div>
                  {displayBilan.valeurs.length == 0 && !doneFetching ?
                    <div style={{marginTop:'15%'}}>
                      <Typography style={{textAlign: 'center'}}>{planText.chargement[lg]} </Typography>
                      <div style={{textAlign: 'center'}}><CircularProgress color="primary"/></div>
                    </div>                  
                  :
                  displayBilan.valeurs.length == 0 && doneFetching ?
                  <div style={{marginTop:'25%'}}>
                    <Typography style={{textAlign: 'center'}}> {planText.erreur[lg]} </Typography>
                  </div>
                  :
                    <Line data={BilanGraph} options={optionsLegend}/>}
                  </div>
                </Item>
              </Link>
            </Grid>
            {/* <Grid item xs={1} sm={1} md={1}><div></div></Grid>
            <Grid item xs={9} sm={9} md={9} >
            <Item style={{borderStyle:'none'}}> 
              <Typography style={styles.titre} variant='h6'>{planText.recommandations[lg]}</Typography>
              <Typography>pH {planText.eleve[lg]} <br/>
                eOI {planText.faible[lg]} <br/>
                {planText.reduire[lg]} ... {planText.a[lg]} ...<br/>
                {planText.augmenter[lg]} ... {planText.a[lg]} ...</Typography></Item>
            </Grid> */}
          </Grid>
      </Grid>
    </div>
  );
}