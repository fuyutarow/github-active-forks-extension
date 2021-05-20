import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { name as appName, version } from '../package.json';

import './App.css';
import { Fork } from './models';
import Table from './components/Table';

const App = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [repo, setRepo] = useState<string|null>(null);
  // const [repoUrl, setRepoUrl] = useState<string|null>(null);
  const [forks, setForks] = useState<Fork[]>([]);

  useEffect(() => {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
      const tab = tabs[0];
      setCurrentUrl(tab.url ?? null);

    });
  }, [currentUrl]);

  useEffect(() => {
    if (currentUrl) {
      const parser = new URL(currentUrl);
      const repo = parser.pathname.split('/').slice(1, 3).join('/').replace(/\.git$/, '');
      setRepo(repo);
    }
  }, [currentUrl, repo]);

  const fetchAndShow = async() => {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/forks?sort=stargazers&per_page=100`
    );
    // .catch(e => alert(e));
    if (!response.ok) throw Error(response.statusText);
    const data = await response.json();
    console.log(data);

    const forks = data.map((fork: any) => {
      return {
        ...fork,
        ownerName: fork.owner ? fork.owner.login : 'Unknown',
      } as Fork;
    });

    setForks(forks);
  };

  return (
    <div className="App">
      <Container className="App-container" style={{
        paddingTop: 20,
        paddingBottom: 20,
      }}>
        <div style={{
          fontSize: 12,
          color: 'gray',
        }}>
          {repo ?? ''}
        </div>
        <div>
          <button onClick={fetchAndShow}>fetch</button>
        </div>
        <Table {...{
          originRepo: repo ?? '',
          rows: forks,
        }} />
      </Container>
    </div>
  );
};

export default App;
