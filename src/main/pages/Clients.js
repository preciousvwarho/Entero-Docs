import React, {useState, useEffect, useContext} from 'react';
import { useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Button, Row, Col, Modal, Offcanvas } from 'react-bootstrap';
import configData from "../../config.json";
import Layout from '../Layout';
import img from '../assets/img/IMG-2.jpg';
import {RightArrow} from './svg/Svg';
import { useHistory } from "react-router-dom";
import { Context } from '../../Store';


function Clients() {
    const history = useHistory();

    const [state, setState] = useContext(Context);
    const [clients, setClients] = useState([]);
    const [nClients, setNclients] = useState([]);
    const [isBtnLoading, setisBtnLoading] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
  
    const { register, handleSubmit, setValue,reset, errors  } = useForm();
  
    const [showOffcanvas, setShowOffcanvas] = useState(false);
  
     const offCanvasClose = () => setShowOffcanvas(false);
     const offCanvasShow = () => setShowOffcanvas(true);
  
  
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
  
     const adminClient = async (data) => {
           console.log(data);
  
  
          const formData = new FormData();
  
          formData.append('passport', data.passport[0]);
          formData.append('fullName', data.fullName);
          formData.append('email', data.email);
          formData.append('phoneNumber', data.phoneNumber);
          formData.append('sex', data.sex);
          formData.append('address', data.address);
          formData.append('dateOfBirth', data.dateOfBirth);
          formData.append('state', data.state);
          formData.append('city', data.city);
  
        // return console.log(data.dateOfBirth);
  
        setisBtnLoading(true)
  
            
  
        try {
          const response = await fetch(`${configData.TEST_URL}/client/addClient`, {
            method: "post",
            headers: {
              "x-auth-token":  window.localStorage.getItem("token")
            },
            body: formData,
          });
          const responseJson = await response.json();
  
          if (responseJson.status === "success") {
                setisBtnLoading(false);
                reset();
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
  
  
  
       const getClients = async() => {
            
                return fetch(`${configData.TEST_URL}/client/getAllClients`, {
                    method: "get",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    // "x-auth-token":  window.localStorage.getItem("token")
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                       setClients(responseJson.data);
                       setNclients(responseJson.data);
                    })
                    .catch((error) => {
                    console.error(error);
                    });
                
       }
  
  
        useEffect(() => {
          getClients();
          // const interval = setInterval(() => {
          //   getClients();
          // }, 3000);
  
          // return () => clearInterval(interval);
        }, []);
      
  
  
      const navigation = (data) => {
        history.push({
          pathname: `/Client-Details/${data?._id}`,
          state: { data: data },
        });
    }
  
    const [search, setSearch] = useState('');


    const handleAdminSearch = (query) => {
        const filteredResults = nClients.filter((nClients) =>
        nClients?.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setClients(filteredResults);
    };
  
    const handleDocChange = (e) => {
        const query = e.target.value;
        setSearch(query);
  
        // Perform search when at least 2 characters are entered
        if (query.length >= 2) {
            handleAdminSearch(query);
        } else {
          setClients(nClients); // Clear results if the search query is less than 2 characters
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
                      <span className="activeText">Clients</span>
                     </div>

                    
                     
                     <div class="form-group has-search" style={{width:"30%"}}>
                            <div className="col-md-12 mx-auto">
                                <div className="input-group">
                                    <input className="form-control border rounded-pill" placeholder="Search with clients name" value={search} onChange={handleDocChange} type="search"  id="example-search-input"/>
                                </div>
                            </div>
                     </div>

                   </div>


                   <div className="mContent">

                   {(state.profile.role === 'admin' || (state.profile.permission === 'clients' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) && (
                      <div onClick={offCanvasShow} className="btn-add">
                            <span>Add Client</span>
                        </div>
                   )}

                                                
                       <Col lg="12" style={{margin:'0px', padding:'0px'}}>
                                <div class="category-menu">
                                
                                <ul class="nav">
                                    {/* <li class="nav-item"> 
                                      <a class="nav-link" href="#"><i class="fa fa-long-arrow-alt-left"></i></a>
                                    </li> */}
                                    <li class="nav-item"> 
                                      <a class="nav-link" href="#">Clients</a>
                                    </li>
                                  </ul>
                                      <span class="line"></span>
                                      

                                  </div>      
                            </Col>

                       <div className="userDataParent">

                   {clients.map(c => (
                           <div onClick={() => navigation(c)} className="userData">
                                <div className="userDataOne">
			                        <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${c.passport}`} className="useDataImg" alt="" />
                                    <div className="userDataName">
                                      <span>{c?.fullName}</span>
                                      <span>{c?.email}</span>
                                      <span>{c?.phoneNumber}</span>
                                    </div>
                                </div>
                                <div className="userDataTwo">
                                    <RightArrow/>
                                    <span>Client</span>
                                </div>
                           </div>

                                ))}


                       </div>

                   </div>
    
                   </div>

                <div className='mainBoxTwo'> 
                  
                  <div className='userProfDisplay'>


                  <div className="profInfo">
                                   <h4>Due Payment</h4>

                                <div className="dueParent">
                                       <img src={img} className="img-fluid perfImg" alt="user"/>
                                        <span className="perfName">Precious vwarho</span>
                                        <span>+2347035814787</span>
 
                                    <div className="profInfo">

                                        <div className="profInfoData">

                                            <div className="profData">
                                                <span>Due Date</span>
                                                <span>23rd Nov, 2023</span>
                                            </div>

                                            <div className="profData">
                                                <span>Property</span>
                                                <span>Flourish Estate</span>
                                            </div>
                                            
                                            <div className="profData">
                                                <span>Payment Plan</span>
                                                <span>3-6 Months</span>
                                            </div>
                                            
                                            <div className="profData">
                                                <span>Balance</span>
                                                <span>#200,000</span>
                                            </div>

                                        </div>
                                    </div>
                                    
                                </div>

                                <div className="dueParent">
                                       <img src={img} className="img-fluid perfImg" alt="user"/>
                                        <span className="perfName">Precious vwarho</span>
                                        <span>+2347035814787</span>
 
                                    <div className="profInfo">

                                        <div className="profInfoData">

                                            <div className="profData">
                                                <span>Due Date</span>
                                                <span>23rd Nov, 2023</span>
                                            </div>

                                            <div className="profData">
                                                <span>Property</span>
                                                <span>Flourish Estate</span>
                                            </div>
                                            
                                            <div className="profData">
                                                <span>Payment Plan</span>
                                                <span>3-6 Months</span>
                                            </div>
                                            
                                            <div className="profData">
                                                <span>Balance</span>
                                                <span>#200,000</span>
                                            </div>

                                        </div>
                                    </div>
                                    
                                </div>
                                


                              </div>

                  </div>
                    
        
                        
                </div>

        </div>

    </Layout>


    <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                                  <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>New Client</Offcanvas.Title>
                                  </Offcanvas.Header>
                                  <Offcanvas.Body>
            
                                    
                                   
                <form onSubmit={handleSubmit(adminClient)} className="pt-3"  enctype="multipart/form-data" id="submit">
        
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
                                            <input type="file" name="passport"  ref={register({ required: true})} 
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
                                <div class="form-floating">
                                    <select className="form-select mt-3" name="sex" ref={register({ required: true })}>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                    </select>
                                    <label for="floatingSelect">Sex</label>
                                </div>
        
                                    </div>
        
                                <div className="col-md">
        
                                <div class="form-floating">
                                <input type="date" id="dateofbirth" className="form-control mt-3" placeholder="Date Of Birth" name="dateOfBirth" ref={register({ required: true })}/>
                                    <label for="floatingSelect">Date Of Birth</label>
                                </div>
        
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
                                            <div className="form-floating mt-3">
                                                <input placeholder="Email Address" type="text" className="h-auto form-control " name="email" ref={register({ required: true })} />
                                                {errors.email && <span className="alert alert-danger" role="alert">Email Required</span>}
                                                <label for="floatingInput">Email Address</label>
                                                </div>
                                      </div>
            
                                </div>


                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="" type="text" className="h-auto form-control" name="state" 
                                                ref={register({ required: true})} />
                                                {errors.state && <span className="alert alert-danger" role="alert">State is Required</span>}
                                                <label for="floatingInput">State</label>
                                            </div>
                                            </div>
        
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="" type="text" className="h-auto form-control" name="city" 
                                                ref={register({ required: true})} />
                                                {errors.city && <span className="alert alert-danger" role="alert">City Required</span>}
                                                <label for="floatingInput">City</label>
                                            </div>
                                            </div>
                                            
                                    </div>

                            <div className="form-floating mt-3">
                                <textarea  id="floatingTextarea2" className="form-control" placeholder="Type contact address here"  name="address" ref={register({ required: true })} style={{height: "100px"}}/>
                                {errors.address && <span className="alert alert-danger" role="alert">Contact address Required</span>}
                                <label for="floatingTextarea2">Contact Address</label>
                             </div>
        
                                
        

                            <div className="mt-4 mb-4">

                                <Button variant="primary"  className="float-end"  type="submit" disabled={isBtnLoading}>     
                                {isBtnLoading ? (<>Waiting...</>) : (<>Add Client</>)}
                                </Button>
                             </div>
        
                                </div>
        
                    </form> 

    
                                    
                                   </Offcanvas.Body>
                              </Offcanvas>






    </>
  );
}

export default Clients;