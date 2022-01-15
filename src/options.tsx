import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { Container, Box, Button, TextField } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useMap } from 'usehooks-ts';

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

interface Row {
  id: string,
  name: string,
  status: 'pending' | 'done',
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'screen name', width: 200 },
  { field: 'status', headerName: 'status', width: 120 },
  { field: 'url', headerName: 'url', width: 300 },
];

const rowMap2rows = (rowMap: Omit<Map<string, Row>, 'set' | 'clear' | 'delete'>) => {
  const rows = Array.from(rowMap.entries()).map(([key, value]) => ({
    ...value,
    url: `https://twitter.com/${value.name}`,
  }));
  return rows;
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [userNameList, setUserNameList] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [rows, setRows] = useState<GridRowsProp>([]);

  const [rowMap, { set }] = useMap<string, Row>([]);

  useEffect(() => {
    const names = input.split(',').map(s => s.trim().replace('@', ''));
    setUserNameList(names);

  }, [input]);

  useEffect(() => {
    userNameList.forEach(name => {
      const row: Row = {
        id: name,
        name: name,
        status: 'pending',
      };
      set(row.id, row);
    });
  }, [userNameList]);

  useEffect(() => {
    const rows = rowMap2rows(rowMap);
    setRows(rows);
  }, [rowMap]);

  return (
    <Container sx={{
      backgroundColor: 'whitesmoke',
      p: 3,
    }}>
      <Box>
        v{version}
      </Box>
      <Box>
        <Button
          variant='contained'
          onClick={() => { chrome.runtime.openOptionsPage(); }}
          children="open options"
        />
      </Box>
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
      <Button
        children="Go"
        onClick={async () => {
          for (const userName of userNameList) {
            setCurrent(userName);
            jumpUrl(`https://twitter.com/${userName}`);
            await sleep(2e3);
            addMemberList();
            await sleep(6e3);
            set(userName, {
              id: userName,
              name: userName,
              status: 'done',
            });
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
      <div style={{ height: 800, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </Container>
  );
};

const mountNode = document.getElementById('options');
ReactDOM.render(<App />, mountNode);
