
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offcanvas, Button, Row, Col, Modal} from 'react-bootstrap';
import configData from "../../../config.json";

const Offers = () => {
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [content, setContent] = useState('');
    const [type, setType] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (data) => {
        setType(data)
        setShow(true);
    };

    const addOffer = () => {

    }


    return (
        <>
            
        <Row className="mt-5 mb-5">
          <Col lg="5">
                  <Row className="">
                      <Col lg="8">
                          <h5 className="">Clients Offers</h5>
                      </Col>
                      <Col lg="4">
                        <p className="btn-add" onClick={() =>handleShow('Clients')}
                        >Add Offer</p>
                      </Col>
                  </Row>
              </Col>
              <Col lg="1"/>
          <Col lg="5">
                  <Row className="">
                      <Col lg="8">
                          <h5 className="">Marketers Offers</h5>
                      </Col>
                      <Col lg="4">
                        <p className="btn-add" onClick={() =>handleShow('marketers')}
                        >Add Offer</p>
                      </Col>
                  </Row>
              </Col>
          </Row>



        <Modal show={show} onHide={handleClose}>
        
        <Modal.Header closeButton>
          <Modal.Title>{type} Offer</Modal.Title>
        </Modal.Header>
            <Modal.Body>

          <Row>

                                
            <Col lg="1"></Col>

            <Col lg="10" className="white-card">


                <div className="form-floating mt-3">

                <textarea className="form-control" placeholder="Offer Content" id="floatingTextarea2" name="content"  style={{height: "200px"}} value={content} onChange={(e) => setContent(e.target.value)}/>
                 <label for="floatingTextarea2">Content</label>
                </div>

                <div className="row g-2">
                    <div className="col-md">
                        <div className="form-floating mt-3">
                                
                            </div>
                        </div>
                </div>

                </Col>

            <Col lg="1"></Col>




           </Row>
      
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
              <Button onClick={()=> addOffer()} variant="primary" type="submit" disabled={isBtnLoading}>     
                  {isBtnLoading ? (<>Loading</>) : (<>Add Offer</>)}
              </Button>
          </Modal.Footer>
          
      </Modal>

    
        </>
    );
};

export default Offers;