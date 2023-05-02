import React, {useState} from 'react'
import { Button, CssBaseline, Dialog, DialogTitle, Divider, Grid, Input, Select, shouldSkipGeneratingVar, TextField, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import { appText} from './Text';
import BarChartIcon from '@mui/icons-material/BarChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { withStyles } from "@material-ui/core/styles";
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Chip from '@mui/material/Chip';
import { useNavigate } from "react-router-dom";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { creerGraphText, listePages } from './Text';

export let graph = [
  {
    openAutreM : false,
    titre: null,
    mesures:[],
    type:[],
    couleur:[],
    nbBornes: null,
    bornes:[],
    moyenne:false,
    mediane:false,
  }]

export function CreateGraph ({lg, setOpenCreateGraph, setOpenMenu}){
let history = useNavigate()
const mesuresBDD = ['pouls','fc','fio2','mawp','spo2','epao2','eoi', 'pH', 'VT']
const couleurs = ['#009688','#ed4b82','#6573c3','#f44336','#8bc34a','#ff9800','#00bcd4','#af52bf','#ff5722']
const { isDark, toggleTheme } = useContext(ThemeContext);

const [mesures, setMesures] = useState([])
const [type, setType] = useState([])
const [couleur, setCouleur] = useState([])
const [bornes, setBornes] = useState([])
const [moyenne, setMoyenne] = useState(false)
const [mediane, setMediane] = useState(false)
const [openEtatC, setOpenEtatC] = useState(false)
const [openAutreM, setOpenAutreM] = useState(false)
const [nbBornes, setNbBornes] = useState(0)

const addMesure = () =>{
  setOpenAutreM(true)
  setOpenEtatC(false)
  graph = [
    {
      openAutreM: true,
      titre: document.getElementById('titreGraph').value,
      mesures: mesures,
      type: type,
      couleur: couleur,
      nbBornes: nbBornes,
      bornes: nbBornes == 1 ? [bornes, document.getElementById('borne').value] : 
      (nbBornes == 2 ? [document.getElementById('borneInf').value, document.getElementById('borneSup').value] : []),
      moyenne: moyenne,
      mediane: mediane,
    }
  ]
  setMesures(null)
  setType(null)
  setCouleur(null)
  setNbBornes(0)
  setBornes([])
  setMoyenne(false)
  setMediane(false)
}

const Submit = () => {
  if(openAutreM){
    graph.push({
      mesures: mesures,
      type: type,
      couleur: couleur,
      nbBornes: nbBornes,
      bornes: nbBornes == 1 ? [bornes, document.getElementById('borne').value] : 
      (nbBornes == 2 ? [document.getElementById('borneInf').value, document.getElementById('borneSup').value] : []),
      moyenne: moyenne,
      mediane: mediane,
    })
  }else{
    graph = [
        {
          openAutreM: false,
          titre: document.getElementById('titreGraph').value,
          mesures: mesures.toLowerCase(),
          type: type,
          couleur: couleur,
          nbBornes: nbBornes,
          bornes: nbBornes == 1 ? [bornes, document.getElementById('borne').value] : 
          (nbBornes == 2 ? [document.getElementById('borneInf').value, document.getElementById('borneSup').value] : []),
          moyenne: moyenne,
          mediane: mediane,
        }
    ]
  }
    history('/New', {state :{infosGraph:graph}});
    /* listePages.push({
      lien: 'New',
      fr: mesures,
      en: mesures,
      sp: mesures,}) */
    setOpenCreateGraph(false);
  }
const handleChangeBornes = (e) =>{
  setNbBornes(e.target.value)
  if (e.target.value != 0){
    setOpenEtatC(true)
  }else{
    setOpenEtatC(false)
  }
};
const resumeMesure1 =
(<div>
  <Grid container columnSpacing={1}>
    <Grid item xs={2} sm={2} md={2}>
      <Typography>
      { graph[0].type == 'area' ? <StackedLineChartIcon sx={{ color: graph[0].couleur }}/> :
        graph[0].type == 'bar' ? <BarChartIcon sx={{ color: graph[0].couleur }}/> :
        graph[0].type == 'bubble' ? <BubbleChartIcon sx={{ color: graph[0].couleur }}/> :
        graph[0].type == 'scatter' ? <ScatterPlotIcon sx={{ color: graph[0].couleur }}/> :
        <ShowChartIcon sx={{ color: graph[0].couleur }}/>
      }
       {graph[0].mesures}</Typography>
    </Grid>
    <Grid item xs={4} sm={4} md={4}>
      {graph[0].nbBornes == 0 ? <Typography><CloseIcon fontSize='small'/> {creerGraphText.bornes[lg]} </Typography> :
        graph[0].nbBornes == 1 ? <Typography><DoneIcon fontSize='small'/> {creerGraphText.bornes[lg].slice(0,-1)} : {graph[0].bornes[0]} | {graph[0].bornes[1]} </Typography> :
        <Typography><DoneIcon fontSize='small'/> {creerGraphText.bornes[lg]} : {graph[0].bornes[0]} - {graph[0].bornes[1]} </Typography>
      }
    </Grid>
    <Grid item xs={3} sm={3} md={3}>
      {
        graph[0].moyenne ? <Typography><DoneIcon fontSize='small'/>{creerGraphText.moyenne[lg]}</Typography> : <Typography><CloseIcon fontSize='small'/>Moyenne</Typography>
      }
    </Grid>
    <Grid item xs={3} sm={3} md={3}>
      {
        graph[0].mediane ? <Typography><DoneIcon fontSize='small'/>{creerGraphText.mediane[lg]}</Typography> : <Typography><CloseIcon fontSize='small'/>Médiane</Typography>
      }
    </Grid>
  </Grid>
</div>)
const etatCritique = nbBornes == 1 ?
(
  <div>
    <Grid container spacing={1} alignItems='center' justifyContent='flex-start'>
      <Grid item xs={3} sm={3} md={3}>
        <Typography>{creerGraphText.etat[lg]}</Typography>
      </Grid>
      <Grid item xs={5} sm={5} md={5}>
        <Select id="mesure" sx={{width: '100%'}} value={bornes} onChange={e => setBornes(e.target.value)}>
          <MenuItem value='sup'>{creerGraphText.dessus[lg]}</MenuItem>
          <MenuItem value='inf'>{creerGraphText.dessous[lg]}</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={3} sm={3} md={3}>
        <Input type='number' size="small" sx={{width: 70}} placeholder="value" id="borne" required/>   
      </Grid>
    </Grid>
  </div>
) :
(
  <div>
    <Grid container spacing={1} alignItems='center' justifyContent='flex-start'>
      <Grid item xs={7} sm={7} md={7}>
        <Typography>{creerGraphText.etat[lg]} {creerGraphText.dessous[lg]}</Typography>
      </Grid>
      <Grid item xs={3} sm={3} md={3}>
      <Input type='number' size="small" sx={{width: 70}} placeholder="value" id="borneInf" required/>   
      </Grid>
      <Grid item xs={4} sm={4} md={4}>
        <Typography> {creerGraphText.et[lg]} {creerGraphText.dessus[lg]} </Typography>
      </Grid>
      <Grid item xs={3} sm={3} md={3}>
        <Input type='number'  size="small" sx={{width: 70}} placeholder="value" id="borneSup" required/>   
      </Grid>
    </Grid>
  </div>
);

const StyledChip = withStyles({
  root: {
    "&&:active, &&:focus": {
      padding:'18px',
    }
  }
})(Chip);
const contenu =
(<div style={{padding: '10px',}}>
  <Grid container rowSpacing={3} columnSpacing={2} alignItems='center' justifyContent='center'>
    <Grid item xs={6} sm={6} md={6}>
      <FormControl fullWidth>
      <InputLabel>{appText.mesure[lg]}</InputLabel>
      <Select
        id="mesure"
        value={mesures}
        onChange={e => setMesures(e.target.value)}
        label={appText.mesure[lg]}
      >
        {mesuresBDD.map((m, i) =>{
          return(<MenuItem key={i} value={m}>{m[0].toUpperCase()}{m.slice(1)}</MenuItem>)})}
      </Select>
      </FormControl>
    </Grid>
    <Grid item xs={6} sm={6} md={6}> 
      <FormControl fullWidth>
      <InputLabel>{appText.type[lg]}</InputLabel>
        <Select
          id="type"
          label={appText.type[lg]}
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <MenuItem value='line'><ShowChartIcon/> Line </MenuItem>
          <MenuItem value='area'><StackedLineChartIcon/> Area </MenuItem>
          <MenuItem value='bar'><BarChartIcon/> Bar </MenuItem>
          <MenuItem value='bubble'><BubbleChartIcon/> Bubble </MenuItem>
          <MenuItem value='scatter'><ScatterPlotIcon/> Scatter </MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={12} md={12} container spacing={2} justifyContent='center' alignItems='center'>
        <Typography variant='h6' textAlign='center'>{creerGraphText.couleur[lg]}</Typography>
        <Grid item xs={12} sm={12} md={12} container rowSpacing={1} columnSpacing={1}>
        {couleurs.map((c, i) =>{
          return(
            <Grid key={i} item xs={4} sm={4} md={4} container justifyContent='center' alignItems='center'>
              <StyledChip key={i}  onClick={e => setCouleur(c)} sx={{ bgcolor: c, width: 20, height: 20, borderRadius: '50%',}}/>
            </Grid>
          )})}
        </Grid>
    </Grid> 
    <Grid item xs={12} sm={12} md={12} container spacing={1}>
      <Grid item xs={2} sm={2} md={2}>
        <Typography>{creerGraphText.bornes[lg]} :</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2}>
        <RadioGroup name="use-radio-group" defaultValue="0" onChange={handleChangeBornes}>
          <FormControlLabel value="0" label="0" control={<Radio />} />
          <FormControlLabel value="1" label="1" control={<Radio />} />
          <FormControlLabel value="2" label="2" control={<Radio />} />
        </RadioGroup>
      </Grid>
      <Grid item xs={8} sm={8} md={8}>
        <Collapse in={openEtatC} timeout="auto" unmountOnExit>
          {etatCritique}
        </Collapse>
      </Grid>
    </Grid>
    <Grid item xs={12} sm={12} md={12} container justifyContent='center' alignItems='center'>
      <FormControlLabel
        control={
          <Switch checked={moyenne} onChange={e => setMoyenne(e.target.checked)} name="moyenne" />
        }
        label={creerGraphText.calculMoy[lg]} 
       />
    </Grid>
    <Grid item xs={12} sm={12} md={12} container justifyContent='center' alignItems='center'>
      <FormControlLabel
        control={
          <Switch checked={mediane} onChange={e => setMediane(e.target.checked)} name="mediane" />
        }
        label={creerGraphText.calculMed[lg]}
      />
    </Grid>
  </Grid>
</div>);

return(
  <div style={{padding: '10px'}}>
    <Grid container rowSpacing={3} columnSpacing={2} alignItems='center' justifyContent='center'>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant='h6' style={{textAlign:'center'}}>{appText.graph[lg]}</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <TextField sx={{width: '100%'}} variant="filled" placeholder={appText.nom[lg]} id="titreGraph" />
      </Grid>
      {openAutreM ?
      <Grid item xs={12} sm={12} md={12}>
        <Divider>{creerGraphText.mesure1[lg]}</Divider>
        <br/>
        <Grid item xs={12} sm={12} md={12}>{resumeMesure1}</Grid>
        <br/>
        <Divider>{creerGraphText.mesure2[lg]}</Divider>
      </Grid>
      :
      <Grid item xs={12} sm={12} md={12}>      
        <Grid item xs={12} sm={12} md={12}>{contenu}</Grid>
        <Grid item xs={12} sm={12} md={12}><Divider/></Grid>
        <Grid item xs={12} sm={12} md={12}><br/><Button variant="text" onClick={addMesure}><AddIcon/> {creerGraphText.ajouter[lg]}</Button></Grid>   
      </Grid>        
        }
        <Collapse in={openAutreM} timeout="auto" unmountOnExit>
          {contenu}
        </Collapse>
        <Grid item xs={12} sm={12} md={12}><Divider/></Grid>
        <Grid item xs={12} sm={12} md={12} container spacing={3} justifyContent='center' alignItems='center'>
          <Grid item xs={6} sm={6} md={6}>
            <Button variant='outlined' sx={{float:'right'}} onClick={e => setOpenCreateGraph(false)}>
                {creerGraphText.annuler[lg]}
            </Button>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Button variant='contained' onClick={Submit}>
                {appText.creer[lg]}
            </Button>
          </Grid>
        </Grid>
    </Grid>
  </div>
  );}

  

  