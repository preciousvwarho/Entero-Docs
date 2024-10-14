import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../Layout';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import configData from "../../config.json";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { io } from 'socket.io-client';
import { toast } from "react-toastify";

function Estates() {

    const socket = io(`${configData.URL}`, {
       
    });

    socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
    });


  const { register, handleSubmit, reset, errors } = useForm();

    const history = useHistory();
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [estate, setEstate] = useState([])
    const [all, setAll] = useState(true);
    const [available, setAvailable] = useState(false);
    const [soldOut, setSoldOut]  = useState(false);
    const [search, setSearch] = useState('')
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const addEstate = async (data) => {


      try {

      setisBtnLoading(true);
    
      const formData = new FormData()
      formData.append('image',data?.image[0]);
      formData.append('name', data?.name);
      formData.append('mapIdentifier', data?.mapIdentifier);
      formData.append('price', data?.price);
      formData.append('priceTwo', data?.priceTwo);
      formData.append('promoPrice', data?.promoPrice);
      formData.append('size', data?.size);
      formData.append('location', data?.location);
      formData.append('features', data?.features);
      formData.append('pageContent', data?.pageContent);
      formData.append('isSoldOut', isSoldOut);
 

        const response = await fetch(`${configData.SERVER_URL}/estate/addEstate`, {
          method: "post",
          headers: {
            // 'Content-Type': 'multipart/form-data',
            "x-auth-token":  window.localStorage.getItem("token")
          },
          body: formData,
        });
        const responseJson = await response.json();

        if (responseJson.status === "success") {
              setisBtnLoading(false);
              reset();
              toast.success(responseJson.message);
             setShow(false);
        }
        if (responseJson.status === "error") {
              setisBtnLoading(false);
              toast.error(responseJson.message);
        }
      } catch (error) {
              setisBtnLoading(false);
              console.error(error);
      }
  

    }


    const getEstates = async () => {

        setisBtnLoading(true);
      const response = await axios.get(`${configData.SERVER_URL}/estate/getEstate`);
      console.log(response.data.data);
      setEstate(response.data.data);
      setAll(true);
      setAvailable(false);
      setSoldOut(false);
      setisBtnLoading(false);
  
     }
  
     const getAvaliableEstate = async () => {

      setisBtnLoading(true);
      // const response = await axios.get(`${configData.TEST_URL}/estate/getAvaliableEstate`);
      //  console.log(response.data.data);
      //  setEstate(response.data.data);
       setisBtnLoading(false);
       setAvailable(true);
       setAll(false);
       setSoldOut(false);
  
     }
   
     const getSoldOutEstate = async () => {
      setisBtnLoading(true);
      // const response = await axios.get(`${configData.TEST_URL}/estate/getSoldOutEstate`);
      //  console.log(response.data.data);
      //  setEstate(response.data.data);
       setisBtnLoading(false);
       setSoldOut(true);
       setAll(false);
       setAvailable(false);
  
     } 

      useEffect(() => {
        getEstates();
      }, []);

        
    const editEstate = (data) => {
      history.push({
        pathname:`/Estate/${data.name}/${data._id}`, 
        state: { data: data }})
    }

    const searchEstate = async () => {

       setisBtnLoading(false);
       
       const response = await axios.get(`${configData.TEST_URL}/estate/searchEstate/${search}`);
      console.log(response);
      setEstate(response.data.data);
      setisBtnLoading(false);
    }




  return (
    <>
        
        <Layout>

<div className="mainBox">


       <div className='mBoxOne' style={{width: '100%'}}>


            <div className="heading-section">
              <div className="navSection">
                {/* <span className="inactiveText">Dashboard</span>
                <span className="activeArrow">{">"}</span> */}
                <span className="activeText">Estate/Layout</span>
              </div>

            </div>

          <div style={{width: '90%'}}>

            <div className="mContent">
                    


                      <Col lg="12">
                          <Row>



                        {isBtnLoading ? (<> 

                          <div className="col-md-12 d-flex justify-content-center pt-5 pb-5">
                          <div class="spinner-border" role="status">
                          </div>
                          </div>

                          </>) 

                          : (<>

                              <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                                  <div className="category-menu">

                                  <ul className="nav">
                                      <li className="nav-item">
                                        <a className="nav-link" href="#">Estates</a>
                                      </li>
                                    </ul>
                                        <span className="line"></span>
                                        
                                        <ul className="nav lastNav">
                                            <li className="nav-item">
                                              <a className={ `nav-link ${all && 'activ'}` } href="javascript:void(0)" onClick={getEstates}>All</a>
                                              </li>
                                            <li className="nav-item">
                                              <a className={ `nav-link ${available && 'activ'}` }aria-current="page" href="javascript:void(0)" onClick={getAvaliableEstate}>Available</a>
                                            </li>
                                            <li className="nav-item">
                                              <a className={ `nav-link ${soldOut && 'activ'}` }href="javascript:void(0)" onClick={getSoldOutEstate}>SoldOut</a>
                                            </li>
                                          </ul>

                                    </div>      
                              </Col>


                            



                              <Col lg="12">
                                  <Row className="mt-5">
                                      <Col lg="9">
                                      <p>List of Estates</p>   
                                      </Col>
                                      <Col lg="3">
                                          <p className="btn-add" onClick={handleShow}>Add Estates</p>
                                      </Col>
                                  </Row>
                              
                              </Col>

                              <Col lg="12">
                          <div className="estCon">

                              {estate && estate.length > 0
                                  ? estate.map(e => {
                                      return <>

                                      <div onClick={() => editEstate(e)} className="estCad" key={e._id}>
                                          <img crossorigin="anonymous" src={`${configData.PIC_URL}/${e.image}`} className="d-block w-100 proImg" alt={e.name}/>
                                          <div className="itemDetails">
                                              <span>{e.location}</span>
                                              <h4>{e.name}</h4>
                                              <span className="flex">
                                                  <span variant="primary"  className="fa fa-eye mr-3"></span>
                                              </span>
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

  
                              </>)}  
                              
                          </Row>
                      </Col>
                  


            </div>

          </div>

        </div>

        
</div>

</Layout>






      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Estate</Modal.Title>
              </Modal.Header>
        <form className="pt-3"  onSubmit={handleSubmit(addEstate)} encType="multipart/form-data" id="submit" >
             <Modal.Body>



                        <Col lg="12">


                            <Row>

                                                
                              <Col lg="1"></Col>

                              <Col lg="10" className="white-card">

                              <div className="">
                                  <label className="form-label" for="customFile">Upload Estate Image</label>
                                  <input type="file" className="form-control" id="customFile" name="image"
                                   ref={register({ required: true})} />
                                  </div>

                                <div className="form-floating mt-3">
                                  <input placeholder="Estate Name" type="text" className="h-auto form-control" id="floatingInput" name="name" ref={register({ required: true})} />
                                  {errors.name && <span className="alert alert-danger" role="alert">Estate Name is Required</span>}
                                  <label for="floatingInput">Estate Name</label>
                                  </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="price" type="text" className="h-auto form-control " name="price" ref={register({ required: true})} />
                                                {errors.price && <span className="alert alert-danger" role="alert">Estate price is Required</span>}
                                                <label for="floatingInput">Price</label>
                                            </div>
                                       </div>

                                     <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="location" type="text" className="h-auto form-control " name="promoPrice" ref={register({ required: false})} />
                                            <label for="floatingInput">Promo Price</label>
                                          </div>
                                     </div>
                                 </div>

                                  <div className="row g-2">
                                      <div className="col-md">
                                          <div className="form-floating mt-3">
                                                  <input placeholder="size" type="text" className="h-auto form-control " name="size"  ref={register({ required: true})} />
                                                {errors.size && <span className="alert alert-danger" role="alert">Estate size is Required</span>}
                                                  <label for="floatingInput">Per Square Meter</label>
                                              </div>
                                      </div>

                                      <div className="col-md">
                                          <div className="form-floating mt-3">
                                              <input placeholder="Price Two" type="text" className="h-auto form-control " name="priceTwo"  ref={register({ required: false})} />
                                              <label for="floatingInput">Price Abrev</label>
                                              </div>
                                      </div>
                                  </div>

                                 <div className="form-floating mt-3">
                                    <input placeholder="location" type="text" className="h-auto form-control " name="location"
                                            ref={register({ required: true})} />
                                            {errors.location && <span className="alert alert-danger" role="alert">Estate location is Required</span>}
                                              <label for="floatingInput">Location</label>
                                  </div>


                                 <div className="form-floating mt-3">
                                     <input placeholder="Estate Features" type="text" className="h-auto form-control" id="floatingInput" name="features" ref={register({ required: true})} />
                                            {errors.features && <span className="alert alert-danger" role="alert">Estate features are Required</span>}
                                     <label for="floatingInput">Estate Features</label>
                                  </div>
                                  

                                  <div className="mt-3 form-floating">
                                      <textarea className="form-control" placeholder="Page Content here" id="floatingTextarea2" name="pageContent"  style={{height: "100px"}} 
                                      ref={register({ required: true})} />
                                      {errors.pageContent && <span className="alert alert-danger" role="alert">Estate Description are Required</span>}
                                      <label for="floatingTextarea2">Estate Content</label>
                                  </div>

                                  <div className="mb-3 mt-3 form-check">
                                      <input type="checkbox" className="form-check-input"  name="isSoldOut" id="exampleCheck1"
                                      onChange={(e)=> setIsSoldOut(e.target.checked)}/>
                                      <label className="form-check-label" for="exampleCheck1">Please check if property is sold out</label>
                                   </div>


                                <div className="form-floating mt-3">
                                  <input placeholder="Estate Name" type="text" className="h-auto form-control" id="floatingInput" name="mapIdentifier" ref={register({ required: true})} />
                                  {errors.mapIdentifier && <span className="alert alert-danger" role="alert">Map Identifier is Required</span>}
                                  <label for="floatingInput">Map Identifier</label>
                                  </div>

                                  </Col>

                              <Col lg="1"></Col>




                            </Row>
                                
                           </Col>


                
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary"   type="submit" disabled={isBtnLoading}>     
                     {isBtnLoading ? (<>Loading</>) : (<>Add Estate</>)}
                </Button>
              </Modal.Footer>
       </form>


      </Modal>
    </>
  );
}

export default Estates;
