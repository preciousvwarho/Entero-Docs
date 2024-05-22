import React from 'react';
import Sidebar from './components/Sidebar';
import NavToggle from './components/NavToggle';
import { Col } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import GoToTop from '../GoToTop';

const Layout = ({children}) => {


    
    return (
        
        <div className='contain'>

            <div className="sidebar" id="sideBar">
                <Sidebar/>
            </div>

            <div className="main" id="mainBg">
                  <Col lg="12">
                      <NavToggle/>

                    <ToastContainer
                        toastStyle={{
                        zIndex: "9999 !important",
                        }}
                    />
                    </Col>

                   {children}

             </div>

          {/* <GoToTop/> */}

        </div>

             
            
    );
};

export default Layout;