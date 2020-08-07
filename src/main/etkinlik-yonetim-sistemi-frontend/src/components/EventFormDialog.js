import React, {Component} from "react"
import {InputNumber} from "primereact/inputnumber";
import {Calendar} from "primereact/calendar";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import {Chips} from "primereact/chips";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Zoom from "@material-ui/core/Zoom";
import {Messages} from "primereact/messages";
import authHeader from "./Authentication/authHeader";

export const ValidationTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: 'green',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'red',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);

const ZoomTransition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

export class EventFormDialog extends Component {

    state = {
        uuid: null,
        eventName: "",
        eventDates: [new Date(), new Date()],
        eventLocation: {lat: 39.907535, lng: 32.802588},
        quota: undefined,
        extraFields: [],
    }

    constructor() {
        super();
        this.nameInput = React.createRef();
        this.messages = React.createRef();
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    resetState(){
        this.setState({
            eventName: "",
            eventDates: [new Date(), new Date()],
            eventLocation: {lat: 39.907535, lng: 32.802588},
            quota: undefined,
            extraFields: [],
        })
    }

    setValues(event) {
        this.setState({
            uuid: event.uuid,
            eventName: event.name,
            eventDates: [new Date(event.startDate), new Date(event.endDate)],
            eventLocation: {lat: event.lat, lng: event.lng},
            quota: event.quota,
            extraFields: event.extraFields
        })
    }

    mapClicked = (t, map, coord) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        this.setState({eventLocation: {lat, lng}})
        console.log(this.state.eventLocation)
    }


    sendEditRequest(event) {
        axios.post("http://localhost:8080/updateEvent", event,{headers: authHeader()})
            .then(response => {
                this.props.dataTable.editEvent(response.data)
                this.props.close()
                this.props.growl.show({severity: 'success', summary: "Etkinlik düzenlendi",})
            })
            .catch(reason => {
                if (reason.response.data.errors) {
                    this.messages
                        .replace({
                            closable: false,
                            severity: 'error',
                            summary: reason.response.data.errors[0].defaultMessage,
                            life: 2000
                        })
                }
            })
    }

    sendSubmitRequest(event) {
        axios.post("http://localhost:8080/addEvent", event, {headers: authHeader()})
            .then(response => {
                if (this.props.dataTable) {
                    this.props.dataTable.addEvent(response.data)
                }
                this.resetState()
                this.props.close()
                this.props.growl.show({severity: 'success', summary: "Etkinlik eklendi",})
            })
            .catch(reason => {
                if (reason.response.data.errors) {
                    this.messages
                        .replace({
                            closable: false,
                            severity: 'error',
                            summary: reason.response.data.errors[0].defaultMessage,
                            life: 2000
                        })
                }
            })
    }

    submitEvent = () => {
        let endDate
        if (this.state.eventDates[1] === null){
            endDate = this.state.eventDates[0]
        }
        else{
            endDate = this.state.eventDates[1]
        }
        let event = {
            uuid: this.state.uuid,
            name: this.state.eventName,
            startDate: this.state.eventDates[0].toDateString(),
            endDate: endDate.toDateString(),
            quota: this.state.quota,
            lat: this.state.eventLocation.lat,
            lng: this.state.eventLocation.lng,
            extraFields: this.state.extraFields
        }
        if (this.props.type === "edit"){
            this.sendEditRequest(event);
        }else{
            this.sendSubmitRequest(event);
        }
    }

    eventForm(){
        return <div className="p-grid p-dir-col p-fluid">
            <div className="p-col">
                <div className="p-grid">
                    <div className="p-col-9">
                        <ValidationTextField
                            inputRef={this.nameInput}
                            label="Etkinlik Adı"
                            fullWidth
                            required
                            value={this.state.eventName}
                            onChange={(e) => this.setState({eventName: e.target.value})}
                            variant="outlined"
                            size="small"
                        />
                    </div>
                    <div className="p-col-3">
                        <InputNumber
                            value={this.state.quota}
                            onChange={(e) => this.setState({quota: e.target.value})}
                            required
                            placeholder="Kontenjan *"
                            suffix={" kişi"}
                        />
                    </div>
                </div>
            </div>
            <div className="p-col">
                <div className="p-grid">
                    <div className="p-col-fixed">
                        <Calendar
                            selectionMode="range"
                            inline={true}
                            value={this.state.eventDates}
                            onChange={(e) => this.setState({eventDates: e.target.value}) }
                            minDate={new Date()}
                            required
                        />
                    </div>
                    <div className="p-col">
                        <Map
                            google={this.props.google}
                            initialCenter={this.state.eventLocation}
                            center={this.state.eventLocation}
                            zoom={15}
                            containerStyle={{position: "relative"}}
                            style={{border: "1px solid white", borderRadius: "5px", cursor: "pointer"}}
                            onClick={this.mapClicked}
                        >
                            <Marker
                                position={this.state.eventLocation}
                                draggable={true}
                                onDragend={this.mapClicked}
                            />
                        </Map>
                    </div>
                </div>
            </div>
            <div className="p-col" style={{paddingBottom: "0px"}}>
                <div style={{
                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    letterSpacing: "0.00938em", color: "#757575", marginBottom: "-10px",
                    position: "relative", backgroundColor: "white", width: "600px",
                    textAlign: "center", marginLeft: "10px"
                }}>
                    Kayıt ekranına eklemek istediğiniz soruları aralarına virgül koyarak ekleyebilirsiniz
                </div>
                <Chips
                    value={this.state.extraFields}
                    onChange={(e) => this.setState({extraFields: e.value})}
                    separator=","
                />
            </div>
        </div>
    }

    render() {
        return <Dialog
            open={this.props.open}
            TransitionComponent={ZoomTransition}
            keepMounted
            onClose={() => {
                this.props.close()
                this.resetState()
            }}
            onEntered={() => this.nameInput.current.focus()}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth
            maxWidth={"md"}
        >
            <DialogTitle id="alert-dialog-slide-title" style={{textAlign: "center"}}>
                {this.props.type === "edit" ? "ETKİNLİĞİ DÜZENLE" : "ETKİNLİK EKLE"}
            </DialogTitle>
            <DialogContent dividers style={{padding: "10px 24px"}}>
                {this.eventForm()}
            </DialogContent>
            <DialogActions>
                <Messages ref={(el) => this.messages = el}/>
                <Button onClick={this.submitEvent} color="primary">
                    {this.props.type === "edit" ? "Kaydet" : "Ekle"}
                </Button>
            </DialogActions>
        </Dialog>
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(EventFormDialog)