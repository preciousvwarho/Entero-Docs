import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Row, Col, Modal} from 'react-bootstrap';
import configData from "../../config.json";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const AddImages = (props) => {
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);


    const {id} = props;

    const [picture, setPicture] = useState("");
    const [images, setImages] = useState([])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addImg =  async (e) => {
        console.log(id)

        setisBtnLoading(true);
  
        e.preventDefault()
  
        const formData = new FormData()
        formData.append('picture', picture);


      await axios.post(`${configData.SERVER_URL}/estate/addImages/${id}`, formData)
      .then((response) => {
        setisBtnLoading(false)
        console.log(response);
        if(response.data.status === "success"){
            setisBtnLoading(false);
            alert(response.data.message);
            setShow(false);
          }
        if(response.data.status === "error"){
          setisBtnLoading(false);
          alert(response.data.message);
        }
      });

    }

    const getEstImg = () => {

        setisBtnLoading(true);

        return axios.get(`${configData.SERVER_URL}/estate/getImages/${id}`).then((response) => {
            console.log(response.data.data);
            if(response.data.status === "success"){
                setisBtnLoading(false)
                setImages(response.data.data);
            }
            if (response.data.status === "error") {
                setisBtnLoading(false)
                alert(response.data.message);
            }
          });


     }


    useEffect(() => {
        getEstImg();
      }, []);
  




    return (
        <>
            
            <Col lg="12">
                    <Row className="mt-5">
                        <Col lg="9">
                            <h5 className="">Add Estate Images</h5>
                        </Col>
                        <Col lg="3">
                            <p className="btn-add" onClick={handleShow}
                            >Add Estate</p>
                        </Col>
                        </Row>
                </Col>


                <Col lg="12" className="mt-4">

                    <OwlCarousel items={2} stagePadding={"50"} margin={8} autoplay={true}>  
                                {images && images.length > 0 ?
                                  images.map(img => ( <>
                                    <div>
                                      <img  className="img" src={`${configData.PIC_URL}/${img.picture}`}/>
                                    </div>  
                                  </>)) 
                                  :<>
                                    <section className="container mt-5">
                                        <div className="row justify-content-center align-items-center">
                                                <p style={{color:'#000', fontWeight:"bold", marginTop:'20px', fontSize:'20px', alignSelf:"center"}}>No Estate Image Found</p>
                                            </div>
                                            </section>
                                  </>
                                  }

                    </OwlCarousel> 

                </Col>






           <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
              </Modal.Header>
          <form className="pt-3" onSubmit={addImg} method="POST"   encType="multipart/form-data" id="submit" >
                  <Modal.Body>

                            <Row>

                                                
                              <Col lg="1"></Col>

                              <Col lg="10" className="white-card">


                              <div className="">
                                  <label className="form-label" for="customFile">Upload Estate Images</label>
                                  <input type="file" className="form-control" id="customFile" name="picture"
                                  onChange={(e)=> setPicture(e.target.files[0])}/>
                                  </div>

                                  </Col>

                              <Col lg="1"></Col>




                            </Row>
            
                  
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit" disabled={isBtnLoading}>     
                      {isBtnLoading ? (<>Loading</>) : (<>Add Image</>)}
                  </Button>
                </Modal.Footer>
           </form>


            </Modal>

        </>
    );
};

export default AddImages;