import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you are using React 18's createRoot
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; // Adjust the import path as needed
import { AuthProvider } from './components/Authentication/AuthContext';
import '../src/index.css';
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
