import React, {useState, useEffect} from 'react';
import { Image, Offcanvas} from 'react-bootstrap';
import RoseGardenImage from "../../assets/img/RoseGarden.png";
import configData from "../../../config.json";
import { useHistory } from "react-router-dom";

const RoseGarden = (props) => {
    const history = useHistory();
    const {estate} = props;
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [data, setData] = useState([]);
    const [properties, setProperties] = useState([])
  
    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = () => setShowOffcanvas(true);

    const getEstPlots = async() => {

        try {

            return fetch(`${configData.SERVER_URL}/plot/estate/plots/${estate._id}`, {
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
    
    useEffect(()=> {
        getEstPlots()
    },[])

         properties.forEach((property) => {
            const element = document.getElementById(`plot-${property.plotNumber}`);
            if(element) {
                if (property.status === 'sold') {
                    element.style.fill = 'rgb(255, 0, 0, 0.4)';
                  } 
                if (property.status === 'reserved') {
                    element.style.fill = 'rgb(255, 210, 0, 0.4)';
                   } 
                // else {
                //     element.style.fill = 'rgba(255, 255, 255, 0.2)';
                //   }
            }
        
        })

    const getPlotData = (id) => {
        console.log(id);
        
       const selectedPlot = properties.find((property) => `plot-${property.plotNumber}` === id)
       if(selectedPlot) {
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
  

    return (
        <>


        <div  style={{background: `url(${RoseGardenImage})`, backgroundSize:"cover", width:"100%"}} 
        className="layout">
                    <svg width="100%" height="100%" viewBox="0 0 2302 3222" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="ROSEGARDEN-lines">
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-11"  onClick={()=> getPlotData('plot-11')}  d="M1259 1109L965 801L1138 630L1434 943L1259 1109Z" stroke="black"/>
                        <path   fill='rgba(255, 255, 255, 0.2)'  id="plot-12"  onClick={()=> getPlotData('plot-12')} d="M1085 1278L790 972L964 800L1261 1110L1085 1278Z" stroke="black"/>
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-03"  onClick={()=> getPlotData('plot-03')} d="M1783 1645L1722 1583L1910 1385L2001 1772L1865 1973L1673 1788L1783 1675V1645Z" stroke="black"/>
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-02"  onClick={()=> getPlotData('plot-02')} d="M1673 2270L1433 2040L1673 1789L1872 1979L1673 2270Z" stroke="black"/>
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-01"  onClick={()=> getPlotData('plot-01')} d="M1524 2490L1277 2267V2201L1432 2038L1672 2267L1524 2490Z" stroke="black"/>

                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-06"  onClick={()=> getPlotData('plot-06')} d="M1127 2131L945 1967L1205 1705L1419 1901L1191 2131H1127Z" stroke="black"/>
                        
                        <path fill='rgba(255, 255, 255, 0.2)' id="plot-05"  onClick={()=> getPlotData('plot-05')} d="M1418 1896L1205 1707L1463 1433L1669 1637L1418 1896Z" stroke="black"/>

                        <path fill='rgba(255, 255, 255, 0.2)' id="plot-04"  onClick={()=> getPlotData('plot-04')} d="M1667 1636L1463 1435L1726 1158L1916 1379L1667 1636Z" stroke="black"/>

                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-9"  onClick={()=> getPlotData('plot-09')} d="M1463 1435L1273 1247L1528 1003L1496 921L1558 898L1596 1003L1726 1159L1463 1435Z" stroke="black"/>
                        
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-8" onClick={()=> getPlotData('plot-08')} d="M1206 1706L993 1515L1272 1246L1463 1434L1206 1706Z" stroke="black"/>
                        
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-7"  onClick={()=> getPlotData('plot-07')} d="M1205 1707L993 1515L761 1737V1799L947 1965L1205 1707Z" stroke="black"/>
                        
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-15"  onClick={()=> getPlotData('plot-15')} d="M567 1775L251 1485L437 1303L735 1617L567 1775Z" stroke="black"/>
                        
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-14"  onClick={()=> getPlotData('plot-14')} d="M911 1445L609 1135L433 1303L735 1617L911 1445Z" stroke="black"/>
                        
                        <path   fill='rgba(255, 255, 255, 0.2)' id="plot-10"  onClick={()=> getPlotData('plot-10')} d="M1437 946L1137 630L1381 394L1561 902L1437 946Z" stroke="black"/>

                        <path fill='rgba(255, 255, 255, 0.2)' id="plot-13"  onClick={()=> getPlotData('plot-13')} d="M911 1447L609 1133L783 965L1085 1277L911 1447Z" stroke="black"/>
                        {/* <path id="plot-3457" d="M1365 2501L1705 2797L1517 3185L1481 3221M1481 3221H1633L1841 2777L1533 2485L2301 1677V1H1V1489V3221H1481Z" stroke="white"/> */}
                        </g>
                    </svg>

            </div>





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

                                    <Image 
                                    // crossorigin="anonymous"
                                     src={`${configData.PIC_URL}/${data.docId.clientId.passport}`} className="useDataImg3" alt="" />
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

export default RoseGarden;