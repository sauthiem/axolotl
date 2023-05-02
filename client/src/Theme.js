import {createTheme} from '@mui/material/styles';
import { dark } from '@mui/material/styles/createPalette';

//https://deeplylearning.fr/cours-web-frontend-react/dark-light-custom-theme-avec-react-material-ui/

export const LOCAL_STORAGE_KEY = "isDark";

const baseTheme = createTheme({
    typography: {
        fontFamily: ['"Source Sans Pro"', 'sans-serif' ].join(','),
        subtitle1:{
            fontSize:'1.15rem'
        }
    }
})

export const LIGHT_THEME = createTheme({
    ...baseTheme,
    palette: {
        mode: 'light',
        primary: {
            main: '#009688',
        },
        secondary: {
            main: '#e0f7fa',
        },
        background: {
            default:"#fff",
            paper:"#fff",
        },
        text: {
            primary:"#000",
            secondary: "#9e9e9e"
        }
    },
    
  });
  
  export const DARK_THEME= createTheme({
    ...baseTheme,
    palette: {
        mode: 'dark',
        primary: {
            main: 'rgb(98, 93, 82)',
        },
        secondary: {
            main: '#37474f',
        },
        background: {
            default:'rgba(0, 0, 0, 0.8)',
            paper:'rgba(0, 0, 0, 0.8)',
        },
        divider: 'rgba(0, 0, 0, 0.8)',
        text:{
            primary:'rgba(250,250,250,0.9)',
            secondary:'rgba(250,250,250,0.7)',
        }
    },
  }); 