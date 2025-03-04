import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Offcanvas, Button, Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import Layout from '../Layout';
import { LongArrow } from './svg/Svg';
import { useHistory, useParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { format } from 'date-fns';
import { FaRegEdit, FaTrashAlt, FaLock, FaLockOpen } from "react-icons/fa";
import CommissionComp from "./Components/CommissionComp";
import TransComp from "./Components/TransComp";
import Refereer from "./Components/Refereer";
import { Context } from '../../Store';
import { ThreeDots, ColorRing } from 'react-loader-spinner';
import { toast } from "react-toastify";


import io from 'socket.io-client';
const socket = io(`${configData.URL}`);


function MarketerDetails() {

  useEffect(() => {
    socket.on('marketer-activity', (data) => {
      getMarketerDetails();
    });

    return () => {
      socket.off('marketer-activity');
    };
  }, []);

  useEffect(() => {
    socket.on('document-activity', (param) => {
      if (param.data?.marketerId == data?._id) {
        getLeatetMarketerDocs()
        getMarketerDocs();
      }
    });

    return () => {
      socket.off('document-activity');
    };
  }, []);


  useEffect(() => {
    socket.on('commission-request', (param) => {
      if (param.data?.requesterId == data?._id) {
        getCommision();
        getLatestCommision()
      }
    });

    return () => {
      socket.off('commission-request');
    };
  }, []);

  useEffect(() => {
    socket.on('marketer-added', (param) => {
      if (param.data?.referralId == data?._id) {
        getRefMarketer();
      }
    });

    return () => {
      socket.off('marketer-added');
    };
  }, []);

  const history = useHistory();
  const [data, setData] = useState(history.location?.state?.data);
  const { id } = useParams();
  const [state] = useContext(Context);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isComLoading, setIsComLoading] = useState(false);
  const [isRefLoading, setIsRefLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // console.log("data", JSON.stringify(data, null, 2))

  const { register, handleSubmit, setValue, errors } = useForm();

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const offCanvasClose = () => setShowOffcanvas(false);
  const offCanvasShow = () => setShowOffcanvas(true);


  const [show, setShow] = useState(false);
  const [page, setPage] = useState("overview");
  const [commission, setCommission] = useState([]);
  const [latestCommission, setLatestCommission] = useState([]);
  const [marketers, setMarketers] = useState([]);
  const [refMarketers, setRefMarketers] = useState([]);
  const [refererId, setRefererId] = useState(null);
  const [trans, setTrans] = useState([])
  const [latestTrans, setLatestTrans] = useState([])
  const [isBtnLoading, setisBtnLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const lockUpliner = async (value) => {

    if (!window.confirm(`are you sure want to ${value} refereer's commission?`)) {
      return
    }
    setisBtnLoading(true)

    try {
      const response = await fetch(`${configData.SERVER_URL}/marketer/updateCanWithdraw/${id}?value=${value}`, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
        body: JSON.stringify({ data })
      });
      const responseJson = await response.json();

      if (responseJson.status === "success") {
        setData(responseJson.data);
        setisBtnLoading(false);
        toast.success(responseJson.message);
        offCanvasClose()
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


  const getMarketerDetails = async () => {
    try {

      return fetch(`${configData.SERVER_URL}/marketer/single/${id}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setData(responseJson.data);
        })
        .catch((error) => {
          console.error(error);
        });

    } catch (error) {
      console.log(error);
    }
  }

  const getMarketerDocs = async () => {
    try {
      setIsPageLoading(true)
      return fetch(`${configData.SERVER_URL}/document/marketer/${id}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setTrans(responseJson.data);
          setIsPageLoading(false)
        })
        .catch((error) => {
          console.error(error);
          setIsPageLoading(false)
        });

    } catch (error) {
      console.log(error);
      setIsPageLoading(false)
    }

  }


  const getLeatetMarketerDocs = async () => {
    try {
      setIsPageLoading(true)
      return fetch(`${configData.SERVER_URL}/document/getDocument/latest/${id}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setLatestTrans(responseJson.data);
          setIsPageLoading(false)
        })
        .catch((error) => {
          console.error(error);
          setIsPageLoading(false)
        });

    } catch (error) {
      console.log(error);
      setIsPageLoading(false)
    }

  }


  const updateMarketer = async (data) => {

    setisBtnLoading(true)

    try {
      const response = await fetch(`${configData.SERVER_URL}/marketer/update/${id}`, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
        body: JSON.stringify({ data })
      });
      const responseJson = await response.json();

      if (responseJson.status === "success") {
        setData(responseJson.data);
        setisBtnLoading(false);
        toast.success(responseJson.message);
        offCanvasClose()
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

  const removeMarketers = async () => {


    try {
      setisBtnLoading(true)

      const response = await fetch(`${configData.SERVER_URL}/marketer/remove/${id}`, {
        method: "post",
        headers: {
          "x-auth-token": window.localStorage.getItem("token")
        },
      });
      const responseJson = await response.json();

      if (responseJson.status === "success") {
        setData(responseJson.data);
        setisBtnLoading(false);
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

  const getCommision = async () => {
    try {

      setIsComLoading(true)
      return fetch(`${configData.SERVER_URL}/commission/marketer/${id}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setCommission(responseJson.data);
          setIsComLoading(false)
        })
        .catch((error) => {
          console.error(error);
          setIsComLoading(false)
        });

    } catch (error) {
      console.log(error);
      setIsComLoading(false)
    }
  }


  const getLatestCommision = async () => {
    try {

      setIsComLoading(true)
      return fetch(`${configData.SERVER_URL}/commission/marketer/latest/${id}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setLatestCommission(responseJson.data);
          setIsComLoading(false)
        })
        .catch((error) => {
          console.error(error);
          setIsComLoading(false)
        });

    } catch (error) {
      console.log(error);
      setIsComLoading(false)
    }
  }


  const getMarketer = async () => {
    try {

      return fetch(`${configData.SERVER_URL}/marketer/getMarketer`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setMarketers(responseJson.data);
        })
        .catch((error) => {
          console.error(error);
        });

    } catch (error) {
      console.log(error);
    }
  }

  const getRefMarketer = async () => {
    try {

      setIsRefLoading(true);
      return fetch(`${configData.SERVER_URL}/marketer/referers/${id}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setRefMarketers(responseJson.data);
          setIsRefLoading(false)
        })
        .catch((error) => {
          console.error(error);
          setIsRefLoading(false)
        });

    } catch (error) {
      console.log(error);
      setIsRefLoading(false)
    }
  }


  useEffect(() => {
    getMarketer();
    getRefMarketer()
    getLeatetMarketerDocs()
    getMarketerDocs();
    getCommision();
    getLatestCommision()
  }, []);

  //   search query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {

    try {
      setSearchLoading(true);

      const response = await fetch(`${configData.SERVER_URL}/marketer/searchRefMarketer?search=${query}`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        }
      })

      const responseJson = await response.json();
      
    console.log(JSON.stringify(responseJson, null, 2))

      setSearchResults(responseJson.data);
      setSearchLoading(false);

    } catch (error) {
      console.log(error);
      setSearchLoading(false);
    }
  };

  const handleChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Perform search when at least 2 characters are entered
    if (query.length >= 2) {
      handleSearch(query);
    } else {
      setSearchResults([]); // Clear results if the search query is less than 2 characters
    }
  };

  const selectReferer = async (result) => {
    setRefererId(result._id);

    try {
      const response = await fetch(`${configData.SERVER_URL}/marketer/referer/${id}/${result._id}`, {
        method: "put",
        headers: {
          "x-auth-token": window.localStorage.getItem("token")
        },
      });
      const responseJson = await response.json();

      if (responseJson.status === "success") {

        setData(responseJson.data);
        setisBtnLoading(false);
        handleClose();
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

  const removeReferial = async () => {
    if (!window.confirm("are you sure want to remove this user as referial?")) {
      return
    }

    try {

      setisBtnLoading(true);

      const response = await fetch(`${configData.SERVER_URL}/marketer/referer/delete/${id}`, {
        method: "delete",
        headers: {
          "x-auth-token": window.localStorage.getItem("token")
        },
      });
      const responseJson = await response.json();

      if (responseJson.status === "success") {

        setData(responseJson.data);
        setisBtnLoading(false);
        //   alert(responseJson.message);
      }
      if (responseJson.status === "error") {
        setisBtnLoading(false);
        //   alert(responseJson.message);
      }
    } catch (error) {
      setisBtnLoading(false);
      console.error(error);
    }


  }

  const navigate = (data) => {
    history.push({
      pathname: `/Document-Details/${data?._id}`,
      state: { data: data },
    });
  }

  const completedCount = trans.filter(item => item.paymentStatus === 'success').length;
  const pendingCount = trans.filter(item => item.paymentStatus === 'pending').length;


  const navigation = (link) => {
    history.push(`/${link}`);
  }

  // console.log(JSON.stringify(data, null, 2))



  return (
    <>

      <Layout>

        <div className="mainBox">


          <div className='mBoxOne' style={{ width: '100%' }}>

            <div className="heading-section">
              <div className="navSection">
                <span className="inactiveText">Administration</span>
                <span className="activeArrow">{">"}</span>
                <span className="activeText" onClick={() => navigation('Marketers')} style={{ cursor: "pointer" }}>Marketers</span>
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

                    <Image
                      // crossorigin="anonymous"
                      src={`${configData.PIC_URL}/${data.profImage}`} className="useDataImg" alt="" />
                    <div className="userDataName">
                      <span>{data?.fullName}</span>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <span className="email">{data?.email}</span>
                        {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['edit'].some(substring => state.profile.permissionType.includes(substring)))) && (
                          <FaRegEdit className="editIcon" onClick={offCanvasShow} style={{ cursor: "pointer" }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <LongArrow />

                <div className="mrk">
                  <h4>Marketer</h4>
                  <span className="referedBy">Refered by: </span>

                  {isBtnLoading ? (<>
                    <div className="d-flex  justify-content-center align-items-center w-100">
                      <ThreeDots
                        visible={true}
                        height="30"
                        width="30"
                        color="#0b9967"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass="" />
                    </div>
                  </>)
                    : (<>

                      <div className="d-flex  justify-content-center align-items-center">
                        {data?.referralId ? <>
                          <Image
                            // crossorigin="anonymous"
                            src={`${configData.PIC_URL}/${data?.referralId?.profImage}`} className="refImg" alt="" />
                          <span className="refName">{data?.referralId?.fullName}</span>

                          {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['delete'].some(substring => state.profile.permissionType.includes(substring)))) && (
                            <FaTrashAlt className="editIcon" style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={removeReferial} />
                          )}
                        </> : <>
                          {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) && (<>
                            <FaRegEdit className="editIcon" onClick={handleShow} style={{ marginLeft: '5px', cursor: "pointer" }} />
                            <span className="refName">Add Referer</span>
                          </>)}
                        </>}


                        {data?.referralId && <>

                          {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) && (<>
                            {data?.refererComActive ?
                              <FaLockOpen onClick={() => lockUpliner('lock')} style={{ fontSize: "16px", marginLeft: '25px', cursor: "pointer", color: '#017D3D' }} /> :
                              <FaLock onClick={() => lockUpliner('unlock')} style={{ fontSize: "16px", marginLeft: '25px', cursor: "pointer", color: '#F23030' }} />
                            }
                          </>)}

                        </>}


                      </div>

                    </>)}
                </div>

              </div>


              <div className="userBtnPa">
                <div className="firstUserBtns">
                  <div className={page === "overview" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('overview')}>
                    <span>Overview</span>
                  </div>
                  <div className={page === "transactions" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('transactions')}>
                    <span>Transactions</span>
                  </div>
                  <div className={page === "commission" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('commission')}>
                    <span>Commission Requested</span>
                  </div>
                  <div className={page === "referers" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('referers')}>
                    <span>Referers</span>
                  </div>
                </div>
                <div>
                  {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['delete'].some(substring => state.profile.permissionType.includes(substring)))) && (<>
                    {data.status === true ?
                      <div onClick={removeMarketers} className="del-btn">
                        <span>Block Marketer</span>
                      </div>
                      :
                      <div onClick={removeMarketers} className="activate-btn">
                        <span>Activate Marketer</span>
                      </div>
                    }
                  </>)}
                </div>
              </div>

              <div className="userOverview">
                <div className="user-summary">

                  <div className="profInfo">
                    <h4>Summary</h4>
                    <div className="summaryBox">
                      <div>
                        <span>{completedCount}</span>
                        <span>Completed</span>
                      </div>
                      <div>
                        <span>{pendingCount}</span>
                        <span>Pending</span>
                      </div>

                    </div>

                  </div>

                  <div className="profInfo">
                    <h4>Information</h4>

                    <div className="profInfoData">

                      <div className="profData">
                        <span>First Name</span>
                        <span>{data?.fullName}</span>
                      </div>
                      <div className="profData">
                        <span>Username</span>
                        <span>{data?.username}</span>
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
                        <span>Account Name</span>
                        <span>{data?.accountName}</span>
                      </div>

                      <div className="profData">
                        <span>Account Number</span>
                        <span>{data?.accountNumber}</span>
                      </div>

                      <div className="profData">
                        <span>Bank Name</span>
                        <span>{data?.bankName}</span>
                      </div>




                    </div>
                  </div>

                </div>

                <div className="user-trans">

                  {page === "overview" && <>

                    <div className="">

                      <div className="tranHeader">
                        <span>Latest Transactions</span>
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
                                wrapperClass="" />
                            </div>

                          </>

                            : <>

                              <table className="table table-image">
                                {latestTrans.length > 0 &&
                                  <thead>
                                    <tr>
                                      <th scope="col"></th>
                                      <th scope="col">Client Name</th>
                                      <th scope="col">Estate/Layout</th>
                                      <th scope="col">Amount</th>
                                      <th scope="col">Date</th>
                                      <th scope="col">Status</th>
                                    </tr>
                                  </thead>
                                }

                                <tbody>

                                  {latestTrans && latestTrans.length > 0
                                    ? latestTrans.map((t, index) => {
                                      return <>
                                        <tr className="tr" key={index + 1} onClick={() => navigate(t)}>
                                          <td><Image
                                            // crossorigin="anonymous"
                                            src={`${configData.PIC_URL}/${t?.clientId?.passport}`} className="img-fluid tableImg" alt="user" />
                                          </td>
                                          <td>{t?.clientId?.fullName}</td>
                                          <td>{t?.estateId?.name}</td>

                                          <NumericFormat value={t?.amount} displayType={'text'} thousandSeparator={true} prefix={"₦"} renderText={text => <td>{text}</td>} />

                                          <td>{format(new Date(t?.dateOfPurchase), 'MMMM, do, yyy')}</td>
                                          <td>
                                            <span className={t?.paymentStatus === 'success' ? "completed" : "pendingStatus"}>{t?.paymentStatus === 'success' ? "completed" : "pending"}</span>
                                          </td>
                                        </tr>

                                      </>
                                    })
                                    : <div className="col-12 py-5 w-100 d-flex justify-content-center align-items-center">
                                      <h6 className="text-center">No transaction found</h6>

                                    </div>}
                                </tbody>

                              </table>

                            </>}

                        </div>
                      </div>

                    </div>


                    <div className="">

                      <div className="tranHeader mt-4">
                        <span>Commissions</span>
                      </div>

                      <div className='docList'>
                        <div class="col-12 mt-3">

                          {isComLoading ? <>
                            <div className="d-flex  justify-content-center align-items-center w-100 pt-5">
                              <ThreeDots
                                visible={true}
                                height="50"
                                width="50"
                                color="#0b9967"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass="" />
                            </div>

                          </>

                            : <>
                              <CommissionComp commission={latestCommission} />

                            </>}
                        </div>
                      </div>

                    </div>
                  </>}

                  {page === "transactions" && <>

                    <div className="">

                      <div className="tranHeader">
                        <span>Transactions</span>
                        <span>{trans.length} record{trans.length > 1 && "s"}</span>
                      </div>

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
                            wrapperClass="" />
                        </div>

                      </>

                        : <>

                          <div className='docList'>
                            <div class="col-12 mt-3">

                              <TransComp trans={trans} />

                            </div>
                          </div>

                        </>}


                    </div>
                  </>}

                  {page === "commission" && <>

                    <div className="">

                      <div className="tranHeader mt-4">
                        <span>Commisions</span>
                      </div>

                      {isComLoading ? <>
                        <div className="d-flex  justify-content-center align-items-center w-100 pt-5">
                          <ThreeDots
                            visible={true}
                            height="50"
                            width="50"
                            color="#0b9967"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass="" />
                        </div>

                      </>

                        : <>
                          <div className='docList'>
                            <div class="col-12 mt-3">
                              <CommissionComp commission={commission} />
                            </div>
                          </div>

                        </>}
                    </div>

                  </>}


                  {page === "referers" && <>

                    <div className="">

                      <div className="tranHeader mt-4">
                        <span>Referers</span>
                      </div>


                      {isRefLoading ? <>

                        <div className="d-flex  justify-content-center align-items-center w-100 pt-5">
                          <ThreeDots
                            visible={true}
                            height="50"
                            width="50"
                            color="#0b9967"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass="" />
                        </div>

                      </>

                        : <>
                          <div className='docList'>
                            <div class="col-12 mt-3">
                              <Refereer refMarketers={refMarketers} />
                            </div>
                          </div>

                        </>}
                    </div>

                  </>}







                </div>

              </div>


            </div>

          </div>


        </div>

      </Layout>


      <Modal show={show} onHide={handleClose}>

        <Modal.Body>

          <div className="modal-body my-4">
            <h6 className="mt-2 mb-4">Who referered {data.fullName} </h6>
            <div class="form-group has-search">
              <span class="fa fa-search form-control-feedback"></span>
              <input type="text" class="form-control" placeholder="Search for referer"
                value={searchQuery}
                onChange={handleChange} />
            </div>

            <div class="list-referer">

              {searchResults.map((result) => (

                <div onClick={() => selectReferer(result)} className="searchDiv d-flex align-items-center my-4 mx-4">
                  <Image
                    // crossorigin="anonymous"
                    src={`${configData.PIC_URL}/${result.profImage}`} className="serchImg" alt="" />
                  <span className="serchName">{result?.fullName}</span>
                </div>
              ))}
            </div>

          </div>



        </Modal.Body>
      </Modal>



      <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit Marketer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>


          <form onSubmit={handleSubmit(updateMarketer)} className="pt-3" enctype="multipart/form-data" id="submit">

            <div className="adminForm">


              <div className="col-md-12">

                <div className="form-floating mt-3">
                  <input placeholder="" type="text" className="h-auto form-control" name="fullName"
                    ref={register({ required: true })} defaultValue={data ? data?.fullName : ''} />
                  {errors.fullName && <span className="alert alert-danger" role="alert">Full Name Required</span>}
                  <label for="floatingInput">Full Name</label>
                </div>
              </div>


              <div className="row g-2">
                <div className="col-md">
                  <div className="form-floating mt-3">
                    <input placeholder="Phone Number" type="text" className="h-auto form-control " name="phoneNumber"
                      ref={register({ required: true })} defaultValue={data ? data?.phoneNumber : ''} />
                    {errors.phoneNumber && <span className="alert alert-danger" role="alert">Phone Number Required</span>}
                    <label for="floatingInput">Phone Number</label>
                  </div>
                </div>



                <div className="col-md">
                  <div class="form-floating">
                    <select className="form-select mt-3" name="sex" ref={register({ required: true })} defaultValue={data ? data?.sex : ''}>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </select>
                    <label for="floatingSelect">Sex</label>
                  </div>

                </div>

              </div>

              <div className="col-md-12">
                <div className="form-floating mt-3">
                  <input placeholder="Email Address" type="text" className="h-auto form-control" name="email" ref={register({ required: true })} defaultValue={data ? data?.email : ''} />
                  {errors.email && <span className="alert alert-danger" role="alert">Email Required</span>}
                  <label for="floatingInput">Email Address</label>
                </div>

              </div>

              <div className="form-floating mt-3">
                <textarea id="floatingTextarea2" className="form-control" placeholder="Type contact address here" name="address" ref={register({ required: true })} style={{ height: "100px" }} defaultValue={data ? data?.address : ''} />
                {errors.address && <span className="alert alert-danger" role="alert">Contact address Required</span>}
                <label for="floatingTextarea2">Contact Address</label>
              </div>

              <div className="col-md-12">
                <div className="form-floating mt-3">
                  <input placeholder="" type="text" className="h-auto form-control" name="accountName"
                    ref={register({ required: true })} defaultValue={data ? data?.accountName : ''} />
                  {errors.accountName && <span className="alert alert-danger" role="alert">Account Name Required</span>}
                  <label for="floatingInput">Account Name</label>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md">
                  <div className="form-floating mt-3">
                    <input placeholder="" type="text" className="h-auto form-control" name="accountNumber"
                      ref={register({ required: true })} defaultValue={data ? data?.accountNumber : ''} />
                    {errors.accountNumber && <span className="alert alert-danger" role="alert">Account Number Required</span>}
                    <label for="floatingInput">Account Number</label>
                  </div>
                </div>

                <div className="col-md">
                  <div className="form-floating mt-3">
                    <input placeholder="" type="text" className="h-auto form-control" name="bankName"
                      ref={register({ required: true })} defaultValue={data ? data?.bankName : ''} />
                    {errors.bankName && <span className="alert alert-danger" role="alert">Bank Name Required</span>}
                    <label for="floatingInput">Bank Name</label>
                  </div>
                </div>
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
                      colors={['#0b9967', '#0b9967', '#0b9967', '#0b9967', '#0b9967']} />
                    <span>Updating account... </span>
                  </div>
                </>

                  : <>

                    <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                      Update Marketer
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

export default MarketerDetails;
