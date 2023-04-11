import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import configData from "../config.json";
import { useHistory } from "react-router-dom";
import NavToggle from './components/NavToggle';

function Estates() {

    const history = useHistory();
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [priceTwo, setPriceTwo] = useState('');
    const [promoPrice, setPromoPrice] = useState('')
    const [size, setSize] = useState('')
    const [location, setLocation] = useState('');
    const [features, setFeatures] = useState('');
    const [pageContent, setPageContent] = useState('');
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [estate, setEstate] = useState([])
    const [all, setAll] = useState(true);
    const [available, setAvailable] = useState(false);
    const [soldOut, setSoldOut]  = useState(false);
    const [search, setSearch] = useState('')
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const addEstate = async (e) => {

      setisBtnLoading(true);

      e.preventDefault()

      const formData = new FormData()
      formData.append('image', image);
      formData.append('name', name);
      formData.append('price', price);
      formData.append('priceTwo', priceTwo);
      formData.append('promoPrice', promoPrice);
      formData.append('size', size);
      formData.append('location', location);
      formData.append('features', features);
      formData.append('pageContent', pageContent);
      formData.append('isSoldOut', isSoldOut);


      await axios.post(`${configData.SERVER_URL}/estate/addEstate`, formData)
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


    const getEstates = () => {

        setisBtnLoading(true);
      return axios.get(`${configData.SERVER_URL}/estate/getEstate`).then((response) => {
          console.log(response.data.data);
          setEstate(response.data.data);
          setAll(true);
          setAvailable(false);
          setSoldOut(false);
          setisBtnLoading(false);
        });
  
     }
  
     const getAvaliableEstate = () => {

      setisBtnLoading(true);
      return axios.get(`${configData.SERVER_URL}/estate/getAvaliableEstate`).then((response) => {
          console.log(response.data.data);
          setEstate(response.data.data);
          setisBtnLoading(false);
          setAvailable(true);
          setAll(false);
          setSoldOut(false);
        });
  
     }
   
     const getSoldOutEstate = () => {
      setisBtnLoading(true);
      return axios.get(`${configData.SERVER_URL}/estate/getSoldOutEstate`).then((response) => {
          console.log(response.data.data);
          setEstate(response.data.data);
          setisBtnLoading(false);
          setSoldOut(true);
          setAll(false);
          setAvailable(false);
        });
  
     } 

      useEffect(() => {
        getEstates();
      }, []);

        
    const editEstate = (id) => {
      const estId = id;
      history.push(`/Estate-Details/${estId}`);
    }

    const searchEstate = () => {

       setisBtnLoading(false);
      //  return alert(search)
       return axios.get(`${configData.SERVER_URL}/estate/searchEstate/${search}`).then((response) => {
          console.log(response);
          setEstate(response.data.data);
          setisBtnLoading(false);
       })
    }




  return (
    <>
    
    <div className="contain" id="sideBar">

        <div className="sidebar" id="mainBg">
             <Sidebar/>
        </div>
        <div className="main"> 
                  <Col lg="12">
                      <NavToggle/>
                    </Col>


           <Col lg="12">

                <Row>


                    <Col lg="10">
                        <Row>



                        <Col lg="12">
                                <div className="col-md-12 mt-5">
                                    <div className="container" id="container">
                                      <div className="row">
                                        <div className="col-md-6">
                                        <span className="h4">Estates</span>
                                            </div>
                                          <div className="col-md-6 search">
                                              <input className="form-control" type="text" placeholder="Search" aria-label="Search" name="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                              <a href="javascript:void(0)" className='searchBtn' onClick={searchEstate}>
                                                <span variant="primary" className="fa fa-search mr-3"></span>
                                              </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                              </Col>

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

                                    <div className="estCad" key={e.id}>
                                        <img src={`${configData.PIC_URL}/${e.image}`} className="d-block w-100 proImg" alt={e.name}/>
                                        <div className="itemDetails">
                                            <span>{e.location}</span>
                                            <h4>{e.name}</h4>
                                            <span className="flex">
                                                <span variant="primary" onClick={() => editEstate(e.id)} className="fa fa-eye mr-3"></span>
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
                    <Col lg="4"></Col>

                </Row>


           </Col>



                
        </div>

      </div>



      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Estate</Modal.Title>
              </Modal.Header>
        <form className="pt-3" onSubmit={addEstate} method="POST"   encType="multipart/form-data" id="submit" >
             <Modal.Body>



                        <Col lg="12">


                            <Row>

                                                
                              <Col lg="1"></Col>

                              <Col lg="10" className="white-card">

                              <div className="">
                                  <label className="form-label" for="customFile">Upload Estate Image</label>
                                  <input type="file" className="form-control" id="customFile" name="image"
                                  onChange={(e)=> setImage(e.target.files[0])}/>
                                  </div>

                                <div className="form-floating mt-3">
                                  <input placeholder="Estate Name" type="text" className="h-auto form-control" id="floatingInput" name="name"
                                  value={name} 
                                  onChange={(e) => setName(e.target.value)}
                                  />
                                  <label for="floatingInput">Estate Name</label>
                                  </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="price" type="text" className="h-auto form-control " name="price" 
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}/>
                                                <label for="floatingInput">Price</label>
                                            </div>
                                       </div>

                                     <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="location" type="text" className="h-auto form-control " name="promoPrice"
                                            value={promoPrice} 
                                            onChange={(e) => setPromoPrice(e.target.value)}/>
                                            <label for="floatingInput">Promo Price</label>
                                          </div>
                                     </div>
                                 </div>

                                  <div className="row g-2">
                                      <div className="col-md">
                                          <div className="form-floating mt-3">
                                                  <input placeholder="size" type="text" className="h-auto form-control " name="price" 
                                                  value={size}
                                                  onChange={(e) => setSize(e.target.value)}/>
                                                  <label for="floatingInput">Per Square Meter</label>
                                              </div>
                                      </div>

                                      <div className="col-md">
                                          <div className="form-floating mt-3">
                                              <input placeholder="Price Two" type="text" className="h-auto form-control " name="price"
                                              value={priceTwo} 
                                              onChange={(e) => setPriceTwo(e.target.value)}/>
                                              <label for="floatingInput">Price Abrev</label>
                                              </div>
                                      </div>
                                  </div>

                                 <div className="form-floating mt-3">
                                    <input placeholder="location" type="text" className="h-auto form-control " name="location"
                                              value={location} 
                                              onChange={(e) => setLocation(e.target.value)}/>
                                              <label for="floatingInput">Location</label>
                                  </div>


                                 <div className="form-floating mt-3">
                                     <input placeholder="Estate Features" type="text" className="h-auto form-control" id="floatingInput" name="features"
                                  value={features} 
                                  onChange={(e) => setFeatures(e.target.value)}/>
                                     <label for="floatingInput">Estate Features</label>
                                  </div>
                                  

                                  <div className="mt-3 form-floating">
                                      <textarea className="form-control" placeholder="Page Content here" id="floatingTextarea2" name="pageContent"  style={{height: "100px"}} 
                                      value={pageContent} 
                                      onChange={(e) => setPageContent(e.target.value)}/>
                                      <label for="floatingTextarea2">Estate Content</label>
                                  </div>

                                  <div className="mb-3 mt-3 form-check">
                                      <input type="checkbox" className="form-check-input"  name="isSoldOut" id="exampleCheck1"
                                      onChange={(e)=> setIsSoldOut(e.target.checked)}/>
                                      <label className="form-check-label" for="exampleCheck1">Please check if property is sold out</label>
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
