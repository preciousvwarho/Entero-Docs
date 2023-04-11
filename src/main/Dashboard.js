
import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import NavToggle from './components/NavToggle';
import { Table, Button, Row, Col, Modal } from 'react-bootstrap';
import configData from "../config.json";
import { Context } from '../Store';

function Dashboard() {
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [state, setState] = useContext(Context);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [estate, setEstate] = useState([])
    const [doc, setDoc] = useState(0)
    const [esateCount, setEstateCount] = useState(0)
    const [user, setUser] = useState(0)

    const fullName =  window.localStorage.getItem("fullName");

    const getEstates = () => {
      setisBtnLoading(true)
      return axios.get(`${configData.SERVER_URL}/estate/getEstate`).then((response) => {
          setEstateCount(response.data.data.length)
          setEstate(response.data.data);

           setisBtnLoading(false)
        });
  
     }

     const getAdmin = () => {


      return axios.get(`${configData.SERVER_URL}/admin/getAllAdmin`).then((response) => {
          setUser(response.data.data.length);
        });
  
     }
  

     const getDoc = () => {
      setisBtnLoading(true);
      const page = 1;

      return axios.get(`${configData.SERVER_URL}/document/getAllDocuments?page=${page}`).then((response) => {
        console.log(response)
          setDoc(response.data.count);
          setisBtnLoading(false);
        });
  
     }
  
  

      useEffect(() => {
        getDoc();
        getEstates();
        getAdmin();
        const interval = setInterval(() => {
          getDoc();
          getEstates();
          getAdmin();
        }, 3000);
    
        return () => clearInterval(interval);
      }, []);



  return (
    <>
    
    <div className="contain">

        <div className="sidebar" id="sideBar">
             <Sidebar/>
        </div>
        <div className="main" id="mainBg"> 
           <Row>
                  <Col lg="12">
                      <NavToggle/>
                    </Col>

                    <Col lg="12" className="mt-5">
                      <Row>
                         <Col lg="6">
                             <h4>Hey, {fullName}!</h4>
                             <span>Welcome to Entero Documents</span>
                         </Col>
                         <Col lg="6">
                         </Col>
                      </Row>
                    </Col>


                    <Col lg="8">

                        <Row>

                              <Col lg="12">

                              <Col className="mt-3" lg="12">
                                  <h5></h5>
                                </Col>

                                {/* <Row> */}

                              <div className="subsec">
                                    <div className="cad cad1">
                                      <span class="fa fa-file-alt mr-3"></span>
                                      <p>Documents</p>
                                      <span className="noOf">{doc}</span>
                                    </div>
                                    <div className="cad cad2">
                                      <span class="fa fa-landmark mr-3"></span>
                                      <p>Estates</p>
                                      <span className="noOf">{esateCount}</span>
                                    </div>
                                    <div className="cad cad3">
                                      <span class="fa fa-users mr-3"></span>
                                      <p>Admins</p>
                                      <span className="noOf">{user}</span>
                                    </div>
                                    <div className="cadhide"></div>
                                </div>
          
                                {/* </Row> */}

                                <Row>
                                    <Col lg="12">
                                      <div className="proCon mt-4">

                            {estate && estate.length > 0
                                ? estate.map(e => {
                                    return <>

                                    <div className="proCad" key={e.id}>
                                      <img  src={`${configData.PIC_URL}/${e.image}`} class="d-block w-100 proImg" alt={e.name}/>
                                      <div class="itemDetails">
                                          <span>{e.location}</span>
                                          <h4>{e.name}</h4>
                                          {/* <span>₦ 5,500,000</span> */}
                                        </div>
                                    </div>

                                </> })
                                :<section className="container mt-5">
                                <div className="row justify-content-center align-items-center">
                                        <p style={{color:'#000', fontWeight:"bold", marginTop:'20px', fontSize:'20px', alignSelf:"center"}}>No Estate Found</p>
                                    </div>
                                 </section>}
                                      </div>

                                      </Col>
                                </Row>
                                    

                              </Col>
                              
                          </Row>

                      </Col>


                      <Col lg="4">
          
                              <Row>
                                  <Col lg="12">

                                  <div className="mt-3 tableContent">
                                    <p>Recently added Documents</p>

                                      <Table striped bordered hover  variant="dark">
                                          <thead>
                                              <tr>
                                                  <th>Full Name</th>
                                                  <th>Email</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              <tr className="list">
                                                  <td>Mark Otto</td>
                                                  <td>Thornton@mdo.com</td>
                                              </tr>
                                              <tr>
                                                  <td>Jacob</td>
                                                  <td>Thornton@fat.com</td>
                                              </tr>
                                              <tr>
                                                  <td>Larry Bird</td>
                                                  <td>Thornton@twitter.com</td>
                                              </tr>
                                          </tbody>
                                      </Table>


                                  </div>
                                    
                                    </Col>
                              </Row>

                        </Col>

           </Row>

                
        </div>

    </div>









      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dashboard;
