
import axios from "axios";
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import { Offcanvas, Row, Col} from 'react-bootstrap';
import NavToggle from './components/NavToggle';
import configData from "../config.json";
import { format } from 'date-fns'
import ReactPaginate from 'react-paginate';

function BusinessDeveloper() {
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [loadDoc, setLoadDoc] = useState(true);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [totalpage, setTotalpage] = useState(0)
    const [doc, setDoc] = useState([]);
    const [all, setAll] = useState(true);
    const [complete, setComplete] = useState(false);
    const [pending, setPending] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }


    const getDoc = () => {
        setLoadDoc(true);

        return axios.get(`${configData.SERVER_URL}/developer/getDeveloper?page=${page}`).then((response) => {
          console.log(response.data.data.rows);
          const total = response.data.count;
          setTotalpage(Math.ceil(total/3));
          setDoc(response.data.data.rows);
          setAll(true);
          setPending(false);
          setComplete(false);
        });
  
     }



     const getNewDoc = (currentPage) => {
      setLoadDoc(true);
      return axios.get(`${configData.SERVER_URL}/developer/getDeveloper?page=${currentPage}`).then((response) => {
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
  

     useEffect(() => {
      getDoc();
    }, []);
   



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
                                <div class="col-md-12 mt-5">
                                    <div class="container" id="container">
                                      <div class="row">
                                        <div class="col-md-6">
                                        <span class="h4">Documents</span>
                                            </div>
                                          <div class="col-md-6 search">
                                              <input class="form-control" type="text" placeholder="Search" aria-label="Search"/>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                              </Col>


                            <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                                <div class="category-menu">

                                <ul class="nav">
                                    <li class="nav-item">
                                      <a class="nav-link" href="#">Documents</a>
                                    </li>
                                  </ul>
                                      <span class="line"></span>
                                      
                                      <ul class="nav lastNav">
                                          <li class="nav-item">
                                            <a class="nav-link activ" href="#">All</a>
                                            </li>
                                          <li class="nav-item">
                                            <a class="nav-link" aria-current="page" href="#">Successful</a>
                                          </li>
                                          <li class="nav-item">
                                            <a class="nav-link" href="#">Pending</a>
                                          </li>
                                        </ul>

                                  </div>      
                            </Col>




                            <Col lg="12">
                                <Row className="mt-5">
                                    <Col lg="9">
                                    <p>Business Developers</p>   
                                    </Col>
                                    <Col lg="3">
                                    </Col>
                                 </Row>
                            
                            </Col>


                            <div class="table-responsive">
                                <table class="table">
                                   <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
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
                                <tr>

                                    <td> 
                                        <div class="d-flex">
                                        <span class="pl-2">1</span>
                                        </div>
                                    </td>
                                    {/* <td> 
                                        <div class="d-flex">
                                            <img src="img/face1.42d41e61.jpg" className="pic" alt="face"/>
                                            <span class="pl-2">{doc.fullName}</span>
                                        </div>
                                    </td> */}
                                    <td>{doc.email}</td>
                                    <td> {doc.phone}</td>
                                    <td>{format(new Date(doc.createdAt), 'dd MMMM yy')} </td>
                                      <td>
                                          <span variant="primary" class="fa fa-edit mr-3"  onClick={handleShow}></span></td>
                                    </tr></> })
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


           </Col>

           {/* offcanvas for details */}


      <Offcanvas show={show} onHide={handleClose} placement={'end'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

            <Row>
                <Col lg="12" className='text-center'>
                    <img src="img/face1.42d41e61.jpg" className="profilePic" alt="face"/>
                </Col>
                <Col lg="12" className="text-center">
                    <h4> Henry Klein</h4>
                </Col>
            </Row>     
            
        </Offcanvas.Body>
      </Offcanvas>



                
        </div>

    </div>


    </>
  );
}

export default BusinessDeveloper;
