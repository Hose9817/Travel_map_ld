import React, {useState} from 'react'
import axios from 'axios';


export default function AddInfo({pin, pins, setPins, setNewPlace}) {

    // console.log(pin._id);

    const [newInfo, setNewInfo] = useState('');

    const onInputHandler = (e) => {
        setNewInfo(e.target.value);
    }

    const saveBtnHandler = async (e) => {
        e.preventDefault();
        const updatedPin = {...pin, info: newInfo};

        // console.log(updatedPin);
      
        try {
          const res = await axios.put(`/pins/${pin._id}`, updatedPin);
          const updatedPins = pins.map((pin) => (pin._id === pin.id ? res.data.pin : pin));
          setPins(updatedPins);
          setNewPlace(null);
        } catch (err) {
          console.log(err);
        }

        setNewInfo('');
      };

  return (
    <div>
        <input type="text" value={newInfo} onChange={onInputHandler}/>
        <button onClick={saveBtnHandler}>Save</button>
    </div>
  )
}
