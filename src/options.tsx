import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { Container, Box, Button, TextField } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

import { name as appName, version } from '../package.json';

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

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

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
      <Box>
        v{version}
      </Box>
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
        onChange={e => setInput(e.target.value)}
      />
      <Box style={{
        color: 'black',
      }}>
        {isFinished ? 'DONE' : current}
      </Box>
      <Box>
        <Button
          onClick={() => { chrome.runtime.openOptionsPage(); }}
          children="open options"
        />
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
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </Container>
  );
};

const mountNode = document.getElementById('options');
ReactDOM.render(<App />, mountNode);
