
import React, { useState, useEffect, useContext, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Button, Offcanvas, Col, Modal, Nav } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router-dom';
import configData from "../../config.json";
import Layout from '../Layout';
import { LongArrow, DocArrow } from './svg/Svg';
import { NumericFormat } from 'react-number-format';
import { format } from 'date-fns';
import UpdateDoc from "./Components/UpdateDocs";
import { RiUploadCloud2Fill } from "react-icons/ri"
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import CommissionComp from "./Components/CommissionComp";
import { Context } from '../../Store';
import { ThreeDots, ColorRing } from 'react-loader-spinner';
import { toast } from "react-toastify";

import io from 'socket.io-client';
const socket = io(`${configData.URL}`);

function DocumentDetails() {
    const history = useHistory();
    const [data, setData] = useState(history.location?.state?.data);
    const [state] = useContext(Context);
    const { id } = useParams();
    const { register, handleSubmit, reset, setValue, errors } = useForm();

    // useEffect(() => {
    //     socket.on('document-activity', (param) => {

    //         console.log(param, "clientId data")

    //         if (param.data._id === id) {
    //             getSingleDocs();
    //         }
    //         if (param.data?.clientId === data?.clientId._id) {
    //             getDocs();
    //         }
    //     });

    //     return () => {
    //         socket.off('document-activity');
    //     };
    // }, []);


    useEffect(() => {
        socket.on('payment-activity', (param) => {
            if (param.data._id === id) {
                getPayment()
            }
        });

        return () => {
            socket.off('payment-activity');
        };
    }, []);


    const [showComm, setShowComm] = useState(false);
    const [showGenComm, setShowGenComm] = useState(false);
    const [show, setShow] = useState(false);
    const [page, setPage] = useState("overview");
    const [plots, setPlots] = useState([]);
    const [plotsN, setPlotsN] = useState([]);
    const [showTwo, setShowTwo] = useState(false);
    const [formType, setFormType] = useState('add');
    const [amount, setAmount] = useState(0);
    const [datePaid, setDatePaid] = useState('');
    const [error, setError] = useState('')
    const [docStatus, setDocStatus] = useState(data?.documentStatus === 'success' ? true : false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [commission, setCommission] = useState([]);

    const [editPay, setEditPay] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    
    const handleGenComClose = () => setShowGenComm(false);
    const handleGenComShow = () => setShowGenComm(true);

    const handleComClose = () => setShowComm(false);
    const handleComShow = () => setShowComm(true);


    const getCommision = async () => {
        try {

            return fetch(`${configData.SERVER_URL}/commission/document/${id}`, {
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
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCommision();
    }, []);


    //   search query
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        const filteredResults = plotsN.filter((plot) =>
            plot.plotNumber.includes(query));
        setPlots(filteredResults);
    };

    const handleChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Perform search when at least 2 characters are entered
        if (query.length >= 2) {
            handleSearch(query);
        } else {
            setPlots(plotsN); // Clear results if the search query is less than 2 characters
        }
    };

    const getPlots = async () => {

        try {

            return fetch(`${configData.SERVER_URL}/plot/estate/${data.estateId._id}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    // "x-auth-token":  window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setPlotsN(responseJson.data);
                    setPlots(responseJson.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }


    }

    const [selectedPlots, setSelectedPlots] = useState([]);

    const selectPlot = (result) => {
        // console.log(result._id)
        // Check if the plot is already selected
        const isPlotSelected = selectedPlots.find((selectedPlot) => selectedPlot._id === result._id);

        if (isPlotSelected) {
            // If already selected, remove it from the selectedPlots array
            const updatedSelectedPlots = selectedPlots.filter((selectedPlot) => selectedPlot._id !== result._id);
            setSelectedPlots(updatedSelectedPlots);
        } else {
            // If not selected, add it to the selectedPlots array
            setSelectedPlots([...selectedPlots, result]);
        }
    };

    const getSingleDocs = async () => {
        try {

            return fetch(`${configData.SERVER_URL}/document/singleDocument/${id}`, {
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

    const updateDocPlot = async () => {

        if (selectedPlots.length <= 0) return toast.error("Please select a plot.")

        if (selectedPlots.length > data?.numbOfPlot) return toast.error("Number of plots selected is above the number of plots attached to this document.");

        setisBtnLoading(true);

        try {
            const response = await fetch(`${configData.SERVER_URL}/document/updateDocumentPlot/${id}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
                body: JSON.stringify({
                    plots: selectedPlots
                })
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {
                setData(responseJson.data)
                getPlots();
                getSingleDocs();
                setisBtnLoading(false);
                toast.success(responseJson.message);
                handleClose();
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

    const handlePay = async (value) => {
        setFormType(value);
        setShowTwo(true);
    }

    const handleEditPay = async (value, p) => {

        if (state.profile.role !== 'admin') return

        setFormType(value);
        setEditPay(p)
        setAmount(p.amount)
        setDatePaid(p.datePaid)
        setShowTwo(true);
    }
    const handleCloseTwo = () => setShowTwo(false);

    const addPayment = async (e) => {
        e.preventDefault();
        try {

            if (amount <= 0) return setError('amount');
            if (datePaid == '') return setError('datePaid');

            setisBtnLoading(true)

            return fetch(`${configData.SERVER_URL}/document/payment/${id}`, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
                body: JSON.stringify({
                    amount: amount,
                    datePaid: datePaid
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status === 'success') {
                        getPayment();
                        getSingleDocs()
                        setData(responseJson.data);
                        toast.success(responseJson.message);
                        // alert(responseJson.message);
                        setisBtnLoading(false);
                        handleCloseTwo();
                    }
                    if (responseJson.status === 'error') {
                        setisBtnLoading(false);
                        toast.error(responseJson.message);
                        // alert(responseJson.message);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setisBtnLoading(false)
                });

        } catch (error) {
            console.log(error);
            setisBtnLoading(false)
        }

    }

    const editPayment = async (e) => {
        e.preventDefault();
        console.log(amount + ' ' + datePaid);


        return fetch(`${configData.SERVER_URL}/document/payment/${editPay._id}`, {
            method: "put",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-auth-token": window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                amount: amount,
                datePaid: datePaid
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.status === 'success') {
                    getPayment();
                    getSingleDocs()
                    toast.success(responseJson.message);
                    //    alert(responseJson.message);
                    setisBtnLoading(false);
                    reset()
                    handleCloseTwo();
                }
                if (responseJson.status === 'error') {
                    toast.error(responseJson.message);
                    //    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error(error);
                setisBtnLoading(false)
            });


    }

    const deletePayment = async () => {
        if (!window.confirm("are you sure want to delete payment?")) {
            return
        }

        try {

            setisBtnLoading(true);

            const response = await fetch(`${configData.SERVER_URL}/document/payment/${editPay._id}/${id}`, {
                method: "delete",
                headers: {
                    "x-auth-token": window.localStorage.getItem("token")
                },
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {
                getPayment();
                getSingleDocs()
                setisBtnLoading(false);
                toast.success(responseJson.message);
                //   alert(responseJson.message);
                handleCloseTwo();
            }
            if (responseJson.status === "error") {
                setisBtnLoading(false);
                toast.error(responseJson.message);
                //   alert(responseJson.message);
            }
        } catch (error) {
            setisBtnLoading(false);
            console.error(error);
        }


    }

    const getPayment = async () => {

        setIsPageLoading(true)
        return fetch(`${configData.SERVER_URL}/document/payment/${id}`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                // "x-auth-token":  window.localStorage.getItem("token")
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                setPayments(responseJson.data);
                setIsPageLoading(false)
            })
            .catch((error) => {
                console.error(error);
                setIsPageLoading(false)
            });
    }

    const [docs, setDocs] = useState([]);

    const getDocs = async () => {
        try {

            return fetch(`${configData.SERVER_URL}/document/getClientDocument/${data?.clientId._id}/${id}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    // console.log("response data", JSON.stringify(responseJson.data, null, 2))
                    // setDocs(responseJson.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }
    }

    const navigate = (data) => {
        history.push({
            pathname: `/Document-Details/${data?._id}`,
            state: { data: data },
        });
        window.location.reload();
    }
    // useEffect(() => {

    //     // Listen for 'newPayment' events from the server
    //     socket.on('newPayment', (ioData) => { 
    //         // if (ioData.documentId === data?._id) {
    //             console.log('Payment received',  ioData.payment)
    //             // Update state with new payment data
    //             // setPayment((prevPayment) => [...prevPayment, data.payment]);
    //         // }
    //     });

    //     // Clean up the effect
    //     return () => {
    //         socket.off('newPayment');
    //     };
    // }, []);

    useEffect(() => {
        getPlots();
        getPayment();
    }, []);

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const getOrdinalSuffix = (number) => {
        if (number >= 11 && number <= 13) {
            return number + 'th';
        }

        const suffixes = ['st', 'nd', 'rd'];
        const v = number % 10;
        return number + (suffixes[v - 1] || 'th');
    };

    const removePlot = async (plotId) => {

        if (!window.confirm(`are you sure you want to remove plot ${plotId?.plotNumber} from this document?`)) {
            return
        }

        setisBtnLoading(true);

        try {
            const response = await fetch(`${configData.SERVER_URL}/document/remove/plot/${id}/${plotId?._id}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                }
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {

                setData(responseJson.data);
                getPlots();
                setisBtnLoading(false);
                toast.success(responseJson.message);
                handleClose();
            }
            if (responseJson.status === "error") {
                setisBtnLoading(false);
                toast.error(responseJson.message);
                // alert(responseJson.message);
            }
        } catch (error) {
            setisBtnLoading(false);
            console.error(error);
        }

    }

    const changeDocStatus = async (checked) => {


        if (!window.confirm(`are you sure the document is available?`)) {
            return
        }

        setisBtnLoading(true);

        try {
            const response = await fetch(`${configData.SERVER_URL}/document/status/${id}/${checked}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                }
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {
                setData(responseJson.data);
                setisBtnLoading(false);
                console.log('Data', responseJson.data);
                toast.success(responseJson.message);
            }
            if (responseJson.status === "error") {
                setisBtnLoading(false);
                toast.error(responseJson.message);
                // alert(responseJson.message);
            }
        } catch (error) {
            setisBtnLoading(false);
            console.error(error);
        }
    }

    const updateComStatus = async (checked) => {

        if (!window.confirm(`are you sure the agent has been paid?`)) {
            return
        }

        setisBtnLoading(true);

        try {
            const response = await fetch(`${configData.SERVER_URL}/document/commission/status/${id}/${checked}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                }
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {
                // setDocStatus(checked);
                setData(responseJson.data);
                setisBtnLoading(false);
                toast.success(responseJson.message);
                // alert(responseJson.message);
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

    const updateUplinerComStatus = async (checked) => {

        if (!window.confirm(`are you sure the agents referer has been paid`)) {
            return
        }

        setisBtnLoading(true);

        try {
            const response = await fetch(`${configData.SERVER_URL}/document/upliner/commission/status/${id}/${checked}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                }
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {
                // setDocStatus(checked);
                setData(responseJson.data);
                setisBtnLoading(false);
                toast.success(responseJson.message);
                // alert(responseJson.message);
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

    const navigation = (link) => {
        history.push(`/${link}`);
    }

    const [agentCommission, setAgentCommission] = useState(data?.commission);
    const [uplinerCommission, setUplinerCommission] = useState(data?.uplinerCommission);
    const [genCommission, setGenCommission] = useState('')

    const addDocCom = async () => {
        try {
            // e.preventDefault();

            return fetch(`${configData.SERVER_URL}/document/update/${data?._id}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
                body: JSON.stringify({
                    commission: agentCommission,
                    uplinerCommission: uplinerCommission
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.status === "success") {
                        setisBtnLoading(false)
                        toast.success(responseJson.message);
                        getSingleDocs();
                        handleComClose()
                    }
                    if (responseJson.status === "error") {
                        setisBtnLoading(false)
                        toast.error(responseJson.message);
                        // offCanvasClose()
                    }
                })
                .catch((error) => {
                    setisBtnLoading(false)
                    console.error(error);
                });



        } catch (error) {
            console.log(error);
        }

    }

    const addCom = async() => {

        try {
            // e.preventDefault();

            return fetch(`${configData.SERVER_URL}/commission/generate/commission/${data?.marketerId?._id}/${data?._id}`, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
                body: JSON.stringify({
                    commission: genCommission,
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.status === "success") {
                        setisBtnLoading(false)
                        toast.success(responseJson.message);
                        getSingleDocs();
                        handleComClose()
                    }
                    if (responseJson.status === "error") {
                        setisBtnLoading(false)
                        toast.error(responseJson.message);
                        // offCanvasClose()
                    }
                })
                .catch((error) => {
                    setisBtnLoading(false)
                    console.error(error);
                });



        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>

            <Layout>

                <div className="mainBox">

                    <div className='mBoxOne' style={{ width: '100vw' }}>

                        <div className="heading-section">
                            <div className="navSection">
                                <span onClick={() => navigation('Documents')} className="inactiveText" style={{ cursor: "pointer" }}>Documents</span>
                                <span className="activeArrow">{">"}</span>
                                <span className="activeText" >Document Details</span>
                                <span className="activeText">{">"}</span>
                                <span className="activeText">{data?.clientId?.fullName}</span>
                            </div>

                            <div>

                            </div>

                        </div>

                        <div className="uContent">



                            <div className="userSec">

                                <div className="userSecOne">
                                    <div className="userDataOne">
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", flexDirection: "column", gap: "10px" }}>
                                            <Image
                                                //  crossorigin="anonymous"
                                                src={`${configData.PIC_URL}/${data?.clientId?.passport}`} className="useDataImg" alt="" />
                                            <DocArrow />
                                        </div>
                                        <div className="userDataName">
                                            <span>{data?.clientId?.fullName}</span>
                                            <span>{data?.clientId?.phoneNumber}</span>

                                            <div className="total-amount">
                                                <span>Total Amount</span>

                                                <NumericFormat value={data?.amount} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span>{text}</span>} />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <LongArrow />

                                <div className="mrk">
                                    <span className="referedBy">Refered by: </span>
                                    <div className="d-flex  justify-content-center align-items-center">
                                        {data?.marketerId ? <>
                                            <Image
                                                // crossorigin="anonymous"
                                                src={`${configData.PIC_URL}/${data?.marketerId?.profImage}`} className="refImg" alt="" />
                                            <span className="refName">{data?.marketerId?.fullName}</span>
                                        </> : <>
                                            <span className="refName">No Referer</span>
                                        </>}
                                    </div>
                                </div>

                            </div>


                            <div className="userBtnPa">
                                <div className="firstUserBtns">
                                    <div className={page === "overview" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('overview')}>
                                        <span>Overview</span>
                                    </div>
                                    <div className={page === "plots" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('plots')}>
                                        <span>Plots</span>
                                    </div>
                                    <div className={page === "commisions" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('commisions')}>
                                        <span>Commisions</span>
                                    </div>
                                    <div className={page === "properties" ? "user-btn" : "user-inactivBtn"} onClick={() => setPage('properties')}>
                                        <span>Other Properties</span>
                                    </div>
                                </div>
                                <div>

                                    {state.profile.role === 'admin' && (<>
                                        <div onClick={{}} className="del-btn">
                                            <span>Remove Document</span>
                                        </div>
                                    </>)}
                                </div>
                            </div>


                            <div className="mt-5">

                                <div className="userOverview">

                                    {page === "overview" && <>

                                        <div className="docDiv-one">

                                            <div className="profInfo">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <h4>Property Details</h4>
                                                    <UpdateDoc id={id} reload={getSingleDocs} />
                                                </div>

                                                <div className="profInfoData">

                                                    <div className="profData">
                                                        <span>Name</span>
                                                        <span>{data?.estateId?.name}</span>
                                                    </div>

                                                    <div className="profData">
                                                        <span>Date Of Purchase</span>
                                                        <span>{format(new Date(data?.dateOfPurchase), 'dd MMMM yy')} </span>
                                                    </div>

                                                    <div className="profData">
                                                        <span>Location</span>
                                                        <span>{data?.estateId?.location}</span>
                                                    </div>

                                                    <div className="profData">
                                                        <span>Price/Plot</span>
                                                        <NumericFormat value={data?.costPerPlot} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span>{text}</span>} />
                                                    </div>

                                                    <div className="profData">
                                                        <span>No Plots</span>
                                                        <span>{data?.numbOfPlot}</span>
                                                    </div>

                                                    <div className="profData">
                                                        <span>Total Amount</span>
                                                        <NumericFormat value={data?.amount} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span>{text}</span>} />
                                                    </div>

                                                    <div className="profData">
                                                        <span>Payment plan</span>
                                                        <span>{data?.paymentPlan}</span>
                                                    </div>
                                                    <div className="profData">
                                                        <span>Payment Status</span>
                                                        <span className={data?.paymentStatus == 'success' ? "completed" : "pendingStatus"}>{data?.paymentStatus === 'success' ? "Completed" : "Pending"}</span>
                                                    </div>
                                                    <div className="profData">
                                                        <span>Document Status</span>
                                                        <span className={data?.documentStatus === 'success' ? "completed" : "pendingStatus"}>{data?.documentStatus == 'success' ? "Completed" : "Pending"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="docDiv-two">

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
                                                    <div className="profInfo">

                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <h4>Payment History</h4>
                                                            {state.profile.role === 'admin' && (<>
                                                                <span onClick={() => handlePay('add')} className="plotBtn">add Payment</span>
                                                            </>)}

                                                        </div>

                                                        <div className="profInfoData">

                                                            {payments.map((p, index) => (
                                                                <div onClick={() => handleEditPay('edit', p)} key={p._id} className="profData" style={{ cursor: "pointer" }}>
                                                                    <span>{getOrdinalSuffix(index + 1)} Payment</span>
                                                                    <span>{format(new Date(p?.datePaid), 'do MMM yy')}</span>
                                                                    <NumericFormat value={(p?.amount)} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span>{text}</span>} />
                                                                </div>
                                                            ))}
                                                            {data?.paymentStatus == 'success' ? <>
                                                                <h4 style={{ marginTop: '10%', textAlign: 'center' }}>This document payment has been completed</h4>
                                                            </> : <>
                                                                {payments.length > 0 &&
                                                                    <div className="profData balance">
                                                                        <span></span>
                                                                        <span>Balance</span>
                                                                        <NumericFormat value={(data?.amount) - totalAmount} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span>{text}</span>} />
                                                                    </div>
                                                                }
                                                            </>}
                                                        </div>




                                                    </div>
                                                </>}
                                        </div>

                                        <div className="docDiv-two">
                                            <div className="profInfo">
                                                <h4>Document Features</h4>

                                                <div className="profData">
                                                    <span>Is Document available</span>
                                                    <BootstrapSwitchButton size="xs"
                                                        offstyle="secondary"
                                                        checked={data?.documentStatus === 'success' ? true : false}
                                                        onlabel='true'
                                                        offlabel='pending'
                                                        onChange={(checked) => {
                                                            changeDocStatus(checked);
                                                        }} />
                                                </div>

                                                {docStatus ?
                                                    <div className="align-items-center justify-content-center text-center mt-5 border p-5">
                                                        <RiUploadCloud2Fill style={{ fontSize: '30px' }} />
                                                        <h4 className="mt-2">Upload Document</h4>
                                                    </div> : null}

                                                <input type="file" name="doc" ref={register({ required: true })}
                                                    id="imageInput"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={handleImageChange} />

                                            </div>


                                        </div>
                                    </>}

                                    {page === "plots" && <>

                                        <div className="w-100">

                                            <div className="w-100 px-5 py-4">

                                                <div className="tranHeader d-flex align-items-center justify-content-between mx-3 pb-2">
                                                    <span>Document Plot(s)</span>
                                                    <span onClick={handleShow} className="plotBtn">Add Plot(s)</span>
                                                </div>


                                                <div className="plotParent py-4">

                                                    {data?.plots.map((plot, index) => (
                                                        <div className="plotInfo">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h4>Plot {index + 1}</h4>
                                                                <span onClick={() => removePlot(plot?.plotId)} style={{ color: 'red', fontSize: '12px', cursor: 'pointer' }}>Remove Plot</span>
                                                            </div>
                                                            <div className="protInfoData">

                                                                <div className="profData">
                                                                    <span>Plot Number</span>
                                                                    <span>{plot?.plotId.plotNumber}</span>
                                                                </div>

                                                                <div className="profData">
                                                                    <span>Estate</span>
                                                                    <span>{data?.estateId?.name}</span>
                                                                </div>

                                                                <div className="profData">
                                                                    <span>Size</span>
                                                                    <span>{plot?.plotId?.size}sqm</span>
                                                                </div>

                                                                <div className="profData">
                                                                    <span>Amount</span>
                                                                    <NumericFormat value={(data?.costPerPlot)} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span>{text}</span>} />
                                                                </div>

                                                                <div className="profData">
                                                                    <span>Status</span>
                                                                    <span className={"successStatus"}>Sold</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ))}



                                                </div>

                                            </div>


                                        </div>

                                    </>}

                                    {page === "properties" && <>

                                        <div class="col-12 mt-3 px-5 py-4">

                                            {docs.length > 0 ?
                                                <table className="table table-image">
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

                                                    <tbody>

                                                        {docs && docs.length > 0
                                                            && docs.map((data, index) => {
                                                                return <>
                                                                    <tr key={index + 1} onClick={() => navigate(data)} className="tr">
                                                                        <td>
                                                                            {/* <img crossorigin="anonymous" src={`${configData.PIC_URL}/${data?.clientId?.passport}`} className="img-fluid tableImg" alt="user" /> */}
                                                                        </td>
                                                                        <td>{data?.clientId?.fullName}</td>
                                                                        <td>{data?.estateId?.name}</td>
                                                                        <NumericFormat value={data?.amount} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <td>{text}</td>} />
                                                                        <td>{format(new Date(data?.dateOfPurchase), 'do MMM yy')} </td>
                                                                        <td>
                                                                            <span className={data?.paymentStatus === 'success' ? "completed" : "pendingStatus"}>{data?.paymentStatus == 'success' ? "completed" : "pending"}</span>
                                                                        </td>
                                                                    </tr>

                                                                </>
                                                            })}

                                                    </tbody>

                                                </table>
                                                : <div className="col-md-12 py-5">

                                                    <h6 className="text-center">Client does not have another document</h6>

                                                </div>}


                                            {/* <div className="table-footer">
                                            <div className="row-per">
                                                <span>Rows per page</span>
                                                <span>10</span>
                                            </div>
                                            <div className="row-arrow">
                                                <LeftArrow/>

                                                <RightArrowTwo/>

                                            </div>

                                        </div>    */}
                                        </div>

                                    </>}

                                    {page === "commisions" && <>

                                        <div className="docOne">

                                            <div className="w-100 px-5 py-4">

                                                <div className="tranHeader d-flex align-items-center justify-content-between mx-3 pb-2">
                                                    <h4 className="h4">Commission on this Document</h4>
                                                    {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) && (
                                                        <span onClick={handleComShow} className="plotBtn">Edit Commission</span>
                                                    )}

                                                </div>

                                            </div>

                                            <div className="w-100 px-5 py-4">
                                                <div className="tranHeader d-flex align-items-center justify-content-between mx-3 pb-2">
                                                    <h4 className="h4">Commission Status</h4>
                                                    {(state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) && (
                                                        <span onClick={handleGenComShow} className="plotBtn">Generate Commission</span>
                                                    )}

                                                </div>
                                                <div className='d-flex'>
                                                    <div className="doc-one px-5 py-4">
                                                        <span>Commission Amount:
                                                            <NumericFormat value={data?.commission} displayType={'text'} thousandSeparator={true} prefix={" ₦"} renderText={text => <span>{text}</span>} />
                                                        </span>
                                                        <div className="profData">
                                                            <span>Agent Commission Status</span>
                                                            {isBtnLoading ? <>
                                                                <div className="d-flex justify-content-end align-items-center w-100">
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
                                                            </> : <>
                                                                <BootstrapSwitchButton size="xs"
                                                                    offstyle="secondary"
                                                                    checked={data?.commissionStatus === 'paid' ? true : false}
                                                                    onlabel='paid'
                                                                    offlabel='pending'
                                                                    onChange={(checked) => {
                                                                        updateComStatus(checked);
                                                                    }} />
                                                            </>}
                                                        </div>
                                                    </div>
                                                    <div className="doc-one px-5 py-4">
                                                        <span>Upliner Commission Amount:
                                                            <NumericFormat value={data?.uplinerCommission} displayType={'text'} thousandSeparator={true} prefix={" ₦"} renderText={text => <span>{text}</span>} />

                                                        </span>
                                                        <div className="profData">
                                                            <span>Upliner Commission Status</span>
                                                            {isBtnLoading ? <>
                                                                <div className="d-flex justify-content-end align-items-center w-100">
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
                                                            </> : <>
                                                                <BootstrapSwitchButton size="xs"
                                                                    offstyle="secondary"
                                                                    checked={data?.uplinerComStatus === 'paid' ? true : false}
                                                                    onlabel='paid'
                                                                    offlabel='pending'
                                                                    onChange={(checked) => {
                                                                        updateUplinerComStatus(checked);
                                                                    }} />
                                                            </>}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="w-100 px-5 py-4">

                                                <CommissionComp commission={commission} />

                                            </div>

                                        </div>

                                    </>}

                                </div>

                            </div>

                        </div>

                    </div>


                </div>

            </Layout>


            <Modal show={showComm} onHide={handleComClose}>

                <Modal.Body>
                    <div className="modal-body my-4">
                        <div className="col-md-12">
                            <h4 className="mt-2 mb-4 text-center">Add Commission </h4>
                        </div>

                        <div className="pt-2 pb-5" id="submit">

                            <div className="adminForm">

                                <div className="row g-2">

                                 <div className="col-12">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Commission" type="number" className="h-auto form-control " name="commission" value={agentCommission}
                                                onChange={(e) => setAgentCommission(e.target.value)} />
                                            {errors.commission && <span className="alert alert-danger" role="alert">Commision is Required</span>}
                                            <label for="floatingInput">Agent Commission</label>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Amount" type="number" className="h-auto form-control " name="uplinerCommission" value={uplinerCommission}
                                                onChange={(e) => setUplinerCommission(e.target.value)} />

                                             <label for="floatingInput">Upliner Commission</label>
                                        </div>
                                    </div>

                                </div>


                                <div className="mt-4 mb-4">
                                    {agentCommission &&
                                        <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading} onClick={() => addDocCom()}>
                                            {isBtnLoading ? (<>Please Wait...</>) : (<>Submit</>)}
                                        </Button>
                                    }
                                </div>

                            </div>

                        </div>
                    </div>

                </Modal.Body>
            </Modal>


            <Modal show={showGenComm} onHide={handleGenComClose}>

                <Modal.Body>
                    <div className="modal-body my-4">
                        <div className="col-md-12">
                            <h4 className="mt-2 mb-4 text-center">Commission </h4>
                        </div>

                        <div className="pt-2 pb-5" id="submit">

                            <div className="adminForm">

                                <div className="row g-2">

                                 <div className="col-12">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Commission" type="number" className="h-auto form-control " name="commission" value={genCommission}
                                                onChange={(e) => setGenCommission(e.target.value)} />
                                            {errors.commission && <span className="alert alert-danger" role="alert">Commision is Required</span>}
                                            <label for="floatingInput">Commission</label>
                                        </div>
                                    </div>

                                </div>


                                <div className="mt-4 mb-4">
                                        <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading} onClick={() => addCom()}>
                                            {isBtnLoading ? (<>Please Wait...</>) : (<>Submit</>)}
                                        </Button>
                                </div>

                            </div>

                        </div>
                    </div>

                </Modal.Body>
            </Modal>


            <Modal show={show} onHide={handleClose}>

                <Modal.Body>
                    <div className="modal-body my-4">

                        {plots.length > 0 ? <>
                            <h6 className="mt-2 mb-4">Add plots to this document </h6>
                            <div class="form-group has-search">

                                <div className="row">
                                    <div className="col-md-12 mx-auto">
                                        <div className="input-group">
                                            <input className="form-control border rounded-pill" placeholder="Search with plot number" value={searchQuery}
                                                onChange={handleChange} type="search" id="example-search-input" />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="list-referer">
                                <div className="row">

                                    {plots.map((result) => (

                                        <div onClick={() => selectPlot(result)}
                                            className={`col-lg-6 g-4 searchPlot pb-4 ${selectedPlots.find((selectedPlot) => selectedPlot._id === result._id) ? 'selectedPlot' : ''}`}>

                                            <div className="d-flex flex-column justify-content-center align-items-center mb-2">
                                                <span>{data?.estateId.name}</span>
                                                <span>{result?.title}</span>
                                            </div>

                                            <div className="profInfoData">

                                                <div className="profData">
                                                    <span>Plot Number</span>
                                                    <span>{result?.plotNumber}</span>
                                                </div>
                                                <div className="profData">
                                                    <span>Plot Size</span>
                                                    <span>{result?.size}m<sup>2</sup></span>
                                                </div>

                                            </div>

                                        </div>
                                    ))}

                                </div>

                            </div>
                            {plots.length > 0 &&
                                <div className="mt-4 mb-4">

                                    {isBtnLoading ? (<>
                                        <div className="d-flex  justify-content-end w-100">
                                            <ColorRing
                                                visible={true}
                                                height="30"
                                                width="30"
                                                ariaLabel="color-ring-loading"
                                                wrapperStyle={{}}
                                                wrapperClass="color-ring-wrapper"
                                                colors={['#0b9967', '#0b9967', '#0b9967', '#0b9967', '#0b9967']}
                                            />
                                            <span>Adding plots... </span>
                                        </div>
                                    </>)
                                        : (<>
                                            <Button onClick={updateDocPlot} variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                                                Add Plots
                                            </Button>
                                        </>)}
                                </div>
                            }
                        </> : <>

                            <h6 className="mt-2 mb-4  text-center">
                                {data?.estateId.name} does not have any available plot
                            </h6>

                        </>}


                    </div>

                </Modal.Body>
            </Modal>



            <Modal show={showTwo} onHide={handleCloseTwo}>

                <Modal.Body>
                    <div className="modal-body my-4">

                        {formType === 'add' &&
                            <form onSubmit={addPayment} method="POST" enctype="multipart/form-data" className="pt-3" id="submit">

                                <div className="adminForm">

                                    <h6 className="mt-2 mb-4">Add Payment made </h6>

                                    <div className="row g-2">
                                        <div className="col-md">
                                            <div className="form-floating mt-3">
                                                <input placeholder="amount" type="text" className="h-auto form-control " name="amount" onChange={(e) => setAmount(e.target.value)}
                                                />
                                                {error === 'amount' && <span className="alert alert-danger" role="alert">Amount Required</span>}
                                                <label for="floatingInput">Amount</label>
                                            </div>
                                        </div>

                                        <div className="col-md">
                                            <div class="form-floating">
                                                <input type="date" id="datePaid" className="form-control mt-3" placeholder="Date Of Payment" name="datePaid"
                                                    onChange={(e) => setDatePaid(e.target.value)} />
                                                {error === 'datePaid' && <span className="alert alert-danger" role="alert">Date of Payment Required</span>}
                                                <label for="floatingSelect">Date Of Payment</label>
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
                                                <span>Adding payment... </span>
                                            </div>
                                        </>

                                            : <>
                                                <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                                                    Submit
                                                </Button>
                                            </>}
                                    </div>

                                </div>

                            </form>

                        }


                        {formType === 'edit' &&

                            <form onSubmit={editPayment} className="pt-3" enctype="multipart/form-data" id="submit">

                                <div className="adminForm">

                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mt-2 mb-4">Update Payment</h6>
                                        {isBtnLoading ? <>
                                            <div className="d-flex justify-content-end align-items-center w-100">
                                                <ColorRing
                                                    visible={true}
                                                    height="20"
                                                    width="20"
                                                    ariaLabel="color-ring-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClass="color-ring-wrapper"
                                                    colors={['#0b9967', '#0b9967', '#0b9967', '#0b9967', '#0b9967']}
                                                />
                                                <span>deleting payment... </span>
                                            </div>
                                        </> :
                                            <span onClick={deletePayment} className="mt-2 mb-4" style={{ color: "red", cursor: "pointer" }}>Delete</span>
                                        }
                                    </div>



                                    <div className="row g-2">
                                        <div className="col-md">

                                            <div className="form-floating mt-3">
                                                <input placeholder="amount" type="text" className="h-auto form-control " name="amount"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                />
                                                {error === 'amount' && <span className="alert alert-danger" role="alert">Amount Required</span>}
                                                <label for="floatingInput">Amount</label>
                                            </div>
                                        </div>

                                        <div className="col-md">

                                            <div class="form-floating">
                                                <input type="date" id="datePaid" className="form-control mt-3" placeholder="Date Of Payment" name="datePaid"
                                                    value={datePaid.substring(0, 10)}
                                                    onChange={(e) => setDatePaid(e.target.value)} />
                                                {error === 'datePaid' && <span className="alert alert-danger" role="alert">Date of Payment Required</span>}
                                                <label for="floatingSelect">Date Of Payment</label>
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
                                                <span>Updating payment... </span>
                                            </div>
                                        </>

                                            : <>
                                                <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                                                    Update
                                                </Button>
                                            </>}
                                    </div>

                                </div>

                            </form>

                        }

                    </div>



                </Modal.Body>

            </Modal>



        </>
    );
}

export default DocumentDetails;
