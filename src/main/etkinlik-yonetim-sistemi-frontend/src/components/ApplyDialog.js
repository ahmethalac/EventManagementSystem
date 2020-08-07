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

const ZoomTransition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

export class ApplyDialog extends Component {

    constructor() {
        super();
        this.nameInput = React.createRef();
        this.messages = React.createRef();
    }

    state = {
        eventData: "",
        name: "",
        tcKimlikNo: "",
        email: "",
        answers: []
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    resetState(){
        this.setState({
            name: "",
            tcKimlikNo: "",
            email: "",
            answers: []
        })
    }

    setValues(data){
        this.setState({eventData: data})
        data.extraFields.map((e) => {
            this.setState(prevState => ({
                answers: [...prevState.answers, {question: e, answer: ""}]
            }))
        })
    }

    apply(){
        axios.post("http://localhost:8080/applyEvent/" + this.state.eventData.uuid,
            {
                nameSurname: this.state.name,
                tcKimlikNo: this.state.tcKimlikNo,
                email: this.state.email,
                answers: this.state.answers
            })
            .then(res => {
                this.props.getQRCode(res.data)
                this.props.setApplicantCount(this.state.eventData.uuid, this.state.eventData.applicantCount + 1)
                this.props.onSubmit()
                this.props.onClose()
                this.resetState()
            })
            .catch(reason => {
                console.log(reason.response)
                if (reason.response.data.errors){
                    this.messages
                        .replace({
                            closable: false,
                            severity: 'error',
                            summary: reason.response.data.errors[0].defaultMessage,
                            life: 2000
                        })
                }else{
                    this.messages
                        .replace({
                            closable: false,
                            severity: 'error',
                            summary: reason.response.data,
                            life: 2000
                        })
                }
            })
    }

    content(){
        return <div className="p-grid p-dir-col p-nogutter" style={{minHeight: "70px"}}>
            <div className="p-grid p-nogutter p-justify-between" style={{marginTop: "10px"}}>
                <ValidationTextField
                    inputRef={this.nameInput}
                    label="Ad Soyad"
                    required
                    value={this.state.name}
                    onChange={(e) => this.setState({name: e.target.value})}
                    variant="outlined"
                    size="small"
                    style={{width: "49.49%"}}
                />
                <ValidationTextField
                    label="Email"
                    required
                    value={this.state.email}
                    onChange={(e) => this.setState({email: e.target.value})}
                    variant="outlined"
                    size="small"
                    style={{width: "31%"}}
                />
                <ValidationTextField
                    label="TC Kimlik No"
                    required
                    value={this.state.tcKimlikNo}
                    onChange={(e) => this.setState({tcKimlikNo: e.target.value})}
                    variant="outlined"
                    size="small"
                    style={{width: "17.4%"}}
                />
                <div className="p-grid p-nogutter" style={{paddingTop: "15px", width: "101%", marginLeft: "-1%"}}>
                    {this.props.open ? this.state.eventData.extraFields.map((e,index) => {

                        return <ValidationTextField
                            className="p-col"
                            label={e}
                            value={this.state.answers[index].answer}
                            onChange={(e) => {
                                let newAnswers = this.state.answers
                                newAnswers[index].answer = e.target.value
                                this.setState({answers: newAnswers})
                            }}
                            required
                            variant="outlined"
                            size="small"
                            style={{margin: "0px 0px 15px 1%", minWidth: "24%", maxWidth: "49%"}}
                        />
                    }) : null}
                </div>
            </div>
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
            maxWidth={"md"}
        >
            <DialogTitle id="alert-dialog-slide-title" style={{textAlign: "center"}}>
                <InformationCard eventData={this.state.eventData} mapVisible/>
            </DialogTitle>
            <DialogContent>
                {this.content()}
            </DialogContent>
            <DialogActions>
                <Messages ref={(el) => this.messages = el}/>
                <Button onClick={() => this.apply()} color="primary">
                    BAŞVUR
                </Button>
            </DialogActions>
        </Dialog>
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(ApplyDialog)