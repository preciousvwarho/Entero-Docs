
import React, {useState, useContext, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image } from 'react-bootstrap';
import { MdSupervisorAccount, MdOutlineAccountBox } from "react-icons/md";
import configData from "../../config.json";
import { Context } from '../../Store';
import { FaRegEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";

const EditProfile = () => {

    const { register, handleSubmit, reset, errors } = useForm();
    const [show, setShow] = useState(false);
    const [state] = useContext(Context);
    const [page, setPage] = useState(true);
    const [message, setMessage] = useState('');
    const [disablebtn, setDisablebtn] = useState(false);

  const updatePassword = async(data) => {

    // setDisablebtn(true);
    // return
    
      try {

        return fetch(`${configData.SERVER_URL}/admin/update/password`, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-auth-token":  window.localStorage.getItem("token")
            },
            body: JSON.stringify({    
                oldPassword:data.oldPassword, 
                newPassword:data.newPassword 
            })
            })
            .then((response) => response.json())
            .then((responseJson) => {
            console.log(responseJson)
            setDisablebtn(false);
                if(responseJson.status === "success"){
                    setMessage(responseJson.message);
                    reset();
                    // alert(responseJson.message);
                }
                if (responseJson.status === "error") {
                    setDisablebtn(false);
                    // alert(responseJson.message);
                    setMessage(responseJson.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });

      } catch (error) {
        console.error('Error:', error);
      }
  }

    return (
        <>

            <FaRegEdit className="editProfIcon" style={{cursor:"pointer"}}  onClick={() => setShow(true)}/>


      <Modal
        show={show}
        size="lg"
        // fullscreen={fullscreen}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="mx-5" closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Profile Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">

        <div className='profBox'>

            <div className='settingBox' onClick={() => setPage(true)}>
                <div className='profIconBox'>
                <MdSupervisorAccount style={{fontSize:"28px"}}/>
                </div>
                <div className='profTextBox'>
                   <span>Profile</span>
                </div>

            </div>

            <div className='settingBox' onClick={() => setPage(false)}>
                <div className='profIconBox'>
                <MdOutlineAccountBox style={{fontSize:"28px"}}/>
                </div>
                <div className='profTextBox'>
                   <span>Change Password</span>
                </div>
            </div>


         </div>
     
     {page ? <>
         <div className=''>
                <div className='userProfDisplay'>

                    <div className="user-details">

                            <Image  
                            // crossorigin="anonymous"
                             src={`${configData.PIC_URL}/${state.profile?.profImage}`} className="useDataImg2" alt="" />
                            <div className="userDataName">
                            <span>{state.profile?.fullName}</span>
                            <span>{state.profile?.email}</span>
                            </div>

                    </div>

                    <div className="profInfo">
                        <h4>Information</h4>

                        <div className="profInfoData">

                            <div className="profData">
                                <span>Full Name</span>
                                <span>{state.profile?.fullName}</span>
                            </div>

                            
                            <div className="profData">
                                <span>Sex</span>
                                <span>{state.profile?.sex}</span>
                            </div>
                            
                            <div className="profData">
                                <span>Email</span>
                                <span>{state.profile?.email}</span>
                            </div>

                            <div className="profData">
                                <span>Phone</span>
                                <span>{state.profile?.phoneNumber}</span>
                            </div>
                            
                            <div className="profData">
                                <span>Permission Type</span>
                                <span>{state.profile?.role}</span>
                            </div>
                            
                            <div className="profData">
                                <span>Position</span>
                                <span>{state.profile?.position}</span>
                            </div>
                        </div>
                    </div>

                </div> 
         </div>
         </> :<>

         <div className="profForm">
            <form onSubmit={handleSubmit(updatePassword)} className="pt-3"  enctype="multipart/form-data" id="submit">
                
                <small style={{color: 'red', paddingBottom: '10px'}}>{message.length > 0 ? (message) : (null)}</small>

                    <div className="col-md">
                        <div className="form-floating mt-3">
                            <input placeholder="Old Password" type="password" className="h-auto form-control " name="oldPassword" ref={register({ required: true })} />
                            {errors.email && <span className="alert alert-danger" role="alert">Old Password Required</span>}
                            <label for="floatingInput">Old Password</label>
                            </div>

                            </div>

                    <div className="col-md">
                        <div className="form-floating mt-3">
                            <input placeholder="Password" type="password" className="h-auto form-control " name="newPassword" ref={register({ required: true })} />
                            {errors.email && <span className="alert alert-danger" role="alert">New Password Required</span>}
                            <label for="floatingInput">New Password</label>
                            </div>

                            </div>

             <div className="col-md mt-4 mb-5">     
                {disablebtn ? (<><span style={{float: 'right'}}>Updating password...</span> </>) : (<>
                    <Button className="float-end" variant="primary"  type="submit" disabled={disablebtn}>Update Password
                    </Button>
                 </>)}
              </div>

                </form>

         </div>
         </> }
         
        </Modal.Body>
      </Modal>
                        
        </>
    );
};

export default EditProfile;