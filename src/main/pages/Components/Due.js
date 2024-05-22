import React, { useState } from 'react';
import {LongArrow, LeftArrow, RightArrowTwo} from '../svg/Svg';
import img from '../../assets/img/IMG-2.jpg';

const Due = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  return (
    <>

        <div className='d-flex justify-content-between'>
                          <h4>Due Payment</h4>
                          <div className="row-arrow">
                              <LeftArrow/>
                              <RightArrowTwo/>
                          </div>
                    </div>

        <div className="dueParent">
                        <img src={img} className="img-fluid perfImg" alt="user"/>
                        <span className="perfName">Precious vwarho</span>
                        <span>+2347035814787</span>

                    <div className="profInfo">

                        <div className="profInfoData">

                            <div className="profData">
                                <span>Due Date</span>
                                <span>23rd Nov, 2023</span>
                            </div>

                            <div className="profData">
                                <span>Property</span>
                                <span>Flourish Estate</span>
                            </div>
                            
                            <div className="profData">
                                <span>Payment Plan</span>
                                <span>3-6 Months</span>
                            </div>
                            
                            <div className="profData">
                                <span>Balance</span>
                                <span>#200,000</span>
                            </div>

                        </div>
                    </div>
                    
                </div>


      {/* <h2>{data[currentIndex].title}</h2>
      <p>{data[currentIndex].content}</p>

      <button onClick={goToPrevious}>Previous</button>
      <button onClick={goToNext}>Next</button> */}
    </>
  );
};

export default Due;
