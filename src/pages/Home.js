import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {v4 as uuid} from 'uuid'


const Home = () => {

    const navigate = useNavigate()


    const toastOptions = {
        position: "top-right",
        autoClose: 500,
        pauseOnHover: true,
        draggable: true,
        theme: {
            primary: '#4aed88',
        },
    }


    const createNewRoom = (e) => {
        e.preventDefault()
        const id = uuid()
        setRoomId(id)
        toast.success('Created New Room', toastOptions)
    }

    const [roomId, setRoomId] = useState('')

    const [username, setUsername] = useState('')

    const joinRoom = () =>{
        if(!roomId || !username){
            toast.error('ROOM ID or Username is required', toastOptions)
            return;
        }
        navigate(`/editor/${roomId}`, {
            state:{
                username
            }
        })
    }

    const handleInput = (e)=>{
        if(e.code==='Enter'){
            joinRoom();
        }
    }

    return (
        <div className='homePageWrapper'>
            <div className='formWraper'>
                <img src='/code-sync.png' alt="code-sync-logo" />
                <h4 className='mainLable'>
                    Paste Invitation ROOM ID
                </h4>
                <div className='inputGroup'>
                    <input type='text' className='inputBox' value={roomId}  onChange={(e)=>setRoomId(e.target.value)} placeholder='ROOM ID' onKeyUp={handleInput} />
                    <input type='text' className='inputBox'  onChange={(e)=>setUsername(e.target.value)} value={username} placeholder='UserName' onKeyUp={handleInput} /> 
                    <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp; 
                        <a href="#" onClick={createNewRoom} className='createNewBtn'> new room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>
                    Built with 💛 &nbsp; by &nbsp;
                    <a href="https://github.com/dheerajkukreja">Dheeraj</a>
                </h4>
            </footer>
        </div>

    )
}

export default Home