import React, {Component} from "react"
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Zoom from "@material-ui/core/Zoom";
import WebSocket from "./WebSocket";
import 'react-chat-elements/dist/main.css';
import {MessageBox} from 'react-chat-elements'
import "../styles/QandADialog.css"
import DialogTitle from "@material-ui/core/DialogTitle";

const ZoomTransition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

class QandADialog extends Component {

    constructor() {
        super();
        this.websocket = React.createRef();
    }

    state = {
        eventUuid: "",
        eventName: "",
        messages: []
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    resetState() {
        this.setState({
            eventUuid: "",
            eventName: "",
            messages: []
        })
    }

    setValues(uuid, name) {
        this.setState({eventUuid: uuid, eventName: name})
    }

    render() {
        return <Dialog
            open={this.props.open}
            TransitionComponent={ZoomTransition}
            keepMounted
            onClose={() => {
                this.props.onClose()
                this.resetState()
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth
            maxWidth={"sm"}
        >
            <DialogTitle style={{backgroundColor: "#075e54"}}>
                <div style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "white"
                }}>{this.state.eventName + " Soruları"}</div>
            </DialogTitle>
            <DialogContent style={{overflow: "hidden", backgroundColor: "#ece5dd", padding: "8px"}}>
                {this.props.open ? <div>
                    <WebSocket
                        ref={(el) => this.websocket = el}
                        onNotification={(msg) => {
                            this.setState(prevState => ({
                                messages: [...prevState.messages, <MessageBox
                                    title={msg.split(":")[0]}
                                    text={msg.split(":")[1]}
                                    dateString={new Date().getHours() + ":" + new Date().getMinutes()}
                                    style={{width: "100%"}}
                                />]
                            }))
                        }}
                        topics={['/topic/answers/' + this.state.eventUuid]}
                    />
                    <div className={"noScroll"} style={{
                        overflow: "auto",
                        height: "400px",
                    }}>
                        {this.state.messages}
                    </div>
                </div> : null}
            </DialogContent>
        </Dialog>
    }
}

export default QandADialog