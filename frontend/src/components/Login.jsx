import { Room, Cancel } from '@mui/icons-material';
import './login.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Login({setShowLogin, myStorage, setCurrentUser}) {
    const [failure, setFailure] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        }
        try {
            const res = await axios.post('/users/login', user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setFailure(false);
        } catch (err) {
            console.log(err);
            setFailure(true);
        }

    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room />
                SaibPin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='username' ref={nameRef} />
                <input type="password" placeholder='password' ref={passwordRef} />
                <button className='loginBtn'>Login</button>
                {failure && (<span className='failure'>Something went wrong!</span>)}
            </form>
                <Cancel className='loginCancel' onClick={() => setShowLogin(false)}/>
        </div>
    )
}
