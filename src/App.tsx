import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { Box, Button, TextField } from '@material-ui/core';

import { name as appName, version } from '../package.json';

import './App.css';
import { Fork } from './models';
import Table from './components/Table';
import { sleep } from './utils';

const jumpUrl = (url: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      // @ts-ignore
      tabs[0].id,
      JSON.stringify({ action: 2, url }),
      (res) => { }
    );
  });
};

const addMemberList = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      // @ts-ignore
      tabs[0].id,
      JSON.stringify({ action: 1 }),
      (res) => { }
    );
  });

};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [userNameList, setUserNameList] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const names = input.split(',').map(s => s.trim().replace('@', ''));
    setUserNameList(names);
  }, [input]);

  return (
    <Container className="App-container" style={{
      backgroundColor: '#ECEFF4',
      paddingTop: 20,
      paddingBottom: 20,
      width: 600,
    }}>
      <Button
        children="user list"
        onClick={() => {
          alert(userNameList);
        }}
      />
      <TextField
        id="text-field"
        label="カンマ区切りでtwitter idを複数入力"
        multiline
        rows={4}
        value={input}
        onChange={ e => setInput(e.target.value)}
      />
      <Box style={{
        color: 'black',
      }}>
        {isFinished ? 'DONE' : current}
      </Box>
      <Button
        children="Go"
        onClick={async () => {
          for (const userName of userNameList) {
            setCurrent(userName);
            jumpUrl(`https://twitter.com/${userName}`);
            await sleep(2e3);
            addMemberList();
            await sleep(4e3);
          }
          setIsFinished(true);
        }}
      />
      <Button
        children="btn1"
        onClick={async () => {
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(
              // @ts-ignore
              tabs[0].id,
              JSON.stringify({ action: 1 }),
              (res) => { }
            );
          });
        }}
      />
      <Button
        children="btn2"
        onClick={async () => {
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(
              // @ts-ignore
              tabs[0].id,
              JSON.stringify({ action: 2, url: 'https://twitter.com/bonbonnice1' }),
              (res) => { }
            );
          });
        }}
      />
      <Button
        children="btn1"
        onClick={async () => {
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(
              // @ts-ignore
              tabs[0].id,
              JSON.stringify({ action: 1 }),
              (res) => { }
            );
          });
        }}
      />
      <a
        href={
          'https://twitter.com/bonbonnice1'
        }
        onClick={(e: any) => {
          if (e.target.href !== undefined) {
            chrome.tabs.create({ url: e.target.href });
          }
        }}>
          url
      </a>
    </Container>
  );
};

export default App;
