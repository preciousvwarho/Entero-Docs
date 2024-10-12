import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Modal, Button } from 'react-bootstrap';
import { NumericFormat }  from 'react-number-format';
import NumberFormat from 'react-number-format';
import { format } from 'date-fns';
import configData from "../../../config.json";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const CommissionComp = (props) => {
    const history = useHistory();
    const {commission} = props;
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [displayAcc, setDisplayAcc] = useState(false);
    // console.log(commission)
  
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const showCom = (data) => {
          setData(data);
          handleShow();
       }
           
       const navigate = (data) => {
        history.push({
            pathname: `/Document-Details/${data?._id}`,
            state: { data: data },
          });
       }

       const paidCommissions = async(data) => {
           
        if (!window.confirm("are you sure commission has been paid?")) {
            return
          }
            

    try {
        const response = await fetch(`${configData.TEST_URL}/commission/marketer/paid/${data?._id}`, {
        method: "put",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": window.localStorage.getItem("token") 
        },
        });
        const responseJson = await response.json();

        if (responseJson.status === "success") {
            setisBtnLoading(false);
            alert(responseJson.message);
            handleClose();
            window.location.reload(); 
        }
        if (responseJson.status === "error") {
            setisBtnLoading(false);
            alert(responseJson.message);
        }
    } catch (error) {
            setisBtnLoading(false);
            console.error(error);
    }
       }

       const rejectCommissions = async(data) => {
           
            if (!window.confirm("are you sure you want to reject this requet?")) {
                return
            }
                        

            try {
                const response = await fetch(`${configData.SERVER_URL}/commission/marketer/reject/${data?._id}`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-auth-token": window.localStorage.getItem("token") 
                },
                });
                const responseJson = await response.json();

                if (responseJson.status === "success") {
                    setisBtnLoading(false);
                    toast.success(responseJson.message);
                    handleClose();
                    window.location.reload(); 
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

            
            <table className="table table-image">
                    {commission.length > 0 &&
                        <thead>
                            <tr>
                            <th scope="col"></th>
                            <th scope="col">Requested by</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Request type</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                            </tr>
                        </thead>
                        }
                
                        <tbody>
                
                        {commission && commission.length > 0
                            ?  commission.map((c, index) => {
                            return <>
                            <tr onClick={()=>showCom(c)} key={index + 1} className="tr">
                            <td>
                                <Image crossorigin="anonymous" src={`${configData.PIC_URL}/${c?.requesterId?.profImage}`} className="img-fluid tableImg" alt="user"/>
                            </td>
                             
                             <td>{c?.requesterId.fullName}</td>

                            <NumericFormat value={c?.commission} displayType={'text'} thousandSeparator={true} prefix={"₦"} renderText={text => <td>{text}</td>}/>

                             <td>{c?.requestType === 'refCommision' ? 'Referial Commission' : 'My Commission'}</td>

                            <td>{format(new Date(c?.createdAt), 'MMMM, do, yyy')}</td>

                            <td>
                            <span className={c?.status === 'paid' ? "completed" : (c?.status === 'rejected' ? "rejectedStatus" : "pendingStatus")}>{c?.status}</span>
                                </td>
                            </tr>
                            
                            </>})
                            : <div className="col-md-12 w-100 text-center mt-5"> 
                
                                <h6>No commission requested yet</h6>
                                
                                </div>}
                        </tbody>

                    </table>  


    <Modal show={show} onHide={handleClose}>

            <Modal.Body>

                <div className="modal-body my-4">

                
                <div className="dueParent">
                                    {/* <img src={`${configData.PIC_URL}/`} className="img-fluid perfImg" alt="user"/> */}
                                    <span className="perfName">Client: {data?.docId?.clientId?.fullName}</span>
                                    <div className="view-more">
                                        <span>Refered by: {data?.docId?.marketerId?.fullName}</span>
                                    </div>
                                    <div className="view-acc">
                                        <span  onClick={()=> setDisplayAcc(!displayAcc)}>view account details</span>
                                    </div>
                            {displayAcc &&
                                <div className="profInfo">
                                    <div className="profInfoData">
                                        <div className="profData">
                                            <span>Account Name</span>
                                            <span>{data?.requesterId?.accountName}</span>
                                        </div>
                                        <div className="profData">
                                            <span>Account Number</span>
                                            <span>{data?.requesterId?.accountNumber}</span>
                                        </div>
                                        <div className="profData">
                                            <span>Bank Name</span>
                                            <span>{data?.requesterId?.bankName}</span>
                                        </div>
                                    </div>
                                </div>
                            }


                                <div className="profInfo">

                                    <div className="profInfoData">
                                        <div className="profData">
                                            <span>Commission type</span>
                                            <span>{data?.requestType === 'refCommision' ? 'Refereer Commission' : 'My Commission'}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Estate</span>
                                            <span>{data.docId?.estateId?.name}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Property Price</span>
                                            <NumericFormat value={data.docId?.amount} displayType={'text'} thousandSeparator={true} renderText={text => <span className="">{text}</span>} />
                                        </div>
                                        
                                        <div className="profData">
                                            <span>Payment Plan</span>
                                            <span>{data.docId?.paymentPlan}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Requested by</span>
                                            <span>{data?.requesterId?.fullName}</span>
                                        </div>
                                        
                                        <div className="profData">
                                            <span>Commission</span>
                                            <NumericFormat value={data?.commission} displayType={'text'} thousandSeparator={true} renderText={text => <span className="">{text}</span>} />
                                        </div>

                                        <div className="profData">
                                            <span>Commission Status</span>
                                            <span>{data?.status}</span>
                                        </div>


                                        {data?.status === 'success' || data?.status === 'rejected' && 
                                                <div className="profData">
                                                    <span>Date {data?.status}</span>
                                                    <span>{format(new Date(data?.dateOfPayment), 'MMMM, do, yyy')}</span>
                                                </div>
                                        }

                                    <div className="view-more">
                                        <span  onClick={()=> navigate(data.docId)}>view more</span>
                                    </div>
                                {data?.status === 'pending' && 
                                    <div className="d-flex mt-4" style={{float:'right'}}>
                                        <Button onClick={()=> rejectCommissions(data)} variant="secondary" size="sm">Reject</Button>

                                        <Button  onClick={()=> paidCommissions(data)} variant="primary" size="sm">Paid</Button>

                                    </div>
                            }


                                    </div>
                                </div>
                                
                            </div>


                </div>



            </Modal.Body>
      </Modal>




            
        </>
    );
};

export default CommissionComp;