import React from 'react';
import "./styles.css";

function input({ lable , state, setState, placeholder , type}) {
  return (
    <div className="input-wrapper">
        <p className='lable-input'>{lable}</p>
        <input
        type={type}
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className='custom-input'/>
    </div>
  )
}

export default input