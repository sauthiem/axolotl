import Input from '@mui/material/Input';
import { Grid, Typography, Button } from '@mui/material'
import { loginText } from './Text'
import { useNavigate } from "react-router-dom";
import React, {useState, useEffect} from "react";
import chu from "./images/chu.png"
import chuD from "./images/chuDark.png"
import Paper from '@mui/material/Paper';
import ThemeContext from './ThemeContext';
import { useContext } from 'react';
import { DARK_THEME, LIGHT_THEME } from "./Theme";


const admin = {title:'Dr', name: 'Greg House', email:'test', password:'test'}


export default ({ setToken, lg
}) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  let history = useNavigate()
  useEffect(() => {
    if (lg) {
      history("/");
    }
  }, [lg]);
  
  const handleSubmit = (e) => {
    if(username == admin.email && password == admin.password){
      setToken(admin)
      e.stopPropagation() 
    }else{
      setToken(null)
    }
  }
    return (
      <div className='Background' style={{textAlign:'center', height: '100vh', width: '100%'}}> 
        <Grid container justifyContent='center' alignItems="center">
          <Grid item xs={3} sm={3} md={3}>
            <Paper elevation={3} style={{marginTop:'20%', backgroundColor:isDark? 'rgba(0,0,0, 0.4)':'rgba(255,255,255, 0.4)'}}>
            <Grid container spacing={2} direction='row'   justifyContent='center' alignItems="center">
              <Grid item xs={12} sm={12} md={12}><Typography variant="h3" style={{color: isDark? DARK_THEME.palette.text.primary : '#2c387e' }}>{loginText.titre[lg]}</Typography></Grid>
              <Grid item xs={10} sm={10} md={10}>
                <Input placeholder={loginText.username[lg]} id="username" onChange={e => setUserName(e.target.value)} required/>
              </Grid>
              <Grid item xs={10} sm={10} md={10}>
                <Input placeholder={loginText.password[lg]} id="password" type="password" onChange={e => setPassword(e.target.value)}/>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Button variant='contained' type="submit" value={loginText.titre[lg]} onClick={handleSubmit}>
                  {loginText.titre[lg]}
                </Button>
              </Grid>   
              <Grid item xs={9} sm={9} md={9}>{isDark ? <img src={chuD} height='70%' width='70%'/> : <img src={chu} height='70%' width='70%'/>}</Grid>     
            </Grid>
            </Paper>  
          </Grid>
        </Grid>
        
      </div>
    );
  }
