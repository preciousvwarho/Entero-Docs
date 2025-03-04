import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Row, Col, Modal} from 'react-bootstrap';
import configData from "../../config.json";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useForm } from 'react-hook-form';

const AddImages = (props) => {
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const { register, handleSubmit } = useForm();


    const {id} = props;

    const [picture, setPicture] = useState("");
    const [images, setImages] = useState([])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addImg =  async (data) => {
      try {

        const imagesArray = Array.from(data.images);

        const formData = new FormData();
        imagesArray.forEach((image) => {
          formData.append('images', image);
        });


        // const formData = new FormData();
        // data.images.forEach((image) => {
        //   formData.append('images', image[0]);
        // });

        setisBtnLoading(true);


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

    } catch (error) {
      console.error('Error uploading images:', error);
    }

    }

    const getEstImg = async() => {

        setisBtnLoading(true);

        return axios.get(`${configData.SERVER_URL}/estate/getImages/${id}`).then((response) => {
            if(response.data.status === "success"){
                setisBtnLoading(false)
                setImages(response.data.data.images);
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
  

      const onDeleteImage = (index) => {

        if (!window.confirm("are you sure you want to delete this?")) {
          return
        }
        setisBtnLoading(true)
            
          axios.delete(`${configData.SERVER_URL}/estate/deleteImages/${id}/${index}`)
          .then((response) => {
            console.log(response);
            if(response.data.status === "success"){
                setisBtnLoading(false);
                getEstImg();
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
                                  images.map((img, index) => ( <>
                                    <div key={index}>
                                      <img 
                                      // crossorigin="anonymous" 
                                      className="img" src={`${configData.PIC_URL}/Images/${img}`}/>
                                      <button onClick={() => onDeleteImage(index)}>Delete</button>
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
          <form className="pt-3"  onSubmit={handleSubmit(addImg)}  encType="multipart/form-data" id="submit" >
                  <Modal.Body>

                            <Row>

                                                
                              <Col lg="1"></Col>

                              <Col lg="10" className="white-card">


                              <div className="">
                                  <label className="form-label" for="customFile">Upload Estate Images</label>
                                  <input  type="file" ref={register({ required: true })} className="form-control" id="customFile" name="images" multiple/>
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