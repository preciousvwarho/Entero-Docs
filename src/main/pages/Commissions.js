import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import Layout from '../Layout';
// import { format } from 'date-fns'
// import { useHistory } from "react-router-dom";
import CommissionComp from "./Components/CommissionComp";
import io from 'socket.io-client';
const socket = io(`${configData.URL}`);

const Commissions = () => {
    const [page, setPage] = useState("all");
    const [miniNav, setMiniNav] = useState('all');
    const [commission, setCommission] = useState([]);
    const [newCommission, setNewCommission] = useState([]);
    const [docPage, setDocPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(null);
    const [isPageLoading, setisPageLoading] = useState(false);

    const [searchDoc, setSearchDoc] = useState('');

    useEffect(() => {
        socket.on('commission-request', (param) => {
            getCommision();
        });

        return () => {
            socket.off('commission-request');
        };
    }, []);

    const onPageChange = (pageNumb) => {
        setDocPage(pageNumb);
        getCommision(pageNumb);
    };


    const filterByStatus = (status) => {
        setMiniNav(status);
        if (status !== "all") {
            // const filteredData = newCommission.filter((data) => data.status === status);
            // setCommission(filteredData);
            getCommision(1)
            return
        }
        getCommision(1)
    };



    const getCommision = async (pageNumb) => {
        try {
            setisPageLoading(true);

            return fetch(`${configData.SERVER_URL}/commission/marketers?page=${pageNumb}&sizePerPage=${sizePerPage}&pageType=${miniNav}`, {
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
                    setNewCommission(responseJson.data);
                    setTotalPages(responseJson.totalPages)
                    setisPageLoading(false);
                    // setFilteredComm(responseJson.data);
                })
                .catch((error) => {
                    console.error(error);
                    setisPageLoading(false);
                });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCommision(docPage);
    }, []);


        const [pageNumberRange, setPageNumberRange] = useState([]);
    
        useEffect(() => {
            updatePageNumberRange();
        }, [docPage, totalPages]);
    
        const updatePageNumberRange = () => {
            const rangeStart = Math.max(1, docPage - 2);
            const rangeEnd = Math.min(totalPages, rangeStart + 4);
    
            setPageNumberRange([...Array(rangeEnd - rangeStart + 1).keys()].map(num => num + rangeStart));
        };
    

    const handleComSearch = (query) => {
        const filteredResults = commission.filter((com) =>
            com?.requesterId?.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setCommission(filteredResults);
    };

    const handleDocChange = (e) => {
        const query = e.target.value;
        setSearchDoc(query);

        // Perform search when at least 2 characters are entered
        if (query.length >= 2) {
            handleComSearch(query);
        } else {
            setCommission(newCommission); // Clear results if the search query is less than 2 characters
        }
    };



    return (
        <>

            <Layout>

                <div className="mainBox">


                    <div className='mBoxOne' style={{ width: '100vw' }}>

                        <div className="heading-section">
                            <div className="navSection">
                                <span className="activeText">Commission</span>
                            </div>

                            <div class="form-group has-search" style={{ width: "30%" }}>
                                <div className="col-md-12 mx-auto">
                                    <div className="input-group">
                                        <input className="form-control border rounded-pill" placeholder="Search commission by marketers name" value={searchDoc} onChange={handleDocChange} type="search" id="example-search-input" />
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="estContent">

                            <Col lg="12" style={{ margin: '0px', padding: '0px' }}>


                                <div class="category-menu">

                                    <ul className="nav">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Commission</a>
                                        </li>
                                    </ul>
                                    <span className="line"></span>

                                    <ul className="nav lastNav">
                                        <li className="nav-item" onClick={() => filterByStatus('all')}>
                                            <a className={miniNav === 'all' ? 'nav-link activeNav' : "nav-link"} aria-current="page" href="#">All</a>
                                        </li>
                                        <li className="nav-item" onClick={() => filterByStatus('paid')}>
                                            <a className={miniNav === 'paid' ? 'nav-link activeNav' : "nav-link"} aria-current="page" href="#">Paid</a>
                                        </li>
                                        <li className="nav-item" onClick={() => filterByStatus('pending')}>
                                            <a className={miniNav === 'pending' ? 'nav-link activeNav' : "nav-link"} href="#">Pending</a>
                                        </li>
                                        <li className="nav-item" onClick={() => filterByStatus('rejected')}>
                                            <a className={miniNav === 'rejected' ? 'nav-link activeNav' : "nav-link"} href="#">Rejected</a>
                                        </li>
                                    </ul>

                                </div>

                            </Col>


                            <div className="mt-5">

                                <div className="tranHeader">
                                    <span>Commission</span>
                                    {/* <span>{filteredDocs.length} record{filteredDocs.length > 1 && 's'}</span> */}
                                </div>

                                <div className='docList'>
                                    <div class="col-12 mt-3">

                                        <CommissionComp commission={commission} />

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



                        </div>

                    </div>

                </div>

            </Layout>


        </>
    );
};

export default Commissions;