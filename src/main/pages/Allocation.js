
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Image, Modal, Offcanvas, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import Layout from '../Layout';
import Paradise from './Layouts/Paradise';
import RoseGarden from './Layouts/RoseGarden';
import Fountain from "./Layouts/Fountain";
import Atlantic from "./Layouts/Atlantic";


function Allocation() {

  const [showMap, setShowMap] = useState(false);
  const [page, setPage] = useState("rose");
  const [docs, setDocs] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [isBtnLoading, setisBtnLoading] = useState(false);
  const [estate, setEstate] = useState([]);
  const [activeEstate, setActiveEstate] = useState([]);

   const getEstates = async() => {

    return fetch(`${configData.SERVER_URL}/estate/getEstate`, {
        method: "get",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },

    })
    .then((response) => response.json())
    .then((responseJson) => {

        if(responseJson.status === "success"){
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

  useEffect(() => {
        getEstates();
  },[]);


        const [searchDoc, setSearchDoc] = useState('');

        const handleDocSearch = (query) => {
            const filteredResults = docs.filter((docs) =>
               docs?.clientId?.fullName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredDocs(filteredResults);
        };

        const handleDocChange = (e) => {
            const query = e.target.value;
            setSearchDoc(query);

            // Perform search when at least 2 characters are entered
            if (query.length >= 2) {
                handleDocSearch(query);
            } else {
                setFilteredDocs(docs); // Clear results if the search query is less than 2 characters
            }
        };

        const togglePage = (estate)=> {
            const filteredData = docs.filter((doc) => doc.estateId._id === estate._id);
            setFilteredDocs(filteredData);
            setShowMap(false);
            setActiveEstate(estate)
            setPage(estate?.mapIdentifier);
        }
        


  return (
    <>
       
    <Layout>

        <div className="mainBox">
            
               <div className='mBoxOne' style={{width: '100vw'}}>

                   <div className="heading-section">
                     <div className="navSection">
                      <span className="inactiveText">Dashboard</span>
                      <span className="activeArrow">{">"}</span>
                      <span className="activeText">Allocation</span>
                     </div>

                    <div class="form-group has-search" style={{width:"30%"}}>
                            <div className="col-md-12 mx-auto">
                            </div>
                     </div>

                   </div>


                   <div className="estContent">
                          
            <Col lg="12" style={{margin:'0px', padding:'0px'}}>


                <div className="userBtnPa p0">
                    <div className="firstUserBtns">
                        {estate.map((e, index) => {
                            return <>         
                                <div key={index + 1} className={page === e?.mapIdentifier ? "user-btn" : "user-inactivBtn" }  onClick={()=> togglePage(e)}>
                                    <span>{e?.name}</span>
                                </div>
                        </>})} 
                    </div>
                    </div>

             </Col>

                    
                       
            <div className="mapSection">
            
                    {page  === "rose" &&  <RoseGarden estate={activeEstate}/> }
                    {page  === "paradise" &&  <Paradise estate={activeEstate}/> }
                    {page  === "fountain" &&  <Fountain estate={activeEstate}/> }
                    {page === "atlantic" && <Atlantic estate={activeEstate}/>}

              </div>



                   </div>
    
                   </div>

        </div>

    </Layout>


    </>
  );
}

export default Allocation;
