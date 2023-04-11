import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Store from './Store';
import Login from './main/Login';
import Dashboard from './main/Dashboard';
import Admin from './main/Admin';
import Documents from './main/Documents';
import Estates from './main/Estates';
import DocumentDetails from "./main/DocumentDetails";
import InterestForm from './main/InterestForm';
import InterestDetails from './main/InterestDetails';
import BusinessDeveloper from './main/BusinessDeveloper';
import EstateDetails from './main/EstateDetails';
import Pdf from './main/Pdf';

function App() {
  return (
    <Store>
    <Router>
       <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/Dashboard" exact>
            <Dashboard />
          </Route>
          <Route path="/Admin" exact>
            <Admin />
          </Route>
          <Route path="/Estates" exact>
            <Estates/>
            </Route>
          <Route path="/Documents" exact>
            <Documents />
          </Route>
          <Route path="/Interest-Form" exact>
            <InterestForm/>
          </Route>
          <Route path="/Interest-Form-Details/:id" exact>
            <InterestDetails/>
          </Route>
          <Route path="/Document-Details/:id" exact>
            <DocumentDetails/>
          </Route>
          <Route path="/Business-Developer" exact>
            <BusinessDeveloper/>
            </Route>
          <Route path="/Estate-Details/:id" exact>
            <EstateDetails />
          </Route>
          <Route path="/pdf-Details/:name" exact>
            <Pdf />
          </Route>

        </Switch>
    </Router>
    </Store>
  );
}

export default App;
