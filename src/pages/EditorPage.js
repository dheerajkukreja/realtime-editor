import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import initSocket from '../socket'
import ACTIONS from '../Actions'

import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'


const EditorPage = () => {

    const socketRef  = useRef(null)


    const codeRef = useRef(null)

    const location = useLocation()

    const redirecter = useNavigate()

    const {roomId}  = useParams()

    const [clients, setClients] = useState([])


    const toastOptions = {
        position: "top-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: {
            primary: '#4aed88',
        },
    }

    const handleErrors = (err) =>{
        toast.error('Socket connection failed, try again later...', toastOptions)
        redirecter('/')   
    }

    const showAlert = (type, msg) =>{
        if(type==='success'){
            toast.success(msg, toastOptions)
        }else{
            toast.error(msg, toastOptions)
        }
    }

    useEffect(()=>{
        
        const init = async ()=>{
            socketRef.current = await initSocket()

            socketRef.current.on('connect_error', (err)=> handleErrors(err))
            socketRef.current.on('connect_failed', (err)=> handleErrors(err))
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId, 
                username: location.state?.username
            })
            socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId})=>{
                if(username!==location.state.username){
                    let msg = `${username} joined the room`
                    showAlert('success', msg)
                }
                setClients(clients)
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId
                })
            })

            //listening for disconnected
            socketRef.current.on(ACTIONS.DISCONNECTED, (data)=>{
                let msg = `${data.username} left the room....`
                showAlert('error', msg)
                setClients((prev)=>{
                    return prev.filter((client)=>client.socketId !== data.socketId )
                })
            })
        }
        init();

        //this is cleaning function
        return () =>{
            socketRef.current.off(ACTIONS.JOINED)
            socketRef.current.off(ACTIONS.DISCONNECTED)
            socketRef.current.disconnect()
        }
    }, [])
    

    function copyRoomID(){
        try {
            navigator.clipboard.writeText(roomId)
            toast.success(`Room Id has been copied to clipboard`)
        } catch (error) {
            toast.error('Could not copy Room ID')
        }
    }

    const leaveRoom = ()=>{
        redirecter('/')
    }

    if(!location.state){
        <Navigate to='/'/>
    }


    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='logo'>
                        <img className='logoImage' src='/code-sync.png' alt="code-sync-logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className='clientsList'>
                        {
                            clients.map((client)=>(
                                <Client key={client.socketId} username={client.username} />
                            ))
                        }
                    </div>                
                </div>
                <button className="btn copyBtn" onClick={copyRoomID}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </div>
            <div className='editorWrap'>
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code}} />
            </div>
        </div>
    )
}

export default EditorPage