
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Image, Offcanvas, Modal, Row, Col } from 'react-bootstrap';
import configData from "../../../config.json";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const Plots = (props) => {

    const history = useHistory();
    const { id } = props;
    const { register, handleSubmit, setValue, reset, errors } = useForm();
    const [plots, setPlots] = useState([]);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [updateType, setUpdateType] = useState('')
    const [data, setData] = useState([])
    const [isDataLoaded, setIsDataLoaded] = useState(false)

    const [selectedPlots, setSelectedPlots] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = (result) => {
        setData(result)
        setIsDataLoaded(true);
        setShowOffcanvas(true);
    }
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

    const updatePlot = async () => {

        if (selectedPlots.length <= 0) return alert("Please select a plot");
        setisBtnLoading(true);


        try {
            const response = await fetch(`${configData.SERVER_URL}/plot/update/estate/plots/${id}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    // "x-auth-token": window.localStorage.getItem("token") 
                },
                body: JSON.stringify({
                    plots: selectedPlots,
                    updateType
                })
            });
            const responseJson = await response.json();
            console.log(responseJson);

            if (responseJson.status === "success") {
                getPlots();
                refreshPlots();
                setisBtnLoading(false);
                setSelectedPlots([]);
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

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        const filteredResults = plots.filter((plot) =>
            plot.plotNumber.includes(query));
        console.log(filteredResults)
        setSearchResults(filteredResults);
    };

    const handleChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Perform search when at least 2 characters are entered
        if (query.length >= 1) {
            handleSearch(query);
        } else {
            setSearchResults(plots); // Clear results if the search query is less than 2 characters
        }
    };

    const getPlots = async () => {

        try {

            return fetch(`${configData.SERVER_URL}/plot/estate/plots/${id}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.data)
                    setSearchResults(responseJson.data);
                    setPlots(responseJson.data)
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }


    }

    useEffect(() => {
        getPlots();
    }, []);

    plots.forEach((plot) => {
        const element = document.getElementById(`${plot.plotNumber}`);
        if (element) {
            console.log(plot.status);
            if (plot.status === 'sold') {
                element.style.backgroundColor = 'rgb(255, 0, 0, 0.5)';
            }
            if (plot.status === 'reserved') {
                element.style.backgroundColor = 'rgb(255, 210, 0, 0.5)';
            }
            if (plot.status === 'available') {
                element.style.backgroundColor = '#fff';
            }
        }

    })

    const refreshPlots = () => {

        plots.forEach((plot) => {
            const element = document.getElementById(`${plot.plotNumber}`);
            if (element) {
                console.log(plot.status);
                if (plot.status === 'sold') {
                    element.style.backgroundColor = 'rgb(255, 0, 0, 0.5)';
                }
                if (plot.status === 'reserved') {
                    element.style.backgroundColor = 'rgb(255, 210, 0, 0.5)';
                }
                if (plot.status === 'available') {
                    element.style.backgroundColor = '#fff';
                }
            }

        })
    }

    const navigation = (data) => {
        history.push({
            pathname: `/Client-Details/${data?._id}`,
            state: { data: data },
        });
    }


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    };

    const [image, setImage] = useState('');

    const submitForm = async (data) => {
        try {
            setisBtnLoading(true);

            console.log(JSON.stringify(data.estateId, null, 2))

            // return

            const formData = new FormData();
            formData.append('svgImg', data.profImage[0]);
            formData.append('width', data?.width);
            formData.append('height', data?.height);
            formData.append('svgPaths', JSON.stringify(data?.svgPaths))

            const response = await fetch(`${configData.SERVER_URL}/estate/add-estate-layout-new/${data.estateId}`, {
                method: "post",
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    "x-auth-token": window.localStorage.getItem("token")
                },
                body: formData,
            });
            const responseJson = await response.json();

            console.log(responseJson.data.data);
            if (responseJson.data.status === "success") {
                setisBtnLoading(false);
                alert(responseJson.data.message);
            }
            if (responseJson.data.status === "error") {
                setisBtnLoading(false)
                alert(responseJson.data.message);
            }

        } catch (error) {
            setisBtnLoading(false);
            console.error(error);
        }
    }


    const [estate, setEstate] = useState([]);
    const [isEstLoading, setIsEstLoading] = useState(false);

    const getEstates = async () => {
        try {
            setIsEstLoading(true);

            return fetch(`${configData.SERVER_URL}/estate/getEstate`, {
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
            setIsEstLoading(false);
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

    useEffect(() => {
        getEstates();
    }, []);


    return (
        <>


            <div className='col-md-12 mt-4'>
                <div onClick={handleShow} className="btn-add">
                    <span>Add Layout</span>
                </div>
            </div>


            <div className="my-5">

                {plots.length > 0 ? <>
                    <h6 className="mt-2 mb-4">Update Plot Status </h6>
                    <div class="form-group has-search">

                        <div className="row">
                            <div className="col-md-5 mx-auto">
                                <div className="input-group">
                                    <input className="form-control border rounded-pill" placeholder="Search with plot number" value={searchQuery} onChange={handleChange} type="search" id="example-search-input" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="list-referer">
                        <div className="row">

                            {searchResults.map((result) => (

                                <div onClick={() => selectPlot(result)}
                                    className={`col-lg-3 g-4 searchPlot pb-4 ${selectedPlots.find((selectedPlot) => selectedPlot._id === result._id) ? 'selectedPlot' : ''}`} id={result.plotNumber}>

                                    <div className="d-flex flex-column justify-content-center align-items-center mb-2">
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

                                        <span onClick={() => offCanvasShow(result)} className="w-100 text-center">view</span>

                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>
                    {selectedPlots.length > 0 && <>

                        <div className="updateType">
                            <div className="form-group">
                                <label htmlFor="updateType">Update Type</label> <span style={{ marginRight: "20px" }}></span>

                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="updateType"
                                            value="sold"
                                            onChange={(e) => setUpdateType('sold')}
                                            checked={updateType === 'sold'}
                                        /> Sold
                                    </label>
                                </div>


                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="updateType"
                                            value="reserved"
                                            onChange={(e) => setUpdateType('reserved')}
                                            checked={updateType === 'reserved'}
                                        /> Reserved
                                    </label>
                                </div>


                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="updateType"
                                            value="available"
                                            onChange={(e) => setUpdateType('available')}
                                            checked={updateType === 'available'}
                                        /> Available
                                    </label>
                                </div>
                            </div>
                            {updateType !== '' &&
                                <div className="mt-4 mb-5">
                                    <Button onClick={updatePlot} variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                                        {isBtnLoading ? (<>Waiting...</>) : (<>Update Plots</>)}
                                    </Button>
                                </div>}
                        </div>
                    </>}
                </> : <>

                    <h6 className="mt-2 mb-4  text-center">
                        This Estate does not plots attached to it yet
                    </h6>

                </>}
            </div>


            <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                <Offcanvas.Body>

                    <div className="estateDetails">
                        <span>{isDataLoaded && data?.estateId.name}</span>
                        <span>{isDataLoaded && data?.estateId.location}</span>
                    </div>


                    <div className='userProfDisplay'>

                        {isDataLoaded &&
                            <div className="profInfo">
                                {data?.docId ? <>

                                    <h4>Owned By</h4>

                                    <div className="user-details">

                                        <Image
                                            // crossorigin="anonymous"
                                            src={`${configData.PIC_URL}/${data?.docId.clientId.passport}`} className="useDataImg3" alt="" />
                                        <div className="userDataName">
                                            <span>{data?.docId.clientId.fullName}</span>
                                            <span>{data?.docId.clientId.phoneNumber}</span>
                                        </div>
                                    </div>

                                    <div className="profInfoData">

                                        <div className="profData">
                                            <span>Full Name</span>
                                            <span>{data?.docId.clientId.fullName}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Phone Number</span>
                                            <span>{data?.docId.clientId.phoneNumber}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Sex</span>
                                            <span>{data?.docId.clientId.sex}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Email</span>
                                            <span>{data?.docId.clientId.email}</span>
                                        </div>

                                        <div className="view-more" onClick={() => navigation(data?.docId.clientId)}>
                                            <span>view more</span>
                                        </div>


                                    </div>

                                </> : <>
                                    <span>This property does not have an owner</span>
                                </>}
                            </div>
                        }

                    </div>

                </Offcanvas.Body>

            </Offcanvas>




            <Modal show={show} onHide={handleClose}>

                <Modal.Header closeButton>
                    <Modal.Title>Add Layout</Modal.Title>
                </Modal.Header>

                <form onSubmit={handleSubmit(submitForm)} className="pt-2 pb-5" encType="multipart/form-data" id="submit">
                    <Modal.Body>

                        <Row>


                            <Col lg="1"></Col>

                            <Col lg="10" className="white-card">


                                <div className='col-md'>

                                    <input type="file" name="profImage" ref={register({ required: true })}
                                        id="imageInput"
                                        accept="image/*"
                                        onChange={handleImageChange} />
                                </div>

                                <div className="col-md">
                                    <div class="form-floating">
                                        <select className="form-select mt-3" name="estateId" ref={register({ required: false })}>
                                            <option value=''>Select Estate</option>
                                            {estate.map(e => (
                                                <option value={e._id}>{e.name}</option>
                                            ))}
                                        </select>
                                        <label for="floatingSelect">Select estate</label>
                                    </div>
                                </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="width" type="text" className="h-auto form-control " name="width" ref={register({ required: true })} />
                                            {errors.width && <span className="alert alert-danger" role="alert">Width Required</span>}
                                            <label for="floatingInput">Width</label>
                                        </div>
                                    </div>
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="height" type="text" className="h-auto form-control " name="height"
                                                ref={register({ required: true })} />
                                            {errors.height && <span className="alert alert-danger" role="alert">Height Required</span>}
                                            <label for="floatingInput">Height</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-floating mt-3">
                                    <input placeholder="SvgPaths" type="text" className="h-auto form-control" id="floatingInput" name="svgPaths"
                                        ref={register({ required: true })} height="100px" />
                                    {errors.svgPaths && <span className="alert alert-danger" role="alert">SvgPaths Required</span>}
                                    <label for="floatingInput">Svg Paths</label>
                                </div>

                            </Col>

                            <Col lg="1"></Col>




                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" className="float-end" type="submit" disabled={isBtnLoading}>
                            {isBtnLoading ? (<>Loading</>) : (<>Add Layout</>)}
                        </Button>
                    </Modal.Footer>
                </form>

            </Modal>




        </>
    );
};

export default Plots;