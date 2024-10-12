import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import configData from "../../config.json";
import Layout from '../Layout';
import { RightArrow } from './svg/Svg';
import { ThreeDots, ColorRing } from 'react-loader-spinner';
import { toast } from "react-toastify";

import io from 'socket.io-client';
const socket = io("http://localhost:9001");

function Admin() {


  useEffect(() => {
    socket.on('admin-activity', (data) => {
      getAdmin();
    });

    return () => {
      socket.off('admin-activity');
    };
  }, []);

  const [page, setPage] = useState("all");
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [adminData, setAdmiData] = useState([]);
  const [admin, setAdmin] = useState([])
  const [admData, setAdmData] = useState([])
  const { register, handleSubmit,
    reset, setValue, errors } = useForm();
  const [isBtnLoading, setisBtnLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleTwoClose = () => setShowTwo(false);
  const handleTwoShow = (data) => {
    setIsAdminSelected(data?.role);
    setShowTwo(true);
  }

  const [selectedPermission, setSelectedPermission] = useState(null);

  const handlePermissionChange = (event) => {
    setSelectedPermission(event.target.value);
  };

  const [isAdminSelected, setIsAdminSelected] = useState('admin');

  const handleRoleChange = (e) => {
    setIsAdminSelected(e.target.value);
  };


  const adminAdd = async (data) => {

    const formData = new FormData();

    formData.append('profImage', data.profImage[0]);
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('sex', data.sex);
    formData.append('role', data.role);
    formData.append('position', data.position)
    { data.role !== 'admin' && formData.append('permission', data.permission) }
    { data.role !== 'admin' && formData.append('permissionType', data.permissionType) }

    for (let pair of formData.entries()) {
      const [key, value] = pair;
      console.log(`${key}: ${value}`);
    }

    setisBtnLoading(true)

    try {

      return fetch(`${configData.TEST_URL}/admin/addAdmin`, {
        method: "post",
        headers: {
          "x-auth-token": window.localStorage.getItem("token")
        },
        body: formData
      })
        .then((response) => response.json())
        .then((responseJson) => {

          console.log(responseJson);

          if (responseJson.status === "success") {
            setisBtnLoading(false);
            reset();
            handleClose();
            toast.success(responseJson.message);
          }
          if (responseJson.status === "error") {
            setisBtnLoading(false);
            toast.error(responseJson.message);
          }
        })
        .catch((error) => {
          setisBtnLoading(false)
          console.error(error);
        });

    } catch (error) {
      setisBtnLoading(false);
      console.error(error);
    }

  }

   const getAdmin = async () => {
   try {
    setIsPageLoading(true);
    setPage('all')
        const response = await axios.get(`${configData.SERVER_URL}/admin/getAllAdmin`, {
          headers: {
            "x-auth-token":  window.localStorage.getItem("token")
          }
        });
        setAdmin(response.data.data);
        setAdmData(response.data.data);
        setIsPageLoading(false);
   } catch (error) {
       console.log(error);
   }

   }

  // const [limit, setLimit] = useState(20); // The limit of data per request
  // const [offSet, setOffSet] = useState(0); // The current offset
  // const [hasMoreData, setHasMoreData] = useState(true); // If there's more data to load\

  // const getAdmin = async () => {
  //   if (!hasMoreData) return; // Stop fetching if no more data

  //   try {
  //     setIsPageLoading(true);

  //     console.log(`Loading`);

  //     const response = await axios.get(
  //       `${configData.SERVER_URL}/admin/getAllAdmin?limit=${limit}&offSet=${offSet}`,
  //       {
  //         headers: {
  //           "x-auth-token": window.localStorage.getItem("token"),
  //         },
  //       }
  //     );

  //     const newData = response.data.data;

  //     // If we receive less data than the limit, there's no more data to load
  //     if (newData.length < limit) {
  //       setHasMoreData(false);
  //     }

  //     // Append new data to the existing data
  //       setAdmin(oldData => [...oldData, ...newData]);
  // //       setAdmData(response.data.data);
  //     // setAdminData(oldData => [...oldData, ...newData]);

  //     // Increment the offset by the limit
  //     setOffSet(prevOffSet => prevOffSet + limit);

  //     setIsPageLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setIsPageLoading(false);
  //   }
  // };

  // const handleScroll = (e) => {
  //   console.log(`1`);
  //   if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight) {

  //     console.log(`2`);
  //     getAdmin()

  //   }

  // }


  useEffect(() => {
    getAdmin();
   // window.addEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    if (adminData && adminData.permissionType) {
      const defaultTypes = [adminData.permissionType];
      const newArray = defaultTypes[0].split(',');
      setPermissionTypes(newArray);
    }
  }, [adminData]);


  const [permissionTypes, setPermissionTypes] = useState([]);

  const handlePermissionTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      const valuesToAdd = value.split(', ');
      setPermissionTypes(prevTypes => [...prevTypes, ...valuesToAdd]);
    } else {
      console.log(permissionTypes)
      const newValue = value.split(', ');
      setPermissionTypes(prevTypes => prevTypes.filter(type => {
        // Check if any element of newValue is included in type
        return !newValue.some(value => type.includes(value));
      }));
    }
  };

  useEffect(() => {
    console.log(permissionTypes)
  }, [permissionTypes])

  const updateUser = async (data) => {

    setisBtnLoading(true);

    try {

      const response = await fetch(`${configData.SERVER_URL}/admin/updateAdmin/${adminData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": window.localStorage.getItem("token")
        },
        body: JSON.stringify({
          fullName: data.fullName,
          sex: data.sex,
          phoneNumber: data.phoneNumber,
          email: data.email,
          role: data.role,
          position: data.position,
          permission: data.role === 'admin' ? null : data.permission,
          permissionType: data.role === 'admin' ? null : permissionTypes.join(', ')
        })
      });

      const responseData = await response.json();

      if (responseData.status === "success") {
        setisBtnLoading(false);
        toast.success(responseData.message);
        setShowTwo(false);
      } else if (responseData.status === "error") {
        setisBtnLoading(false);
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setisBtnLoading(false);
    }






  }

  const blockUnBlock = async(id) => {
    if (!window.confirm("are you sure you want to unblock this user?")) {
      return
    }
    setisBtnLoading(true)

    const response = await fetch(`${configData.SERVER_URL}/admin/blockAdmin/${adminData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": window.localStorage.getItem("token")
      }
    });



    const responseData = await response.json();

    // axios.put(`${configData.SERVER_URL}/admin/blockAdmin/${adminData._id}`)
    //   .then((response) => {
         console.log(response);
        if (responseData.status === "success") {
          setisBtnLoading(false)
          setAdmiData([])
          toast.success(responseData.message);
        }
        if (responseData.status === "error") {
          setisBtnLoading(false)
          toast.error(responseData.message);
        }
      // });

  }

  const deleteUser = (id) => {
    if (!window.confirm("are you sure you want to delete this user?")) {
      return
    }
    setisBtnLoading(true)

    axios.delete(`${configData.SERVER_URL}/admin/deleteAdmin/${adminData._id}`)
      .then((response) => {
        console.log(response);
        if (response.data.status === "success") {
          setAdmiData([])
          setisBtnLoading(false)
          toast.success(response.data.message);
        }
        if (response.data.status === "error") {
          setisBtnLoading(false)
          alert(response.data.message);
        }
      });
  }

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const showActive = () => {
    setPage('active')
    const completedData = admData.filter(item => item.status === true);
    setAdmin(completedData);
  };

  const showBlocked = () => {
    setPage('blocked')
    const completedData = admData.filter(item => item.status === false);
    setAdmin(completedData);
  };


  const [search, setSearch] = useState('');

  const handleAdminSearch = (query) => {
    const filteredResults = admData.filter((admData) =>
      admData?.fullName.toLowerCase().includes(query.toLowerCase())
    );
    setAdmin(filteredResults);
  };

  const handleDocChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    // Perform search when at least 2 characters are entered
    if (query.length >= 2) {
      handleAdminSearch(query);
    } else {
      setAdmin(admData); // Clear results if the search query is less than 2 characters
    }
  };

  return (
    <>

      <Layout>

        <div className="mainBox">


          <div className='mBoxOne'>

            <div className="heading-section">
              <div className="navSection">
                <span className="inactiveText">Administration</span>
                <span className="activeArrow">{">"}</span>
                <span className="activeText">Admins</span>
              </div>

              <div class="form-group has-search" style={{ width: "30%" }}>
                <div className="col-md-12 mx-auto">
                  <div className="input-group">
                    <input className="form-control border rounded-pill" placeholder="Search with admin name" value={search} onChange={handleDocChange} type="search" id="example-search-input" />
                  </div>
                </div>
              </div>

            </div>


            {isPageLoading ? <>
              <div className="d-flex  justify-content-center align-items-center w-100 mt-5">
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
            </> : <>
              <div className="mContent">

                <Col lg="12" style={{ margin: '0px', padding: '0px' }}>
                  <div onClick={handleShow} className="btn-add">
                    <span>Add Admin</span>
                  </div>


                  <div className="category-menu">

                    <ul className="nav">
                      <li className="nav-item">
                        <a className="nav-link" href="#">Admin</a>
                      </li>
                    </ul>
                    <span className="line"></span>

                    <ul className="nav lastNav">
                      <li className="nav-item">
                        <a className={page === "all" ? "nav-link activ" : "nav-link"} onClick={() => getAdmin()} href="#">All</a>
                      </li>
                      <li className="nav-item">
                        <a className={page === "active" ? "nav-link activ" : "nav-link"} onClick={() => showActive()} href="#">Active</a>
                      </li>
                      <li className="nav-item">
                        <a className={page === "blocked" ? "nav-link activ" : "nav-link"} onClick={() => showBlocked()} href="#">Blocked</a>
                      </li>
                    </ul>

                  </div>
                </Col>

                <div className="userDataParent">

                  {admin.map(admin => (
                    <div onClick={() => setAdmiData(admin)} className="userData">
                      <div className="userDataOne">
                        <Image crossorigin="anonymous" src={`${configData.PIC_URL}/${admin.profImage}`} className="useDataImg" alt="" />
                        <div className="userDataName">
                          <span>{admin.fullName}</span>
                          <span>{admin.email}</span>
                          {admin?.status == true ?
                            <div className="userState">
                              <span>active</span>
                            </div> :
                            <div className="userStateBlocked">
                              <span>blocked</span>
                            </div>
                          }

                        </div>
                      </div>
                      <div className="userDataTwo">
                        <RightArrow />
                        <span>{admin?.position}</span>
                      </div>
                    </div>

                  ))}

                </div>

              </div>

            </>}
          </div>

          <div className='mainBoxTwo'>



            {adminData && adminData.fullName ?
              <div className='userProfDisplay'>

                <div className="user-details">

                  <Image crossorigin="anonymous" src={`${configData.PIC_URL}/${adminData.profImage}`} className="useDataImg2" alt="" />
                  <div className="userDataName">
                    <span>{adminData.fullName}</span>
                    <span>{adminData.email}</span>
                  </div>
                  {adminData?.status ?

                    <div className="editDel">
                      <div onClick={() => handleTwoShow(adminData)} className="edit">
                        <span>Edit</span>
                      </div>
                      <div onClick={() => blockUnBlock(adminData._id)} className="delete">
                        <span>Block</span>
                      </div>
                    </div> :

                    <div className="editDel">
                      <div onClick={() => blockUnBlock(adminData._id)} className="edit">
                        <span>Unblock</span>
                      </div>
                      <div onClick={() => deleteUser(adminData._id)} className="delete">
                        <span>Delete</span>
                      </div>
                    </div>}

                </div>

                <div className="profInfo">
                  <h4>Information</h4>

                  <div className="profInfoData">

                    <div className="profData">
                      <span>Full Name</span>
                      <span>{adminData?.fullName}</span>
                    </div>


                    <div className="profData">
                      <span>Sex</span>
                      <span>{adminData?.sex}</span>
                    </div>

                    <div className="profData">
                      <span>Email</span>
                      <span>{adminData?.email}</span>
                    </div>

                    <div className="profData">
                      <span>Phone</span>
                      <span>{adminData?.phoneNumber}</span>
                    </div>

                    <div className="profData">
                      <span>Permission Type</span>
                      <span>{adminData?.role}</span>
                    </div>

                    <div className="profData">
                      <span>Position</span>
                      <span>{adminData?.position}</span>
                    </div>
                  </div>
                </div>

                {adminData?.role !== 'admin' &&
                  <div className="profInfo mb-3">
                    <h4>User's Permissions</h4>

                    <div className="selectPref">

                      <Form.Check
                        inline
                        disabled
                        label="Marketers"
                        name="permission"
                        value="marketers"
                        ref={register({ required: true })}
                        defaultChecked={adminData ? adminData?.permission === 'marketers' : false}
                        type={'radio'} />

                      <Form.Check
                        inline
                        disabled
                        label="Clients"
                        name="permission"
                        value="clients"
                        ref={register({ required: true })}
                        defaultChecked={adminData ? adminData?.permission === 'clients' : false}
                        type={'radio'} />


                      <Form.Check
                        inline
                        disabled
                        label="Documents"
                        name="permission"
                        value="documents"
                        ref={register({ required: true })}
                        defaultChecked={adminData ? adminData?.permission === 'documents' : false}
                        type={'radio'} />




                      <div className="" style={{ marginLeft: '10%' }}>
                        <Form.Check
                          inline
                          disabled
                          label="add"
                          name="permissionType"
                          value="add"
                          ref={register({ required: false })} defaultChecked={
                            adminData &&
                            adminData.permissionType &&
                            ['add'].some(substring => adminData.permissionType.includes(substring))
                          }
                          type={'checkbox'} />
                        <Form.Check
                          inline
                          disabled
                          label="edit"
                          name="permissionType"
                          value="edit"
                          ref={register({ required: false })} defaultChecked={
                            adminData &&
                            adminData.permissionType &&
                            ['edit'].some(substring => adminData.permissionType.includes(substring))
                          }
                          type={'checkbox'} />

                        <Form.Check
                          inline
                          disabled
                          label="delete"
                          name="permissionType"
                          value="delete"
                          ref={register({ required: false })} defaultChecked={
                            adminData &&
                            adminData.permissionType &&
                            ['delete'].some(substring => adminData.permissionType.includes(substring))
                          }
                          type={'checkbox'} />

                      </div>

                    </div>


                  </div>
                }

              </div>
              : <></>
            }



          </div>

        </div>

      </Layout>






      <Modal show={show} onHide={handleClose}>

        <form onSubmit={handleSubmit(adminAdd)} className="pt-3" enctype="multipart/form-data" id="submit">
          <Modal.Body>


            <div className="adminForm">
              <span>Add Admin</span>

              <div className="col-md-12 d-flex justify-content-center">
                <label htmlFor="imageInput">
                  <div className="imgCircleDiv">
                    {!selectedImage ? (
                      <span style={{ fontSize: '24px' }}>+</span>
                    ) : (
                      <img src={selectedImage}
                        alt="Selected"
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    )}
                  </div>
                </label>
                <input type="file" name="profImage" ref={register({ required: true })}
                  id="imageInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange} />

              </div>

              <div className="col-md-12">

                <div className="form-floating mt-3">
                  <input placeholder="" type="text" className="h-auto form-control" name="fullName"
                    ref={register({ required: true })} />
                  {errors.fullName && <span className="alert alert-danger" role="alert">Full Name Required</span>}
                  <label for="floatingInput">Full Name</label>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md">
                  <div className="form-floating mt-3">
                    <input placeholder="Phone Number" type="text" className="h-auto form-control " name="phoneNumber"
                      ref={register({ required: true })} />
                    {errors.phoneNumber && <span className="alert alert-danger" role="alert">Phone Number Required</span>}
                    <label for="floatingInput">Phone Number</label>
                  </div>
                </div>


                <div className="col-md">
                  <div className="form-floating mt-3">
                    <input placeholder="Email Address" type="text" className="h-auto form-control " name="email" ref={register({ required: true })} />
                    {errors.email && <span className="alert alert-danger" role="alert">Email Required</span>}
                    <label for="floatingInput">Email Address</label>
                  </div>

                </div>

              </div>

              <div className="row g-2">
                <div className="col-md">
                  <div className="form-floating">
                    <select className="form-select mt-3" name="sex" ref={register({ required: true })}>
                      {/* <span className="mt-4">Select Sex</span> */}
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </select>
                    <label for="floatingSelect">Sex</label>
                  </div>

                </div>

                <div className="col-md">

                  <div className="form-floating">
                    <select
                      className="form-select mt-3"
                      name="role"
                      ref={register({ required: true })}
                      onChange={handleRoleChange} >
                      <option selected>Select Role</option>
                      <option value='admin'>Admin</option>
                      <option value='manager'>Manager</option>
                    </select>
                    <label htmlFor="floatingSelect">Role type</label>
                  </div>
                </div>
              </div>


              <div className="form-floating mt-3">
                <input placeholder="Position" type="text" className="h-auto form-control" name="position" ref={register({ required: true })} />
                {errors.position && <span className="alert alert-danger" role="alert">Position Required</span>}
                <label for="floatingInput">Position</label>
              </div>



              {isAdminSelected == "admin" ? <></> :
                <div className="my-4">
                  <h4>Select users permissions</h4>

                  <div className="selectPref">

                    <Form.Check
                      inline
                      label="Marketers"
                      value="marketers"
                      name="permission"
                      ref={register({ required: true })}
                      onChange={handlePermissionChange}
                      checked={selectedPermission === "marketers"}
                      type="radio"
                    />

                    <Form.Check
                      inline
                      label="Clients"
                      value="clients"
                      name="permission"
                      ref={register({ required: true })}
                      onChange={handlePermissionChange}
                      checked={selectedPermission === "clients"}
                      type="radio"
                    />

                    <Form.Check
                      inline
                      label="Documents"
                      value="documents"
                      name="permission"
                      ref={register({ required: true })}
                      onChange={handlePermissionChange}
                      checked={selectedPermission === "documents"}
                      type="radio"
                    />

                  </div>

                  {selectedPermission &&
                    <div className="" style={{ textAlign: 'center' }}>
                      <Form.Check
                        inline
                        label="add"
                        name="permissionType"
                        value="add"
                        ref={register({ required: true })}
                        type={'checkbox'}
                      // id={`inline-${type}-1`}
                      />
                      <Form.Check
                        inline
                        label="edit"
                        name="permissionType"
                        value="edit"
                        ref={register({ required: true })}
                        type={'checkbox'}
                      // id={`inline-${type}-2`}
                      />
                      <Form.Check
                        inline
                        label="delete"
                        name="permissionType"
                        value="delete"
                        ref={register({ required: true })}
                        type={'checkbox'}
                      // id={`inline-${type}-3`}
                      />

                    </div>
                  }


                </div>
              }

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
                <span>Creating account... </span>
              </div>
            </>)
              : (<>

                <Button variant="primary" type="submit" disabled={isBtnLoading}>
                  Add Admin
                </Button>
              </>)}
          </Modal.Footer>
        </form>
      </Modal>


      {/* update data */}
      <Modal show={showTwo} onHide={handleTwoClose}>


        <form onSubmit={handleSubmit(updateUser)} className="pt-3" enctype="multipart/form-data" id="submit">
          <Modal.Body>


            <div className="adminForm">
              <span>Update Details</span>

              <div className="col-md-12">

                <div className="form-floating mt-3">
                  <input placeholder="" type="text" className="h-auto form-control" name="fullName"
                    ref={register({ required: true })}
                    defaultValue={adminData ? adminData?.fullName : ''} />
                  {errors.fullName && <span className="alert alert-danger" role="alert">Full Name Required</span>}
                  <label for="floatingInput">Full Name</label>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md">
                  <div className="form-floating mt-3">
                    <input placeholder="Phone Number" type="text" className="h-auto form-control " name="phoneNumber"
                      ref={register({ required: true })}
                      defaultValue={adminData ? adminData?.phoneNumber : ''} />
                    {errors.phoneNumber && <span className="alert alert-danger" role="alert">Phone Number Required</span>}
                    <label for="floatingInput">Phone Number</label>
                  </div>
                </div>


                <div className="col-md">
                  <div className="form-floating mt-3">
                    <input placeholder="Email Address" type="text" className="h-auto form-control " name="email" ref={register({ required: true })} defaultValue={adminData ? adminData?.email : ''} />
                    {errors.email && <span className="alert alert-danger" role="alert">Email Required</span>}
                    <label for="floatingInput">Email Address</label>
                  </div>

                </div>

              </div>

              <div className="row g-2">
                <div className="col-md">
                  <div className="form-floating">
                    <select className="form-select mt-3" name="sex" ref={register({ required: true })} defaultValue={adminData ? adminData?.sex : ''}>
                      {/* <span className="mt-4">Select Sex</span> */}
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </select>
                    <label for="floatingSelect">Sex</label>
                  </div>

                </div>

                <div className="col-md">

                  <div className="form-floating">
                    <select className="form-select mt-3" name="role" ref={register({ required: true })} defaultValue={adminData ? adminData?.role : ''}
                      onChange={handleRoleChange}>
                      <option value='admin'>Admin</option>
                      <option value='manager'>Manager</option>
                    </select>
                    <label for="floatingSelect">Permission type</label>
                  </div>

                </div>
              </div>

              <div className="form-floating mt-3">
                <input placeholder="Position" type="text" className="h-auto form-control" name="position" ref={register({ required: true })} defaultValue={adminData ? adminData?.position : ''} />
                {errors.position && <span className="alert alert-danger" role="alert">Position Required</span>}
                <label for="floatingInput">Position</label>
              </div>


              {isAdminSelected == "admin" ? <></> :
                <div className="my-4">
                  <h4>Select users permissions</h4>

                  <div className="selectPref">

                    <Form.Check
                      inline
                      label="Marketers"
                      name="permission"
                      value="marketers"
                      ref={register({ required: true })}
                      defaultChecked={adminData ? adminData?.permission === 'marketers' : false}
                      type={'radio'} />

                    <Form.Check
                      inline
                      label="Clients"
                      name="permission"
                      value="clients"
                      ref={register({ required: true })}
                      defaultChecked={adminData ? adminData?.permission === 'clients' : false}
                      type={'radio'} />


                    <Form.Check
                      inline
                      label="Documents"
                      name="permission"
                      value="documents"
                      ref={register({ required: true })}
                      defaultChecked={adminData ? adminData?.permission === 'documents' : false}
                      type={'radio'} />

                    <div className="" style={{ marginLeft: '10%' }}>
                      <Form.Check
                        inline
                        label="add"
                        name="permissionType"
                        value="add"
                        ref={register({ required: false })}
                        defaultChecked={
                          adminData &&
                          adminData.permissionType &&
                          ['add'].some(substring => adminData.permissionType.includes(substring))
                        }
                        onChange={handlePermissionTypeChange}
                        type={'checkbox'} />
                      <Form.Check
                        inline
                        label="edit"
                        name="permissionType"
                        value="edit"
                        ref={register({ required: false })} defaultChecked={
                          adminData &&
                          adminData.permissionType &&
                          ['edit'].some(substring => adminData.permissionType.includes(substring))
                        }
                        onChange={handlePermissionTypeChange}
                        type={'checkbox'} />

                      <Form.Check
                        inline
                        label="delete"
                        name="permissionType"
                        value="delete"
                        ref={register({ required: false })}
                        defaultChecked={
                          adminData &&
                          adminData.permissionType &&
                          ['delete'].some(substring => adminData.permissionType.includes(substring))
                        }
                        onChange={handlePermissionTypeChange}
                        type={'checkbox'} />

                    </div>

                  </div>

                </div>
              }




              <div className="mt-4 mb-4">
              </div>

            </div>



          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleTwoClose}>
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
                <span>Updating account... </span>
              </div>
            </>)
              : (<>

                <Button variant="primary" type="submit" disabled={isBtnLoading}>
                  Update Admin
                </Button>
              </>)}
          </Modal.Footer>
        </form>
      </Modal>



    </>
  );
}

export default Admin;
