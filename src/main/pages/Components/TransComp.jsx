import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image} from 'react-bootstrap';
import { NumericFormat }  from 'react-number-format';
import { format } from 'date-fns';
import configData from "../../../config.json";
import { useHistory } from "react-router-dom";


const TransComp = (props) => {
    const history = useHistory();
    const {trans} = props;
       
    const navigate = (data) => {
        history.push({
            pathname: `/Document-Details/${data?._id}`,
            state: { data: data },
          });
    }

    return (
        <>

               <table className="table table-image">
                        {trans.length > 0 &&
                                <thead>
                                    <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Client Name</th>
                                    <th scope="col">Estate/Layout</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Status</th>
                                    </tr>
                                </thead>
                            }
                        
                                <tbody>
                        
                {trans && trans.length > 0
                    ?  trans.map((t, index) => {
                    return <>
                    <tr className="tr" key={index + 1} onClick={()=> navigate(t)}>
                    <td>
                    <Image  crossorigin="anonymous" src={`${configData.PIC_URL}/${t?.clientId?.passport}`} className="img-fluid tableImg" alt="user"/>
                    </td>
                    <td>{t?.clientId?.fullName}</td>
                    <td>{t?.estateId?.name}</td>
                                    
                        <NumericFormat value={t?.amount} displayType={'text'} thousandSeparator={true} prefix={"₦"} renderText={text => <td>{text}</td>}/>

                    <td>{format(new Date(t?.dateOfPurchase), 'MMMM, do, yyy')}</td>
                    <td>
                        <span className={t?.paymentStatus === 'success' ? "completed" : "pendingStatus" }>{t?.paymentStatus === 'success' ? "completed" : "pending" }</span>
                        
                        </td>
                    </tr>
    
                    </>})
                        : <div className="col-12 py-5 w-100 d-flex justify-content-center align-items-center"> 
                                <h6 className="text-center">No transaction found</h6>
                                        
                            </div>}
                                </tbody>

                            </table>  
            
        </>
    );
};

export default TransComp;