
import React, {useState, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import { Row, Col } from 'react-bootstrap';
import { useForm } from "react-hook-form";

function AddDocument() {
    const [show, setShow] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();
    const [isBtnLoading, setisBtnLoading] = useState(false);
  
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const documentDetails = () =>{
        // alert("documentDetails")
        window.location = window.location.origin + "/Document-Details";
    }


    const addDoc = (data) => {
      
      setisBtnLoading(true)
  
      return fetch(`/admin`, {
          method: "post",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-auth-token":  window.localStorage.getItem("token")
          },
          body: JSON.stringify({ 
            fullName:data.fullName,
            address:data.address,
            email:data.email,
            phone:data.phone,
            property:data.property,
            amount:data.amount,
            amountPaid:data.amountPaid,
            isPaymentComplete:data.isPaymentComplete,
            plots:data.plots,
            datePurchased:data.  datePurchased    
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {
  
          if(responseJson.status === "success"){
              setisBtnLoading(false)
              alert(responseJson.message);
          }
          if (responseJson.status === "error") {
              setisBtnLoading(false)
              alert(responseJson.message);
          }
      })
      .catch((error) => {
          setisBtnLoading(false)
          console.error(error);
      });
  
     }
  

     
  return (
    <>
    
    <div className="contain">

        <div className="sidebar" id="sideBar">
             <Sidebar/>
        </div>
        <div className="main" id="mainBg"> 
         
           <Col lg="12">

                <Row>

                <form onSubmit={handleSubmit(addDoc)} className="pt-3  needs-validation"   enctype="multipart/form-data" id="submit" novalidate>
                    <Col lg="12">
                        <Row>
                            <Col lg="9">
                            <span class="backBg"> 
                              <i class="fa fa-long-arrow-alt-left"></i>
                              </span>
                              <span class="h4"> Add Document</span>
                            </Col>
                            <Col lg="3">
                            </Col>
                            <Col lg="12">


                                <Row>

                                                
                                    <Col lg="12"></Col>
                                        {/* <Col lg="2"></Col> */}
                                        <Col lg="10" className="white-card">
                                            <h5 className="mt-4">Clients Details</h5>

                                         <div className="form-floating mt-3">
                                            <input placeholder="Full Name" type="text" className="h-auto form-control" id="floatingInput" name="fullName"  ref={register({ required: true, })} required/>
                                            <label for="floatingInput">Full Name</label>
                                            <div class="invalid-feedback">
                                                Please choose a username.
                                            </div>
                                                {errors.fullName && <div className="alert alert-danger" role="alert">Full Name Required</div>}
                                            </div>

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                                <input placeholder="Email" type="email" className="h-auto form-control " name="email"  ref={register({ required: true, })} />
                                                <label for="floatingInput">Email address</label>
                                                    {errors.email && <div className="alert alert-danger" role="alert">Email Required</div>}
                                            </div>
                                     </div>

                                     <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input placeholder="Phone Number" type="tel" className="h-auto form-control " name="phone"  ref={register({ required: true, })} />
                                            <label for="floatingInput">Phone Number</label>
                                                {errors.phone && <div className="alert alert-danger" role="alert">Phone Number Required</div>}
                                            </div>
                                     </div>

                                    </div>

                                  

                                        <div className="mt-3 form-floating">
                                            <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" name="address"  style={{height: "100px"}}   ref={register({ required: true, })}/>
                                            <label for="floatingTextarea2">Address</label>
                                            {errors.address && <div className="alert alert-danger" role="alert">Address Required</div>}

                                        </div>

                                          </Col>

                                          <Col lg="2"></Col>




                                    </Row>
                                
                            </Col>


                            <Col lg="12">
                                <Row className="mt-5">
                                    <Col lg="10" className="white-card">
                                        <h5>Estate Details</h5>  

                                        <div className="form-floating mt-3">
                                            <select className="form-select" id="floatingSelect" aria-label="select Property" name="property" ref={register({ required: true })}>
                                                <option selected>Click to select Estate</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                                </select>
                                           <label for="floatingSelect">Select Property</label>
                                            </div>
                                          
                                          
                                <div className="row g-2">
                                    <div className="col-md">
                                                                                                                       <div className="form-floating mt-3">
                                            <input placeholder="Number of Plots" type="number" className="h-auto form-control " name="plots"  ref={register({ required: true, })} />
                                            <label for="floatingInput">Number of Plots</label>
                                                {errors.plots && <div className="alert alert-danger" role="alert">Number of plots Required</div>}

                                         </div>

                                        </div>

                                    <div className="col-md">
                                        <div className="form-floating mt-3">
                                            <input type="date" className="h-auto form-control " name="datePurchased"  ref={register({ required: true, })} />
                                                <label className=" mb-2" for="exampleFormControlSelect1">Date Purchased</label>
                                         </div>
                                      </div> 

                            </div>

                                            <div className="mb-3 mt-3 form-check">
                                                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                                <label className="form-check-label" for="exampleCheck1">Is Payment Complete</label>
                                            </div>

                                            {/* <div className="input-group mt-3">
                                                <span className="input-group-text">#</span>
                                                <input type="number" placeholder="Amount Paid" className="form-control" name='amountPaid' aria-label="Naira amount"/>
                                            </div> */}
                                                                                                                             <div className="mt-4" style={{textAlign: 'right'}}>
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>

                                    </Col>
                                    <Col lg="2">
                                      {/* <p className="btn-add" onClick={handleShow}>Add File</p> */}
                                    </Col>
                                 </Row>
                            </Col>

                            
                         </Row>
                    </Col>
                    <Col lg="4"></Col>

                    </form>

                </Row>

                

           </Col>



                
        </div>

    </div>



    </>
  );
}

export default AddDocument;
