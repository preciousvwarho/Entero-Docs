
import React, {useState, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import { Table, Button, Row, Col, Modal, Nav } from 'react-bootstrap';
import img from './assets/img/The-Cove.png'
import img1 from './assets/img/Adiva2.jpeg'
import img2 from './assets/img/COVE-LOFT.png'
import img3 from './assets/img/Tunisia_-Alhambra.jpeg'
import img4 from './assets/img/1.jpeg'
import img5 from './assets/img/2.jpeg'

function AdminDash() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <>
    
    <div className="contain">

        <div className="sidebar">


           <Col className="pt-5" lg="12"></Col>
           <Col className="pt-5" lg="12">
                <Nav defaultActiveKey="/" className="flex-column">
                    <Nav.Link href="/" className="">
                        <span class="fa fa-home mr-3"></span> Dashboard
                    </Nav.Link>
                    <Nav.Link href="/Admin" eventKey="link-1">
                        <span class="fa fa-users mr-3"></span> Admin
                    </Nav.Link>
                    <Nav.Link href="/Documents">
                        <span class="fa fa-file-alt mr-3"></span> Documents
                      </Nav.Link>
                    <Nav.Link href="/Estates" eventKey="link-3">
                        <span class="fa fa-landmark mr-3"></span> Estates
                      </Nav.Link>
                </Nav>
            </Col>
           <Col className="pt-5" lg="12">
                    <Nav.Link eventKey="link-3">
                        <span class="fa fa-sign-out-alt mr-3"></span> Logout
                    </Nav.Link>
                        </Col>
            

        </div>
        <div className="main"> 
           <Row>


                    <Col lg="8" className="mainOne">

                        <Row>

                              <Col lg="12">
                                    <Col lg="12">
                                    <Row>
                                        <Col lg="6">
                                            <h4>Welcome Anthony</h4>
                                        </Col>
                                        <Col lg="6">
                                        </Col>
                                    </Row>
                                    </Col>

                              {/* <Col className="mt-3" lg="12">
                                  <h5>Welcome,<br/> Anthony Moroh</h5>
                                </Col> */}

                                {/* <Row> */}

                              <div className="subsec">
                                    <div className="cad cad1">
                                      <span class="fa fa-file-alt mr-3"></span>
                                      <p>Documents</p>
                                      <span className="noOf">2,000</span>
                                    </div>
                                    <div className="cad cad2">
                                      <span class="fa fa-landmark mr-3"></span>
                                      <p>Estates</p>
                                      <span className="noOf">2,000</span>
                                    </div>
                                    <div className="cad cad3">
                                      <span class="fa fa-users mr-3"></span>
                                      <p>Admins</p>
                                      <span className="noOf">2,000</span>
                                    </div>
                                    <div className="cadhide"></div>
                                </div>
          
                                {/* </Row> */}

                                <Row>
                                    <Col lg="12">
                                      <div className="proCon mt-4">

                                          {/* <div className="add">
                                            <h4>ADD</h4>
                                          </div> */}
                                          <div className="proCad">
                                            <img src={img} class="d-block w-100 proImg" alt="..."/>
                                            <div class="itemDetails">
                                                <span>Igwruta Ali</span>
                                                <h4>Rose Garden Estate</h4>
                                                {/* <span>₦ 5,500,000</span> */}
                                              </div>
                                          </div>
                                          <div className="proCad">
                                            <img src={img1} class="d-block w-100 proImg" alt="..."/>
                                            <div class="itemDetails">
                                                <span>Igwruta Ali</span>
                                                <h4>Rose Garden Estate</h4>
                                                {/* <span>₦ 5,500,000</span> */}
                                              </div>
                                          </div>
                                          <div className="proCad">
                                            <img src={img2} class="d-block w-100 proImg" alt="..."/>
                                            <div class="itemDetails">
                                                <span>Igwruta Ali</span>
                                                <h4>Rose Garden Estate</h4>
                                                {/* <span>₦ 5,500,000</span> */}
                                              </div>
                                          </div>
                                          <div className="proCad">
                                            <img src={img3} class="d-block w-100 proImg" alt="..."/>
                                            <div class="itemDetails">
                                                <span>Igwruta Ali</span>
                                                <h4>Rose Garden Estate</h4>
                                                {/* <span>₦ 5,500,000</span> */}
                                              </div>
                                          </div>
                                          <div className="proCad">
                                            <img src={img4} class="d-block w-100 proImg" alt="..."/>
                                            <div class="itemDetails">
                                                <span>Igwruta Ali</span>
                                                <h4>Rose Garden Estate</h4>
                                                {/* <span>₦ 5,500,000</span> */}
                                              </div>
                                          </div>
                                          <div className="proCad">
                                            <img src={img5} class="d-block w-100 proImg" alt="..."/>
                                            <div class="itemDetails">
                                                <span>Igwruta Ali</span>
                                                <h4>Rose Garden Estate</h4>
                                                {/* <span>₦ 5,500,000</span> */}
                                              </div>
                                          </div>
                                      </div>

                                      </Col>
                                </Row>
                                    

                              </Col>
                              
                          </Row>

                      </Col>


                      <Col lg="4">
          
                              <Row>
                                  <Col lg="12">

                                  {/* <div className="mt-3 tableContent">
                                    <p>Recently added Documents</p>

                                      <Table striped bordered hover  variant="dark">
                                          <thead>
                                              <tr>
                                                  <th>Name</th>
                                                  <th>Estate</th>
                                                  <th>Plots</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              <tr className="list">
                                                  <td>Mark Otto</td>
                                                  <td>Thornton@mdo.com</td>
                                                  <td>1</td>
                                              </tr>
                                              <tr>
                                                  <td>Jacob</td>
                                                  <td>Thornton@fat.com</td>
                                                  <td>1</td>
                                              </tr>
                                              <tr>
                                                  <td>Larry Bird</td>
                                                  <td>Thornton@twitter.com</td>
                                                  <td>1</td>
                                              </tr>
                                          </tbody>
                                      </Table>


                                  </div>
                                     */}
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

export default AdminDash;
