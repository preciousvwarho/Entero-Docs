import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Modal, Button } from 'react-bootstrap';
import configData from "../../../config.json";
import { useHistory } from "react-router-dom";

const Refereer = (props) => {
    const history = useHistory();
    const {refMarketers} = props;

    const navigate = (data) => {
        history.push({
          pathname: `/Marketer-Details/${data._id}`,
          state: { data: data },
        });
        window.location.reload();
    }

    return (
        <>

                       <table className="table table-image">
                                <thead>
                                    <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Email</th>
                                    </tr>
                                </thead>
                        
                                <tbody>
                        
                                    {refMarketers && refMarketers.length > 0
                                        ?  refMarketers.map((m, index) => {
                                        return <>
                                        <tr key={index + 1}  onClick={()=> navigate(m)} className="tr">
                                        <td>
                                            <img 
                                            // crossorigin="anonymous"
                                             src={`${configData.PIC_URL}/${m.profImage}`} className="img-fluid tableImg" alt="user"/>
                                        </td>
                                        <td>{m.fullName}</td>
                                        <td>{m.phoneNumber}</td>
                                        <td>{m.email}</td>
                                        </tr>
                                        
                                        </>})
                                        : <div className="col-md-12"> 
                            
                                            <h6>No Referial found</h6>
                                            
                                            </div>}

                              </tbody>

                    </table>  
                                            
            
        </>
    );
};

export default Refereer;