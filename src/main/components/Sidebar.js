
import React, {useState, useContext, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Nav } from 'react-bootstrap';
import { useHistory, useLocation } from "react-router-dom";
import configData from "../../config.json";

function Sidebar () {
    const location = useLocation();
    console.log(location.pathname);
    const history = useHistory();
    const [navLink, setNavLink] = useState('');

    useEffect(() => {

        const url =   window.location.href;
        if(url === `${configData.WEB_URL}/Dashboard`){
            window.localStorage.setItem('navLink', 'Dashboard');
            const nav =  window.localStorage.getItem("navLink");
            setNavLink(nav);
        }
        if(url === `${configData.WEB_URL}/Admin`){
            window.localStorage.setItem('navLink', 'Admin');
            const nav =  window.localStorage.getItem("navLink");
            setNavLink(nav);
        }
        if(url === `${configData.WEB_URL}/Documents`){
            window.localStorage.setItem('navLink', 'Documents');
            const nav =  window.localStorage.getItem("navLink");
            setNavLink(nav);
        }
        if(url === `${configData.WEB_URL}/Estates`){
            window.localStorage.setItem('navLink', 'Estates');
            const nav =  window.localStorage.getItem("navLink");
            setNavLink(nav);
        }
        if(url === `${configData.WEB_URL}/Business-Developer`){
            window.localStorage.setItem('navLink', 'Business-Developer');
            const nav =  window.localStorage.getItem("navLink");
            setNavLink(nav);
        }
        // if(url === `${configData.WEB_URL}/Business-Developer/1`){
        //     window.localStorage.setItem('navLink', 'Business-Developer/1');
        //     const nav =  window.localStorage.getItem("navLink");
        //     setNavLink(nav);
        // }
    },[])

    const logout = () => {
        window.localStorage.clear();
        history.push('/');

    }

    const navigation = (link) => {
        history.push(`/${link}`);
    }
    
        return (
            <>

           <Col className="pt-5" lg="12"></Col>
           <Col className="pt-4" lg="12">
                <Nav defaultActiveKey="/" className="flex-column myNav" id="flex-nav">
                    <Nav.Link eventKey="link-1"  className={ `${(location.pathname === '/Dashboard') && 'active'}` } onClick={()=> navigation('Dashboard')}>
                        <span className="fa fa-home mr-3"></span> Dashboard
                    </Nav.Link>
                    <Nav.Link onClick={()=> navigation('Admin')} eventKey="link-2" className={ `${(location.pathname === '/Admin') && 'active'}` }>
                        <span className="fa fa-users mr-3"></span> Admin
                    </Nav.Link>
                    <Nav.Link onClick={()=> navigation('Documents')}  eventKey="link-3" className={ `${(location.pathname === '/Documents') && 'active'}` }>
                        <span className="fa fa-file-alt mr-3"></span> Documents
                      </Nav.Link>
                    <Nav.Link onClick={()=> navigation('Estates')}  eventKey="link-4" className={ `${(location.pathname === '/Estates') && 'active'}` }>
                        <span className="fa fa-landmark mr-3"></span> Estates
                      </Nav.Link>
                    <Nav.Link onClick={()=> navigation('Business-Developer')} eventKey="link-5" className={ `${(location.pathname === '/Business-Developer') && 'active'}` }>
                        <span className="fa fa-user mr-3"></span> Business Developers
                      </Nav.Link>
                    <Nav.Link onClick={()=> navigation('Interest-Form')} eventKey="link-6" className={ `${(location.pathname === '/Interest-Form') && 'active'}` }>
                        <span className="fa fa-landmark mr-3"></span> Interest Form
                      </Nav.Link>
                </Nav>
            </Col>
           <Col className="pt-5" lg="12">
                    <Nav.Link eventKey="link-3" onClick={logout}>
                        <span className="fa fa-sign-out-alt mr-3"></span> Logout
                    </Nav.Link>
                        </Col>
                
            </>
        );
}

export default Sidebar;
