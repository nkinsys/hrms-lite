// import logo from './logo.svg';
// import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppRouter from './components/AppRouter';
import UserProvider from './components/providers/UserProvider';
import { ColorModeContext, useMode } from './scripts/theme';

function App() {
  const [theme, colorMode] = useMode();

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

    <ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline></CssBaseline>
				<UserProvider>
					<AppRouter></AppRouter>
				</UserProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
  );
}

export default App;
