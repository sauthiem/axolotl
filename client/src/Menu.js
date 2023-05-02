import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useLocation  } from "react-router-dom";
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { menuText, listePages } from './Text';

const useStyles = (isDark) =>({
    fontFamily: "'Source Sans Pro', sans-serif",
    height: '50px',    
    justifyContent: 'center',
    backgroundColor:'white',
    backgroundImage: isDark ? 'linear-gradient(to right,'+ DARK_THEME.palette.primary.main + ', #bcaaa4)' : 'linear-gradient(to right,'+ LIGHT_THEME.palette.primary.main + ', rgba(0,150,136,0.2))',
    button:{
        margin:'auto',
        marginTop: '0px',
        marginBottom: '0px',
        textTransform: 'none'

    },
});

export default function ButtonAppBar({lg, setFenetre, fenetre}) {
  const location = useLocation();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const styles = useStyles(isDark)
  const SelectWrapper = styled('div')(() => ({
    height: '100%',
    position: 'static',
    height:'45px',
    display: 'flex',
    alignItems: 'center',
    borderColor: isDark? DARK_THEME.palette.primary.main : LIGHT_THEME.palette.primary.main
  }));
  const handleChange = (event) => {
    if(event.target.value == 0){
      setFenetre(0)
    }
    if(event.target.value == 1){
      setFenetre(1)
    }
    if(event.target.value == 2){
      setFenetre(2)
    }
    if(event.target.value == 3){ //7 jours
      setFenetre(3)
    } 
};

  return (
    <div>
      <Box  sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={styles}>
          <Toolbar>
            <Grid container spacing={2}>
              <Grid item xs={10} sm={10} md={10} container justifyContent='center'>
                {listePages.map((page, i) =>{
                    return(<Link key={page.lien} style={{textDecoration: 'none', color:'white', fontFamily: "'Source Sans Pro', sans-serif", fontSize: 25}} to={`/${page.lien}`}><Button style={styles.button} color="inherit">{page[lg]}</Button></Link>)                  
                })}
                </Grid>
            <Grid item xs={2} sm={2} md={2}>
            <SelectWrapper>
              <FormControl sx={{ m: 1, width: '90%'}}  size="small">
                <InputLabel style={{color:isDark?'white': LIGHT_THEME.palette.primary.main}}>{menuText.slider[lg]}</InputLabel>
                <Select
                  style={{color:isDark?'white': LIGHT_THEME.palette.primary.main}}
                  defaultValue={fenetre}
                  onChange={handleChange}
                  autoWidth
                  label={menuText.slider[lg]}
                >
                  <MenuItem value={0}>8 {menuText.heures[lg]}</MenuItem>
                  <MenuItem value={1}>24 {menuText.heures[lg]}</MenuItem>
                  <MenuItem value={2}>48 {menuText.heures[lg]}</MenuItem>
                  <MenuItem value={3}>7 {menuText.jours[lg]}</MenuItem>
                </Select>
              </FormControl>
             </SelectWrapper>     
            </Grid>
            </Grid>
          </Toolbar>
      </AppBar>
      </Box>  
    </div>
  );
}
