import React from 'react';
import Main from './pages/Main';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';
import awsconfig from './aws-exports';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
Amplify.configure(awsconfig);

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#78909c',
      main: '#546e7a',
      dark: '#37474f',
      // : will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#e91e63',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const signUpConfig = {
  hideAllDefaults: true,
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
}

//export default withAuthenticator(App, { signUpConfig });
export default App;
