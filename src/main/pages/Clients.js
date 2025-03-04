import React, { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Button, Row, Col, Modal, Offcanvas } from 'react-bootstrap';
import configData from "../../config.json";
import Layout from '../Layout';
import img from '../assets/img/IMG-2.jpg';
import { RightArrow } from './svg/Svg';
import { useHistory } from "react-router-dom";
import { Context } from '../../Store';
import { toast } from "react-toastify";

import io from 'socket.io-client';
const socket = io(`${configData.URL}`);



function Clients() {
    const history = useHistory();


    useEffect(() => {
        socket.on('client-added', (param) => {
            getClients();
        });

        return () => {
            socket.off('client-added');
        };
    }, []);

    const [state, setState] = useContext(Context);
    const [clients, setClients] = useState([]);
    const [nClients, setNclients] = useState([]);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
      const [page, setPage] = useState("all");

    const [selectedImage, setSelectedImage] = useState(null);

    const { register, handleSubmit, setValue, reset, errors } = useForm();

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = () => setShowOffcanvas(true);



    const [type, setType] = useState(null);
    const [docPage, setDocPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(null);
    const [pageNumberRange, setPageNumberRange] = useState([]);

    useEffect(() => {
        updatePageNumberRange();
    }, [docPage, totalPages]);

    const updatePageNumberRange = () => {
        const rangeStart = Math.max(1, docPage - 2);
        const rangeEnd = Math.min(totalPages, rangeStart + 4);

        setPageNumberRange([...Array(rangeEnd - rangeStart + 1).keys()].map(num => num + rangeStart));
    };



    const onPageChange = (pageNumb) => {
        setDocPage(pageNumb);
        if (type !== null) {
            statusMarketer(pageNumb, type);
            return
        }
        getClients(pageNumb);
    };

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

        setisBtnLoading(true)



        try {
            const response = await fetch(`${configData.SERVER_URL}/client/addClient`, {
                method: "post",
                headers: {
                    "x-auth-token": window.localStorage.getItem("token")
                },
                body: formData,
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {
                setisBtnLoading(false);
                reset();
                toast.success(responseJson.message);
            }
            if (responseJson.status === "error") {
                setisBtnLoading(false);
                toast.error(responseJson.message);
            }
        } catch (error) {
            setisBtnLoading(false);
            console.error(error);
        }




    }

    const getClients = async () => {

        return fetch(`${configData.SERVER_URL}/client/getAllClients`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-auth-token":  window.localStorage.getItem("token")
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Clients gotten: ", responseJson.data)
                setClients(responseJson.data);
                setNclients(responseJson.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    useEffect(() => {
        getClients();
    }, []);

    const statusMarketer = async (pageD, type) => {
        try {

            setIsPageLoading(true);

            return fetch(`${configData.SERVER_URL}/marketer/getClientsPaginatedStatus?page=${pageD}&sizePerPage=${sizePerPage}&pageType=${type}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setClients(responseJson.data);
                    setNclients(responseJson.data);
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

    const navigation = (data) => {
        history.push({
            pathname: `/Client-Details/${data?._id}`,
            state: { data: data },
        });
    }

    const [search, setSearch] = useState('');


    const handleClientSearch = async(query) => {
        try {
            setIsPageLoading(true);
      
            const response = await fetch(`${configData.SERVER_URL}/client/searchClient?page=${page}&sizePerPage=${sizePerPage}&search=${query}`, {
              method: "post",
              headers: {
                Accept: "application/json",
                "x-auth-token": window.localStorage.getItem("token")
              }
            })
      
            const responseJson = await response.json();
            setTotalPages(responseJson.totalPages)
            setClients(responseJson.data);
            setIsPageLoading(false);
      
          } catch (error) {
            console.log(error);
            setIsPageLoading(false);
          }
    };

    const handleDocChange = (e) => {
        const query = e.target.value;
        setSearch(query);

        // Perform search when at least 2 characters are entered
        if (query.length >= 2) {
            handleClientSearch(query);
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



                            <div class="form-group has-search" style={{ width: "30%" }}>
                                <div className="col-md-12 mx-auto">
                                    <div className="input-group">
                                        <input className="form-control border rounded-pill" placeholder="Search with clients name" value={search} onChange={handleDocChange} type="search" id="example-search-input" />
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


                            <Col lg="12" style={{ margin: '0px', padding: '0px' }}>
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


                    {clients.length > 0 ?
                      <table className="table table-image">
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">Clients Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>

                        <tbody>

                          {clients && clients.length > 0
                            && clients.map((data, index) => {
                              return <>
                                <tr key={index + 1} onClick={() => navigation(data)} className="tr">
                                  <td>
                                    <img 
                                    // crossorigin="anonymous"
                                     src={`${configData.PIC_URL}/${data.passport}`} className="img-fluid tableImg" alt="user" />
                                  </td>
                                  <td>{data?.fullName}</td>
                                  <td>{data?.email}</td>
                                  <td>{data?.phoneNumber}</td>
                                  <td>{data?.status ? "active" : "blocked"} </td>
                                </tr>

                              </>
                            })}

                        </tbody>

                      </table>

                      : <div className="col-md-12 py-5">

                        <h6 className="text-center">No Client found</h6>

                      </div>}


                                {/* {clients.map(c => (
                                    <div onClick={() => navigation(c)} className="userData">
                                        <div className="userDataOne">
                                            <Image crossorigin="anonymous" src={`${configData.PIC_URL}/${c.passport}`} className="useDataImg" alt="" />
                                            <div className="userDataName">
                                                <span>{c?.fullName}</span>
                                                <span>{c?.email}</span>
                                                <span>{c?.phoneNumber}</span>
                                            </div>
                                        </div>
                                        <div className="userDataTwo">
                                            <RightArrow />
                                            <span>Client</span>
                                        </div>
                                    </div>

                                ))} */}


                            </div>



                            <div className="w-100 mt-4 d-flex justify-content-end align-items-center">


                                {totalPages > 1 &&

                                    <nav aria-label="...">
                                        <ul className="pagination">
                                            <li className={`page-item ${docPage === 1 ? 'disabled' : ''}`}>
                                                <a className="page-link" href="#" onClick={() => onPageChange(docPage - 1)}>Previous</a>
                                            </li>
                                            {pageNumberRange.map(pageNum => (
                                                <li key={pageNum} className={`page-item ${pageNum === docPage ? 'active' : ''}`}>
                                                    <a className="page-link" href="#" onClick={() => onPageChange(pageNum)}>{pageNum}</a>
                                                </li>
                                            ))}
                                            <li className={`page-item ${docPage === totalPages ? 'disabled' : ''}`}>
                                                <a className="page-link" href="#" onClick={() => onPageChange(docPage + 1)}>Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                }
                            </div>


                        </div>

                    </div>

                    <div className='mainBoxTwo'>

                        <div className='userProfDisplay'>

{/* 
                            <div className="profInfo">
                                <h4>Due Payment</h4>

                                <div className="dueParent">
                                    <img src={img} className="img-fluid perfImg" alt="user" />
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
                                    <img src={img} className="img-fluid perfImg" alt="user" />
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



                            </div> */}

                        </div>
                        
                    </div>

                </div>

            </Layout>


            <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>New Client</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>



                    <form onSubmit={handleSubmit(adminClient)} className="pt-3" enctype="multipart/form-data" id="submit">

                        <div className="adminForm">

                            <div className="col-md-12 d-flex justify-content-center">
                                <label htmlFor="imageInput">
                                    <div className="imgCircleDiv">
                                        {!selectedImage ? (
                                            <span style={{ fontSize: '24px' }}>+</span>
                                        ) : (
                                            <img src={selectedImage}
                                                alt="Selected"
                                                style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                        )}
                                    </div>
                                </label>
                                <input type="file" name="passport" ref={register({ required: true })}
                                    id="imageInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange} />

                            </div>

                            <div className="col-md-12">
                                <div className="form-floating mt-3">
                                    <input placeholder="" type="text" className="h-auto form-control" name="fullName"
                                        ref={register({ required: true })} />
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
                                        <input type="date" id="dateofbirth" className="form-control mt-3" placeholder="Date Of Birth" name="dateOfBirth" ref={register({ required: true })} />
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
                                        <input placeholder="Email Address" type="text" className="h-auto form-control " name="email" ref={register({ required: false })} />
                                        {errors.email && <span className="alert alert-danger" role="alert">Email Required</span>}
                                        <label for="floatingInput">Email Address</label>
                                    </div>
                                </div>

                            </div>


                            <div className="row g-2">
                                <div className="col-md">
                                    <div className="form-floating mt-3">
                                        <input placeholder="" type="text" className="h-auto form-control" name="state"
                                            ref={register({ required: true })} />
                                        {errors.state && <span className="alert alert-danger" role="alert">State is Required</span>}
                                        <label for="floatingInput">State</label>
                                    </div>
                                </div>

                                <div className="col-md">
                                    <div className="form-floating mt-3">
                                        <input placeholder="" type="text" className="h-auto form-control" name="city"
                                            ref={register({ required: true })} />
                                        {errors.city && <span className="alert alert-danger" role="alert">City Required</span>}
                                        <label for="floatingInput">City</label>
                                    </div>
                                </div>

                            </div>

                            <div className="form-floating mt-3">
                                <textarea id="floatingTextarea2" className="form-control" placeholder="Type contact address here" name="address" ref={register({ required: true })} style={{ height: "100px" }} />
                                {errors.address && <span className="alert alert-danger" role="alert">Contact address Required</span>}
                                <label for="floatingTextarea2">Contact Address</label>
                            </div>




                            <div className="mt-4 mb-4">

                                <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
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
