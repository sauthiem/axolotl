import React, {useEffect, useState} from 'react'
import Main from './Main'
import Login from './Login'
import Plan from "./Plan";
import EOI from './EOI';
import EPF from './EPF';
import SPO from './SPO';
import PMOY from './PMOY';
import FIO from './FIO';
import VT from './VT';
import PH from './PH';
import Bilan from './Bilan';
import { BrowserRouter as Router, Outlet, Routes, Route, Link, useLocation  } from "react-router-dom";
import { Button, CssBaseline, Dialog, DialogTitle, Divider, Grid, Input, Select, TextField, Typography } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import ThemeContext from './ThemeContext';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import LanguageIcon from '@mui/icons-material/Language';
import AddchartIcon from '@mui/icons-material/Addchart';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Modal from '@material-ui/core/Modal';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { appText, menuText } from './Text';
import Paper from '@mui/material/Paper';
import { CreateGraph } from './CreerGraph';
import NouveauGraph from './NouveauGraph';
import HotelIcon from '@mui/icons-material/Hotel';
import StorageIcon from '@mui/icons-material/Storage';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DialogContent } from '@material-ui/core';
import axios from "axios"

//IMAGES
import fr from "./images/france.png";
import es from "./images/espagne.png";
import en from "./images/anglais.png";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 52,
  height: 24,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? DARK_THEME.palette.primary.main : LIGHT_THEME.palette.primary.main,
    width: 22,
    height: 22,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },}))

  const useStyles = (isDark) =>({
    modal:{
      position: 'absolute',
      top: '6.5%',
      right: '0%',
      left: 'auto',
      bottom: 'auto',
      boxShadow: '24',
      backgroundColor: isDark ? DARK_THEME.palette.background.default : LIGHT_THEME.palette.background.default,
      color: isDark ? DARK_THEME.palette.text.primary : LIGHT_THEME.palette.text.primary
    },
  });
function App(){
  const baseURL = ""
  const [size, setSize] = useState(0)
  const fetchValues = async () =>{
    const loadData = await axios.get(`${baseURL}/DBsize`)
    setSize(Number.parseFloat(loadData.data).toFixed(1))
  }
  useEffect(()=>{
    fetchValues()
  })
  const [openStorage, setOpenStorage] = useState(false);
  const handleOpenStorage = () => {
    setOpenStorage(!openStorage);
  };
  const handleDeletePatientsOut = async () => {
    const deletePO = await axios.get(`${baseURL}/DeleteDischargedPatients`)
  }
  const handleReset = async () => {
    const reset = await axios.get(`${baseURL}/DeleteDB`)
  }
  const [dataPatient, setDataPatient] = useState(null)
  const [token, setToken] = useState(null);
  const [chambre, setChambre] = useState(null);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [lg, setLg] = useState('en')
  const [fenetre, setFenetre] = useState(2)
  const styles = useStyles(isDark)
  const [openMenu, setOpenMenu] = useState(false); 
  const handleOpenMenu = () => { 
      setOpenMenu(!openMenu);
    };
  const [openCreateGraph, setOpenCreateGraph] = useState(false);
  const handleOpenCreateGraph = () => { 
      setOpenCreateGraph(!openCreateGraph);
    };

  const [openLanguages, setOpenLanguages] = useState(false);
  const handleOpenLanguages = () => {
    setOpenLanguages(!openLanguages);
  };  
  

  const drawer = (
    <div>
      {token ? <Typography align='center' style={{color: isDark? DARK_THEME.palette.text.secondary : LIGHT_THEME.palette.text.secondary}} variant='h6'>{token.title} {token.name}</Typography>: <></>}
      <Divider/> 
      <List>
        <ListItemButton onClick={handleOpenLanguages}>
          <ListItemIcon>
            <LanguageIcon /> 
          </ListItemIcon>
          <ListItemText primary={appText.langue[lg]} />
          {openLanguages ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openLanguages} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={() => {setLg('fr'); setOpenMenu(false)}}>
            <ListItemIcon>
              <img src={fr} height="15" width="20" alt="rouge" style={{borderRadius:'10%'}}/>
            </ListItemIcon>
            <ListItemText primary={appText.francais[lg]} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => {setLg('en'); setOpenMenu(false)}}>
            <ListItemIcon>
              <img src={en} height="15" width="20" alt="rouge" style={{borderRadius:'10%'}}/>
            </ListItemIcon>
            <ListItemText primary={appText.anglais[lg]} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => {setLg('sp'); setOpenMenu(false)}}>
          <ListItemIcon>
              <img src={es} height="15" width="20" alt="rouge" style={{borderRadius:'10%'}}/>
            </ListItemIcon>
            <ListItemText primary={appText.espagnol[lg]} />
          </ListItemButton>
        </List>
      </Collapse>

        <ListItemButton>
          <ListItemIcon>
            <AddchartIcon /> 
          </ListItemIcon>
          <ListItemText primary={appText.graph[lg]} onClick={handleOpenCreateGraph}/>
          <Dialog open={openCreateGraph} onClose={handleOpenCreateGraph}>
            <DialogContent sx={{backgroundColor:'white'}}>
              <CreateGraph setOpenCreateGraph={setOpenCreateGraph} lg={lg}/>
            </DialogContent>
          </Dialog>
        </ListItemButton>
        
        <ListItemButton onClick={handleOpenStorage}>
          <ListItemIcon>
            <StorageIcon/> 
          </ListItemIcon>
          <ListItemText primary={appText.db[lg]} />
          {openLanguages ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openStorage} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={() => {handleDeletePatientsOut() ;setOpenMenu(false)}}>
            <ListItemIcon>
              <GroupRemoveIcon/>
            </ListItemIcon>
            <ListItemText primary={appText.pOut[lg]} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => {handleReset(); setOpenMenu(false)}}>
            <ListItemIcon>
              <DeleteForeverIcon/>
            </ListItemIcon>
            <ListItemText primary={appText.reset[lg]} />
          <Typography> ({size} Mo)</Typography>
          </ListItemButton>
        </List>
      </Collapse>
      
        <ListItemButton>
          <ListItemIcon>
            <HotelIcon/>
          </ListItemIcon>
          <ListItemText primary={appText.patient[lg]} onClick={() => {setChambre(null);}} />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary={appText.deconnexion[lg]} onClick={() => {setToken(null); setChambre(null); }} />
        </ListItemButton>
      </List>
    </div>
  );
  
  const Accueil = styled(Paper)(() => ({
    backgroundColor: isDark? DARK_THEME.palette.primary.main : LIGHT_THEME.palette.primary.main
  }));

