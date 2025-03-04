
import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Nav, Image } from 'react-bootstrap';
import { useHistory, useLocation, Link } from "react-router-dom";
import configData from "../../config.json";
import { DropDownArrow, DropDownActiveArrow, AdminIcon } from "../pages/svg/Svg";
import logo from '../assets/img/ENTERO.png';
import EditProfile from './EditProfile';
import { Context } from '../../Store';
import addNotification from 'react-push-notification';
import io from 'socket.io-client';
const socket = io(`${configData.URL}`);
// import { useIdleTimer } from 'react-idle-timer/legacy'


function Sidebar() {
    const location = useLocation();
    const history = useHistory();
    const [state, setState] = useContext(Context);

    useEffect(() => {

        socket.on('admin-notification', (data) => {

            if(state?.profile?._id == data?.id) return

            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then((permission) => {
                    console.log('request again')
                    if (permission === 'granted') {
                        notifyMe(data);
                    } else {
                        console.log('Notification permission denied');
                    }
                });
            } else {
                notifyMe(data);
            }

        });

        return () => {
            socket.off('admin-notification');
        };
    }, []);


    const soundUrl = "/notification2.wav"; // Ensure this sound file is in public folder

    const playNotificationSound = () => {
      const audio = new Audio(soundUrl);
      audio.play().catch((error) => console.error("Error playing sound:", error));
    };

    const notifyMe = (data) => {
        
        if (state.profile.role === 'admin' || (data?.for?.includes(state?.profile?.permission))) {
            console.log("should work")
            addNotification({
                title: data?.title,
                message: data?.message,
                icon: 'https://enterohomes.com/img/logo.png',
                duration: 5000,
                native: true,
                onClick: () => console.log("Notification clicked!"),
            });

            playNotificationSound()
        }
    }



    const verifyUser = async () => {

        try {

            return fetch(`${configData.SERVER_URL}/admin/verify`, {
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
                    if (responseJson.status === "success") {
                        setState({
                            ...state,
                            profile: responseJson.data,
                            fullName: responseJson.data.fullName,
                            email: responseJson.data.email
                        })

                    } else {
                        window.localStorage.clear();
                        history.push('/');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    window.localStorage.clear();
                    history.push('/');
                });

        } catch (error) {
            console.log(error);
            window.localStorage.clear();
            history.push('/');
        }

    }


    useEffect(() => {
        verifyUser();
    }, [])


    const logout = () => {
        window.localStorage.clear();
        history.push('/');
    }

    const navigation = (link) => {
        history.push(`/${link}`);
    }

    const [childrenVisible, setChildrenVisible] = useState(false);

    const handleNavClick = () => {
        setChildrenVisible(!childrenVisible);
    };

    const handleLinkClick = (route) => (e) => {
        e.stopPropagation(); // Stop the event propagation
        navigation(route);
    };

    return (
        <>
            <div className={"sidebarBox"}>
                <div className="navParent elogo">
                    <Image src={logo} className="enteroLogo" alt="" onClick={notifyMe} />
                </div>

                <div className="navParent">
                    <Nav defaultActiveKey="/" className="flex-column myNav" id="flex-nav">
                        <Nav.Link className={`${['Dashboard', 'DuePayment', 'Allocation'].some(substring => location.pathname.includes(substring)) && 'active'}`} onClick={() => navigation('Dashboard')}>
                            <span className="fa fa-home mr-3"></span> Dashboard
                        </Nav.Link>


                        <Nav.Link
                            className={`${['Admin', 'Marketers', 'Marketer-Details', 'Client-Details', 'Clients'].some(substring => location.pathname.includes(substring)) && 'active'}`}
                            onClick={handleNavClick}>
                            <span className="fa fa-users mr-3"></span> Administration
                        </Nav.Link>
                        {childrenVisible && (
                            <div className="children">
                                {state.profile.role === 'admin' && (
                                    <div className='drop-down-nav'>
                                        <div className="iconDiv">
                                            {(location.pathname === '/Admin') ? <DropDownActiveArrow /> : <DropDownArrow />}
                                            <AdminIcon />
                                        </div>
                                        <Link className={`${(location.pathname === '/Admin') && 'active-nav'}`} onClick={handleLinkClick('Admin')}>Admins</Link>
                                    </div>
                                )}
                                {(state.profile.role === 'admin' || state.profile.permission === 'marketers') && (
                                    <div className='drop-down-nav'>
                                        <div className="iconDiv">
                                            {(location.pathname === '/Marketers') ? <DropDownActiveArrow /> : <DropDownArrow />}
                                            <AdminIcon />
                                        </div>
                                        <Link className={`${(location.pathname === '/Marketers') && 'active-nav'}`} onClick={() => navigation('Marketers')}>Marketers</Link>
                                    </div>
                                )}

                                {(state.profile.role === 'admin' || state.profile.permission === 'clients') && (
                                    <div className='drop-down-nav'>
                                        <div className="iconDiv">
                                            {(location.pathname === '/Clients') ? <DropDownActiveArrow /> : <DropDownArrow />}
                                            <AdminIcon />
                                        </div>
                                        <Link className={`${(location.pathname === '/Clients') && 'active-nav'}`} onClick={() => navigation('Clients')}>Clients</Link>
                                    </div>

                                )}
                            </div>
                        )
                        }



                        {(state.profile.role === 'admin' || state.profile.permission === 'documents') && (
                            <Nav.Link onClick={() => navigation('Documents')} eventKey="link-3" className={`${(location.pathname.includes('Document')) && 'active'}`}>
                                <span className="fa fa-file-alt mr-3"></span> Documents
                            </Nav.Link>
                        )}

                        {state.profile.role === 'admin' && (
                            <Nav.Link onClick={() => navigation('Commissions')} eventKey="link-6" className={`${(location.pathname === '/Commissions') && 'active'}`}>
                                <span className="fa fa-coins mr-3"></span> Commissions
                            </Nav.Link>
                        )}
                        {state.profile.role === 'admin' && (
                            <Nav.Link onClick={() => navigation('Estates')} eventKey="link-4" className={`${(location.pathname.includes('Estate')) && 'active'}`}>
                                <span className="fa fa-landmark mr-3"></span> Estaes/Layouts
                            </Nav.Link>
                        )}


                        <Nav.Link onClick={() => navigation('Interest-Form')} eventKey="link-8" className={`${(location.pathname === '/Interest-Form') && 'active'}`}>
                            <span className="fa fa-landmark mr-3"></span> Interest Form
                        </Nav.Link>

                        <Nav.Link onClick={logout}>
                            <span className="fa fa-sign-out-alt mr-3"></span> Logout
                        </Nav.Link>
                    </Nav>
                </div>

                <div className="navParent">

                    <div className="LoginProf">
                        <div className="userDataOne">
                            <Image
                                // crossorigin="anonymous"
                                src={`${configData.PIC_URL}/${state.profile.profImage}`} className="useDataImg" alt="" />
                            <div className="userDataName">
                                <span className='profName'> {state.profile.fullName}</span>
                                <span className='profPosition'> {state.profile.position}</span>
                            </div>
                            <EditProfile />
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Sidebar;
