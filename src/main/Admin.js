
import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import NavToggle from './components/NavToggle';
import { Table, Button, Row, Col, Modal, Nav } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../config.json";

function Admin() {

  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
    const [user, setUser] = useState([])
    const { register, handleSubmit, watch, errors } = useForm();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState('');
    const [isBtnLoading, setisBtnLoading] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleTwoClose = () => setShowTwo(false);
    const handleTwoShow = () => setShowTwo(true);

    const adminAdd = (data) => {

      setisBtnLoading(true)

      return fetch(`${configData.SERVER_URL}/admin/addAdmin`, {
          method: "post",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
              // "x-auth-token":  window.localStorage.getItem("token")
          },
          body: JSON.stringify({            
              fullName:data.fullName,      
              email:data.email,
              role:data.role
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log(responseJson);
  
          if(responseJson.status === "success"){
              setisBtnLoading(false)
              alert(responseJson.message);
          }
          if (responseJson.status === "error") {
              setisBtnLoading(false)
              alert(responseJson.message);
          }
      })
      .catch((error) => {
          setisBtnLoading(false)
          console.error(error);
      });
  
     }

     const getAdmin = () => {

      return axios.get(`${configData.SERVER_URL}/admin/getAllAdmin`).then((response) => {
          console.log(response.data.data);
          setUser(response.data.data);
        });
  
     }
  

  useEffect(() => {
    getAdmin();
    const interval = setInterval(() => {
      getAdmin();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
 
 const editUser = (u) => {
  setFullName(u.fullName);
  setEmail(u.email);
  setRole(u.role);
  setId(u.id);
  handleTwoShow(true);
}


const updateUser = () => {
  setisBtnLoading(true)
   return axios.put(`${configData.SERVER_URL}/admin/updateAdmin/${id}`, {           
    fullName:fullName,      
    email:email,
    role:role
  })
  .then((response) => {
    console.log(response.data.data);
    if(response.data.status === "success"){
        setisBtnLoading(false)
        alert(response.data.message);
    }
    if (response.data.status === "error") {
        setisBtnLoading(false)
        alert(response.data.message);
    }
  });
}

const deleteUser = (id) =>{
  if (!window.confirm("are you sure you want to delete this user?")) {
    return
  }
  setisBtnLoading(true)
      
    axios.delete(`${configData.SERVER_URL}/admin/deleteAdmin/${id}`)
    .then((response) => {
      console.log(response);
      if(response.data.status === "success"){
          setisBtnLoading(false)
          alert(response.data.message);
      }
      if (response.data.status === "error") {
          setisBtnLoading(false)
          alert(response.data.message);
      }
    });
}


  return (
    <>
    
    <div className="contain">

        <div className="sidebar" id="sideBar">
             <Sidebar/>
        </div>
        <div className="main" id="mainBg"> 
           <Col lg="12">
             <NavToggle/>
           </Col>


           <Col lg="12">

                <Row>
    

                    <Col lg="10">
                        <Row>

                 
                      <Col lg="12">
                              <div class="col-md-12 mt-5">
                                  <div class="container" id="container">
                                    <div class="row">
                                      <div class="col-md-6">
                                          <span class="h4">Admin</span>
                                          </div>
                                        <div class="col-md-6 search">
                                            <input class="form-control" type="text" placeholder="Search" aria-label="Search"/>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                             </Col>

                          
                            <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                                <div class="category-menu">
                                
                                <ul class="nav">
                                    {/* <li class="nav-item"> 
                                      <a class="nav-link" href="#"><i class="fa fa-long-arrow-alt-left"></i></a>
                                    </li> */}
                                    <li class="nav-item"> 
                                      <a class="nav-link" href="#">Admin</a>
                                    </li>
                                  </ul>
                                      <span class="line"></span>
                                      
                                      <ul class="nav lastNav">
                                          <li class="nav-item">
                                            <a class="nav-link activ" aria-current="page" href="#">All</a>
                                          </li>
                                          <li class="nav-item"> 
                                            <a class="nav-link" href="#">Admin</a>
                                          </li>
                                          <li class="nav-item"> 
                                            <a class="nav-link" href="#">Maintainal</a>
                                          </li>
                                        </ul>

                                  </div>      
                            </Col>





                            <Col lg="12">

                                <Row className="mt-5">
                                    <Col lg="9">
                                    <p>List of all Admins</p>   
                                    </Col>
                                    <Col lg="3">
                                        <p className="btn-add" onClick={handleShow}>Add Admin</p>
                                    </Col>
                                </Row>
                            
                            </Col>


                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                      {/* <th>#</th> */}
                                      <th>Full Name</th>
                                      <th>Email</th>
                                      <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                  
                            {user.map(u => (
                                   <tr className="list" key={u._id}>
                                        {/* <td>{u.id}</td> */}
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td><span variant="primary" onClick={() => editUser(u)} class="fa fa-edit mr-3"></span></td>
                                        <td>
                                            <span variant="primary" onClick={() => deleteUser(u.id)} class="fa fa-trash mr-3"></span>
                                        </td>
                                    </tr>
                                ))}

                                </tbody>
                            </Table>
                      
                         </Row>
                    </Col>
                    <Col lg="4">
                        </Col>

                </Row>


           </Col>



                
        </div>

    </div>









      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Users</Modal.Title>
        </Modal.Header>


        <form onSubmit={handleSubmit(adminAdd)} className="pt-3"  enctype="multipart/form-data" id="submit">
        <Modal.Body>

            <Row>

            
            <Col lg="12"></Col>
                    <Col lg="2"></Col>
                    <Col lg="8">
                                        <div className="d-flex search-field form-group">
                                           <input placeholder="Full Name" type="text" className="h-auto form-control " name="fullName" ref={register({ required: true, })} />
                                              {errors.fullName && <div className="alert alert-danger" role="alert">Full Name Required</div>}
                                         </div>
                                        <div className="d-flex search-field form-group mt-3">
                                           <input placeholder="Email" type="email" className="h-auto form-control " name="email"  ref={register({ required: true, })} />
                                              {errors.email && <div className="alert alert-danger" role="alert">Email Required</div>}
                                         </div>

                                        <div class="form-group mt-3">
                                            <label className=" mb-2" for="exampleFormControlSelect1">Select Role</label>
                                            <select class="form-control"  name="role" ref={register({ required: true })}>
                                              <option value='admin'>Admin</option>
                                              <option value='maintain'>Maintain</option>
                                                
                                            </select>
                                        </div>
                                        <div className="mt-4 mb-4">
                                         </div>

                             </Col>

                    <Col lg="2"></Col>

              </Row>

              


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary"  type="submit" disabled={isBtnLoading}>     
             {isBtnLoading ? (<>LOADING</>) : (<>Add Admin</>)}
          </Button>
        </Modal.Footer>
          </form>
      </Modal>


      
      <Modal show={showTwo} onHide={handleTwoClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>


        <form onSubmit={handleSubmit(updateUser)} className="pt-3"  enctype="multipart/form-data" id="submit">
        <Modal.Body>

            <Row>

            
            <Col lg="12"></Col>
                    <Col lg="2"></Col>
                    <Col lg="8">


                    <div className="d-flex search-field form-group">
                                           <input placeholder="Full Name" type="text" className="h-auto form-control " name="fullName" value={fullName}  onChange={(e) => setFullName(e.target.value)}/>
                                              {/* {errors.fullName && <div className="alert alert-danger" role="alert">Full Name Required</div>} */}
                                         </div>
                                        <div className="d-flex search-field form-group mt-3">
                                           <input placeholder="Email" type="email" className="h-auto form-control " name="email"  value={email}  onChange={(e) => setFullName(e.target.value)}/>
                                              {/* {errors.email && <div className="alert alert-danger" role="alert">Email Required</div>} */}
                                         </div>
                                        <div class="search-field form-group mt-3">
                                            <label className=" mb-2" for="exampleFormControlSelect1">Select Role</label>
                                            <select class="form-control"  name="role"  value={role}  onChange={(e) => setRole(e.target.value)}>
                                              <option value='admin'>Admin</option>
                                              <option value='maintain'>Maintain</option>
                                                
                                            </select>
                                        </div>
                                        <div className="mt-4 mb-4">
                                         </div>
                      

                     </Col>
                    <Col lg="2"></Col>

              </Row>

              


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTwoClose}>
            Close
          </Button>
          <Button variant="primary"  type="submit" disabled={isBtnLoading}>     
             {isBtnLoading ? (<>LOADING</>) : (<>Update Admin</>)}
          </Button>
        </Modal.Footer>
          </form>
      </Modal>
  


    </>
  );
}

export default Admin;
