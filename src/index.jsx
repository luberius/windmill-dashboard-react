import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './assets/css/tailwind.output.css';
import { Windmill } from '@luberius/fork-windmill-react-ui';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { SidebarProvider } from './context/SidebarContext';
import ThemedSuspense from './components/ThemedSuspense';
import * as serviceWorker from './serviceWorker';

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('react-axe')
//   axe(React, ReactDOM, 1000)
// }

axios.defaults.baseURL = process.env.API_URL;

ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill usePreferences>
        <App />
      </Windmill>
    </Suspense>
    <Toaster
      position="top-center"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{ duration: 4000 }}
    />
  </SidebarProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
