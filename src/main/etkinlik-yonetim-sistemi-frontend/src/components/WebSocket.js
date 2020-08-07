import React, {Component} from "react"
import SockJsClient from 'react-stomp'

class WebSocket extends Component {

    constructor() {
        super();
        this.clientRef = React.createRef()
    }

    sendMessage(target, msg){
        this.clientRef.sendMessage(target, msg)
    }

    render() {
        return <div>
            <SockJsClient
                ref={(el) => this.clientRef = el}
                url='http://localhost:8080/notification'
                topics={this.props.topics}
                onMessage={(msg) => {
                    this.props.onNotification(msg)
                }}
                onConnect={() => console.log("Connected to websocket")}
                onDisconnect={() => console.log("Disconnected from websocket")}
            />
        </div>
    }
}

export default WebSocket