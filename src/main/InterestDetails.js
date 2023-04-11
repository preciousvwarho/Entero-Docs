
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

function InterestDetails() {
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
   const [imgNew, setImgNew] = useState('')
  
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



    useEffect(() => {
      getDoc();
    }, []);




  // add image files


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
                                          <span className="h4">Interest Form Details</span>
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

                                    </div>      
                              </Col>


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

                                </Col>

                                <Col lg="2"></Col>

                             </Row>

                            </Col>
                            

                            <Col l="12" className="mt-4">

                            </Col>

                            
                         </Row>
                    </Col>
                    <Col lg="4"></Col>

                </Row>


           </Col>



                
        </div>

    </div>


    </>
  );
}

export default InterestDetails;
