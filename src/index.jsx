/* @refresh reload */
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'


import './index.css'
import App from './App'
import routes from './Routing'

const root = document.getElementById('root')

render(() => <Router>{routes}</Router>, root)
