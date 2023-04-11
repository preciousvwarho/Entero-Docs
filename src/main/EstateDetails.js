
import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import { Offcanvas, Button, Row, Col, Modal} from 'react-bootstrap';
import configData from "../config.json";
import { useParams, useHistory } from "react-router-dom";
import NumberFormat from 'react-number-format';
import NavToggle from './components/NavToggle';

import AddImages from './components/AddImages';
import AddFaq from './components/AddFaq';

function EstateDetails() {

    let { id } = useParams();
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [imgShow, setImgShow] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [priceTwo, setPriceTwo] = useState('');
    const [promoPrice, setPromoPrice] = useState('');
    const [size, setSize] = useState('')
    const [location, setLocation] = useState('');
    const [features, setFeatures] = useState('');
    const [pageContent, setPageContent] = useState('');
    const [isSoldOut, setIsSoldOut] = useState(false);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [plan, setPlan] = useState([]);
    const [planId, setPlanId] = useState();
    const [isEdit, setIsEdit] = useState(false);

    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = () => setShowOffcanvas(true);

    const handleClose = () => setShow(false);
    const handleShow = () => {
      setTitle();
      setAmount();
      setIsEdit(false);
      setShow(true);
    };


    const handClose = () => setImgShow(false);
    const handShow = () => setImgShow(true);

         
  
const updateEstate = async () => {
  
    setisBtnLoading(true)
     return axios.put(`${configData.SERVER_URL}/estate/editEstate/${id}`, {  
      name:name,
      price:price,
      priceTwo:priceTwo,
      promoPrice:promoPrice,
      size:size,
      location:location,
      features:features,
      pageContent:pageContent,
      isSoldOut:isSoldOut
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
 
  
  const getEstate = () => {

    setisBtnLoading(true);

    return axios.get(`${configData.SERVER_URL}/estate/getEstatePlan/${id}`).then((response) => {
        // console.log(response.data.data[0]);
        if(response.data.status === "success"){
            setisBtnLoading(false)
            setImage(response.data.data[0].image);
            setName(response.data.data[0].name);
            setPrice(response.data.data[0].price);
            setPriceTwo(response.data.data[0].priceTwo);
            setPromoPrice(response.data.data[0].promoPrice);
            setSize(response.data.data[0].size);
            setLocation(response.data.data[0].location);
            setFeatures(response.data.data[0].features);
            setPageContent(response.data.data[0].pageContent);
            setIsSoldOut(response.data.data[0].isSoldOut);
            setPlan(response.data.data[0].paymentPlan);
        }
        if (response.data.status === "error") {
            setisBtnLoading(false)
            alert(response.data.message);
        }
      });
   }


   const imageUpload = (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('image', image)

    // console.log(image)

    // setisBtnLoading(true);
     return axios.put(`${configData.SERVER_URL}/estate/imageUpload/${id}`, formData)
    .then((response) => {
      console.log(response);
      if(response.data.status === "success"){
          setisBtnLoading(false);
          alert(response.data.message);
      }
      if (response.data.status === "error") {
          setisBtnLoading(false);
          alert(response.data.message);
      }
    });
     
   }

   const feat = features.split(',');
   const pageCon = pageContent.split('<>');


    useEffect(() => {
      getEstate();
      // const interval = setInterval(() => {
      //   getEstate();
      // }, 3000);
  
      // return () => clearInterval(interval);
    }, []);

  

  const deleteEstate = () => {


    if (!window.confirm("are you sure you want to delete this user?")) {
      return
    }
    setisBtnLoading(true)
        
      axios.delete(`${configData.SERVER_URL}/estate/deleteEstate/${id}`)
      .then((response) => {
        console.log(response);
        if(response.data.status === "success"){
            setisBtnLoading(false)
            alert(response.data.message);
            history.push(`/Estates`);
        }
        if (response.data.status === "error") {
            setisBtnLoading(false)
            alert(response.data.message);
        }
      });
  }

  const addPlan = async() => {

    

    setisBtnLoading(true);

    const formData = {
        title: title,
        amount:amount
    }


    await axios.post(`${configData.SERVER_URL}/estate/addPlan/${id}`, formData)
    .then((response) => {
      setisBtnLoading(false)
      console.log(response);
      if(response.data.status === "success"){
          setisBtnLoading(false);
          alert(response.data.message);
          setShow(false);
          window.location.reload(true);
        }
      if(response.data.status === "error"){
        setisBtnLoading(false);
        alert(response.data.message);
      }
    });
  }

  const editPlan = (p) => {
    setTitle(p.title);
    setAmount(p.amount);
    setPlanId(p.id);
    setIsEdit(true)
    setShow(true);
  }

  const updatePlan = () => {
    setisBtnLoading(true)
    return axios.put(`${configData.SERVER_URL}/estate/editPlan/${planId}`, {  
    title:title,
    amount:amount,
  })
  .then((response) => {
    console.log(response.data);
    if(response.data.status === "success"){
        setisBtnLoading(false)
        getEstate();
        setShow(false);
        alert(response.data.message);
    }
    if (response.data.status === "error") {
        setisBtnLoading(false)
        alert(response.data.message);
    }
  });
  }


  const deletePlan = (planId) => {


    if (!window.confirm("are you sure you want to delete this Estate plan?")) {
      return
    }
    setisBtnLoading(true)
        
      axios.delete(`${configData.SERVER_URL}/estate/deletePlan/${planId}`)
      .then((response) => {
        console.log(response);
        if(response.data.status === "success"){
            setisBtnLoading(false)
            alert(response.data.message);
            window.location.reload(true);
        }
        if (response.data.status === "error") {
            setisBtnLoading(false)
            alert(response.data.message);
        }
      });
  }

  const back =()=>{
    history.push(`/Estates`);
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
                                  <div className="col-md-12 mt-5">
                                      <div className="container" id="container">
                                        <div className="row">
                                          <div className="col-md-6">

                                          <span variant="primary" className="fa fa-arrow-left mr-3"  onClick={back}></span>
                                          <span className="h4">Estate Details</span>
                                              </div>
                                          </div>
                                        </div>
                                      </div>
                                </Col>


                              <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                                  <div className="category-menu">

                                  <ul className="nav">
                                      <li className="nav-item">
                                        <a className="nav-link" href="#">Details</a>
                                      </li>
                                    </ul>
                                        <span className="line"></span>
                                        
                                        <ul className="nav lastNav">
                                            <li className="nav-item">
                                              <a className="nav-link" aria-current="page" href="#">
                                                <span variant="primary" className="fa fa-edit mr-3"  onClick={offCanvasShow}></span>
                                              </a>
                                            </li>
                                            <li className="nav-item">
                                              <a className="nav-link" href="#">
                                                 <span variant="primary" className="fa fa-trash mr-3" onClick={() => deleteEstate()}></span>
                                              </a>
                                              </li>
                                          </ul>

                                    </div>      
                              </Col>



                            <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                                  <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Edit Document</Offcanvas.Title>
                                  </Offcanvas.Header>
                                  <Offcanvas.Body>

                                      <Row>
                                          <Col lg="12" className='text-center'>


        <form className="pt-3" onSubmit={updateEstate}   method="PUT"   encType="multipart/form-data" id="submit" >

                            <Row>

                                                
                              <Col lg="1"></Col>

                              <Col lg="10" className="white-card">

                              {/* <div className="">
                                  <label className="form-label" for="customFile">Upload Estate Image</label>
                                  <input type="file" className="form-control" id="customFile" name="image"
                                  onChange={(e)=> setImage(e.target.files[0])}/>
                                  </div> */}

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
                                      onChange={(e)=> setIsSoldOut(e.target.checked)}
                                      checked={isSoldOut}/>
                                      <label className="form-check-label" for="exampleCheck1">Please check if property is sold out</label>
                                   </div>


                            <Button variant="primary" type="submit" disabled={isBtnLoading} style={{float: 'right'}}>     
                                {isBtnLoading ? (<>Loading</>) : (<>Update Estate</>)}
                            </Button>

                                  </Col>

                              <Col lg="1"></Col>




                            </Row>
                  


       </form>


                                            
                                          </Col>  
                                      </Row>
                                      
                                  </Offcanvas.Body>
                              </Offcanvas>

                                 
                        <section class="mt-4">
                                <div class="container detailsSec">
                                    <div class="row">
                                        <div class="col-md-5 wow fadeInUp">
                                            <img src={`${configData.PIC_URL}/${image}`} class="d-block w-100" alt="..."/>
                                  <Button variant="secondary" onClick={handShow}>
                                    update Image
                                  </Button>



                          <Modal show={imgShow} onHide={handClose}>
                              <Modal.Header closeButton>
                                <Modal.Title>Update Image</Modal.Title>
                              </Modal.Header>
                              <form onSubmit={imageUpload} method="POST" className="pt-3"  encType="multipart/form-data" id="submit">
                              <Modal.Body>


                                      <Row>

                                          
                                      <Col lg="2"></Col>
                                      <Col lg="8">
                                        <div className="">
                                            <input type="file" className="form-control" id="customFile" name="image"
                                            onChange={(e)=> setImage(e.target.files[0])}/>
                                        </div>

                                              </Col>

                                      <Col lg="2"></Col>

                                      </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={handClose}>
                                    Close
                                  </Button>
                                  <Button variant="primary" type="submit" disabled={isBtnLoading}>     
                                            {isBtnLoading ? (<>Loading</>) : (<>Submit</>)}
                                  </Button>
                                </Modal.Footer>
                                </form>
                              </Modal>


                                          </div>

                                        <div class="col-md-7 wow fadeInUp prop">
                                                <span class="prop-text">
                                                  {location}
                                                </span>
                                                    <h3 class="">
                                                         {name}

                                                        {isSoldOut === true ? <>
                                                          <span className="soldOut" href="#"> (Sold Out)</span></> :  <> <span className="acti" href="#">(Available)</span></>}
                                                    </h3>

                                            {pageCon.map(page => (
                                                    <p class="">{page}</p>
                                                  ))}
                                                
                                        </div>


                                        <div class="col-md-12 wow fadeInUp prop">
                                            <div class="row mt-4 mb-5">
                                                <div class="col-md-8">
                                                    <h4>Features:</h4>
                                                    <div class="row">
                                                        
                                                    {feat.map(feat => (
                                                        <div class="col-md-6">
                                                            <i class="fa fa-check-circle pop-icons"></i>
                                                            <span>{feat}</span>
                                                            </div>
                                                    ))}

                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <h4>Payment Plan:</h4>
                                                    <div class="priceBox mt-3">
                                                        <NumberFormat value={price} displayType={'text'} thousandSeparator={true} prefix={'Actual Price: ₦ '} renderText={text => <p class="price">{text}</p>} />
                                                    </div>
                                                    <div class="priceBox mt-3">
                                                        <NumberFormat value={promoPrice} displayType={'text'} thousandSeparator={true} prefix={'Promo Price: ₦ '} renderText={text => <p class="price">{text}</p>} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                    </div>

                                </div>
                    
                            </section>


                            <Col lg="12">
                                <Row className="mt-5">
                                    <Col lg="9">
                                        <h5 className="">Add Payment plan</h5>
                                    </Col>
                                    <Col lg="3">
                                      <p className="btn-add" onClick={handleShow}
                                      >Add Plan</p>
                                    </Col>
                                 </Row>
                            </Col>

                            <Col lg="8" className="mt-4">
                                
                                {plan && plan.length > 0 
                                ? plan.map(p => {
                                  return <>

                              <div class="priceBox plan mt-3">
                                  <NumberFormat value={p.amount} displayType={'text'} thousandSeparator={true} prefix={`${p.title}: ₦ `} renderText={text => <p class="price">{text}</p>} />
                                  <span variant="primary" className="fa fa-edit mr-3" onClick={() => editPlan(p)}></span>
                                  <span variant="primary" style={{color:'red'}} className="fa fa-trash mr-3" onClick={() => deletePlan(p.id)}></span>
                                  </div>
                                  
                                  </>
                                }) : <>
                                <section className="container mt-5">
                                <div className="row justify-content-center align-items-center">
                                        <p style={{color:'#000', fontWeight:"bold", marginTop:'20px', fontSize:'20px', alignSelf:"center"}}>No Payment Plan Found</p>
                                    </div>
                                 </section>
                                     </>}

                            </Col>



                            <Col lg="12" className="mt-4">

                              <AddImages id={id}/>

  
                            </Col>

                          <Col lg="12" className="mt-4">

                            <AddFaq id={id}/>


                          </Col>

                            
                         </Row>
                    </Col>
                    <Col lg="4"></Col>

                </Row>


           </Col>


           <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Estate Plan</Modal.Title>
              </Modal.Header>
                  <Modal.Body>

                            <Row>

                                                
                              <Col lg="1"></Col>

                              <Col lg="10" className="white-card">


                                <div className="form-floating mt-3">
                                  <input placeholder="Title" type="text" className="h-auto form-control" id="floatingInput" name="title"
                                  value={title} 
                                  onChange={(e) => setTitle(e.target.value)}
                                  />
                                  <label for="floatingInput">Title</label>
                                  </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="amount" type="text" className="h-auto form-control " name="amount" 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}/>
                                                <label for="floatingInput">Amount</label>
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
                  {isEdit ? 
                      <Button onClick={()=> updatePlan()} variant="primary" type="submit" disabled={isBtnLoading}>     
                      {isBtnLoading ? (<>Loading</>) : (<>Update Plan</>)}
                      </Button>
                   : <>
                   <Button onClick={()=> addPlan()} variant="primary" type="submit" disabled={isBtnLoading}>     
                       {isBtnLoading ? (<>Loading</>) : (<>Add Plan</>)}
                   </Button>
                  </>}
                </Modal.Footer>


      </Modal>

                
        </div>

    </div>

    </>
  );
}

export default EstateDetails;
