import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from "react-router-dom"
import Baslangic from "./components/Login"
import Kurum from "./components/Kurum"
import './App.css';
import "./styles/Login.css"
import Button from '@material-ui/core/Button';
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios"
import Katilimci from "./components/Katilimci";
import Login from "./components/Login";

class App extends Component{

    render(){
        return <Router>
            <Route exact path="/" component={Login} />
            <Route path="/kurum" component={Kurum} />
            <Route path="/katilimci" component={Katilimci} />
        </Router>
    }
}

export default App
