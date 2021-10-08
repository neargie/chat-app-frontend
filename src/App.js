import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';

import './App.css';
import Sidebar from "./components/sidebar/Sidebar";
import Chatbar from './components/chatbar/Chatbar'
import axios from './axios'

import Swal from 'sweetalert2'


function App() {
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")

    useEffect(() => {
        axios.get("/messages/sync").then(response => {
            setMessages(response.data);
        })

        axios.get('/rooms/sync').then(response => {
            setRooms(response.data);
        });
    }, []);

    useEffect(async () => {

        const {value: name} = await Swal.fire({
            title: 'Input Your Name',
            input: 'text',
            inputPlaceholder: 'your name here..'
        })

        if (name) {
            setName(name)
            await Swal.fire(`Welcome ${name}`)
        }

    }, [])


    useEffect(() => {
        const pusher = new Pusher('d9b70e4422eb052f2b8a', {
            cluster: 'mt1'
        });

        const channelRooms = pusher.subscribe('rooms');
        channelRooms.bind('roomsInserted', (newRoom) => {
            setRooms([...rooms, newRoom])
        });

        const channelRemoveRooms = pusher.subscribe('removeRooms');
        channelRemoveRooms.bind('roomsRemoved', (deletedRoomId) => {
            setRooms(rooms.filter(room => room._id !== deletedRoomId.id));
        });

        const channelMessages = pusher.subscribe('messages');
        channelMessages.bind('messagesInserted', (newMessage) => {
            const nameFromServer = newMessage.name;
            newMessage.receiver = nameFromServer === name;
            setMessages([...messages, newMessage])
        });

        return () => {
            channelRooms.unbind_all()
            channelMessages.unbind_all()
            channelRemoveRooms.unbind_all()
            channelRooms.unsubscribe()
            channelMessages.unsubscribe()
            channelRemoveRooms.unsubscribe()
        };
    }, [rooms, messages]);

    const roomeText = (room) => {
        setRoom(room)
    }

    return (
        <div className="app">
            <div className="app__body">
                <Sidebar rooms={rooms} name={name} selectedRoom={roomeText}/>
                <Chatbar messages={messages} name={name} room={room}/>
            </div>
        </div>
    );
}

export default App;
