import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import { handleClosePopup } from './handleClosePopup';
import ParseCSV from './ParseCSV';
import './App.css';

const main = () => {
  console.log('logseq-parsecsv-plugin loaded');

  logseq.Editor.registerSlashCommand('Parse CSV', async () => {
    ReactDOM.render(
      <React.StrictMode>
        <ParseCSV />
      </React.StrictMode>,
      document.getElementById('app')
    );

    logseq.showMainUI();
  });

  handleClosePopup();
};

logseq.ready(main).catch(console.error);
