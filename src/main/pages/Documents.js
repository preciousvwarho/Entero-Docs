
import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Image, Modal, Offcanvas, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import Layout from '../Layout';
import { useHistory } from "react-router-dom";
import { NumericFormat } from 'react-number-format';
import { format } from 'date-fns';
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdLandslide } from "react-icons/md";
import EstLayout from './Layouts/Layout';
import { Context } from '../../Store';
import { ThreeDots } from 'react-loader-spinner'
import { toast } from "react-toastify";
import Plots from './Components/Plots';

import io from 'socket.io-client';
const socket = io(`${configData.URL}`);

function Documents() {
    const history = useHistory();


    const { register, handleSubmit, reset, errors } = useForm();
    const [state] = useContext(Context);

    const [show, setShow] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showPlot, setShowPlot] = useState(false);
    const [page, setPage] = useState("all");
    const [docs, setDocs] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [isPageLoading, setisPageLoading] = useState(false);
    const [isEstLoading, setIsEstLoading] = useState(false);
    const [client, setClient] = useState([]);
    const [marketers, setMarketers] = useState([]);
    const [isClientSelected, setIsClientSelected] = useState(false);
    const [isMarketerSelected, setIsMarketerSelected] = useState(false);
    const [selectedClient, setSelectedClient] = useState([]);
    const [selectedMarketer, setSelectedMarketer] = useState([]);
    const [estate, setEstate] = useState([]);
    const [plan, setPlan] = useState([]);

    const [miniNav, setMiniNav] = useState('all');
    const [activeEstate, setActiveEstate] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const [docType, setDocType] = useState("old");
    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = (type) => {
        setDocType(type)
        setShowOffcanvas(true);
    }
    useEffect(() => {
        socket.on('document-activity', (param) => {
            getDocs(docPage);
        });

        return () => {
            socket.off('document-activity');
        };
    }, []);


    const getEstates = async () => {
        try {
            setIsEstLoading(true);

            return fetch(`${configData.SERVER_URL}/estate/show/Estate`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },

            })
                .then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.status === "success") {
                        setIsEstLoading(false)
                        setEstate(responseJson.data);
                    }
                    if (responseJson.status === "error") {
                        setIsEstLoading(false)
                        alert(responseJson.message);
                    }
                })
                .catch((error) => {
                    setIsEstLoading(false)
                    console.error(error);
                });
        } catch (error) {
            console.log(error);
            setisPageLoading(false);
        }
    }

    const [docPage, setDocPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(20);

    const [totalPages, setTotalPages] = useState(null);
    const [selecEstate, setSelecEstate] = useState(null)


    const togglePage = (estate) => {
        // const filteredData = docs.filter((doc) => doc.estateId._id === estate._id);
        // setFilteredDocs(filteredData);
        setShowMap(false);
        setShowPlot(false);
        setActiveEstate(estate)
        setPage(estate?.mapIdentifier);
        estateDocuments(1, estate._id);
    }

    const estateDocuments = async (pageD, estateId) => {

        try {
            setisPageLoading(true);

            return fetch(`${configData.SERVER_URL}/document/getEstatePaginatedDocuments?page=${pageD}&sizePerPage=${sizePerPage}&estateId=${estateId}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.totalPages)
                    setTotalPages(responseJson.totalPages)
                    setDocs(responseJson.data);
                    setFilteredDocs(responseJson.data);
                    setisPageLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setisPageLoading(false);
                });

        } catch (error) {
            console.log(error);
            setisPageLoading(false);
        }
    }

    const getDocs = async (pageD) => {
        try {
            setisPageLoading(true);

            return fetch(`${configData.SERVER_URL}/document/getPaginatedDocuments?page=${pageD}&sizePerPage=${sizePerPage}&pageType=${page}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setTotalPages(responseJson.totalPages)
                    setDocs(responseJson.data);
                    setFilteredDocs(responseJson.data);
                    setisPageLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setisPageLoading(false);
                });

        } catch (error) {
            console.log(error);
            setisPageLoading(false);
        }
    }

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
        console.log(page)
        if (page !== "all") {
            estateDocuments(pageNumb, activeEstate._id);
            return
        }
        getDocs(pageNumb);
    };

    const navigate = (data) => {
        history.push({
            pathname: `/Document-Details/${data?._id}`,
            state: { data: data },
        });
    };


    useEffect(() => {
        getDocs(docPage);
    }, []);

    const getClients = async () => {
        try {

            return fetch(`${configData.SERVER_URL}/client/getAllClients`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    // console.log(responseJson.data);
                    setClient(responseJson.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }
    }

    const getMarketer = async () => {
        try {

            return fetch(`${configData.SERVER_URL}/marketer/getMarketer`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    // "x-auth-token":  window.localStorage.getItem("token")
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

    useEffect(() => {
        getEstates();
        getClients();
        getMarketer();
    }, []);


    //   search client query
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (query) => {
        // const filteredResults = client.filter((client) =>
        //     client.fullName.toLowerCase().includes(query.toLowerCase())
        // );
        // console.log(filteredResults)
        // setSearchResults(filteredResults);

        try {
            setSearchLoading(true);

            const response = await fetch(`${configData.SERVER_URL}/client/searchDocClient?search=${query}`, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                }
            })

            const responseJson = await response.json();
            setSearchResults(responseJson.data);
            setSearchLoading(false);

        } catch (error) {
            console.log(error);
            setSearchLoading(false);
        }
    };

    const handleChange = (e) => {
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
        // console.log(result)
        setSelectedClient(result);
        setIsClientSelected(true);
    }


    //   search Marketer query
    const [searchMQuery, setSearchMQuery] = useState('');
    const [searchMResults, setSearchMResults] = useState([]);

    const handleMSearch = async (query) => {
        // const filteredResults = marketers.filter((marketer) =>
        //     marketer.fullName.toLowerCase().includes(query.toLowerCase())
        // );
        // setSearchMResults(filteredResults);

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
            console.log(responseJson.data);
            setSearchMResults(responseJson.data);
            setSearchLoading(false);

        } catch (error) {
            console.log(error);
            setSearchLoading(false);
        }
    };

    const handleMChange = (e) => {
        const query = e.target.value;
        setSearchMQuery(query);

        if (query.length >= 2) {
            handleMSearch(query);
        } else {
            setSearchMResults([]); 
        }
    };

    const [searchDoc, setSearchDoc] = useState('');


    const handleDocSearch = async (query) => {
        try {
            setisPageLoading(true);

            const response = await fetch(`${configData.SERVER_URL}/document/searchDocuments?page=${page}&sizePerPage=${sizePerPage}&search=${query}`, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                }
            })

            const responseJson = await response.json();
            //totalCount
            setTotalPages(responseJson.totalPages)
            setDocs(responseJson.data);
            setFilteredDocs(responseJson.data);
            setisPageLoading(false);

        } catch (error) {
            console.log(error);
            setisPageLoading(false);
        }
        // setFilteredDocs(filteredResults);
    };

    const handleDocChange = (e) => {
        const query = e.target.value;
        setSearchDoc(query);

        if (query.length <= 0) {
            getDocs(1);
        }
        // Perform search when at least 2 characters are entered
        if (query.length >= 2) {
            handleDocSearch(query);
        } else {
            setFilteredDocs(docs); // Clear results if the search query is less than 2 characters
        }
    };

    const selectMReferer = async (result) => {
        // console.log(result)
        setSelectedMarketer(result);
        setIsMarketerSelected(true);
    }

    const mapDisplay = (page) => {
        setPage(page);
        setShowPlot(false);
        setShowMap(true);
    }
    const plotDisplay = (page) => {
        setPage(page);
        setShowMap(false);
        setShowPlot(true);
    }

    const allPagFunc = () => {
        // setFilteredDocs(docs);
        setShowPlot(false);
        setShowMap(false);
        setPage('all')
        getDocs(1);
    }

    const addDoc = async (data) => {


        setisBtnLoading(true)

        return fetch(`${configData.SERVER_URL}/document/addDocument`, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-auth-token": window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                clientId: selectedClient._id,
                marketerId: selectedMarketer._id,
                estateId: data.estateId,
                costPerPlot: data?.costPerPlot,
                amount: data?.amount,
                commission: data?.commission,
                uplinerCommission: data?.uplinerCommission,
                numbOfPlot: data?.numbOfPlot,
                paymentPlan: data?.paymentPlan,
                dateOfPurchase: data?.dateOfPurchase,
                buildingType: data?.buildingType,
                surname: data?.surname,
                firstName: data?.firstName,
                middleName: data?.middleName,
                sex: data?.sex,
                phoneNumber: data?.phoneNumber,
                relationship: data?.relationship,
                address: data?.address,
                paymentStatus: data?.paymentStatus,
                isComplete: data?.isComplete
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status === "success") {
                    setisBtnLoading(false);
                    // getDocs(docPage)
                    reset();
                    offCanvasClose();
                    toast.success(responseJson.message);
                }
                if (responseJson.status === "error") {
                    setisBtnLoading(false)
                    toast.error(responseJson.message);
                }
            })
            .catch((error) => {
                setisBtnLoading(false)
                console.error(error);
            });
    }

    const handleEstatePlan = (e) => {
        const estId = e.target.value;
        try {

            return fetch(`${configData.SERVER_URL}/estate/getEstatePlan/${estId}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.data);
                    setPlan(responseJson.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }
        //   return console.log(selectedValue);
        //   setIsInstallment(selectedValue === 'Installment');
    };


    const pieData = [
        { name: 'Available', value: 400 },
        { name: 'Sold', value: 300 },
        { name: 'Reserved', value: 300 },
    ];

    const [showDropdown, setShowDropdown] = useState(false);

    // Toggle the dropdown when btn-add is clicked
    const handleAddClick = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>

            <Layout>

                <div className="mainBox">


                    <div className='mBoxOne' style={{ width: '100vw' }}>

                        <div className="heading-section">
                            <div className="navSection">
                                <span className="activeText">Documents</span>
                            </div>

                            <div className="w-50 d-flex gap-2 align-items-center justify-content-end">
                                <div class="form-group has-search" style={{ width: "65%" }}>
                                    <div className="col-md-12 mx-auto">
                                        <div className="input-group">
                                            <input className="form-control border rounded-pill" placeholder="Search documents with clients name" value={searchDoc} onChange={handleDocChange} type="search" id="example-search-input" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{}}>
                                    {(state.profile.role === 'admin' || (state.profile.permission === 'clients' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) && (<>
                                        <div onClick={handleAddClick} className="btn-add">
                                            <span>Add Document</span>
                                        </div>
                                        <Dropdown className='mt-4' show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#" className="item-list" onClick={() => offCanvasShow("old")}>Old document</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3" className="item-list" onClick={() => offCanvasShow("new")}>New document</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </>)}
                                </div>

                                {/* <IoFilter className="w-20 editProfIcon" style={{ cursor: "pointer" }} onClick={handleShow} /> */}

                            </div>

                        </div>


                        <div className="estContent">

                            <Col lg="12" style={{ margin: '0px', padding: '0px' }}>


                                {isEstLoading ? <>
                                    <div className="d-flex justify-content-center align-items-center w-100">
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
                                </> : <>

                                    <div className="userBtnPa p0" style={{ width: '100%' }}>
                                        <div className="firstUserBtns">
                                            <div className={page === "all" ? "user-btn" : "user-inactivBtn"} onClick={allPagFunc}>
                                                <span>All</span>
                                            </div>

                                            {estate.map((e, index) => {
                                                return <>
                                                    <div key={index + 1} className={page === e?.mapIdentifier ? "user-btn" : "user-inactivBtn"} onClick={() => togglePage(e)}>
                                                        <span>{e?.name}</span>
                                                    </div>
                                                </>
                                            })}

                                        </div>

                                    </div>

                                </>}

                                {page !== "all" &&
                                    <div class="category-menu">
                                        <span className="line"></span>
                                        <ul className="nav lastNav">
                                            {page !== "all" && <>
                                                <li onClick={() => mapDisplay(page)} className="nav-item">
                                                    <a className="nav-link" href="#">
                                                        <FaMapMarkedAlt />
                                                    </a>
                                                </li>
                                                <li onClick={() => plotDisplay(page)} className="nav-item">
                                                    <a className="nav-link" href="#">
                                                        <MdLandslide />
                                                    </a>
                                                </li>
                                            </>}
                                        </ul>
                                    </div>
                                }

                            </Col>


                            {showPlot ? <Plots id={activeEstate._id} />
                                : showMap ?
                                    <div className="mapSection">
                                        <EstLayout estate={activeEstate} />
                                    </div>
                                    : <>

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
                                                    wrapperClass="" />
                                            </div>
                                        </> : <>
                                            <div className="mt-2">

                                                {/* {filteredDocs.length > 1 && */}
                                                <div className="tranHeader mt-4">
                                                    <span>Documents</span>
                                                    <span>{filteredDocs.length} record{filteredDocs.length > 1 && 's'}</span>
                                                </div>



                                                <div className='docList'>
                                                    <div class="col-12 mt-3">


                                                        <table className="table table-image">

                                                            {filteredDocs.length >= 1 &&
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

                                                                {filteredDocs && filteredDocs.length > 0
                                                                    ? filteredDocs.map((data, index) => {
                                                                        return <>
                                                                            <tr key={index + 1} onClick={() => navigate(data)} className="tr">
                                                                                <td>
                                                                                    <img
                                                                                        crossorigin="anonymous"
                                                                                        src={`${configData.PIC_URL}/${data?.clientId?.passport}`} className="img-fluid tableImg" alt="user" />
                                                                                </td>
                                                                                <td>{data?.clientId?.fullName}</td>
                                                                                <td>{data?.estateId?.name}</td>
                                                                                <NumericFormat value={(data?.amount)} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <td>{text}</td>} />
                                                                                <td>{format(new Date(data?.dateOfPurchase), 'do MMM yy')} </td>
                                                                                <td>
                                                                                    <span className={data?.paymentStatus == 'success' ? "completed" : "pendingStatus"}>{data?.paymentStatus == 'success' ? "completed" : "pending"}</span>
                                                                                </td>
                                                                            </tr>

                                                                        </>
                                                                    })
                                                                    : <div className="col-md-12">

                                                                        <h6 className="text-center">No item found</h6>

                                                                    </div>}
                                                            </tbody>
                                                        </table>

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

                                            </div>

                                        </>}


                                    </>
                            }


                        </div>

                    </div>

                </div>

            </Layout>





            <Modal show={show} onHide={handleClose}>

                <Modal.Body>

                    <div className="modal-body my-4">
                        <h6 className="mt-2 mb-4">Document Search filters</h6>
                        <form onSubmit={handleSubmit(searchDoc)} className="pt-2 pb-5" enctype="multipart/form-data" id="submit">

                            <div className="col-12">

                                <div className="row g-2">

                                    <div className="col-md">
                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="estateId" ref={register({ required: false })}
                                                onChange={handleEstatePlan}>
                                                <option value=''>Select Estate</option>
                                                {estate.map(e => (
                                                    <option value={e._id}>{e.name}</option>
                                                ))}
                                            </select>
                                            <label for="floatingSelect">Select estate</label>
                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="docStatus" ref={register({ required: true })}>
                                                {/* <option value=''>Select Estate</option>  */}
                                                <option value={"all"}>All</option>
                                                <option value={"success"}>Success</option>
                                                <option value={"pending"}>pending</option>
                                            </select>
                                            <label for="floatingSelect">Select Document Status</label>
                                        </div>

                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-12">
                                        <div className="form-floating mt-3">
                                            <input placeholder="" type="text" className="h-auto form-control" name="name"
                                                ref={register({ required: false })} />
                                            <label for="floatingInput">Client Name</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md">

                                </div>


                            </div>


                        </form>

                    </div>



                </Modal.Body>
            </Modal>


            <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>New Document</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>



                    <form onSubmit={handleSubmit(addDoc)} className="pt-2 pb-5" enctype="multipart/form-data" id="submit">

                        <div className="adminForm">

                            <div className="col-md-12">
                                <h4 className="mt-2 mb-4 text-center">CLIENT DETAILS </h4>

                                {isClientSelected ? <>

                                    {selectedClient && <>
                                        <div className="border-0 searchDiv d-flex align-items-center justify-content-center my-4">
                                            <Image
                                                // crossorigin="anonymous"
                                                src={`${configData.PIC_URL}/${selectedClient.passport}`} className="serchImg" alt="" />
                                            <div className="serchText">
                                                <span className="serchName">{selectedClient?.fullName}</span>
                                                <span className="serchEmail">{selectedClient?.email}</span>
                                            </div>
                                        </div>
                                    </>}

                                </> : <>


                                    <h6 className="mt-2 mb-4">Add client to this document </h6>
                                    <div class="form-group has-search">
                                        <span class="fa fa-search form-control-feedback"></span>
                                        <input type="text" class="form-control" placeholder="Search for client" value={searchQuery} onChange={handleChange} />
                                    </div>

                                    <div class="list-referer">

                                        {searchResults.map((result) => (

                                            <div onClick={() => selectReferer(result)} className="searchDiv d-flex align-items-center my-4 mx-4">
                                                <Image
                                                    // crossorigin="anonymous"
                                                    src={`${configData.PIC_URL}/${result.passport}`} className="serchImg" alt="" />
                                                <span className="serchName">{result?.fullName}</span>
                                            </div>
                                        ))}
                                    </div>

                                </>}

                            </div>


                            <div className="col-md-12">
                                <h4 className="mt-4 text-center">PROPERTY DETAILS </h4>
                                <div className="row g-2">
                                    <div className="col-md">
                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="estateId" ref={register({ required: true })}
                                                onChange={handleEstatePlan}>
                                                <option value=''>Select Estate</option>
                                                {estate.map(e => (
                                                    <option value={e._id}>{e.name}</option>
                                                ))}
                                            </select>
                                            <label for="floatingSelect">Select estate</label>
                                        </div>

                                    </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="" type="number" className="h-auto form-control" name="numbOfPlot"
                                                ref={register({ required: true })} />
                                            {errors.numbOfPlot && <span className="alert alert-danger" role="alert">Number of Plots Required</span>}
                                            <label for="floatingInput">No of Plots</label>
                                        </div>
                                    </div>

                                </div>


                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Cost Per Plot" type="number" className="h-auto form-control " name="costPerPlot"
                                                ref={register({ required: true })} />
                                            {errors.costPerPlot && <span className="alert alert-danger" role="alert">Cost Per Plot is Required</span>}
                                            <label for="floatingInput">Cost per Plot</label>
                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Amount" type="number" className="h-auto form-control " name="amount"
                                                ref={register({ required: true })} />
                                            {errors.amount && <span className="alert alert-danger" role="alert">Total Cost  of Property is Required</span>}
                                            <label for="floatingInput">Total Cost of Property</label>
                                        </div>
                                    </div>
                                </div>
                                {docType === "old" &&
                                    <div className="row g-2">

                                        <div className="col-md">
                                            <div className="form-floating mt-3">
                                                <input placeholder="Commission" type="number" className="h-auto form-control " name="commission" ref={register({ required: true })} />
                                                {errors.commission && <span className="alert alert-danger" role="alert">Commision is Required</span>}
                                                <label for="floatingInput">Agent Commission</label>
                                            </div>
                                        </div>

                                        <div className="col-md">
                                            <div className="form-floating mt-3">
                                                <input placeholder="Amount" type="number" className="h-auto form-control " name="uplinerCommission"
                                                    ref={register({ required: false })} />

                                                <label for="floatingInput">Upliner Commission</label>
                                            </div>
                                        </div>

                                    </div>
                                }


                                <div className="row g-2">

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input type="date" id="dateOfPurchase" className="form-control mt-3" placeholder="Date Of Purchase" name="dateOfPurchase" ref={register({ required: true })} />
                                            <label for="dateOfPurchase">Date Of Purchase</label>
                                        </div>
                                    </div>

                                    <div className="col-md">

                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="paymentPlan" ref={register({ required: true })}
                                            >
                                                {plan.map(p => (
                                                    <option value={p.title}>{p.title}</option>
                                                ))}
                                            </select>
                                            <label for="floatingSelect">Payment Plan</label>

                                        </div>
                                    </div>

                                </div>


                                {/* Type of Building Radio Buttons */}
                                <div className="form-row mt-4">
                                    <div className="col text-center">
                                        <div className="form-group">
                                            <label htmlFor="buildingType">Type of Building</label><br />

                                            {/* "Duplex" Option */}
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        name="buildingType"
                                                        value="Duplex"
                                                        ref={register({ required: true })}
                                                    /> Duplex
                                                </label>
                                            </div>

                                            {/* "Bungalow" Option */}
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        name="buildingType"
                                                        value="Bungalow"
                                                        ref={register({ required: true })}
                                                    /> Bungalow
                                                </label>
                                            </div>

                                            {/* "Commercial" Option */}
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        name="buildingType"
                                                        value="Commercial"
                                                        ref={register({ required: true })}
                                                    /> Commercial
                                                </label>
                                            </div>

                                            {/* Display validation error if any */}
                                            {errors.buildingType && (
                                                <span className="alert alert-danger" role="alert">Type of Building is Required</span>
                                            )}
                                        </div>
                                    </div>
                                </div>



                            </div>


                            <div className="col-md-12 mt-5">
                                <h4 className="text-center">NEXT OF KIN</h4>

                                <div className="row g-2">

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="" type="text" className="h-auto form-control" name="surname"
                                                ref={register({ required: true })} />
                                            {errors.surname && <span className="alert alert-danger" role="alert">Surname Required</span>}
                                            <label for="floatingInput">Surname</label>
                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="" type="text" className="h-auto form-control" name="middleName"
                                                ref={register({ required: true })} />
                                            {errors.middleName && <span className="alert alert-danger" role="alert">Middle Name Required</span>}
                                            <label for="floatingInput">Middle Name</label>
                                        </div>
                                    </div>

                                </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="" type="text" className="h-auto form-control" name="firstName"
                                                ref={register({ required: true })} />
                                            {errors.firstName && <span className="alert alert-danger" role="alert">First Name Required</span>}
                                            <label for="floatingInput">First Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md">
                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="sex" ref={register({ required: true })}>
                                                <option value='male'>Male</option>
                                                <option value='female'>Female</option>
                                            </select>
                                            <label for="floatingSelect">Sex</label>
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
                                            <input placeholder="Relationship" type="text" className="h-auto form-control " name="relationship" ref={register({ required: true })} />
                                            {errors.relationship && <span className="alert alert-danger" role="alert">Relationship Required</span>}
                                            <label for="floatingInput">Relationship</label>
                                        </div>
                                    </div>

                                </div>

                                <div className="form-floating mt-3">
                                    <textarea id="floatingTextarea2" className="form-control" placeholder="Type contact address here" name="address" ref={register({ required: true })} style={{ height: "100px" }} />
                                    {errors.address && <span className="alert alert-danger" role="alert">Residential address Required</span>}
                                    <label for="floatingTextarea2">Residential Address</label>
                                </div>

                            </div>



                            {/* Payment Status Radio Buttons */}
                            <div className="form-row mt-4">
                                <div className="col text-center">
                                    <div className="form-group">
                                        <label htmlFor="paymentStatus">Payment Status</label><br />

                                        {/* "Paid" Option */}
                                        <div className="form-check-inline">
                                            <label className="form-check-label">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="paymentStatus"
                                                    value="success"
                                                    ref={register({ required: true })}
                                                /> Paid
                                            </label>
                                        </div>

                                        {/* "Installmental Payment" Option */}
                                        <div className="form-check-inline">
                                            <label className="form-check-label">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="paymentStatus"
                                                    value="pending"
                                                    ref={register({ required: true })}
                                                /> Installmental Payment
                                            </label>
                                        </div>

                                        {/* Display validation error if any */}
                                        {errors.paymentStatus && (
                                            <span className="alert alert-danger" role="alert">Payment Status is Required</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mt-5">

                                {isMarketerSelected ? <>

                                    {selectedMarketer && <>
                                        <h4 className="mt-2 mb-4 text-center">MARKETER DETAILS </h4>
                                        <div className="border-0 searchDiv d-flex align-items-center my-4  justify-content-center">
                                            <Image
                                                // crossorigin="anonymous"
                                                src={`${configData.PIC_URL}/${selectedMarketer.profImage}`} className="serchImg" alt="" />
                                            <div className="serchText">
                                                <span className="serchName">{selectedMarketer?.fullName}</span>
                                                <span className="serchEmail">{selectedMarketer?.email}</span>
                                            </div>
                                        </div>
                                    </>}

                                </> : <>


                                    <h6 className="mt-2 mb-4">Add Marketer to this document </h6>
                                    <div class="form-group has-search">
                                        <span class="fa fa-search form-control-feedback"></span>
                                        <input type="text" class="form-control" placeholder="Search for marketer"
                                            value={searchMQuery}
                                            onChange={handleMChange} />
                                    </div>



                                    <div class="list-referer">

                                        {searchMResults.map((result) => (

                                            <div onClick={() => selectMReferer(result)} className="searchDiv d-flex align-items-center my-4 mx-4">
                                                <Image
                                                    // crossorigin="anonymous"
                                                    src={`${configData.PIC_URL}/${result.profImage}`} className="serchImg" alt="" />
                                                <span className="serchName">{result?.fullName}</span>
                                            </div>
                                        ))}
                                    </div>

                                </>}

                            </div>


                            <div className="col-md-12 mt-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value=""
                                        name="isComplete" id="flexCheckDefault"
                                        ref={register({ required: false })} />
                                    <label class="form-check-label" for="flexCheckDefault">
                                        is this document completed
                                    </label>
                                </div>
                            </div>

                            <div className="mt-4 mb-4">

                                <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                                    {isBtnLoading ? (<>Waiting...</>) : (<>Add Document</>)}
                                </Button>
                            </div>

                        </div>

                    </form>



                </Offcanvas.Body>
            </Offcanvas>




        </>
    );
}

export default Documents;
