import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { name as appName, version } from '../package.json';

import { sleep } from './utils';

console.log('===========================================');
console.log('Hello from content script', appName, version);
console.log('===========================================');

const addMemberList = async () => {
  await sleep(200);
  const dots = document.querySelector(
    '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1w6e6rj.r-1wtj0ep > div.css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs > div.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-sdzlij.r-1phboty.r-rs99b7.r-6gpygo.r-1kb76zh.r-2yi16.r-1qi8awa.r-1ny4l3l.r-o7ynqc.r-6416eg.r-lrvibr > div'
  );
  // @ts-ignore
  dots?.click();

  await sleep(200);
  const item_list = document.querySelector(
    '#layers > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-yfoy6g.r-z2wwpe.r-xnswec.r-j2cz3j.r-1udh08x.r-u8s1d > div > div > div > a:nth-child(2)'
  );
  // @ts-ignore
  item_list?.click();

  await sleep(1000);
  const node = document.querySelector(
    '#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div > div:nth-child(2) > section > div > div > div:nth-child(2) > div > a'
  );
  console.log(node);
  // @ts-ignore
  node?.click();

  await sleep(200);
  const save = document.querySelector(
    '#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div > div.css-1dbjc4n.r-gtdqiz.r-ipm5af.r-136ojw6 > div > div > div > div > div > div.css-1dbjc4n.r-obd0qt.r-1pz39u2.r-1777fci.r-15ysp7h.r-s8bhmr > div'
  );
  // @ts-ignore
  save?.click();
};

const AddMemberListButton = () => {
  return (
    <button
      onClick={addMemberList}
      children="add member list"
    />
  );
};

// 受信側 other tab -> contents(popup/option -> contents)
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message);
  const msg = JSON.parse(message);
  if (msg.action == 1) {
    await addMemberList();
  } else if (msg.action == 2) {
    window.location = msg.url;
  }
});

const main = async () => {
  console.log('#1');

  await sleep(1000);
  console.log('#2');

  const node = document.querySelector('#react-root');
  // const node = document.querySelector(
  //   '#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div > div.css-1dbjc4n.r-gtdqiz.r-ipm5af.r-136ojw6 > div'
  // );
  console.log('#3');
  // const node = document.getElementById('react-root');
  console.log(node);

  const elem = document.createElement('div');
  // node?.appendChild(elem);
  node?.prepend(elem);
  elem.id = 'my-extension-root';

  const BTN: React.FC = () => {
    return (
      <>
        <AddMemberListButton />
      </>
    );
  };

  ReactDOM.render(<BTN />, elem);
  console.log('rendered');
};

console.log('!1');
main();
console.log('!2');

