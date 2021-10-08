import React, {useState} from 'react';
import Swal from "sweetalert2";
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import {Avatar, IconButton} from '@material-ui/core'
import {Add} from "@material-ui/icons";
import axios from "../../axios";

import SidebarChat from './SidebarChat'
import './Sidebar.css'

function Sidebar({ rooms, name, selectedRoom}) {

    const [search, setSearch] = useState("")

    const handleAddRoom = async e => {
        e.preventDefault()

        const {value: name} = await Swal.fire({
            title: 'Input Room Name',
            input: 'text',
            inputPlaceholder: 'Room name here..'
        })
        if (name) {
            await Swal.fire(`Room ${name} Has been created`)
            await axios.post('/rooms/new', {
                name: name
            })
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar/>
                <div className="sidebar__headerRight">
                    <input value={name} type="text" placeholder="Your name" disabled/>
                </div>

            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined/>
                    <input type="text"
                           placeholder="Search for room"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                    <IconButton onClick={handleAddRoom}>
                        <Add/>
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__chats">
                {rooms.filter(room => room.name.toLowerCase().includes(search.toLowerCase())).map(r => {
                    return (
                        <div key={r._id}>
                            <SidebarChat roomName={r} selectedRoom={selectedRoom}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar;