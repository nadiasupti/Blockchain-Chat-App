import React from 'react';
import Image from 'next/image';
//internal import
import Style from './Loader.module.css' ;
import images from '../../assets';

const Loader = () => {
  return (
    <div className={Style.Loader}>
     <div className= {Style.Loader_box}>
      <img src={images.loader} alt="loader" width={100} height={300} />
     </div>
    </div>
  );
};

export default Loader;