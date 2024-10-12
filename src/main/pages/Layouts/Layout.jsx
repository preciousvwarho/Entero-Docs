import React, { useState, useEffect } from 'react';
import { Image, Offcanvas } from 'react-bootstrap';
import fountainEstate from "../../assets/img/fountain.png";
import atlantic from "../../assets/img/atlantic.png";
import configData from "../../../config.json";
import { useHistory } from "react-router-dom";

const EstLayout = (props) => {
    const history = useHistory();
    const { estate } = props;
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [data, setData] = useState([]);
    const [properties, setProperties] = useState([]);

    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = () => setShowOffcanvas(true);

    const [svgPaths, setSvgPaths] = useState([]);
    
    const [svgData, setSvgData] = useState({
        svgPaths: [],
        svgImg: '',
        width: 0,
        height: 0
    });

    useEffect(() => {
        // Fetch SVG paths from the backend
        fetch(`${configData.TEST_URL}/estate/get-layout/${estate._id}`)
            .then(response => response.json())
            .then(data => {
                console.log("data", data);
                setSvgData({
                    svgPaths: data.data.svgPaths,
                    svgImg: data.data.svgImg,
                    width: data.data.width,
                    height: data.data.height
                });
                setSvgPaths(data.data.svgPaths)
            })
            .catch(error => console.error('Error fetching SVG paths:', error));
    }, [estate]);

    const getEstPlots = async () => {

        try {

            return fetch(`${configData.TEST_URL}/plot/estate/plots/${estate._id}`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    // "x-auth-token":  window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.data);
                    setProperties(responseJson.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getEstPlots()
    }, [])

    properties.forEach((property) => {
        const element = document.getElementById(`${property.plotIdentifier}`);
        if (element) {
            if (property.status === 'sold') {
                element.style.fill = 'rgb(255, 0, 0, 0.4)';
            }
            if (property.status === 'reserved') {
                element.style.fill = 'rgb(255, 210, 0, 0.4)';
            }
        }

    })

    const getPlotData = (id) => {

        const selectedPlot = properties.find((property) => `${property.plotIdentifier}` === id)
        if(selectedPlot.status === 'available') {
            return
        }
        if (selectedPlot) {
            setData(selectedPlot)
            offCanvasShow()
            console.log(selectedPlot)
        }
    }

    const navigation = (data) => {
        history.push({
            pathname: `/Client-Details/${data?._id}`,
            state: { data: data },
        });
    }
    
    const estImage = estate.mapIdentifier  === "fountain" ? fountainEstate : estate.mapIdentifier  === "atlantic" ? atlantic : null

    return (
        <>

            {/* <div className="wrapper">
         <div className="scrollable-content"> */}
            <div style={{background: `url(${estImage})`,backgroundSize: "cover", width: "100%"}} className="layout">

                <svg width={svgData.width} 
                     height={svgData.height} 
                     viewBox={`0 0 ${svgData.width} ${svgData.height}`} 
                     fill="none" xmlns="http://www.w3.org/2000/svg">

                    <g id="Group 2">
                        {svgPaths && svgPaths.map((path) => (<>
                            <path
                                key={path.id}
                                fill='rgba(255, 255, 255, 0.2)'
                                id={path.id}
                                d={path.d}
                                stroke="black"
                                onClick={() => getPlotData(path.id)}
                            />
                       </> ))}
                    </g>

                </svg>


            </div>
            {/* </div> 

        </div> */}


            <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                {/* <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Edit Document</Offcanvas.Title>
                                  </Offcanvas.Header> */}
                <Offcanvas.Body>

                    <div className="estateDetails">
                        <span>{estate.name}</span>
                        <span>{estate.location}</span>
                    </div>


                    <div className='userProfDisplay'>

                        <div className="profInfo">
                            <h4>Property Details</h4>

                            <div className="profInfoData">

                                <div className="profData">
                                    <span>Name</span>
                                    <span>{estate.name}</span>
                                </div>


                                <div className="profData">
                                    <span>Plot Number</span>
                                    <span>{data.plotNumber}</span>
                                </div>

                                <div className="profData">
                                    <span>Sqm</span>
                                    <span>{data.size}m<sup>2</sup></span>
                                </div>

                                <div className="profData">
                                    <span>Status</span>
                                    <span className={data.status === 'sold' ? 'soldStatus' : (data.status === 'pending' ? 'pendingStatus' : 'availableStatus')}>{data.status === 'sold' ? 'sold' : (data.status === 'reserved' ? 'reserved' : 'available')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profInfo">
                            {data.docId ? <>

                                <h4>Owned By</h4>

                                <div className="user-details">

                                    <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${data.docId.clientId.passport}`} className="useDataImg3" alt="" />
                                    <div className="userDataName">
                                        <span>{data.docId.clientId.fullName}</span>
                                        <span>{data.docId.clientId.phoneNumber}</span>
                                    </div>
                                </div>

                                <div className="profInfoData">

                                    <div className="profData">
                                        <span>Full Name</span>
                                        <span>{data.docId.clientId.fullName}</span>
                                    </div>

                                    <div className="profData">
                                        <span>Phone Number</span>
                                        <span>{data.docId.clientId.phoneNumber}</span>
                                    </div>

                                    <div className="profData">
                                        <span>Sex</span>
                                        <span>{data.docId.clientId.sex}</span>
                                    </div>

                                    <div className="profData">
                                        <span>Email</span>
                                        <span>{data.docId.clientId.email}</span>
                                    </div>

                                    <div className="view-more" onClick={() => navigation(data.docId.clientId)}>
                                        <span>view more</span>
                                    </div>


                                </div>

                            </> : <>
                                <span>This property does not have an owner</span>
                            </>}
                        </div>

                    </div>

                </Offcanvas.Body>
            </Offcanvas>






        </>
    );
};

export default EstLayout;