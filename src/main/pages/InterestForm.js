
import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Row, Col } from 'react-bootstrap';
import configData from "../../config.json";
import { format } from 'date-fns'
import Layout from '../Layout';
import { ThreeDots } from 'react-loader-spinner'


function InterestForm() {
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [int, setInt] = useState([]);
    const [data, setData] = useState([]);
    const [isReady, setIsReady] = useState(false)
    const [page, setPage] = useState("all");
    const [miniNav, setMiniNav] = useState('all');
    const [show, setShow] = useState(false);

      const handleClose = () => setShow(false);
      const handleShow = (i) => {
        setData(i)
        setIsReady(true)
        setShow(true);
      }


    
     const getInterestForm = async() => {
      setisBtnLoading(true);
      
      return axios.get(`${configData.SERVER_URL}/document/get/interest/form`, {
        headers: {
          "x-auth-token":  window.localStorage.getItem("token")
        }
      }).then((response) => {
          console.log(response.data.data);
          setInt(response.data.data);
          setisBtnLoading(false)
        });
  
     }

     useEffect(() => {
      getInterestForm();
    //   if(loadDoc === true){
    //   const interval = setInterval(() => {
    //   }, 3000);
  
    //   return () => clearInterval(interval);
    // }
    }, []);
   
  
     const filterByStatus = (status) => {
      setMiniNav(status);
      if(page !== "all"){
          // const filteredData = docs.filter((doc) => doc.documentStatus === status && doc.estateId._id === activeEstate._id);
          // setFilteredDocs(filteredData);
          return
      }
      // const filteredData = docs.filter((doc) => doc.documentStatus === status);
      // setFilteredDocs(filteredData);
    };

     const handleShowAll = () => {
            
      if(page !== "all"){
          // const filteredData = docs.filter((doc) => doc.estateId._id === activeEstate._id);
          // setFilteredDocs(filteredData);
          setMiniNav('all');
          return
      }
      setMiniNav('all');
      // setFilteredDocs(docs);
    };
  



  return (
    <>
    
    <Layout>

        <div className="mainBox">


               <div className='mBoxOne' style={{width: '100vw'}}>

               <div className="heading-section">
                     <div className="navSection">
                      <span className="activeText">Interest Form</span>
                     </div>

                   </div>


                   <div className="estContent">

                    <Col lg="12"> 

                    <div class="category-menu">
                            
                            <ul className="nav">
                                <li className="nav-item"> 
                                    <a className="nav-link" href="#">Form</a>
                                </li>
                                </ul>
                                    <span className="line"></span>
                                    
                                    <ul className="nav lastNav">
                                        <li className="nav-item"  onClick={handleShowAll}>
                                          <a className={miniNav === 'all' ? 'nav-link activeNav' : "nav-link"} aria-current="page" href="#">All</a>
                                        </li>
                                        <li className="nav-item"  onClick={() => filterByStatus('complete')}>
                                        <a className={miniNav === 'complete' ? 'nav-link activeNav' : "nav-link"} aria-current="page" href="#">Unread</a>
                                        </li>
                                        <li className="nav-item" onClick={() => filterByStatus('pending')}> 
                                        <a className={miniNav === 'pending' ? 'nav-link activeNav' : "nav-link"} href="#">Read</a>
                                        </li>
                                    </ul>

                                </div> 

                          <Row>


                              <Col lg="12">
                                  <Row>
                                      <Col lg="12">
                                          <Row className="mt-5">
                                              <Col lg="9">
                                              <p>List of Interest Clients</p>   
                                              </Col>
                                              <Col lg="3">
                                              </Col>
                                          </Row>
                                      
                                      </Col>

         {isBtnLoading ? (<> 
                <div className="d-flex justify-content-center align-items-center w-100">
                        <ThreeDots
                            visible={true}
                            height="50"
                            width="50"
                            color="#0b9967"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""/>
                </div>

                                </>) 

                                : (<>  
                          

                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                          <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Full Name</th>
                                                <th>Phone Number</th>
                                                <th>Estate Interest</th>
                                                <th>Plots</th>
                                                <th>Date</th>
                                            </tr>
                                              </thead>
                                              <tbody>                  


                      {int && int.length > 0
                            ? int.map((i, index) => {
                                return <> 
                                <tr key={i.id}  onClick={() => handleShow(i)} >
                                    <td> 
                                        <span className="pl-2">{index + 1}</span>
                                    </td>
                                    <td>{i.fullName} </td>
                                    <td>{i.phoneNumber}</td>
                                    <td>{i.estateId.name}</td>
                                    <td>{i.numbOfPlot}</td>
                                    <td>{format(new Date(i?.createdAt), 'do MMM yy')} </td>
                                </tr>
                                            
                            </> })
                            :<section className="container mt-5" style={{width:'100%'}}>
                              <div className="row">
                                    <p style={{color:'#000', fontWeight:"bold", marginTop:'20px', fontSize:'20px', alignSelf:"center", textAlign:'center'}}>No Document Found</p>
                                </div>
                            </section>}

                  
                                          </tbody>
                                                  </table>
                                                </div>

                                </>)} 
                                      
                                  </Row>
                              </Col>
                              <Col lg="4"></Col>

                          </Row>


                    </Col>

                    </div>
                </div>
                

          </div>

           </Layout>


    <Modal show={show} onHide={handleClose}>

<Modal.Body>

    <div className="modal-body my-4">

       
       <div className="dueParent">

                    <div className="profInfo">
                        <h4 className="h4">Personal Info</h4>
                        <div className="profInfoData">
                            <div className="profData">
                                <span>Full Name</span>
                                <span>{data?.fullName}</span>
                            </div>
                            <div className="profData">
                                <span>Phone Number</span>
                                <span>{data?.phoneNumber}</span>
                            </div>
                            <div className="profData">
                                <span>Email</span>
                                <span>{data?.email}</span>
                            </div>
                            <div className="profData">
                                <span>Date Of Birth</span>
                                <span>{format(isReady ? new Date(data?.dateOfBirth) : new Date(), 'do MMM yy')}</span>
                            </div>
                        </div>
                    </div>


                    <div className="profInfo">
                        <h4 className="h4">Property Info</h4>

                        <div className="profInfoData">
                            <div className="profData">
                                <span>Estate Name</span>
                                <span>{data?.estateId?.name}</span>
                            </div>

                            <div className="profData">
                                <span>Number of plots</span>
                                <span>{data?.numbOfPlot}</span>
                            </div>

                            
                            <div className="profData">
                                <span>Mode of Payment</span>
                                <span>{data?.modeOfPayment}</span>
                            </div>

                            <div className="profData">
                                <span>Building Type</span>
                                <span>{data?.buildingType}</span>
                            </div>
                            
                            
                            <div className="profData">
                                <span>Date of enquiry</span>
                                <span>{format(isReady ? new Date(data?.createdAt) : new Date(), 'do MMM yy')}</span>
                            </div>





                        </div>
                    </div>


                    <div className="profInfo">
                        <h4 className="h4">Location Info</h4>
                        <div className="profInfoData">
                            <div className="profData">
                                <span>State</span>
                                <span>{data?.state}</span>
                            </div>
                            <div className="profData">
                                <span>City</span>
                                <span>{data?.city}</span>
                            </div>
                            <div className="profData">
                                <span>Address</span>
                                <span>{data?.address}</span>
                            </div>
                        </div>
                    </div>

                    
                </div>


    </div>



</Modal.Body>
</Modal>



    </>
  );
}

export default InterestForm;
