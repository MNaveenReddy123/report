// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';
import 'antd/dist/reset.css'; // ant reset (v5). Use 'antd/dist/antd.css' for older version

const theme = {
  token: {
    colorPrimary: '#5b21b6', // purple you used in screenshot (customize)
    borderRadius: 8,
    // add other tokens as needed
  },
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
