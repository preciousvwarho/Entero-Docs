
import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import { Offcanvas, Button, Row, Col, Modal, Nav } from 'react-bootstrap';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import configData from "../config.json";
import { useParams, useHistory } from "react-router-dom";
import NumberFormat from 'react-number-format';
import { format } from 'date-fns';
import NavToggle from './components/NavToggle';

function DocumentDetails() {
  let { id } = useParams();
  const history = useHistory();
    const [show, setShow] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('')
   const [phone, setPhone] = useState('')
   const [address, setAddress] = useState('')
   const [property, setProperty] = useState('')
   const [amount, setAmount] = useState()
   const [amountPaid, setAmountPaid] = useState('')
   const [isPaymentComplete, setIsPaymentComplete] = useState(false);
   const [plots, setPlots] = useState('')
   const [datePurchased, setDatePurchased] = useState(Date.now()) 
   const [estate, setEstate] = useState([])
   const [image, setImage] = useState('')
   const [title, setTitle] = useState('');
   const [fileImages, setFileImages] = useState([])
   const [imgNew, setImgNew] = useState('');
  
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   const offCanvasClose = () => setShowOffcanvas(false);
   const offCanvasShow = () => setShowOffcanvas(true);

   const [showImage, setShowImage] = useState(false);
   const handleShowClose = () => setShowImage(false);
   const handleShowOpen = (i) => {
      setImgNew(i.image);
      console.log(i.image)
      setShowImage(true);
    }

    const openPdf = (name) => {
      const newName = `${name}`.replace('uploads/', '')
      // console.log(newName) 
        history.push(`/pdf-Details/${newName}`);
     }

  
    const editDoc = (e) => {
       
      e.preventDefault();

         setisBtnLoading(true)
         return axios.put(`${configData.SERVER_URL}/document/updateDocument/${id}`, { 
              fullName: fullName,
              email: email,
              phone: phone,
              address: address,
              property: property,
              amount: amount,
              amountPaid: amountPaid,
              plots: plots,
              datePurchased: datePurchased,
              isPaymentComplete: isPaymentComplete
          })
          .then((response) => {
            console.log(response.data.data);
            if(response.data.status === "success"){
                setisBtnLoading(false)
                alert(response.data.message);
                setShow(false)
                setShowOffcanvas(false)    
            }
            if (response.data.status === "error") {
                setisBtnLoading(false)
                alert(response.data.message);
            }
   });


    }

     
  const getDoc = () => {

    setisBtnLoading(true);

    return axios.get(`${configData.SERVER_URL}/document/getDocumentImages/${id}`).then((response) => {
        console.log(response.data.data[0]);
        if(response.data.status === "success"){
            setisBtnLoading(false)
            setFullName(response.data.data[0].fullName);
            setEmail(response.data.data[0].email);
            setPhone(response.data.data[0].phone);
            setAddress(response.data.data[0].address);
            setProperty(response.data.data[0].property);
            setAmount(response.data.data[0].amount);
            setAmountPaid(response.data.data[0].amountPaid);
            setIsPaymentComplete(response.data.data[0].isPaymentComplete);
            setPlots(response.data.data[0].plots);
            setDatePurchased(response.data.data[0].datePurchased);
            setFileImages(response.data.data[0].image);
        }
        if (response.data.status === "error") {
            setisBtnLoading(false)
            alert(response.data.message);
        }
      });
   }

   const amountSplit = amountPaid.split(',');
   
  const getEstates = () => {


    return axios.get(`${configData.SERVER_URL}/estate/getEstate`).then((response) => {
        console.log(response.data.data);
        setEstate(response.data.data);
      });

   }



    useEffect(() => {
      getDoc();
      getEstates();
      // const interval = setInterval(() => {
      //   getDoc();
      //   getEstates();
      // }, 3000);
  
      // return () => clearInterval(interval);
    }, []);

  const deleteDoc = () => {
    if (!window.confirm("are you sure you want to delete this Document?")) {
      return
    }
    setisBtnLoading(true)
        
      axios.delete(`${configData.SERVER_URL}/document/deleteDocument/${id}`)
      .then((response) => {
        console.log(response);
        if(response.data.status === "success"){
            setisBtnLoading(false)
            alert(response.data.message);
            history.push(`/Documents`);
        }
        if (response.data.status === "error") {
            setisBtnLoading(false)
            alert(response.data.message);
        }
      });
  }


  const deleteDocFile = (fileid) => {
    if (!window.confirm("are you sure you want to delete this Image?")) {
      return
    }
    const fileId = fileid;
    setisBtnLoading(true)
        
      axios.delete(`${configData.SERVER_URL}/document/deleteDocFile/${fileId}`)
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

  // add image files

  const addDocFile = async (e) => {
    setisBtnLoading(true);

    e.preventDefault()

    const formData = new FormData()
    formData.append('file', image)
    formData.append('title', title)

    // console.log(formData)

    await axios.post(`${configData.SERVER_URL}/document/addImage/${id}`, formData)
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


  const back =()=>{
    history.push(`/Documents`);
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
                                          <span className="h4">Document Details</span>
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
                                                 <span variant="primary" className="fa fa-trash mr-3" onClick={() => deleteDoc()}></span>
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
                                          <Col lg="12">

                                          <form onSubmit={editDoc} className="needs-validation"   enctype="multipart/form-data" id="submit">
                                                  <Col lg="12">
                                                      <Row>
                                                          <Col lg="1">
                                                          </Col>
                                                          <Col lg="12">


                                                              <Row>

                                                                              
                                                                  <Col lg="1"></Col>

                                                                      <Col lg="10" className="white-card">
                                                                      <h5 className="mt-4">Clients Details</h5>

                                                                      <div className="form-floating mt-3">
                                                                          <input placeholder="Full Name" type="text" className="h-auto form-control" id="floatingInput" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)}  required/>
                                                                          <label for="floatingInput">Full Name</label>
                                                                        </div>

                                                              <div className="row g-2">
                                                                  <div className="col-md">
                                                                      <div className="form-floating mt-3">
                                                                              <input placeholder="Email" type="email" className="h-auto form-control " name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                                                              <label for="floatingInput">Email address</label>
                                                                          </div>
                                                                  </div>

                                                                  <div className="col-md">
                                                                      <div className="form-floating mt-3">
                                                                          <input placeholder="Phone Number" type="tel" className="h-auto form-control " name="phone" value={phone} onChange={(e)=> setPhone(e.target.value)}/>
                                                                          <label for="floatingInput">Phone Number</label>
                                                                          </div>
                                                                  </div>

                                                                  </div>

                                                                

                                                                  <div className="mt-3 form-floating">

                                                                          <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" name="address"  style={{height: "200px"}} value={address} onChange={(e) => setAddress(e.target.value)}/>
                                                                          <label for="floatingTextarea2">Address</label>

                                                                      </div>

                                                                        </Col>

                                                                  <Col lg="1"></Col>




                                                              </Row>
                                                            
                                                              <Row className="mt-5">
                                                                              
                                                                  <Col lg="1"></Col>
                                                                  <Col lg="10" className="white-card">
                                                                      <h5>Estate Details</h5>  

                                                                      <div className="form-floating mt-3">
                                                                          <select className="form-select" id="floatingSelect" aria-label="select Property" name="property" onChange={(e) => setProperty(e.target.value)}>
                                                                              <option selected>Select Estate</option>
                                                                              {estate.map(e => (
                                                                                    <option value={e.name}>{e.name}</option>
                                                                                  ))}
                                                                              </select>
                                                                        <label for="floatingSelect">Select Property</label>
                                                                        </div>


                                                              <div className="row g-2">

                                                                <div className="col-md">
                                                                      <div className="form-floating mt-3">
                                                                          <input placeholder="Property Amount" type="number" className="h-auto form-control " name="amount" value={amount} onChange={(e)=> setAmount(e.target.value)}/>
                                                                          <label for="floatingInput">Property Amount</label>
                                                                          </div>
                                                                  </div>
                                                                  
                                                                  <div className="col-md">
                                                                      <div className="form-floating mt-3">
                                                                              <input placeholder="Amount Paid" type="text" className="h-auto form-control" name="amountPaid" value={amountPaid} onChange={(e)=> setAmountPaid(e.target.value)}/>
                                                                              <label for="floatingInput">Amount Paid</label>
                                                                          </div>
                                                                  </div>

                                                                  </div>
                                                                        
                                                                        
                                                          <div className="row g-2">
                                                                  <div className="col-md">
                                                                                                                                                                                    <div className="form-floating mt-3">
                                                                          <input placeholder="Number of Plots" type="number" className="h-auto form-control " name="plots" value={plots}  onChange={(e) => setPlots(e.target.value)}/>
                                                                          <label for="floatingInput">Number of Plots</label>

                                                                      </div>

                                                                      </div>

                                                                  <div className="col-md">
                                                                      <div className="form-floating mt-3">
                                                                          <input type="date" className="h-auto form-control " name="datePurchased" value={datePurchased} onChange={(e) => setDatePurchased(e.target.value)} />
                                                                              <label className=" mb-2" for="exampleFormControlSelect1">Date Purchased</label>
                                                                      </div>
                                                                    </div> 

                                                            </div>

                                                                          <div className="mb-3 mt-3 form-check">
                                                                              <input type="checkbox" className="form-check-input"  name="isPaymentComplete" id="exampleCheck1" onChange={(e)=> setIsPaymentComplete(e.target.checked)} checked={isPaymentComplete}/>
                                                                              <label className="form-check-label" for="exampleCheck1">Is Payment Complete</label>
                                                                          </div>

                                                                          <div className="mt-4" style={{textAlign: 'right'}}>
                                                                              <button type="submit" className="btn btn-primary" disabled={isBtnLoading}>     
                                                                                {isBtnLoading ? (<>LOADING</>) : (<>Update Document</>)}
                                                                              </button>
                                                                          </div>

                                                                  </Col>
                                                                  <Col lg="1">
                                                                  </Col>
                                                              </Row>
                                                          </Col>
                                                          <Col lg="1">
                                                          </Col>
                                                          
                                                      </Row>
                                                  </Col>
                                                  <Col lg="4"></Col>

                                                  </form>

                                                              
                                          </Col>  
                                      </Row>
                                      
                                  </Offcanvas.Body>
                              </Offcanvas>


  
                            <Col lg="3">
                            </Col>
                            <Col lg="12">


                            <Row>

                                                                                
                                <Col lg="12"></Col>

                              <Col lg="10" className="white-card mt-4">

                                <h5 className="mt-4">Clients Details</h5>
                                <div className="mb-3">
                                  <span className="fullName">Full Name:</span> 
                                  <span className="spa"> {fullName}</span>
                                  </div>

                                  <div className="mb-3">
                                  <span className="fullName">Email:</span>  
                                  <span className="spa"> {email}</span> 
                                  </div> 


                                  <div className="mb-3">
                                  <span className="fullName">Phone:</span>    
                                  <span className="spa"> {phone}</span> 
                                  </div>

                                  <div className="mb-3">
                                  <span className="fullName">Address:</span>    
                                  <span className="spa"> {address}</span> 
                                  </div>


                                </Col>

                                <Col lg="2"></Col>

                                <Col lg="10" className="white-card">

                                  <h5 className="mt-4">Estate Details</h5>
                                  <div className="mb-2">
                                    <span className="fullName">Estate Name:</span> 
                                    <span className="spa"> {property}</span>
                                  </div>

                                  <div className="mb-2">
                                    <span className="fullName">Plots:</span>  
                                    <span className="spa"> {plots}</span> 
                                  </div> 

                                  <div className="mb-2">
                                    <span className="spa"> 
                                        <div className="docBox mt-3">
                                            <NumberFormat value={amount} displayType={'text'} thousandSeparator={true} prefix={'Price to Pay: ₦ '} renderText={text => <p className="price">{text}</p>} />
                                          </div>
                                      </span> 
                                  </div> 

                            

                                    <div className="mb-2">
                                      <span className="fullName">Date Purchased:</span>    
                                      <span className="spa"> {format(new Date(datePurchased), 'dd MMMM yy')}</span> 
                                    </div>

                                    <div className="mb-2 mt-4">
                                              <h5>Payment History</h5>
                                                {/* <h5>Amount Paid</h5> */}
                                              <div className="docBox mt-3">
                                                {amountSplit.map(amt => (

                                                  <NumberFormat value={amt} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <p className="price">{text}</p>} />
                                                    
                                                ))}
                                                </div>
                                        </div>


                                </Col>

                                <Col lg="2"></Col>

                             </Row>

                            </Col>
                            <Col lg="12">
                                <Row className="mt-5">
                                    <Col md="9"> 
                                        <h5 className="mt-4">Clients Documents</h5>
                                    </Col>
                                    <Col md="3">
                                      <p className="btn-add" onClick={handleShow}>Add File</p>
                                    </Col>
                                 </Row>
                             </Col>

                            <Col l="12" className="mt-4">

        
                            <div>
                                {fileImages && fileImages.length > 0 ?
                                  fileImages.map(img => ( <>
                                    <div key={img.id}>
                                        <div className="imgTitle">
                                           <p onClick={() => openPdf(img.image)}>{img.title}</p>
                                           <span variant="primary" className="fa fa-trash mr-3" onClick={() => deleteDocFile(img.id)}></span>
                                        </div>
                                      </div>  
                                  </>)) 
                                  :<>
                                    <div className="text-center">
                                        <p>No Document added yet</p>
                                    </div>
                                  </>
                                  }   
                              </div> 

                  <Modal className="myModal" size="lg" centered show={showImage} onHide={handleShowClose}>
                      <img className="img" src={`${configData.PIC_URL}/${imgNew}`}  id="myImgBig"/>
                  </Modal>

                            </Col>

                            
                         </Row>
                    </Col>
                    <Col lg="4"></Col>

                </Row>


           </Col>



                
        </div>

    </div>








      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <form onSubmit={addDocFile} method="POST" className="pt-3"  encType="multipart/form-data" id="submit">
        <Modal.Body>


                <Row>

                    
                <Col lg="2"></Col>
                <Col lg="8">

                  <div className="form-floating mb-3">
                    <input placeholder="Title" type="text" className="h-auto form-control" id="floatingInput" name="title" value={title}  onChange={(e) => setTitle(e.target.value)}/>
                    <label for="floatingInput">Title</label>
                  </div>
                  <div className="">
                      <label className="form-label" for="customFile">Upload Document Image</label>
                      <input type="file" className="form-control" id="customFile" name="image"
                      onChange={(e)=> setImage(e.target.files[0])}/>
                   </div>

                        </Col>

                <Col lg="2"></Col>

                </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary"    type="submit" disabled={isBtnLoading}>     
                     {isBtnLoading ? (<>Loading</>) : (<>Add File</>)}
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default DocumentDetails;
