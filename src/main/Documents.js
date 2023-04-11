
import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import { Offcanvas, Row, Col } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import configData from "../config.json";
import { format } from 'date-fns'
import NavToggle from './components/NavToggle';
import ReactPaginate from 'react-paginate';


function Documents() {
    const history = useHistory();
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [doc, setDoc] = useState([]);
    const [estate, setEstate] = useState([])
    const [loadDoc, setLoadDoc] = useState(true);
    const [all, setAll] = useState(true);
    const [complete, setComplete] = useState(false);
    const [pending, setPending] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [totalpage, setTotalpage] = useState(0)


    const [image, setImage] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [propertyAmount, setPropertyAmount] = useState('');
    const [property, setProperty] = useState('');
    const [amount, setAmount] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [plots, setPlots] = useState('');
    const [datePurchased, setDatePurchased] = useState('');
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    // const [date, setDate] = useState('');
  

    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleOffcanvasClose = () => setShowOffcanvas(false);
    const handleOffcanvasShow = () =>   setShowOffcanvas(true);

    const documentDetails = (id) => {
        const docId = id;
        history.push(`/Document-Details/${docId}`);
    }

    const addDoc = async(e) => {
      e.preventDefault();

      const formData = new FormData()
      formData.append('passport', image);
      formData.append('fullName', fullName);
      formData.append('address', address);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('property', property);
      formData.append('amount', amount);
      formData.append('amountPaid', amountPaid);
      formData.append('isPaymentComplete', isPaymentComplete);
      formData.append('plots', plots);
      formData.append('datePurchased', datePurchased);

      
      setisBtnLoading(true);


      await axios.post(`${configData.SERVER_URL}/document/addDocument/`, formData)
      .then((response) => {
        try{

        
        setisBtnLoading(false)
        console.log(response);
        if(response.data.status === "success"){
          setisBtnLoading(false);
          alert(response.data.message);
          const docId = response.data.data.id;
          history.push(`/Document-Details/${docId}`);
          }
        if(response.data.status === "error"){
          setisBtnLoading(false);
          alert(response.data.message);
        }

      }catch(error){
        console.log(error.response)

      }
  });


  
     }
  
     const getDoc = () => {
      setLoadDoc(true);
      return axios.get(`${configData.SERVER_URL}/document/getAllDocuments?page=${page}`).then((response) => {
          console.log(response.data.data.rows);
          const total = response.data.count;
          setTotalpage(Math.ceil(total/3));
          setDoc(response.data.data.rows);
          setAll(true);
          setPending(false);
          setComplete(false);
        });
  
     }

     useEffect(() => {
      getDoc();
      getEstates();
      if(loadDoc === true){
      const interval = setInterval(() => {
        // getDoc();
        getEstates();
      }, 3000);
  
      return () => clearInterval(interval);
    }
    }, []);
   
  

     const getNewDoc = (currentPage) => {
      setLoadDoc(true);
      return axios.get(`${configData.SERVER_URL}/document/getAllDocuments?page=${currentPage}`).then((response) => {
          console.log(response.data.data.rows);
          const data = response.data.data.rows;
          return data;
        });
  
     }

     const nextPrev = async(data) => {
        let currentPage = data.selected + 1;

      console.log(currentPage);

        const docServer = await getNewDoc(currentPage);
        setDoc(docServer);
     }
  
     const getPendingDocuments = () => {
      setLoadDoc(false);
      return axios.get(`${configData.SERVER_URL}/document/getPendingDocuments`).then((response) => {
          console.log(response.data.data);
          setDoc(response.data.data);
          setPending(true);
          setAll(false);
          setComplete(false);
        });
  
     }
  
     const getCompleteDocuments = () => {
      setLoadDoc(false);
      return axios.get(`${configData.SERVER_URL}/document/getCompletedDocuments`).then((response) => {
          console.log(response.data.data);
          setDoc(response.data.data);
          setComplete(true);
          setAll(false);
          setPending(false);
        });
  
     }
  
     
    const getEstates = () => {

      return axios.get(`${configData.SERVER_URL}/estate/getEstate`).then((response) => {
          console.log(response.data.data);
          setEstate(response.data.data);
        });
  
     }
  
     const searchDoc = () => {

      setisBtnLoading(false);
     //  return alert(search)
      return axios.get(`${configData.SERVER_URL}/document/searchDoc/${search}`).then((response) => {
        console.log(response.data.data);
         setDoc(response.data.data);
         setisBtnLoading(false);
      })
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
                                        <span className="h4">Documents</span>
                                            </div>
                                          <div className="col-md-6 search">
                                              <input className="form-control" type="text" placeholder="Search" aria-label="Search" name="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                              <a href="javascript:void(0)" className='searchBtn' onClick={searchDoc}>
                                                <span variant="primary" className="fa fa-search mr-3"></span>
                                              </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                              </Col>


                            <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                                <div className="category-menu">

                                <ul className="nav">
                                    <li className="nav-item">
                                      <a className="nav-link" href="#">Documents</a>
                                    </li>
                                  </ul>
                                      <span className="line"></span>
                                      
                                      <ul className="nav lastNav">
                                          <li className="nav-item">
                                            <a className={ `nav-link ${all && 'activ'}` } href="javascript:void(0)" onClick={getDoc}>All</a>
                                            </li>
                                          <li className="nav-item">
                                            <a className={ `nav-link ${complete && 'activ'}` } aria-current="page" href="javascript:void(0)" onClick={getCompleteDocuments}>Completed</a>
                                          </li>
                                          <li className="nav-item">
                                            <a className={ `nav-link ${pending && 'activ'}` } href="javascript:void(0)"  onClick={getPendingDocuments}>Pending</a>
                                          </li>
                                        </ul>

                                  </div>      
                            </Col>




                            <Col lg="12">
                                <Row className="mt-5">
                                    <Col lg="9">
                                    <p>List of Documents</p>   
                                    </Col>
                                    <Col lg="3">
                                        <a href="javascript:void(0)" onClick={handleOffcanvasShow} className="btn-add">Add Document</a>
                                    </Col>
                                 </Row>
                            
                            </Col>

                 

                          <div className="table-responsive">
                              <table className="table table-striped">
                                 <thead>
                                  <tr>
                                      <th>#</th>
                                      <th>Client Name</th>
                                      <th>Estate</th>
                                      <th>Plots</th>
                                      <th>Status</th>
                                      <th>Date</th>
                                      <th></th>
                                  </tr>
                                     </thead>
                                     <tbody>
                 {isBtnLoading ? (<> 
 
                         <tr>
                            <td className="placeholder-glow">           
                              <span className="placeholder col-12  placeholder-glow"></span>
                            </td>
                            <td className="placeholder-glow">           
                              <span className="placeholder col-12"></span>
                            </td>
                            <td className="placeholder-glow">           
                              <span className="placeholder col-12"></span>
                            </td>
                            <td className="placeholder-glow">           
                              <span className="placeholder col-12"></span>
                            </td>
                            <td className="placeholder-glow">           
                              <span className="placeholder col-12"></span>
                            </td>
                            <td className="placeholder-glow">           
                              <span className="placeholder col-12"></span>
                            </td>
                            <td className="placeholder-glow">           
                              <span className="placeholder col-12"></span>
                            </td>
                           </tr>

                      </>) 

                      : (<>                    


                           {doc && doc.length > 0
                                ? doc.map(doc => {
                                    return <> 
                                     <tr key={doc.id}>
                                        <td> 
                                            {/* <span className="pl-2">1</span> */}
                                        </td>
                                        <td>{doc.fullName} </td>
                                        <td>{doc.property}</td>
                                        <td>{doc.plots}</td>
                                        <td>{doc.isPaymentComplete ?<>Completed</> : <>Pending</>}</td>
                                        <td>{format(new Date(doc.datePurchased), 'dd MMMM yy')} </td>
                                        <td><span variant="primary" onClick={() => documentDetails(doc.id)} className="fa fa-eye mr-3"></span></td>
                                    </tr>
        
                                                 
                                </> })
                                :<section className="container mt-5" style={{width:'100%'}}>
                                   <div className="row">
                                        <p style={{color:'#000', fontWeight:"bold", marginTop:'20px', fontSize:'20px', alignSelf:"center", textAlign:'center'}}>No Document Found</p>
                                     </div>
                                 </section>}

         
                                 </>)} 
                                 </tbody>
                                        </table>
                                      </div>

                            
                         </Row>
                    </Col>
                    <Col lg="4"></Col>

                </Row>


           </Col>



                
           <ReactPaginate
                  previousLabel={"< previous"}
                  nextLabel={"next >"}
                  breakLabel={"..."}
                  pageCount={totalpage}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  onPageChange={nextPrev}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={'page-link'}
                  nextClassName={'page-item'}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={'page-link'}
                  activeClassName={"active"}
                  renderOnZeroPageCount={null}
                />
        </div>

    </div>



    <Offcanvas show={showOffcanvas} onHide={handleOffcanvasClose} placement={'end'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Document</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

            <Row>


            <form  onSubmit={addDoc} method="POST" enctype="multipart/form-data" id="submit" novalidate>
                    <Col lg="12">
                        <Row>
                            <Col lg="1">
                            </Col>
                            <Col lg="12">


                                <Row>

                                                
                                    <Col lg="1"></Col>

                                        <Col lg="10" className="white-card">
                                         <h5 className="mt-4">Clients Details</h5>



                              <div className="mt-3">
                                  <label className="form-label" for="customFile">Upload Clients Image</label>
                                  <input type="file" className="form-control" id="customFile" name="passport"
                                  onChange={(e)=> setImage(e.target.files[0])}/>
                              </div>

                                <div className="form-floating mt-3">
                                  <input placeholder="Full Name" type="text" className="h-auto form-control" id="floatingInput" name="fullName" onChange={(e) => setFullName(e.target.value)} required/>
                                  <label for="floatingInput">Full Name</label>
                                      {/* {errors.fullName && <div className="alert alert-danger" role="alert">Full Name Required</div>} */}
                                  </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="Email" type="email" className="h-auto form-control " name="email"   onChange={(e) => setEmail(e.target.value)}/>
                                                <label for="floatingInput">Email address</label>
                                                    {/* {errors.email && <div className="alert alert-danger" role="alert">Email Required</div>} */}
                                            </div>
                                     </div>

                                     <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Phone Number" type="tel" className="h-auto form-control " name="phone"  onChange={(e) => setPhone(e.target.value)} />
                                            <label for="floatingInput">Phone Number</label>
                                                {/* {errors.phone && <div className="alert alert-danger" role="alert">Phone Number Required</div>} */}
                                            </div>
                                     </div>

                                    </div>

                                  

                                    <div className="mt-3 form-floating">

                                            <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" name="address"  style={{height: "100px"}}  onChange={(e)=> setAddress(e.target.value)}/>
                                            <label for="floatingTextarea2">Address</label>
                                            {/* {errors.address && <div className="alert alert-danger" role="alert">Address Required</div>} */}

                                        </div>

                                          </Col>

                                     <Col lg="1"></Col>




                                 </Row>
                               
                                <Row className="mt-5">
                                                
                                    <Col lg="1"></Col>
                                    <Col lg="10" className="white-card">
                                        <h5>Estate Details</h5>  

                                        <div className="form-floating mt-3">
                                            <select className="form-select" id="floatingSelect" aria-label="select Property" name="property" onChange={(e)=> setProperty(e.target.value)}>
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
                                            <input placeholder="Property Amount" type="number" className="h-auto form-control " name="amount" onChange={(e)=> setAmount(e.target.value)} />
                                            <label for="floatingInput">Property Amount</label>
                                                {/* {errors.amount && <div className="alert alert-danger" role="alert">Property Amount Required</div>} */}
                                            </div>
                                    </div>
                                    
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="Amount Paid" type="text" className="h-auto form-control" name="amountPaid" onChange={(e)=> setAmountPaid(e.target.value)} />
                                                <label for="floatingInput">Amount Paid</label>
                                                    {/* {errors.amountPaid && <div className="alert alert-danger" role="alert">Amount Paid Required</div>} */}
                                            </div>
                                     </div>

                                    </div>
                                          
                                          
                            <div className="row g-2">
                                    <div className="col-md">
                                                                                                                       <div className="form-floating mt-3">
                                            <input placeholder="Number of Plots" type="number" className="h-auto form-control " name="plots"  onChange={(e)=> setPlots(e.target.value)} />
                                            <label for="floatingInput">Number of Plots</label>
                                                {/* {errors.plots && <div className="alert alert-danger" role="alert">Number of plots Required</div>} */}
                                         </div>

                                        </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input type="date" className="h-auto form-control " name="datePurchased" onChange={(e)=> setDatePurchased(e.target.value)} />
                                                <label className=" mb-2" for="exampleFormControlSelect1">Date Purchased</label>
                                         </div>
                                      </div> 

                              </div>

                                            <div className="mb-3 mt-3 form-check">
                                                <input type="checkbox" className="form-check-input"  name="isPaymentComplete" id="exampleCheck1" onChange={(e)=> setIsPaymentComplete(e.target.checked)}/>
                                                <label className="form-check-label" for="exampleCheck1">Is Payment Complete</label>
                                             </div>

                                            <div className="mt-4" style={{textAlign: 'right'}}>
                                                <button type="submit" className="btn btn-primary" disabled={isBtnLoading}>     
                                                   {isBtnLoading ? (<>LOADING</>) : (<>Add Document</>)}
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

              
            </Row>     
            
        </Offcanvas.Body>
      </Offcanvas>






{/* 
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Row>         
                   <Col lg="12"></Col>
                    <Col lg="2"></Col>
                    <Col lg="8">


                            <form onSubmit={handleSubmit(addDoc)} className="pt-3"  enctype="multipart/form-data" id="submit">
                                        <div className="d-flex search-field form-group">
                                           <input placeholder="Full Name" type="text" className="h-auto form-control " name="fullName"  ref={register({ required: true, })} />
                                              {errors.fullName && <div className="alert alert-danger" role="alert">Full Name Required</div>}
                                         </div>
                                        <div className="d-flex search-field form-group mt-3">
                                           <input placeholder="Email" type="email" className="h-auto form-control " name="email"  ref={register({ required: true, })} />
                                              {errors.email && <div className="alert alert-danger" role="alert">Email Required</div>}
                                         </div>
                                        <div className="d-flex search-field form-group mt-3">
                                           <input placeholder="Phone Number" type="tel" className="h-auto form-control " name="phone"  ref={register({ required: true, })} />
                                              {errors.phone && <div className="alert alert-danger" role="alert">Phone Number Required</div>}
                                         </div>
                                        <div className="d-flex search-field form-group mt-3">
                                           <input placeholder="Address" type="text" className="h-auto form-control " name="address"  ref={register({ required: true, })} />
                                              {errors.address && <div className="alert alert-danger" role="alert">Address Required</div>}
                                         </div>
                                        <div className="search-field form-group mt-3">
                                            <label className=" mb-2" for="exampleFormControlSelect1">Select Property</label>
                                            <select className="form-control"  name="property" ref={register({ required: true })}>
                                              <option value='admin'>Admin</option>
                                              <option value='maintain'>Maintain</option>
                                                
                                            </select>
                                        </div>
                                        <div className="d-flex search-field form-group mt-3">
                                           <input placeholder="Number of Plots" type="text" className="h-auto form-control " name="plots"  ref={register({ required: true, })} />
                                              {errors.plots && <div className="alert alert-danger" role="alert">Number of plots Required</div>}
                                         </div>
                                        <div className="search-field form-group mt-3">
                                            <label className=" mb-2" for="exampleFormControlSelect1">Select Date Property was Purchased</label>
                                           <input type="date" className="h-auto form-control " name="datePurchased"  ref={register({ required: true, })} />
                                         </div>
                                        <div className="mt-4 mb-4">
                                         </div>

                                     </form>

                         </Col>

                     <Col lg="2"></Col>


          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose} disabled={isBtnLoading}>     
             {isBtnLoading ? (<>LOADING</>) : (<>Add Document</>)}
          </Button>
        </Modal.Footer> */}
      {/* </Modal> */}
    </>
  );
}

export default Documents;
