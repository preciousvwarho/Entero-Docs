
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdSupervisorAccount, MdOutlineAccountBox } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";
import Layout from '../Layout';
import configData from "../../config.json";
import { Context } from '../../Store';
import { Marketer, Client, Documents } from './svg/Svg';
import { Col } from 'react-bootstrap';
import { format } from 'date-fns';

function Dashboard() {
    const [show, setShow] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [state, setState] = useContext(Context);

    const [doc, setDocs] = useState([])
    const [clients, setClients] = useState([]);
    const [marketers, setMarketers] = useState([])

    const fullName = window.localStorage.getItem("fullName");

    const history = useHistory();
    const navigation = (link) => {
        history.push(`/${link}`);
    }


    const currDate = new Date();

    const getAdmin = async () => {

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
                console.log(responseJson.data)
                setMarketers(responseJson.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    const getClients = async () => {

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
                setClients(responseJson.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    const getDoc = async () => {
        try {
            setisBtnLoading(true);

            return fetch(`${configData.TEST_URL}/document/getDocument`, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setDocs(responseJson.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
        }

    }


    useEffect(() => {
        getDoc();
        getClients();
        getAdmin();
        // const interval = setInterval(() => {
        //   getDoc();
        //   getEstates();
        //   getAdmin();
        // }, 3000);

        // return () => clearInterval(interval);
    }, []);

    const nav = (title) => {

        if (title === 'Marketers') {
            if (state.profile.role === 'admin' || (state.profile.permission === 'marketers' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) {
                navigation('Marketers');
            }
        }

        if (title === 'Clients') {
            if (state.profile.role === 'admin' || (state.profile.permission === 'clients' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) {
                navigation('Clients')
            }
        }

        if (title === 'Documents') {
            if (state.profile.role === 'admin' || (state.profile.permission === 'documents' && ['add'].some(substring => state.profile.permissionType.includes(substring)))) {
                navigation('Documents')
            }
        }


    }


    return (
        <>

            <Layout>

                <div className="mainBox">


                    <div className='mainBoxOne'>

                        <div className='nameSec'>
                            <div>
                                <h4 className='userName'>Hi, {state.profile.fullName}</h4>
                            </div>
                            <div style={{ width: "50%" }}>
                                <span className="line"></span>
                            </div>
                            <div className='dateBox'>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                                    <FaRegCalendarAlt />
                                    <span className='dateText'>{format(new Date(currDate.toDateString()), 'dd MMMM yy')}</span>
                                </div>

                            </div>

                        </div>

                        <div className='analyticsBox'>

                            <div className='analyticsBoxOne'>
                                <div className='iconBox'>
                                    <MdSupervisorAccount style={{ fontSize: "28px" }} />
                                </div>
                                <div className='textBox'>
                                    <span>{marketers.length}</span>
                                    <span>Marketers</span>
                                </div>

                            </div>

                            <div className='analyticsBoxOne'>
                                <div className='iconBox'>
                                    <MdOutlineAccountBox style={{ fontSize: "28px" }} />
                                </div>
                                <div className='textBox'>
                                    <span>{clients.length}</span>
                                    <span>Clients</span>
                                </div>

                            </div>

                            <div className='analyticsBoxOne'>
                                <div className='iconBox'>
                                    <IoDocuments style={{ fontSize: "28px" }} />
                                </div>
                                <div className='textBox'>
                                    <span>{doc.length}</span>
                                    <span>Documents</span>
                                </div>

                            </div>

                        </div>

                        <div className='featureParent'>

                            <div className='feature' onClick={() => nav('Marketers')}>
                                <div className='textBox'>
                                    <span>Marketers</span>
                                    <span>Add, edit and delete marketers datas.</span>
                                </div>
                                <div>
                                    <Marketer />
                                </div>

                            </div>

                            <div className='feature' onClick={() => nav('Clients')}>
                                <div className='textBox'>
                                    <span>Clients</span>
                                    <span>Add and manage clients data.</span>
                                </div>
                                <div>
                                    <Client />
                                </div>

                            </div>

                            <div className='feature' onClick={() => nav('Documents')}>
                                <div className='textBox'>
                                    <span>Documents</span>
                                    <span>Add, edit and delete clients documents.</span>
                                </div>
                                <div>
                                    <Documents />
                                </div>

                            </div>

                        </div>

                        {/* <div className='docList'>
                            <div class="col-12">

                                <div className='mt-4'>
                                    <div className='d-flex justify-content-between'>
                                        <h4 className='feath4'>Other features</h4>
                                    </div>

                                    <div className='otherFeatures'>

                                        {(state.profile.role === 'admin' || state.profile.role === 'allocation') &&
                                            <div onClick={() => navigation('DuePayment')} className='feat-b'>
                                                <div className='textBox'>
                                                    <span>Due Payments</span>
                                                    <span>View documents payment that are due.</span>
                                                </div>
                                                <div className="">
                                                    <h2>1500</h2> <span className=''> Documents are due</span>
                                                </div>
                                            </div>
                                        }
                                        {(state.profile.role === 'admin' || state.profile.role === 'allocation') &&
                                            <div onClick={() => navigation('Allocation')} className='feat-b'>
                                                <div className='textBox'>
                                                    <span>Property Allocation</span>
                                                    <span>Add, edit and delete marketers datas.</span>
                                                </div>
                                                <div className="">
                                                    <h2>100</h2> <span className=''> </span>
                                                </div>
                                            </div>
                                        }

                                    </div>
                                </div>


                                <TransComp trans={doc}/> 

                            </div>
                        </div> */}



                    </div>



                    <div className='mainBoxTwo'>


                        <Col lg="12 profInfo">


                            {/* <div className=''>
                                <div className='d-flex justify-content-between'>
                                    <h4>Monthly Report</h4>
                                    <h4>view all</h4>
                                </div>

                                <div className='request-b'>

                                    <div className='report-b'>
                                        <div className='textBox'>
                                            <span>Febuary 2024 Report</span>
                                        </div>
                                        <div>
                                            <div className="rep-list">
                                                <span className=''>50 plots sold</span>
                                            </div>
                                            <div className="rep-list">
                                                <span className=''>500 new clients</span>
                                            </div>
                                            <div className="rep-list">
                                                <span className=''>100 new documents</span>
                                            </div>
                                            <div className="rep-list">
                                                <span className=''>₦100,000,000 total payment</span>
                                            </div>
                                            <div className="rep-list">
                                                <span className=''>₦10,000,000 commissions paid</span>
                                            </div>
                                        </div>
                                        <div className="view-more"
                                        // onClick={() => navigation(data.docId.clientId)}
                                        >
                                            <span>view more</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className='mt-4'>
                                <div className='d-flex justify-content-between'>
                                    <h4>Commission Request</h4>
                                </div>

                                <div className='otherFeatures d-block'>

                                    <div className='feat-b w-100 my-4'>
                                        <div className='textBox'>
                                            <span>Due Payments</span>
                                            <span>View documents payment that are due.</span>
                                        </div>
                                        <div className="">
                                            <h2>1500</h2> <span className=''> Documents are due</span>
                                        </div>
                                    </div>

                                </div>
                            </div> */}


                        </Col>

                    </div>

                </div>

            </Layout>


        </>
    );
}

export default Dashboard;
