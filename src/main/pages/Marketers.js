

import React, {useState, useEffect, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Button, Row, Col, Modal, Offcanvas } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import Layout from '../Layout';
import img from '../assets/img/IMG-2.jpg';
import {RightArrow} from './svg/Svg';
import { useHistory } from "react-router-dom";
import { Context } from '../../Store';
import { ThreeDots, ColorRing } from 'react-loader-spinner';

function Marketers() {
  const history = useHistory();
  
  const { register, handleSubmit, setValue,reset, errors } = useForm();

    const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

   const offCanvasClose = () => setShowOffcanvas(false);
   const offCanvasShow = () => setShowOffcanvas(true);
   const [page, setPage] = useState("all");
   const [marketers, setMarketers] = useState([]);
   const [marketersN, setMarketersN] = useState([]);
   const [isBtnLoading, setisBtnLoading] = useState(false);
    const [state] = useContext(Context);

  const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setValue('image', file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

   const adminMarketer = async (data) => {
        setisBtnLoading(true)

        const formData = new FormData();

        formData.append('profImage', data.profImage[0]);
        formData.append('fullName', data.fullName);
        formData.append('email', data.email);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('sex', data.sex);
        formData.append('address', data.address);
        formData.append('accountName', data.accountName);
        formData.append('accountNumber', data.accountNumber);
        formData.append('bankName', data.bankName);
        formData.append('dateJoined', data.dateJoined);

      // return console.log(data.sex);


          

      try {
        const response = await fetch(`${configData.TEST_URL}/marketer/addMarketer`, {
          method: "post",
          headers: {
            "x-auth-token":  window.localStorage.getItem("token")
          },
          body: formData,
        });
        const responseJson = await response.json();

        if (responseJson.status === "success") {
              setisBtnLoading(false);
              reset()
              alert(responseJson.message);
        }
        if (responseJson.status === "error") {
              setisBtnLoading(false);
              alert(responseJson.message);
        }
      } catch (error) {
              setisBtnLoading(false);
              console.error(error);
      }
  



    }

    const getMarketer = async() => {
      try {

      setPage('all')
      setIsPageLoading(true);
        
      return fetch(`${configData.TEST_URL}/marketer/getMarketer`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // "x-auth-token":  window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.data)
          setMarketers(responseJson.data);
          setMarketersN(responseJson.data);
          setIsPageLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsPageLoading(false);
        });
       } catch (error) {
         console.log(error);
         setIsPageLoading(false);
     }
    
      }

      useEffect(() => {
        getMarketer();
        // const interval = setInterval(() => {
        //   getMarketer();
        // }, 3000);

        // return () => clearInterval(interval);
      }, []);

      const showActive = () => {
        setPage('active')
        const completedData = marketersN.filter(item => item.status === true);
        setMarketers(completedData);
      };
    
      const showBlocked = () => {
        setPage('blocked')
        const completedData = marketersN.filter(item => item.status === false);
        setMarketers(completedData);
      };
    

      const navigation = (link) => {
        history.push(`/${link}`);
      }

    const mDetails = (data) => {
      history.push({
        pathname: `/Marketer-Details/${data._id}`,
        state: { data: data },
      });
      // history.push(`/Marketer-Details/${data._id}`, { state: { data: data} });
     }


  const [search, setSearch] = useState('');


  const handleAdminSearch = (query) => {
      const filteredResults = marketersN.filter((marketersN) =>
      marketersN?.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setMarketers(filteredResults);
  };

  const handleDocChange = (e) => {
      const query = e.target.value;
      setSearch(query);

      // Perform search when at least 2 characters are entered
      if (query.length >= 2) {
          handleAdminSearch(query);
      } else {
        setMarketers(marketersN); // Clear results if the search query is less than 2 characters
      }
  };



  return (
    <>
       
    <Layout>

        <div className="mainBox">


               <div className='mBoxOne'>

                   <div className="heading-section">
                     <div className="navSection">
                      <span className="inactiveText">Administration</span>
                      <span className="activeArrow">{">"}</span>
                      <span className="activeText">Marketers</span>
                     </div>

                     
                     <div class="form-group has-search" style={{width:"30%"}}>
                            <div className="col-md-12 mx-auto">
                                <div className="input-group">
                                    <input className="form-control border rounded-pill" placeholder="Search with marketers name" value={search} onChange={handleDocChange} type="search"  id="example-search-input"/>
                                </div>
                            </div>
                     </div>

                   </div>


{isPageLoading ? <>
        <div className="d-flex  justify-content-center align-items-center w-100 mt-5">
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
               </> :<>
                   <div className="mContent">
                          
                       <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                       {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) && (
                              <div onClick={offCanvasShow} className="btn-add">
                                    <span>Add Marketer</span>
                                </div>
                         )}

                                <div className="category-menu">
                                
                                <ul className="nav">
                                    <li className="nav-item"> 
                                      <a className="nav-link" href="#">Marketers</a>
                                    </li>
                                  </ul>
                                      <span className="line"></span>
                                      
                                      <ul className="nav lastNav">
                                          <li className="nav-item">
                                            <a className={page === "all" ? "nav-link activ" : "nav-link" }  onClick={()=> getMarketer()} href="#">All</a>
                                          </li>
                                          <li className="nav-item"> 
                                            <a className={page === "active" ? "nav-link activ" : "nav-link" }  onClick={()=> showActive()} href="#">Active</a>
                                          </li>
                                          <li className="nav-item"> 
                                            <a  className={page === "blocked" ? "nav-link activ" : "nav-link" }  onClick={()=> showBlocked()} href="#">Blocked</a>
                                          </li>
                                        </ul>
                                      

                                  </div>      
                            </Col>

                       <div className="userDataParent">

                   {marketers.map(m => (
                           <div onClick={() => mDetails(m)} className="userData">
                                <div className="userDataOne">
			                        <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${m.profImage}`} className="useDataImg" alt="" />
                                    <div className="userDataName">
                                      <span>{m.fullName}</span>
                                      <span>{m.email}</span>
                                    {m.status &&
                                      <div className="userState">
                                          <span>active</span>
                                      </div>}
                                    </div>
                                </div>
                                <div className="userDataTwo">
                                    <RightArrow/>
                                    <span>Join: 20th April, 2018</span>
                                </div>
                           </div>


                                ))}

                       </div>

                   </div>
    
                         </>}
                   </div>

                <div className='mainBoxTwo'> 
                  
                  <div className='userProfDisplay'>


                              <div className="profInfo">
                                   <h4>Highest Perfomers this month </h4>

                                <div className="perfomer">
                                    <div className="perfOne">
                                         <img src={img} className="img-fluid perfImg" alt="user"/>
                                         <div>
                                            <span className="perfName">Previous vwarho</span>
                                            <span className="perfAmount">#20,000,000.00</span>
                                         </div>
                                    </div>
                                    
                                    <div className="perfNubAmt">
                                        <span className="perfNumb">10</span>
                                        <span className="perfAmount">Properties Sold</span>
                                     </div>
                                </div>
                                


                              </div>

                  </div>
                    
        
                        
                </div>

        </div>

    </Layout>


    <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Marketer</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                                    
                                   
        <form onSubmit={handleSubmit(adminMarketer)} className="pt-3"  enctype="multipart/form-data" id="submit">

                 <div className="adminForm">

                            <div className="col-md-12 d-flex justify-content-center">
                            <label htmlFor="imageInput">
                               <div className="imgCircleDiv">
                                    {!selectedImage ? (
                                          <span style={{ fontSize: '24px' }}>+</span>
                                        ) : (
                                          <img src={selectedImage}
                                            alt="Selected"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}/>
                                         )}
                                      </div>
                                    </label>
                                 <input type="file" name="profImage"  ref={register({ required: true})} 
                                    id="imageInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}/>

                              </div>

                      <div className="col-md-12">
    
                                <div className="form-floating mt-3">
                                        <input placeholder="" type="text" className="h-auto form-control" name="fullName" 
                                        ref={register({ required: true})} />
                                        {errors.fullName && <span className="alert alert-danger" role="alert">Full Name Required</span>}
                                        <label for="floatingInput">Full Name</label>
                                    </div>
                            </div>


               <div className="row g-2">
                            <div className="col-md">
                                <div className="form-floating mt-3">
                                    <input placeholder="Phone Number" type="text" className="h-auto form-control " name="phoneNumber" 
                                        ref={register({ required: true })} />
                                        {errors.phoneNumber && <span className="alert alert-danger" role="alert">Phone Number Required</span>}
                                    <label for="floatingInput">Phone Number</label>
                                    </div>
                            </div>



                      <div className="col-md">
                      <div className="form-floating">
                            <select className="form-select mt-3" name="sex" ref={register({ required: true })}>
                              {/* <span className="mt-4">Select Sex</span> */}
                                  <option value='male'>Male</option>
                                  <option value='female'>Female</option>
                            </select>
                            <label for="floatingSelect">Sex</label>
                        </div>

                            </div>

                      </div>

                <div className="col-md-12">
                        <div className="form-floating mt-3">
                            <input placeholder="Email Address" type="text" className="h-auto form-control" name="email" ref={register({ required: true })} />
                              {errors.email && <span className="alert alert-danger" role="alert">Email Required</span>}
                              <label for="floatingInput">Email Address</label>
                            </div>

                            </div>

                      <div className="form-floating mt-3">
                         <textarea  id="floatingTextarea2" className="form-control" placeholder="Type contact address here"  name="address" ref={register({ required: true })} style={{height: "100px"}}/>
                         {errors.address && <span className="alert alert-danger" role="alert">Contact address Required</span>}
                         <label for="floatingTextarea2">Contact Address</label>
                        </div>

                        <div className="col-md-12">
                              <div className="form-floating mt-3">
                                      <input placeholder="" type="text" className="h-auto form-control" name="accountName" 
                                      ref={register({ required: true})} />
                                      {errors.accountName && <span className="alert alert-danger" role="alert">Account Name Required</span>}
                                      <label for="floatingInput">Account Name</label>
                                  </div>
                            </div>

                        <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="" type="text" className="h-auto form-control" name="accountNumber" 
                                                ref={register({ required: true})} />
                                                {errors.accountNumber && <span className="alert alert-danger" role="alert">Account Number Required</span>}
                                                <label for="floatingInput">Account Number</label>
                                            </div>
                                            </div>
        
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="" type="text" className="h-auto form-control" name="bankName" 
                                                ref={register({ required: true})} />
                                                {errors.bankName && <span className="alert alert-danger" role="alert">Bank Name Required</span>}
                                                <label for="floatingInput">Bank Name</label>
                                            </div>
                                            </div>
                                            
                                    </div>

                        
                   <div className="col-md">
                      
                      <div class="form-floating">
                      <input type="date" id="dateJoined" className="form-control mt-3" placeholder="Date Joined" name="dateJoined" ref={register({ required: true })}/>
                          <label for="floatingSelect">Date Joined</label>
                      </div>

                </div>
                        

                        <div className="mt-4 mb-4">

            {isBtnLoading ? (<>
        <div className="d-flex  justify-content-end align-items-center w-100">
              <ColorRing
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={['#0b9967', '#0b9967', '#0b9967', '#0b9967', '#0b9967']}
                  />
                <span>Creating account... </span>
             </div>
                </>)
                : (<>

                <Button variant="primary"  className="float-end"  type="submit" disabled={isBtnLoading}>Add Marketer
                </Button>
             </>)}
                          </div>

                        </div>

          </form> 
                                    
                                    
                                    
                                    
                                   </Offcanvas.Body>
                              </Offcanvas>







    </>
  );
}

export default Marketers;