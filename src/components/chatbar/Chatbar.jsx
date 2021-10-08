import React, {useEffect, useRef, useState} from 'react';
import {Avatar} from '@material-ui/core'
import axios from '../../axios'
import './Chatbar.css'

function Chatbar({messages, name, room}) {
    const [input, setInput] = useState("")

    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (messagesEndRef && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [messages]);

    const sendMessage = async e => {
        e.preventDefault()
        const data = new Date();
        await axios.post('/messages/new', {
            message: input,
            name: name,
            timestamp: data.toLocaleString('en-GB', {hour12: false}),
            receiver: true,
            room
        })

        setInput("")
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar/>
                <div className="chat__headerInfo">
                    <h3>{room}</h3>
                </div>
            </div>
            <div className="chat__body">
                {room !== "" ? messages.filter(message => message.room === room)
                        .map(filteredMessage => {
                            filteredMessage.receiver = filteredMessage.name === name;
                            return (
                                <div ref={messagesEndRef} key={filteredMessage.id}>
                                    <p className={`chat__message ${filteredMessage.receiver && "chat__receiver"}`}>
                                    <span
                                        className={`chat__name ${filteredMessage.receiver && "chat__name_black"}`}>{filteredMessage.name}</span>
                                        {filteredMessage.message}
                                        <span className="chat__timestamp">{filteredMessage.timestamp}</span>
                                    </p>
                                </div>
                            )
                        })
                    : <h2>Please Select Room...</h2>}
            </div>

            <div className="chat__footer">
                <form action="">
                    <input value={input}
                           onChange={(e) => setInput(e.target.value)}
                           type="text"
                           placeholder="type a message"/>
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
            </div>
        </div>
    )
}

export default Chatbar