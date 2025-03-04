
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdSupervisorAccount, MdOutlineAccountBox } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";
import Layout from '../Layout';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import { Context } from '../../Store';
import { Marketer, Client, Documents } from './svg/Svg';
import { Col, Button, Modal } from 'react-bootstrap';
import { ThreeDots, ColorRing } from 'react-loader-spinner';
import { format } from 'date-fns';
import { toast } from "react-toastify";

function Dashboard() {
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [state, setState] = useContext(Context);
    const { register, handleSubmit, reset, setValue, errors } = useForm();
    const [error, setError] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [showHome, setShowHome] = useState(false)
    const [summary, setSummary] = useState([])

    const fullName = window.localStorage.getItem("fullName");

    const history = useHistory();
    const navigation = (link) => {
        history.push(`/${link}`);
    }


    const currDate = new Date();


    const getSummary = async () => {
        setIsLoading(true);

        return fetch(`${configData.SERVER_URL}/admin/account/Sumary`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-auth-token": window.localStorage.getItem("token")
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === "success") {
                    setSummary(responseJson);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });

    }


    useEffect(() => {
        getSummary();
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


    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const adminNotif = async (e) => {
        e.preventDefault();

        const formData = {
            title,
            content,
            showHome
        }

        try {
            const response = await fetch(`${configData.SERVER_URL}/notify/add/notification`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token")
                },
                body: JSON.stringify(formData),
            });
            const responseJson = await response.json();

            if (responseJson.status === "success") {
                setTitle('');
                setContent("");
                setShowHome(false);
                setisBtnLoading(false);
                handleClose();
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


    return (
        <>


            <Layout>


                {isLoading ?

                    <div style={{ display: "flex", height: "100vh", width: "100%", justifyContent: "center", alignItems: "center" }}>
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

                    :

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
                                        <span>{summary?.marketers}</span>
                                        <span>Marketers</span>
                                    </div>

                                </div>

                                <div className='analyticsBoxOne'>
                                    <div className='iconBox'>
                                        <MdOutlineAccountBox style={{ fontSize: "28px" }} />
                                    </div>
                                    <div className='textBox'>
                                        <span>{summary?.clients}</span>
                                        <span>Clients</span>
                                    </div>

                                </div>

                                <div className='analyticsBoxOne'>
                                    <div className='iconBox'>
                                        <IoDocuments style={{ fontSize: "28px" }} />
                                    </div>
                                    <div className='textBox'>
                                        <span>{summary?.documents}</span>
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


                                <div className=''>
                                    <div className='d-flex justify-content-between'>
                                        <h4>Top Notification</h4>
                                    </div>
                                    <div className="view-more">
                                        <span onClick={handleShow}>Send Notification</span>
                                    </div>

                                    <div className='request-b'>

                                        <div className='report-b'>
                                            <div>
                                                <div className='textBox'>
                                                    <span style={{ fontSize: "18px" }}>PROMO ALERT!!</span>
                                                </div>
                                                <span className=''>90 days Promo, win exciting prices from Nov 3 to January 31</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/*   <div className='mt-4'>
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

                }


                <Modal show={show} onHide={handleClose}>

                    <form onSubmit={adminNotif} method="POST" enctype="multipart/form-data" className="pt-3" id="submit">
                        <Modal.Body>


                            <div className="adminForm">
                                <span>Home Notification</span>

                                <div className="col-md-12">

                                    <div className="form-floating mt-3">
                                        <input placeholder="title" type="text" className="h-auto form-control" name="title" onChange={(e) => setTitle(e.target.value)} />
                                        {error === 'title' && <span className="alert alert-danger" role="alert">Title Required</span>}
                                        <label for="floatingInput">Title</label>
                                    </div>

                                    <div className="form-floating mt-3">
                                        <input placeholder="content" type="text" className="h-auto form-control" name="content" onChange={(e) => setContent(e.target.value)} />
                                        {error === 'title' && <span className="alert alert-danger" role="alert">Content Required</span>}
                                        <label for="floatingInput">Content</label>
                                    </div>


                                    <div className="mb-3 mt-3 form-check">
                                        <input type="checkbox" className="form-check-input" name="isSoldOut" id="exampleCheck1"
                                            onChange={(e) => setShowHome(e.target.checked)}
                                            checked={showHome} />
                                        <label className="form-check-label" for="exampleCheck1">Replace Home notification</label>
                                    </div>

                                </div>



                                <div className="mt-4 mb-4">
                                </div>

                            </div>




                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            {isBtnLoading ? (<>
                                <div className="d-flex  justify-content-end align-items-center w-100 mt-5">
                                    <ColorRing
                                        visible={true}
                                        height="30"
                                        width="30"
                                        ariaLabel="color-ring-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="color-ring-wrapper"
                                        colors={['#0b9967', '#0b9967', '#0b9967', '#0b9967', '#0b9967']}
                                    />
                                    <span>Submitting... </span>
                                </div>
                            </>)
                                : (<>

                                    <Button variant="primary" type="submit" disabled={isBtnLoading}>
                                        Submit
                                    </Button>
                                </>)}
                        </Modal.Footer>
                    </form>
                </Modal>


            </Layout>


        </>
    );
}

export default Dashboard;
