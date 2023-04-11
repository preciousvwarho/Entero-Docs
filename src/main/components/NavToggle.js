import React from 'react';

const NavToggle = () => {

    const openNav = () =>{ 
     const nav = document.getElementById('sideBar').style.width = "60%";
     const navb = document.getElementById('sideBar').style.display = "block";
     const pad = document.getElementById('overlay3').style.display = "block";
    }

    const closeNav = () => { 
      const nav = document.getElementById('sideBar').style.width = "0";
      const navb = document.getElementById('sideBar').style.display = "none";
      const pad = document.getElementById('overlay3').style.display = "none";
     }
 
    return (
        <>
        <span className="navBtn" onClick={()=> openNav()}>
          <i class="fa fa-bars"></i>
        </span>
            

          <div className="overlay3" id="overlay3" onClick={()=> closeNav()}>
           </div>
        </>
    );
};

export default NavToggle;