
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { format } from 'date-fns'
import { NumericFormat }  from 'react-number-format';
import configData from "../../config.json";
import Layout from '../Layout';
import { ThreeDots } from 'react-loader-spinner'

const DuePayment = () => {
    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [docs, setDocs] = useState([]);
    const [data, setData] = useState([]);
    const [payments, setPayments] = useState([]);


    const handleClose = () => setShow(false);
    const handleShow = (d) => {
        setData(d);
        getPayment(d._id);
        setIsReady(true);
        setShow(true);
    }



  const getDocs = async() => {
    try {
        setisBtnLoading(true);
        return fetch(`${configData.SERVER_URL}/document/due-documents`, {
            method: "get",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-auth-token":  window.localStorage.getItem("token")
            },
          })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                setDocs(responseJson.data);
                setisBtnLoading(false)
            })
            .catch((error) => {
              console.error(error);
            });
    
        } catch (error) {
             console.log(error);
        }
  }


   
  const getPayment = async(id) => {
    setisBtnLoading(true);
            
    return fetch(`${configData.SERVER_URL}/document/payment/${id}`, {
        method: "get",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token":  window.localStorage.getItem("token")
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson.data)
            setPayments(responseJson.data);
            setisBtnLoading(false)
        })
        .catch((error) => {
        console.error(error);
        });   
   }


  useEffect(() => {
    getDocs();
  },[])
       
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);




    return (
        <>
        <Layout>
    
          <div className="mainBox">

               <div className='mBoxOne' style={{width: '100vw'}}>

                    <div className="heading-section">
                     <div className="navSection">
                      <span className="inactiveText">Dashboard</span>
                      <span className="activeArrow">{">"}</span>
                        <span className="activeText">Due Payment</span>
                        </div>

                        {/* <div class="form-group has-search" style={{width:"30%"}}>
                                <div className="col-md-12 mx-auto">
                                    <div className="input-group">
                                        <input className="form-control border rounded-pill" placeholder="Search documents with clients name" type="search"  id="example-search-input"/>
                                    </div>
                                </div>
                        </div> */}

                    </div>


                    <div className="estContent">



                    <div className="mt-5">

    {isBtnLoading ?<>
        <div className="d-flex  justify-content-center align-items-center w-100 mt-5">
                <ThreeDots
                    visible={true}
                    height="50"
                    width="50"
                    color="#0b9967"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""/>
        </div>
        </> :<>
                        <div className="tranHeader">
                            <span>Documents</span>
                            <span>{docs.length} record{docs.length > 1 && 's'}</span>
                        </div>


                        <div className='docList'>
                          <div class="col-12 mt-3">
                            <table className="table table-image">
                            <thead>
                            <tr>
                            <th scope="col">Client Name</th>
                            <th scope="col">Estate/Layout</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Payment Plan</th>
                            <th scope="col">Date Of Purchase</th>
                            </tr>
                            </thead>

                            <tbody>

                     {docs && docs.length > 0
                            ?  docs.map((data, index) => {
                            return <>

                            <tr key={index + 1} onClick={()=> handleShow(data)} className="tr">

                            <td>{data?.clientId?.fullName}</td>
                            <td>{data?.estateId?.name}</td>
                            <NumericFormat value={(data?.amount)} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <td>{text}</td>} />
                            <td>{data?.paymentPlan}</td>
                            <td>{format(new Date(data?.dateOfPurchase), 'do MMM yy')} </td>
                            
                            </tr>

                            </>})
                            : <div className="col-md-12"> 

                            <h6>No record found</h6>

                            </div>}
                            </tbody>

                            </table>  

                          </div>
                        </div>

        </>}
                    </div>




                    </div>
                 </div>
    
            </div>
    
        </Layout>



    <Modal show={show} onHide={handleClose}>

<Modal.Body>

    <div className="modal-body my-4">

       {isBtnLoading ?<>
        <div className="dueParent">
        <ThreeDots
            visible={true}
            height="50"
            width="50"
            color="#0b9967"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
            />
        </div>
        </> :

        <div className="dueParent">
                        {/* <img src={`${configData.PIC_URL}/`} className="img-fluid perfImg" alt="user"/> */}
                        <span className="perfName">Client: {data?.clientId?.fullName}</span>
                        <span className="perfName">{data?.clientId?.phoneNumber}</span>


                    <div className="profInfo">

                        <div className="profInfoData">

                            <div className="profData">
                                <span>Estate</span>
                                <span>{data.estateId?.name}</span>
                            </div>

                            <div className="profData">
                                <span>Property Price</span>
                                <NumericFormat value={data?.amount} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span className="">{text}</span>} />
                            </div>
                            
                            <div className="profData">
                            <span>Balance</span>
                            <NumericFormat value={(data?.amount) - totalAmount} displayType={'text'} thousandSeparator={true} prefix={'₦ '} renderText={text => <span>{text}</span>} />
                            </div>
                            <div className="profData">
                                <span>Last Payment Date</span>
                                <span>{format(isReady ? new Date(data?.lastPaymentDate) : new Date(), 'do MMM yy')}</span>
                            </div>
                            
                            <div className="profData">
                                <span>Payment Plan</span>
                                <span>{data?.paymentPlan}</span>
                            </div>

                            <div className="profData">
                                <span>Payment Status</span>
                                <span>{data?.paymentStatus}</span>
                            </div>

                    {data?.status === 'pending' && 
                          <div className="d-flex mt-4" style={{float:'right'}}>
                               <Button variant="secondary" size="sm">close</Button>

                               <Button variant="primary" size="sm">Called</Button>

                          </div>
                   }


                        </div>
                    </div>
                    
                </div>

           }


    </div>



</Modal.Body>
</Modal>


            
        </>
    );
};

export default DuePayment;