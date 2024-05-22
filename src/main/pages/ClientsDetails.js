
import axios from "axios";
import React, {useState, useEffect, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, useParams } from 'react-router-dom';
import { Image, Button, Row, Col, Modal, Offcanvas } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import Layout from '../Layout';
import img from '../assets/img/IMG-2.jpg';
import {LongArrow} from './svg/Svg';
import { FaRegEdit } from "react-icons/fa";
import { format } from 'date-fns';
import TransComp from "./Components/TransComp";
import { Context } from '../../Store';
import { ThreeDots, ColorRing } from 'react-loader-spinner';

function ClientsDetails() {
    const history = useHistory();
    const [state] = useContext(Context);
    const [data, setData] = useState(history.location?.state?.data);
    const { id } = useParams();

    const [page, setPage] = useState("all");
    const [trans, setTrans] = useState([]);
    const [transNew, setTransNew] = useState([]);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [isPageLoading, setisPageLoading] = useState(false);
    const { register, handleSubmit, setValue, errors } = useForm();
  
      const [showOffcanvas, setShowOffcanvas] = useState(false);
  
     const offCanvasClose = () => setShowOffcanvas(false);
     const offCanvasShow = () => setShowOffcanvas(true);

     const [selectedImage, setSelectedImage] = useState(null);


     const getClient = async() => {
            
        return fetch(`${configData.TEST_URL}/client/getSingleClient/${id}`, {
            method: "get",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // "x-auth-token":  window.localStorage.getItem("token")
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
               setData(responseJson.data);
            })
            .catch((error) => {
            console.error(error);
            });
        
      }

     
     useEffect(() => {
        setData(history.location?.state?.data);
      }, [history.location?.state?.data]);
    
  
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
   
    const updateMarketer = async(data) => {
        
        const formData = new FormData();
  
        formData.append('fullName', data.fullName);
        formData.append('email', data.email);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('sex', data.sex);
        formData.append('address', data.address);
        formData.append('dateOfBirth', data.dateOfBirth);
        formData.append('state', data.state);
        formData.append('city', data.city);

      setisBtnLoading(true)

          

      try {
        const response = await fetch(`${configData.TEST_URL}/client/update/${id}`, {
          method: "put",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": window.localStorage.getItem("token") 
        },
        body: JSON.stringify({data})
        });
        const responseJson = await response.json();

        if (responseJson.status === "success") {
               // Update the data state
                setData(responseJson.data);
              setisBtnLoading(false);
              alert(responseJson.message);
              offCanvasClose()
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
  
    const getClientDocs = async() => {
        try {
            setPage('all');
            setisPageLoading(true);
            
        return fetch(`${configData.TEST_URL}/document/client/${id}`, {
            method: "get",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-auth-token":  window.localStorage.getItem("token")
            },
          })
            .then((response) => response.json())
            .then((responseJson) => {
                setTrans(responseJson.data);
                setTransNew(responseJson.data);
                setisPageLoading(false)
            })
            .catch((error) => {
              console.error(error);
              setisPageLoading(false)
            });
    
        } catch (error) {
             console.log(error);
             setisPageLoading(false)
        }
        
      }

      useEffect(() => {
        getClientDocs();
  },[]);

  const completedCount = transNew.filter(item => item.paymentStatus === 'success').length;
  const pendingCount =  transNew.filter(item => item.paymentStatus === 'pending').length;

  const showCompleted = () => {
    setPage('completed')
    const completedData = transNew.filter(item => item.paymentStatus === 'success');
    setTrans(completedData);
  };

  const showPending = () => {
    setPage('pending')
    const completedData = transNew.filter(item => item.paymentStatus === 'pending');
    setTrans(completedData);
  };

  const removeClient = () => {

  }

  const navigation = (link) => {
    history.push(`/${link}`);
  }


  return (
    <>
       
    <Layout>

        <div className="mainBox">


               <div className='mBoxOne' style={{width: '100%'}}>

                   <div className="heading-section">
                     <div className="navSection">
                      <span className="inactiveText">Administration</span>
                      <span className="activeArrow">{">"}</span>
                      <span className="activeText" onClick={()=> navigation('Clients')} style={{cursor:"pointer"}}>Client</span>
                      <span className="activeText">{">"}</span>
                      <span className="activeText">{data?.fullName}</span>
                     </div>

                     <div>
                     </div>

                   </div>


                   <div className="uContent">
                          

                       <div className="userSec">

                          <div className="userSecOne">
                            <div className="userDataOne">
                                <Image  crossorigin="anonymous" src={`${configData.TEXT_IMG}/${data.passport}`} className="useDataImg" alt="" />
                                <div className="userDataName">
                                <span>{data?.fullName}</span>
                                <span>{data?.email}</span>
                   {(state.profile.role === 'admin' || (state.profile.permission === 'clients' && ['edit'].some(substring => state.profile.permissionType.includes(substring)))) && (
                            <FaRegEdit onClick={offCanvasShow} style={{cursor:"pointer"}} />
                   )}
                                            </div>
                                        </div>
                                </div>

                                <LongArrow/>

                            <div className="mrk">
                                <h4>Client</h4>
                            </div>

                        </div>


                        <div className="userBtnPa">
                             <div className="firstUserBtns">
                                    <div className={page === "all" ? "user-btn" : "user-inactivBtn"} onClick={()=> getClientDocs()}>
                                            <span>All ({transNew.length})</span>
                                        </div>
                                    <div className={page === "completed" ? "user-btn" : "user-inactivBtn" }  onClick={()=> showCompleted()}>
                                            <span>Completed ({completedCount})</span>
                                        </div>
                                    <div className={page === "pending" ? "user-btn" : "user-inactivBtn"} onClick={()=> showPending()}>
                                            <span>Pending ({pendingCount})</span>
                                        </div>
                              </div>
                              <div>
                   {(state.profile.role === 'admin' || (state.profile.permission === 'clients' && ['delete'].some(substring => state.profile.permissionType.includes(substring)))) && (<>
                                {data.status == true ? 
                                    <div onClick={removeClient} className="del-btn">
                                            <span>Deactivate Client</span>
                                        </div>
                                        :
                                    <div onClick={removeClient} className="activate-btn">
                                    <span>Activate Marketer</span>
                                </div>
                                }
                   </>)}
                                </div>
                         </div>

                        
                        <div className="userOverview">


                        <div className="user-summary">

                                <div className="profInfo">
                                    <h4>Profile Info</h4>

                                    <div className="profInfoData">

                                        <div className="profData">
                                            <span>First Name</span>
                                            <span>{data?.fullName}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Sex</span>
                                            <span>{data?.sex}</span>
                                        </div>
                                        
                                        <div className="profData">
                                            <span>Email</span>
                                            <span>{data?.email}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Phone</span>
                                            <span>{data?.phoneNumber}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Address</span>
                                            <span>{data?.address}</span>
                                        </div>
                                        
                                        <div className="profData">
                                            <span>Date of Birth</span>
                                            <span>{format(new Date(data?.dateOfBirth), 'do MMM yy')}</span>
                                        </div>

                                        <div className="profData">
                                            <span>State</span>
                                            <span>{data?.state}</span>
                                        </div>

                                        <div className="profData">
                                            <span>City</span>
                                            <span>{data?.city}</span>
                                        </div>
                                        
                                        
                                        

                                    </div>
                                </div>
                                
                         </div>

                            <div className="user-trans">


                                <div className="">

                                <div className="tranHeader">
                                    <span>Transactions</span>
                                    {/* <span>{trans.length} records</span> */}
                                </div>

                                    <div className='docList'>
                                            <div class="col-12 mt-3">
                {isPageLoading ? <>
                  <div className="d-flex  justify-content-center align-items-center w-100 pt-5">
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

                            </>

                            : <>  
                                                
                                <TransComp trans={trans}/> 

                        </>}
                                            </div>
                                    </div>

                                </div>
                            
                                                                
                            </div>


                            {/* <div className="estate-details">

                            </div> */}

                        </div>


                   </div>
    
                   </div>

                
        </div>

    </Layout>







    <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                                  <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Update Client</Offcanvas.Title>
                                  </Offcanvas.Header>
                                  <Offcanvas.Body>
                                    
                                   
        <form onSubmit={handleSubmit(updateMarketer)} className="pt-3"  enctype="multipart/form-data" id="submit">
                          
                        
                <div className="adminForm">

                        {/* <div className="col-md-12 d-flex justify-content-center">
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

                            </div> */}

                <div className="col-md-12">
                    <div className="form-floating mt-3">
                            <input placeholder="" type="text" className="h-auto form-control" name="fullName" 
                            ref={register({ required: true})} defaultValue={data ? data?.fullName : ''}/>
                            {errors.fullName && <span className="alert alert-danger" role="alert">Full Name Required</span>}
                            <label for="floatingInput">Full Name</label>
                        </div>
                    </div>



            <div className="row g-2">
                    <div className="col-md">
                    <div class="form-floating">
                        <select className="form-select mt-3" name="sex" ref={register({ required: true })} defaultValue={data ? data?.sex : ''}>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                        </select>
                        <label for="floatingSelect">Sex</label>
                    </div>

                        </div>

                    <div className="col-md">

                    <div class="form-floating">
                    <input type="date" id="dateofbirth" className="form-control mt-3" placeholder="Date Of Birth" name="dateOfBirth" ref={register({ required: true })} defaultValue={data ? data?.dateOfBirth : ''}/>
                        <label for="floatingSelect">Date Of Birth</label>
                    </div>

                            </div>
            </div>


                    <div className="row g-2">
                        <div className="col-md">
                            <div className="form-floating mt-3">
                                <input placeholder="Phone Number" type="text" className="h-auto form-control " name="phoneNumber" 
                                    ref={register({ required: true })}  defaultValue={data ? data?.phoneNumber : ''}/>
                                    {errors.phoneNumber && <span className="alert alert-danger" role="alert">Phone Number Required</span>}
                                <label for="floatingInput">Phone Number</label>
                                </div>
                        </div> 

                        <div className="col-md">
                                <div className="form-floating mt-3">
                                    <input placeholder="Email Address" type="text" className="h-auto form-control " name="email" ref={register({ required: true })}  defaultValue={data ? data?.email : ''}/>
                                    {errors.email && <span className="alert alert-danger" role="alert">Email Required</span>}
                                    <label for="floatingInput">Email Address</label>
                                    </div>
                        </div>

                    </div>


                    <div className="row g-2">
                        <div className="col-md">
                            <div className="form-floating mt-3">
                                    <input placeholder="" type="text" className="h-auto form-control" name="state" 
                                    ref={register({ required: true})}  defaultValue={data ? data?.state : ''}/>
                                    {errors.state && <span className="alert alert-danger" role="alert">State is Required</span>}
                                    <label for="floatingInput">State</label>
                                </div>
                                </div>

                        <div className="col-md">
                            <div className="form-floating mt-3">
                                    <input placeholder="" type="text" className="h-auto form-control" name="city" 
                                    ref={register({ required: true})}  defaultValue={data ? data?.city : ''}/>
                                    {errors.city && <span className="alert alert-danger" role="alert">City Required</span>}
                                    <label for="floatingInput">City</label>
                                </div>
                                </div>
                                
                        </div>

                <div className="form-floating mt-3">
                    <textarea  id="floatingTextarea2" className="form-control" placeholder="Type contact address here"  name="address" ref={register({ required: true })}  defaultValue={data ? data?.address : ''} style={{height: "100px"}}/>
                    {errors.address && <span className="alert alert-danger" role="alert">Contact address Required</span>}
                    <label for="floatingTextarea2">Contact Address</label>
                </div>

                    


                <div className="mt-4 mb-4">

    {isBtnLoading ? <>
        <div className="d-flex  justify-content-end align-items-center w-100 mt-5">
                <ColorRing
                    visible={true}
                    height="30"
                    width="30"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#0b9967', '#0b9967', '#0b9967', '#0b9967', '#0b9967']}/>
                <span>Updating account... </span>
             </div>
                </>

                : <>

                    <Button variant="primary"  className="float-end"  type="submit" disabled={isBtnLoading}>     
                    Update Client
                    </Button>
             </>}
                </div>

                    </div>


          </form> 
                                    
                                    
                                    
                                    
                                   </Offcanvas.Body>
                              </Offcanvas>








    </>
  );
}

export default ClientsDetails;
