import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './pages/app/App.jsx';
import './pages/app/App.scss';
import Login from './pages/login/index.jsx';
import './pages/login/index.scss';
import CriarConta from './pages/criar_conta/index.jsx';
import './pages/criar_conta/index.scss';
import Feed from './pages/feed/index.jsx';
import './pages/feed/index.scss';
import RotaProtegida from './pages/components/rotaprotegida.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CriarConta />} />

        <Route element={<RotaProtegida />}>
          <Route path="/feed" element={<Feed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

