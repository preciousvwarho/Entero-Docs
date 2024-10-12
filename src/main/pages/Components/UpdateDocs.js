
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Button, Offcanvas } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";
import configData from "../../../config.json";
// import { NumericFormat }  from 'react-number-format';
// import { format } from 'date-fns';
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
// import { useHistory, useParams } from 'react-router-dom';


const UpdateDoc = (props) => {
    const { id, reload } = props;
    const { register, handleSubmit, setValue, errors } = useForm();
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [client, setClient] = useState([]);
    const [marketers, setMarketers] = useState([]);
    const [isClientSelected, setIsClientSelected] = useState(false);
    const [isMarketerSelected, setIsMarketerSelected] = useState(false);
    const [selectedClient, setSelectedClient] = useState([]);
    const [selectedMarketer, setSelectedMarketer] = useState([]);
    const [estate, setEstate] = useState([]);
    const [plan, setPlan] = useState([]);

    // console.log(selectedMarketer)

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = () => setShowOffcanvas(true);


    const [docs, setDocs] = useState([]);

    const getDocs = async () => {
        try {

            return fetch(`${configData.TEST_URL}/document/singleDocument/${id}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    // "x-auth-token":  window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log((responseJson.data));
                    setDocs(responseJson.data);
                    setSelectedClient(responseJson.data.clientId);
                    setSelectedMarketer(responseJson.data.marketerId);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }
    }



    const getEstates = async () => {

        return fetch(`${configData.TEST_URL}/estate/getEstate`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },

        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status === "success") {
                    setisBtnLoading(false)
                    setEstate(responseJson.data);
                }
                if (responseJson.status === "error") {
                    setisBtnLoading(false)
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                setisBtnLoading(false)
                console.error(error);
            });

    }

    const getClients = async () => {
        try {

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
        getDocs();
        getEstates();
        getClients();
        getMarketer();
    }, []);



    //   search client query
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        const filteredResults = client.filter((client) =>
            client.fullName.toLowerCase().includes(query.toLowerCase())
        );
        console.log(filteredResults)
        setSearchResults(filteredResults);
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

    const selectClient = async (result) => {
        // console.log(result)
        setSelectedClient(result);
        setIsClientSelected(false);
    }

    //   search Marketer query
    const [searchMQuery, setSearchMQuery] = useState('');
    const [searchMResults, setSearchMResults] = useState([]);



    const handleMSearch = (query) => {
        const filteredResults = marketers.filter((marketer) =>
            marketer.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setSearchMResults(filteredResults);
    };

    const handleMChange = (e) => {
        const query = e.target.value;
        setSearchMQuery(query);

        // Perform search when at least 2 characters are entered
        if (query.length >= 2) {
            handleMSearch(query);
        } else {
            setSearchMResults([]); // Clear results if the search query is less than 2 characters
        }
    };

    const selectMReferer = async (result) => {
        // console.log(result)
        setSelectedMarketer(result);
        setIsMarketerSelected(false);
    }

    const updateDocs = async (data) => {
        // return console.log(data)

        return fetch(`${configData.TEST_URL}/document/update/${id}`, {
            method: "put",
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
                amount: data.amount,
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
                paymentStatus: data?.paymentStatus
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status === "success") {
                    setisBtnLoading(false)
                    getDocs();
                    reload();
                    toast.success(responseJson.message);
                    offCanvasClose()
                    // window.location.reload(true);
                }
                if (responseJson.status === "error") {
                    setisBtnLoading(false)
                    toast.error(responseJson.message);
                    offCanvasClose()
                }
            })
            .catch((error) => {
                setisBtnLoading(false)
                console.error(error);
            });

    }

    const removeClient = () => {
        setIsClientSelected(true);
    }

    const removeMarketer = () => {
        setIsMarketerSelected(true);
    }


    const handleEstatePlan = (e) => {
        const estId = e.target.value;
        try {

            return fetch(`${configData.TEST_URL}/estate/getEstatePlan/${estId}`, {
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
                                                                                                                                                                                                                                                      

    return (
        <>

            <FaRegEdit className="editIcon" onClick={offCanvasShow} style={{ cursor: "pointer" }} />


            <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Update Document</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>



                    <form onSubmit={handleSubmit(updateDocs)} className="pt-2 pb-5" enctype="multipart/form-data" id="submit">

                        <div className="adminForm">

                            <div className="col-md-12">
                                <h4 className="mt-2 mb-4 text-center">CLIENT DETAILS </h4>


                                {isClientSelected ? <>
                                    <h6 className="mt-2 mb-4">Add client to this document </h6>
                                    <div class="form-group has-search">
                                        <span class="fa fa-search form-control-feedback"></span>
                                        <input type="text" class="form-control" placeholder="Search for client"
                                            value={searchQuery}
                                            onChange={handleChange} />
                                    </div>

                                    <div class="list-referer">

                                        {searchResults.map((result) => (

                                            <div onClick={() => selectClient(result)} className="searchDiv d-flex align-items-center my-4 mx-4">
                                                <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${result.passport}`} className="serchImg" alt="" />
                                                <span className="serchName">{result?.fullName}</span>
                                            </div>
                                        ))}
                                    </div>

                                </>
                                    : <>


                                        {selectedClient && <>
                                            <div className="border-0 searchDiv d-flex align-items-center justify-content-center my-4">
                                                <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${selectedClient.passport}`} className="serchImg" alt="" />
                                                <div className="serchText">
                                                    <span className="serchName">{selectedClient?.fullName}</span>
                                                    <span className="serchEmail">{selectedClient?.email}</span>
                                                </div>
                                                <span className="ml5" onClick={removeClient}>x</span>
                                            </div>
                                        </>}


                                    </>}

                            </div>


                            <div className="col-md-12">
                                <h4 className="mt-4 text-center">PROPERTY DETAILS </h4>
                                <div className="row g-2">
                                    <div className="col-md">
                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="estateId" ref={register({ required: true })} defaultValue={docs ? docs?.estateId?.name : ''} onChange={handleEstatePlan}>
                                                <option value={docs?.estateId?._id}>{docs?.estateId?.name}</option>
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
                                                ref={register({ required: true })} defaultValue={docs ? docs?.numbOfPlot : ''} />
                                            {errors.numbOfPlot && <span className="alert alert-danger" role="alert">Number of Plots Required</span>}
                                            <label for="floatingInput">No of Plots</label>
                                        </div>
                                    </div>

                                </div>


                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Cost Per Plot" type="number" className="h-auto form-control " name="costPerPlot"
                                                ref={register({ required: true })} defaultValue={docs ? docs?.costPerPlot : ''} />
                                            {errors.costPerPlot && <span className="alert alert-danger" role="alert">Cost per Property is Required</span>}
                                            <label for="floatingInput">Cost per Property</label>
                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Amount" type="number" className="h-auto form-control " name="amount"
                                                ref={register({ required: true })} defaultValue={docs ? docs?.amount : ''} />
                                            {errors.amount && <span className="alert alert-danger" role="alert">Total Cost  of Property is Required</span>}
                                            <label for="floatingInput">Total Cost  of Property</label>
                                        </div>
                                    </div>

                                </div>


                                <div className="row g-2">
                                    <div className="col-md">


                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="paymentPlan" ref={register({ required: true })} defaultValue={docs ? docs?.paymentPlan : ''}>
                                               <option value={docs?.paymentPlan}>{docs?.paymentPlan}</option>
                                                {plan.map(p => (
                                                    <option value={p.title}>{p.title}</option>
                                                ))}
                                            </select>
                                            <label for="floatingSelect">Payment Plan</label>

                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input type="date" id="dateOfPurchase" className="form-control mt-3" placeholder="Date Of Purchase" name="dateOfPurchase" ref={register({ required: true })}
                                                defaultValue={docs && docs.dateOfPurchase ? new Date(docs.dateOfPurchase).toISOString().split('T')[0] : ''} />
                                            <label for="dateOfPurchase">Date Of Purchase</label>
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
                                                        defaultChecked={docs ? docs.buildingType === 'Duplex' : false}
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
                                                        defaultChecked={docs ? docs.buildingType === 'Bungalow' : false}
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
                                                        defaultChecked={docs ? docs.buildingType === 'Commercial' : false}
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
                                                ref={register({ required: true })}
                                                defaultValue={docs ? docs?.surname : ''} />
                                            {errors.surname && <span className="alert alert-danger" role="alert">Surname Required</span>}
                                            <label for="floatingInput">Surname</label>
                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="" type="text" className="h-auto form-control" name="middleName"
                                                ref={register({ required: true })}
                                                defaultValue={docs ? docs?.middleName : ''} />
                                            {errors.middleName && <span className="alert alert-danger" role="alert">Middle Name Required</span>}
                                            <label for="floatingInput">Middle Name</label>
                                        </div>
                                    </div>

                                </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="" type="text" className="h-auto form-control" name="firstName"
                                                ref={register({ required: true })}
                                                defaultValue={docs ? docs?.firstName : ''} />
                                            {errors.firstName && <span className="alert alert-danger" role="alert">First Name Required</span>}
                                            <label for="floatingInput">First Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md">
                                        <div class="form-floating">
                                            <select className="form-select mt-3" name="sex" ref={register({ required: true })}
                                                defaultValue={docs ? docs?.sex : ''}>
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
                                                ref={register({ required: true })}
                                                defaultValue={docs ? docs?.phoneNumber : ''} />
                                            {errors.phoneNumber && <span className="alert alert-danger" role="alert">Phone Number Required</span>}
                                            <label for="floatingInput">Phone Number</label>
                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Relationship" type="text" className="h-auto form-control " name="relationship" ref={register({ required: true })}
                                                defaultValue={docs ? docs?.relationship : ''} />
                                            {errors.relationship && <span className="alert alert-danger" role="alert">Relationship Required</span>}
                                            <label for="floatingInput">Relationship</label>
                                        </div>
                                    </div>

                                </div>

                                <div className="form-floating mt-3">
                                    <textarea id="floatingTextarea2" className="form-control" placeholder="Type contact address here" name="address" ref={register({ required: true })} style={{ height: "100px" }}
                                        defaultValue={docs ? docs?.address : ''} />
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
                                                    defaultChecked={docs ? docs.paymentStatus === 'success' : false} /> Paid
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
                                                    defaultChecked={docs ? docs.paymentStatus === 'pending' : false}

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

                            {/* <div className="col-md-12 mt-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value=""
                                        name="isComplete" id="flexCheckDefault"
                                        ref={register({ required: false })} 
                                        checked={docs ? docs.isComplete : false}/>
                                    <label class="form-check-label" for="flexCheckDefault">
                                        is this document completed
                                    </label>
                                </div>
                            </div> */}


                            <div className="col-md-12 mt-5">

                                {isMarketerSelected ? <>
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
                                                <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${result.profImage}`} className="serchImg" alt="" />
                                                <span className="serchName">{result?.fullName}</span>
                                            </div>
                                        ))}
                                    </div>

                                </> :
                                    <>

                                        {selectedMarketer && <>
                                            <h4 className="mt-2 mb-4 text-center">MARKETER DETAILS </h4>
                                            <div className="border-0 searchDiv d-flex align-items-center my-4  justify-content-center">
                                                <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${selectedMarketer.profImage}`} className="serchImg" alt="" />
                                                <div className="serchText">
                                                    <span className="serchName">{selectedMarketer?.fullName}</span>
                                                    <span className="serchEmail">{selectedMarketer?.email}</span>
                                                </div>
                                                <span className="ml5" onClick={removeMarketer}>x</span>
                                            </div>
                                        </>}



                                    </>}

                            </div>




                            <div className="mt-4 mb-4">

                                <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                                    {isBtnLoading ? (<>Waiting...</>) : (<>Update</>)}
                                </Button>
                            </div>

                        </div>

                    </form>



                </Offcanvas.Body>
            </Offcanvas>



        </>
    );
};

export default UpdateDoc;