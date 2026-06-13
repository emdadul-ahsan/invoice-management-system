import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { StoreProvider, useStore } from './store'
import { Icon, ClientAvatar, ClientCell, StatusPill, Sidebar, Topbar, Modal, downloadInvoice } from './ui'
import DashboardScreen from './screens/dashboard'
import InvoicesScreen from './screens/invoices'
import InvoiceDetailScreen from './screens/invoice-detail'
import InvoiceEditorScreen from './screens/invoice-editor'
import ProjectsScreen from './screens/projects'
import ProjectDetailScreen from './screens/projects'
import { App } from './app'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
