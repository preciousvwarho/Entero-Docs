
import { Notifications } from 'react-push-notification';
import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Store from './Store';
import Login from './main/pages/Login';
import Dashboard from './main/pages/Dashboard';
import Admin from './main/pages/Admin';
import Marketers from './main/pages/Marketers';
import MarketerDetails from './main/pages/MarketerDetails';
import Clients from './main/pages/Clients';
import ClientsDetails from './main/pages/ClientsDetails';
import Documents from './main/pages/Documents';
import DocumentDetails from "./main/pages/DocumentDetails";
import Commission from './main/pages/Commissions'
import DynamicForm from './main/pages/DynamicForm';
import Estates from './main/pages/Estates';
import InterestForm from './main/pages/InterestForm';
// import InterestDetails from './main/InterestDetails';
import EstateDetails from './main/pages/EstateDetails';
import DuePayment from './main/pages/DuePayment';
import Allocation from './main/pages/Allocation';

function App() {
  return (
    <Store>
       {/* <Notifications /> */}
    <Router>
       <Switch>
       <Route path="/" exact>
            <Login/>
          </Route>
          <Route path="/Dashboard" exact>
            <Dashboard />
          </Route>
           <Route path="/Admin" exact>
            <Admin />
          </Route>
          <Route path="/Clients" exact>
            <Clients />
          </Route>
          <Route path="/DuePayment" exact>
            <DuePayment />
          </Route>
          <Route path="/Client-Details/:id" exact>
            <ClientsDetails />
          </Route>
           <Route path="/Marketers" exact>
            <Marketers />
          </Route>
          <Route path="/Marketer-Details/:id" exact>
            <MarketerDetails />
          </Route>
          <Route path="/Documents" exact>
            <Documents />
          </Route>
          <Route path="/Document-Details/:id" exact>
            <DocumentDetails/>
          </Route>
        <Route path="/Estates" exact>
            <Estates/>
            </Route>
          <Route path="/Estate/:name/:id" exact>
            <EstateDetails />
          </Route>
         <Route path="/DynamicForm" exact>
            <DynamicForm />
          </Route>
         <Route path="/Interest-Form" exact>
            <InterestForm/>
          </Route>
           <Route path="/Commissions" exact>
            <Commission />
          </Route>
           <Route path="/Allocation" exact>
            <Allocation />
          </Route>
        {/*       <Route path="/Interest-Form-Details/:id" exact>
            <InterestDetails/>
          </Route>
          <Route path={"/Clients"} exact>
              <Clients/>
          </Route>
          <Route path={"/:name/:id"} exact>
              <ClientDetails/>
          </Route>
          <Route path="/Document-Details/:id" exact>
            <DocumentDetails/>
          </Route>
          <Route path="/Business-Developer" exact>
            <BusinessDeveloper/>
            </Route>
          <Route path="/pdf-Details/:name" exact>
            <Pdf />
          </Route> */}

        </Switch>
    </Router>
    </Store>
  );
}

export default App;
