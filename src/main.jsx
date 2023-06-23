import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import FineTunedModel from './FineTunedModel.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FineTunedModel />
  </React.StrictMode>,
)
