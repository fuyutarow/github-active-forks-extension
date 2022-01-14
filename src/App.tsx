import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';

import { name as appName, version } from '../package.json';

import './App.css';
import { Fork } from './models';
import Table from './components/Table';

const App: React.FC = () => {
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

  useEffect(() => {
    const unlisten = async () => {
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
    unlisten();
  }, [repo, forks]);

  return (
    <div className="App">
      <Container className="App-container" style={{
        backgroundColor: '#ECEFF4',
        paddingTop: 20,
        paddingBottom: 20,
      }}>
        <Table {...{
          originRepo: repo ?? '',
          rows: forks,
        }} />
        <div style={{
          fontSize: 12,
          color: 'gray',
        }}>
          <a
            href={
              'https://twitter.com/bonbonnice1'
            }
            onClick={(e: any) => {
              if (e.target.href !== undefined){
                chrome.tabs.create({ url: e.target.href });
              }
            }}>
            {appName} v{version}
          </a>
        </div>
      </Container>
    </div>
  );
};

export default App;
