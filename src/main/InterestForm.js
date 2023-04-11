
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


function InterestForm() {
    const history = useHistory();
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [doc, setDoc] = useState([]);
    const [int, setInt] = useState([]);
    const [loadDoc, setLoadDoc] = useState(true);
    const [totalpage, setTotalpage] = useState(0)


    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleOffcanvasClose = () => setShowOffcanvas(false);
    const handleOffcanvasShow = () =>   setShowOffcanvas(true);

    const documentDetails = (id) => {
        const docId = id;
        history.push(`/Interest-Form-Details/${docId}`);
    }

     const getDoc = () => {
      setLoadDoc(true);
      return axios.get(`${configData.SERVER_URL}/interestForm/getForm`).then((response) => {
          console.log(response.data.data);
          setInt(response.data.data);
        });
  
     }

     useEffect(() => {
      getDoc();
      if(loadDoc === true){
      const interval = setInterval(() => {
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
                                        <span className="h4">Interest-Form</span>
                                            </div>
                                          <div className="col-md-6 search">
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                              </Col>


                            <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                                <div className="category-menu">

                                <ul className="nav">
                                    <li className="nav-item">
                                    </li>
                                  </ul>
                                      <span className="line"></span>
                                  </div>      
                            </Col>




                            <Col lg="12">
                                <Row className="mt-5">
                                    <Col lg="9">
                                    <p>List of Interest Form</p>   
                                    </Col>
                                    <Col lg="3">
                                    </Col>
                                 </Row>
                            
                            </Col>

                 

                          <div className="table-responsive">
                              <table className="table table-striped">
                                 <thead>
                                  <tr>
                                      <th>#</th>
                                      <th>Full Name</th>
                                      <th>Phone Number</th>
                                      <th>Email</th>
                                      <th>Estate Interest</th>
                                      <th>Plots</th>
                                      {/* <th>Date</th>
                                      <th></th> */}
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
                           </tr>

                      </>) 

                      : (<>                    


                           {int && int.length > 0
                                ? int.map(doc => {
                                    return <> 
                                     <tr key={doc.id}>
                                        <td> 
                                            {/* <span className="pl-2">1</span> */}
                                        </td>
                                        <td>{doc.fullName} </td>
                                        <td>{doc.phone}</td>
                                        <td>{doc.email}</td>
                                        <td>{doc.estate}</td>
                                        <td>{doc.plots}</td>
                                        {/* <td><span variant="primary" onClick={() => documentDetails(doc.id)} className="fa fa-eye mr-3"></span></td> */}
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


    </>
  );
}

export default InterestForm;
