
import React, {useState, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import configData from "../config.json";
import { useForm } from "react-hook-form";
import {useHistory } from "react-router-dom";
import { Context } from '../Store';

function Login() {
    const history = useHistory();

    const [state, setState] = useContext(Context);

  const { register, handleSubmit, errors } = useForm();
  const [disablebtn, setDisablebtn] = useState(false);
  const [message, setMessage] = useState(false);


const adminUser = (data) => {

  setDisablebtn(true);


  return fetch(`${configData.SERVER_URL}/admin/login`, {
      method: "post",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({            
          email:data.email,
          password:data.password
      })
   })
   .then((response) => response.json())
   .then((responseJson) => {
     console.log(responseJson)
     setDisablebtn(false);
       if(responseJson.status === "success"){
        setState({
          ...state,
          fullName: responseJson.data.fullName,
          email: responseJson.data.email
        })

        window.localStorage.setItem('navLink', 'Dashboard')
        window.localStorage.setItem("fullName", responseJson.data.fullName);
        window.localStorage.setItem("Admin", responseJson.data.role);
        window.localStorage.setItem("userId", responseJson.data.id);
          // window.localStorage.setItem("token", responseJson.token);
          history.push(`/Dashboard`);
       }
       if (responseJson.status === "error") {
          setDisablebtn(false);
          // alert(responseJson.message);
           setMessage(responseJson.message);
       }
   })
   .catch((error) => {
       console.log(error);
   });
}


  return (
    <div className="App">
        <Row className="mx-0 bg-circle-gradiant">
            <Col lg="3"></Col>
            <Col lg="6" className="boxOne">
                <div className="login">

              <form onSubmit={handleSubmit(adminUser)} enctype="multipart/form-data" id="submit" className="login-mg p-5">

                  {/* <div className="alert alert-warning" role="alert">
                      {message.length ? ({message}) : (null)}
                      </div>        */}
                  <p className="h4 mb-4">Welcome, Please Login</p>  

                  <small style={{color: 'red', paddingBottom: '10px'}}>{message.length > 0 ? (message) : (null)}</small>

                  <div className="form-floating">
                       <input type="email" id="FormEmail" className="form-control mb-4" placeholder="Email" name="email" ref={register({ required: true, })} />
                       <label for="floatingInput">Email</label>
                       {errors.email && <div className="alert alert-danger" role="alert">Email Required</div>}
                  </div>

                  <div className="form-floating">
                      <input type="password" id="FormPassword" className="form-control" placeholder="Password" name="password" ref={register({ required: true, })} />
                       <label for="floatingInput">Password</label>
                      {errors.password && <div className="alert alert-danger" role="alert">Password Required</div>}
                  </div>
                  
                  <div className="form-group"  style={{textAlign: 'right', fontWeight: 'bold'}}>
                          <button type="submit" className="btn btn-primary my-4 waves-effect waves-light px-4">
                                {disablebtn ? (<>Please wait <i class="fa fa-spinner fa-spin"></i></>) : (<>LOGIN <i class="fa fa-long-arrow-alt-right"></i></>)}
                          </button>    
                   </div>

                  </form>

                  </div>
            </Col>
            <Col lg="3"></Col>
        </Row>
    </div>
  );
}

export default Login;
