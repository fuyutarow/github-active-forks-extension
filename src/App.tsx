import * as React from 'react';
import { useState, useEffect } from 'react';

import logo from './logo.svg';

import './App.css';
import { useKeyPress } from 'react-use';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { name as appName, version } from '../package.json';

const toProfile: { [theme: string]: string } = {
  'solarized-dark': 'solarized_dark',
  'vue': 'vue',
};

const toBG: { [theme: string]: string } = {
  'solarized-dark': '#282c34',
  'vue': '#ECEFF4',
};

const App = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  // const [theme, setTheme] = useState('solarized-dark');
  const [theme, setTheme] = useState('vue');
  const scale = 0.9;

  useEffect(() => {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
      const tab = tabs[0];
      setCurrentUrl(tab.url ?? null);

    });
  }, [currentUrl]);

  useEffect(() => {
    if (currentUrl) {
      const parser = new URL(currentUrl);
      const username = parser.pathname.split('/')[1];
      setUsername(username);
    }
  }, [currentUrl, username]);

  return (
    <div className="App">
      <Container className="App-container" style={{
        backgroundColor: toBG[theme],
        paddingTop: 20,
        paddingBottom: 20,
      }}>
        {
          username && (
            <Grid container justify="flex-start" spacing={1}>
              <Grid item xs={12}>
                <img {...{
                  height: 195 * scale,
                  src: `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&count_private=true&theme=${theme}`,
                }} />
              </Grid>
              <Grid item xs={12}>
                <img {...{
                  height: 165 * scale,
                  src: `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}`,
                }} />
              </Grid>
              <Grid item xs={12}>
                <img {...{
                  height: 180 * scale,
                  src: `https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${username}&theme=${toProfile[theme]}`,
                }} />
              </Grid>
            </Grid>
          )
        }
        <div style={{
          fontSize: 12,
          color: 'gray',
        }}>
          <a href={'https://github.com/fuyutarow/github-readme-stats-extension'}>
            {appName} v{version}
          </a>
        </div>
      </Container>
    </div>
  );
};

export default App;
