import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Row, Col, Modal, Accordion} from 'react-bootstrap';
import configData from "../../config.json";

const AddFaq = (props) => {
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);


    const {id} = props;

    const [faq, setFaq] = useState([])
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [faqId, setFaqId] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => {
      setContent('')
      setTitle('')
      setIsEdit(false)
      setShow(true)
    };

    const addNewFAQ =  async () => {
  

        setisBtnLoading(true);
    
        const formData = {
            title: title,
            content:content
        }
    
    
        await axios.post(`${configData.SERVER_URL}/estate/addFaq/${id}`, formData)
        .then((response) => {
          setisBtnLoading(false)
          console.log(response);
          if(response.data.status === "success"){
              setisBtnLoading(false);
              // alert(response.data.message);
              setTitle('');
              setContent('')
              getFAQ();
              // setShow(false);
              // window.location.reload(true);
            }
          if(response.data.status === "error"){
            setisBtnLoading(false);
            alert(response.data.message);
          }
        });

    }

    const getFAQ = () => {

        setisBtnLoading(true);

        return axios.get(`${configData.SERVER_URL}/estate/getFaq/${id}`).then((response) => {
            console.log(response.data);
            if(response.data.status === "success"){
                setisBtnLoading(false)
                setFaq(response.data.data);
            }
            if (response.data.status === "error") {
                setisBtnLoading(false)
                alert(response.data.message);
            }
          });


     }

     const deleteFaq = (id) => {

          if (!window.confirm("are you sure you want to delete this?")) {
            return
          }
          setisBtnLoading(true)
              
            axios.delete(`${configData.SERVER_URL}/estate/deleteFAQ/${id}`)
            .then((response) => {
              console.log(response);
              if(response.data.status === "success"){
                  setisBtnLoading(false)
                  alert(response.data.message);
                  getFAQ();
              }
              if (response.data.status === "error") {
                  setisBtnLoading(false)
                  alert(response.data.message);
              }
            });
     }

     const editFaq = (f) => {
        setTitle(f.title);
        setContent(f.content);
        setFaqId(f.id)
        setIsEdit(true);
        setShow(true);
      }

     const updateFaq = () => {

              setisBtnLoading(true)
              return axios.put(`${configData.SERVER_URL}/estate/editFaq/${faqId}`, {  
              title:title,
              content:content,
            })
            .then((response) => {
              console.log(response.data);
              if(response.data.status === "success"){
                  setisBtnLoading(false)
                  getFAQ();
                  setShow(false);
                  alert(response.data.message);
              }
              if (response.data.status === "error") {
                  setisBtnLoading(false)
                  alert(response.data.message);
              }
            });


     }

    useEffect(() => {
        getFAQ();
      }, []);
  

    return (
        <>
            
            <Col lg="12">
                    <Row className="mt-5">
                        <Col lg="9">
                            <h5 className="">Add FAQ</h5>
                        </Col>
                        <Col lg="3">
                            <p className="btn-add" onClick={handleShow}
                            >Add FAQ</p>
                        </Col>
                        </Row>
                </Col>


                <Col lg="12" className="mt-4">
 
                    {faq && faq.length > 0 ?
                      faq.map(f => ( <>
                          <Accordion flush>
                              <Accordion.Item eventKey="0"  className={`${"wow fadeInUp"}`} data-wow-duration="0.8s">
                                  <Accordion.Header>
                                    <div className="faqFlex">
                                        {f.title} 
                                        <div>
                                            <span variant="primary" className="fa fa-edit mr-5" onClick={() => editFaq(f)}></span>
                                            <span variant="primary" className="fa fa-trash" onClick={() => deleteFaq(f.id)}></span>
                                        </div>
                                    </div>
                                  </Accordion.Header>
                                   <Accordion.Body>
                                     {f.content}
                                   </Accordion.Body>
                              </Accordion.Item>
                              </Accordion>
                 
                    </>)) 
                    :<>
                      <section className="container mt-5">
                          <div className="row justify-content-center align-items-center">
                                  <p style={{color:'#000', fontWeight:"bold", marginTop:'20px', fontSize:'20px', alignSelf:"center"}}>No FAQ Found</p>
                              </div>
                              </section>
                    </>
                    }     

                </Col>






           <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
              </Modal.Header>
                  <Modal.Body>

                            <Row>

                                                
                              <Col lg="1"></Col>

                              <Col lg="10" className="white-card">


                                    <div className="form-floating mt-3">
                                        <input placeholder="Event title" type="text" className="h-auto form-control" id="floatingInput" name="name"
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        />
                                        <label for="floatingInput">FAQ Title</label>
                                    </div>


                                    <div className="mt-4 form-floating">
                                        <textarea className="form-control" placeholder="FAQ Content" id="floatingTextarea2" name="content"  style={{height: "200px"}} value={content} onChange={(e) => setContent(e.target.value)}/>
                                        <label for="floatingTextarea2">Content</label>

                                        </div>

                                  </Col>

                              <Col lg="1"></Col>




                            </Row>
            
                  
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  {isEdit ? 
                      <Button onClick={()=> updateFaq()} variant="primary" type="submit" disabled={isBtnLoading}>     
                      {isBtnLoading ? (<>Loading</>) : (<>Update FAQ</>)}
                      </Button>
                   : <>
                  <Button onClick={()=> addNewFAQ()} variant="primary" type="submit" disabled={isBtnLoading}>     
                      {isBtnLoading ? (<>Loading</>) : (<>Add FAQ</>)}
                  </Button>
                  </>}
                </Modal.Footer>


            </Modal>

        </>
    );
};

export default AddFaq;