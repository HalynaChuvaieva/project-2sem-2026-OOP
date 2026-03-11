import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

const style = document.createElement('style');
style.textContent = `
  body { margin: 0; font-family: sans-serif; overflow-x: hidden; }
  button { cursor: pointer; padding: 8px 12px; border-radius: 4px; border: none; background: #007bff; color: white; transition: 0.2s; }
  button:hover { background: #0056b3; }
  input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
