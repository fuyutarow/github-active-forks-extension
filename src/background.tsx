import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { name as appName, version } from '../package.json';

console.log('Hello from background script!', appName, version);

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: '#3aa757' }, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'developer.chrome.com' },
      }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});

const App: React.FC = () => {
  return (
    <>
      <button>
          ok
      </button>
    </>
  );
};

const mountNode = document.getElementById('background');
ReactDOM.render(<App />, mountNode);