const Header = (
  <div>
    <Grid container columns={20} >
      <Grid item xs={15} sm={15} md={15}>
        <Typography variant='h6' style={{textAlign:'right'}}>{appText.titre[lg]}</Typography>
      </Grid>
      <Grid item xs={3} sm={3} md={3} justifyContent='flex-end' container>
        <FormGroup>
          <FormControlLabel control={<MaterialUISwitch sx={{ m: 1 }} checked={isDark} onChange={toggleTheme}/>}/> 
        </FormGroup>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleOpenMenu}
            sx={{ mr: 2 }}
          >
          <MenuIcon />
          </IconButton>
          <Modal hideBackdrop disableEnforceFocus={true} style={styles.modal} open={openMenu} onClose={handleOpenMenu}>
            {drawer}
          </Modal>          
      </Grid>
    </Grid>
  </div>
  );
  return (
    <div>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet"></link>
      { <Router>
        {      
        token ? (chambre ? <div>{Header}</div> : <Main setDataPatient={setDataPatient} setChambre={setChambre} lg={lg}/>) : <Login setToken={setToken} lg={lg}/>
        }
          <Routes>
            <Route path="/" exact element={<Accueil/>}/>
            <Route path="/New" exact element={<NouveauGraph setOpenMenu={setOpenMenu} dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/Main" exact element={<Main setChambre={setChambre} setDataPatient={setDataPatient} lg={lg}/>}/>
            <Route path="/Plan" exact element={<Plan dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/EOI" exact element={<EOI dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/EPF" exact element={<EPF dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/SPO" exact element={<SPO dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/PMOY" exact element={<PMOY dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/FIO" exact element={<FIO dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/VT" exact element={<VT dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/PH" exact element={<PH dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/>
            <Route path="/Bilan" exact element={<Bilan dataPatient={dataPatient} fenetre={fenetre} setFenetre={setFenetre} lg={lg}/>}/> 
          </Routes>
        </Router> }
    <div style={{float:'right'}}><br/><Typography variant='body2'>Version 02/13/2023</Typography></div>
    </div>
    
  );
}
export default App;