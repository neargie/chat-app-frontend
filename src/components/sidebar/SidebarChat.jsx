import React from 'react';

import {Avatar, IconButton} from '@material-ui/core'

import './SidebarChat.css'
import {RemoveCircleRounded} from "@material-ui/icons";
import axios from "../../axios";

function SidebarChat({roomName, selectedRoom}) {

    return (
        <div className="sidebarChat" onClick={(() => selectedRoom(roomName.name))}>
            <Avatar/>
            <div className="sidebarChat__info">
                <h2>{roomName.name}</h2>
            </div>
        </div>
    )
}

export default SidebarChat;