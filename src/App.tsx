import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { name as appName, version } from '../package.json';

import logo from './logo.svg';

import './App.css';
import Table from './components/Table';

const toProfile: { [theme: string]: string } = {
  'solarized-dark': 'solarized_dark',
  'vue': 'vue',
};

const toBG: { [theme: string]: string } = {
  'solarized-dark': '#282c34',
  'vue': '#ECEFF4',
};

interface Fork {
  // repoUrl: string,
  ownerName: string
  full_name: string
  default_branch: string
  stargazers_count: number
  forks_count: number
  open_issues_count: string
  size: number
  pushed_at: string
}

const ForkShow: React.FC<{fork: Fork}> = ({ fork }) => {
  return (
    <div>
      fork
      <div>
        {fork.full_name}
      </div>
      <div>
        {fork.size}
      </div>
    </div>
  );
};

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
      const repoUrl = `https://github.com/${repo}`;
      setRepo(repo);
      // setRepoUrl(repoUrl);
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
        ===
        <div style={{
          fontSize: 12,
          color: 'gray',
        }}>
          {repo ?? ''}
        </div>
        <div>
          <button onClick={fetchAndShow}>fetch</button>
        </div>
        <div>{forks.length}</div>
        <Table />
        {/* <div>
          {
            forks.slice(0, 5).map(fork => {
              return <ForkShow fork={fork} />;
            })
          }
        </div> */}
        ===
      </Container>
    </div>
  );
};

export default App;
