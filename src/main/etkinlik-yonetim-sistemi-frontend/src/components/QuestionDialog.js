import React, {Component} from "react"
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Zoom from "@material-ui/core/Zoom";
import {ValidationTextField} from "./EventFormDialog";
import {GoogleApiWrapper} from "google-maps-react";
import axios from "axios"
import {Messages} from "primereact/messages";
import InformationCard from "./EventInformationCard";
import SockJsClient from "react-stomp";
import WebSocket from "./WebSocket";
import TextField from "@material-ui/core/TextField";

const ZoomTransition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

class QuestionDialog extends Component {

    constructor() {
        super();
        this.nameInput = React.createRef();
        this.messages = React.createRef();
        this.websocket = React.createRef();
    }

    state = {
        question: "",
        name: "",
        eventUuid: "",
        tcKimlikNo: "",
        success: false
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    resetState() {
        this.setState({
            question: "",
            name: "",
            eventUuid: "",
            tcKimlikNo: "",
            success: false
        })
    }

    setValues(uuid) {
        this.setState({eventUuid: uuid})
    }

    check() {
        axios.post("http://localhost:8080/checkApplicantForQandA/" + this.state.eventUuid + "/" + this.state.tcKimlikNo)
            .then(res => {
                console.log(res)
                if (res.data === "notFound") {
                    this.messages
                        .replace({
                            closable: false,
                            severity: 'error',
                            summary: "Bu TC Kimlik numarasına ait bir katılımcı bulunmamaktadır",
                            life: 2000
                        })
                }
                else if (res.data === "notAttended") {
                    this.messages
                        .replace({
                            closable: false,
                            severity: 'error',
                            summary: "Etkinliğe katılmış olmanız gerekiyor",
                            life: 2000
                        })
                }
                else
                {
                    this.setState({name: res.data, success: true})
                }
            })
    }

    content() {
        return <div style={{display: "flex"}}>
            {this.state.success ? <div style={{width: "100%"}}>
                    <WebSocket
                        ref={(el) => this.websocket = el}
                        onNotification={(msg) => {
                            console.log(msg)
                            this.messages
                                .replace({
                                    closable: false,
                                    severity: 'success',
                                    summary: msg,
                                    life: 2000
                                })
                        }}
                        topics={['/topic/question/' + this.state.tcKimlikNo]}
                    />
                    <TextField
                        onKeyDown={event => {
                            if (event.key === "Enter") {
                                this.websocket.sendMessage('/app/question',
                                    JSON.stringify(
                                        {
                                            'questioner': this.state.name,
                                            'question': this.state.question,
                                            'tcKimlikNo': this.state.tcKimlikNo,
                                            'eventUuid': this.state.eventUuid
                                        })
                                )
                                this.setState({question: ""})
                            }
                        }}
                        variant={"outlined"}
                        style={{width: "100%"}}
                        onChange={(e) => this.setState({question: e.target.value})}
                        value={this.state.question}
                        placeholder={"Sorunuzu bu alana giriniz"}
                    />
                </div> :
                <ValidationTextField
                    inputRef={this.nameInput}
                    label="TC Kimlik No"
                    required
                    value={this.state.tcKimlikNo}
                    onChange={(e) => this.setState({tcKimlikNo: e.target.value})}
                    variant="outlined"
                    size="small"
                    style={{width: "100%"}}
                />}
        </div>
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
            onEntered={() => this.nameInput.current.focus()}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth
            maxWidth={"sm"}
        >
            <DialogContent>
                {this.content()}
            </DialogContent>
            <DialogActions>
                <Messages ref={(el) => this.messages = el}/>
                {this.state.success ?
                    <Button
                        onClick={() => {
                            this.websocket.sendMessage('/app/question',
                                JSON.stringify(
                                    {
                                        'questioner': this.state.name,
                                        'question': this.state.question,
                                        'tcKimlikNo': this.state.tcKimlikNo,
                                        'eventUuid': this.state.eventUuid
                                    })
                            )
                            this.setState({question: ""})
                        }}>
                        SOR
                    </Button> :
                    <Button onClick={() => this.check()} color="primary">
                        GİRİŞ YAP
                    </Button>}
            </DialogActions>
        </Dialog>
    }
}

export default QuestionDialog