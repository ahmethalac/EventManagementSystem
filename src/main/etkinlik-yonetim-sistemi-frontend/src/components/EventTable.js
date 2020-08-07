import React, {Component} from "react"
import {DataTable} from "primereact/datatable";
import "primereact/resources/themes/nova-light/theme.css"
import "primereact/resources/primereact.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import {Column} from "primereact/column";
import axios from "axios"
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import {Calendar} from "primereact/calendar";
import "../styles/EventTable.css"
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded"
import EditIcon from "@material-ui/icons/Edit"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PieChartIcon from '@material-ui/icons/PieChart';
import dateConverter from "../common/dateConverter";
import Button from "@material-ui/core/Button";
import authHeader from "./Authentication/authHeader";
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import PollIcon from '@material-ui/icons/Poll';
import HowToVoteIcon from '@material-ui/icons/HowToVote';

export class EventTable extends Component {

    state = {
        events: []
    }

    componentDidMount() {
        this.props.onRef(this)
        axios.get(this.props.editable ? "http://localhost:8080/getEvents" : "http://localhost:8080/getFutureEvents", {headers: authHeader()})
            .then(res => {
                res.data.map((e) => {
                    this.setState(prevState => ({
                        events: [...prevState.events, e]
                    }))
                })
            })
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    addEvent(event) {
        this.setState(prevState => ({
            events: [...prevState.events, event]
        }))
    }

    editEvent(event) {
        let index = this.state.events.findIndex((e) => e.uuid === event.uuid)
        let newEvents = this.state.events
        newEvents.splice(index, 1, event)
        this.setState({events: newEvents})
    }

    setApplicantCount(uuid, applicantCount) {
        let index = this.state.events.findIndex((e) => e.uuid === uuid)
        let newEvents = this.state.events
        newEvents[index].applicantCount = applicantCount
        this.setState({events: newEvents})
    }

    dateTemplate(rowData, column) {
        return <div>{dateConverter(column.field === "startDate" ? rowData.startDate : rowData.endDate)}</div>
    }

    locationTemplate = (rowData) => {
        return <Map
            google={this.props.google}
            containerStyle={{position: "relative", height: "60px"}}
            style={{height: "100%"}}
            initialCenter={{lat: rowData.lat, lng: rowData.lng}}
            center={{lat: rowData.lat, lng: rowData.lng}}
        >
            <Marker
                position={{lat: rowData.lat, lng: rowData.lng}}
            />
        </Map>
    }

    extraFieldsTemplate(rowData) {
        return <div>
            {rowData.extraFields.join(", ")}
        </div>
    }

    dateFilter(date) {
        return <Calendar style={{display: "inline"}}
                         appendTo={document.body}
                         placeholder={"Tarihe göre ara"}
                         onInput={(e) => {
                             if (e.target.value === "") {
                                 this.dt.filter("", date, "equals")
                             }
                         }}
                         onSelect={e => {
                             //toJSON() function returns one day earlier from the selected date,
                             //so easiest way to solve that bug is adding one day
                             let jsonType = new Date(e.value)
                             jsonType.setDate(jsonType.getDate() + 1)
                             this.dt.filter(jsonType.toJSON().substring(0, 10), date, "equals")
                         }}
                         onClearButtonClick={() => this.dt.filter("", date, "equals")}
                         showButtonBar
        />
    }

    buttonsTemplate = (rowData) => {
        let startDate = new Date(rowData.startDate)
        let endDate = new Date(rowData.endDate)
        startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset())
        endDate.setDate(endDate.getDate() + 1)
        endDate.setMinutes(endDate.getMinutes() + startDate.getTimezoneOffset())
        let futureEvent = new Date() < startDate.getTime()
        let continuousEvent = !futureEvent && (new Date().getTime() < endDate.getTime())
        if (this.props.editable) {
            return this.adminButtons(rowData, futureEvent, continuousEvent);
        } else {
            return this.applicantButtons(rowData, futureEvent, continuousEvent);
        }
    }

    applicantButtons(rowData, futureEvent, continuousEvent) {
        return <div>
            {(rowData.applicantCount >= rowData.quota || !futureEvent) ? null : <Button
                style={{backgroundColor: "#9eecff", padding: "10px", color: "primary", width: "120px"}}
                onClick={() => this.props.onApply(rowData)}
                endIcon={<PersonAddIcon style={{fontSize: "25px"}}/>}
                variant={"contained"}
            >
                BAŞVUR
            </Button>}
            {continuousEvent ? <Button
                style={{backgroundColor: "#9eecff", padding: "10px", color: "primary", width: "120px"}}
                onClick={() => this.props.onQuestion(rowData.uuid)}
                endIcon={<QuestionAnswerIcon style={{fontSize: "25px"}}/>}
                variant={"contained"}
            >
                SORU SOR
            </Button> : (futureEvent ? null : <Button
                style={{backgroundColor: "#9eecff", padding: "10px", color: "primary", width: "120px"}}
                onClick={() => console.log("anket")}
                endIcon={<PollIcon style={{fontSize: "25px"}}/>}
                variant={"contained"}
            >
                ANKET
            </Button>)}
        </div>
    }

    adminButtons(rowData, futureEvent, continuousEvent) {
        return <div className="p-grid p-justify-even"
                    style={{width: "100%", margin: "0px"}}
        >
            <Button
                style={{backgroundColor: "#FCD0A1", padding: "5px", minWidth: "0px", borderRadius: "20px"}}
                onClick={() => {
                    this.props.showApplicants(rowData)
                }}
                variant={"contained"}
                children={<PeopleAltIcon style={{fontSize: "20px", color: "black"}}/>}
            />
            <Button
                style={{backgroundColor: "#C9F9FF", padding: "5px", minWidth: "0px", borderRadius: "20px"}}
                onClick={() => {
                    this.props.showChart(rowData)
                }}
                variant={"contained"}
                children={<PieChartIcon style={{fontSize: "20px", color: "black"}}/>}
            />
            {futureEvent ? <Button
                style={{
                    backgroundColor: "#23CE6B",
                    padding: "5px",
                    minWidth: "0px",
                    borderRadius: "20px"
                }}
                onClick={() => {
                    this.props.onEdit(rowData)
                }}
                variant={"contained"}
                children={<EditIcon style={{fontSize: "20px", color: "black"}}/>}
            /> : (continuousEvent ? <Button
                style={{
                    backgroundColor: "azure",
                    padding: "5px",
                    minWidth: "0px",
                    borderRadius: "20px"
                }}
                onClick={() => this.props.openQandA(rowData.uuid, rowData.name)}
                variant={"contained"}
                children={<QuestionAnswerIcon style={{fontSize: "20px", color: "black"}}/>}
            /> : <Button
                    style={{
                        backgroundColor: "azure",
                        padding: "5px",
                        minWidth: "0px",
                        borderRadius: "20px"
                    }}
                    variant={"contained"}
                    children={<PollIcon style={{fontSize: "20px", color: "black"}}/>}
                />)}
            {futureEvent ? <Button
                style={{
                    backgroundColor: "#DE1A1A",
                    padding: "5px",
                    minWidth: "0px",
                    borderRadius: "20px"
                }}
                onClick={() => {
                    axios.post("http://localhost:8080/deleteEvent/" + rowData.uuid, null, {headers: authHeader()})
                    let newEvents = this.state.events
                    let index = this.state.events.findIndex((e) => e.uuid === rowData.uuid)
                    newEvents.splice(index, index + 1)
                    this.setState({events: newEvents})
                }}
                variant={"contained"}
                children={<DeleteRoundedIcon style={{fontSize: "20px", color: "black"}}/>}
            /> : <Button
                style={{
                    backgroundColor: "#C45BAA",
                    padding: "5px",
                    minWidth: "0px",
                    borderRadius: "20px"
                }}
                onClick={() => {
                    axios.get("http://localhost:8080/pickRandomParticipant/" + rowData.uuid)
                        .then(res => this.props.onDraw(res.data))
                }}
                variant={"contained"}
                children={<HowToVoteIcon style={{fontSize: "20px", color: "black"}}/>}
            />}
        </div>
    }

    quotaTemplate = (rowData) => {
        return <div>{rowData.applicantCount + "/" + rowData.quota}</div>
    }

    render() {
        return <div
            style={{
                height: "100%",
                padding: "20px",
            }}
        >
            <DataTable
                ref={(el) => this.dt = el}
                value={this.state.events}
                paginator={true}
                rows={5}
                resizableColumns
                reorderableColumns
                rowsPerPageOptions={[5, 10, 20]}
                scrollable
                scrollHeight={"500px"}
                currentPageReportTemplate={"{totalRecords} etkinlik arasından {first}-{last} arası gösteriliyor"}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            >
                <Column field="name"
                        header="Etkinlik İsmi"
                        sortable
                        filter
                        filterPlaceholder="Etkinlik ismine göre ara"
                        style={{width: "22%"}}
                        filterMatchMode="contains"
                />
                <Column field="startDate"
                        header="Başlangıç Tarihi"
                        sortable
                        style={{width: "11%", textAlign: "center"}}
                        body={this.dateTemplate}
                        filter
                        filterElement={this.dateFilter("startDate")}
                />
                <Column field="endDate"
                        header="Bitiş Tarihi"
                        sortable={true}
                        style={{width: "11%", textAlign: "center"}}
                        body={this.dateTemplate}
                        filter
                        filterElement={this.dateFilter("endDate")}
                />
                <Column field="quota"
                        header="Kontenjan"
                        sortable={true}
                        style={{width: "9%", textAlign: "center"}}
                        body={this.props.editable ? this.quotaTemplate : null}
                />
                {this.props.editable ?
                    <Column field="extraFields"
                            header="Ek Sorular"
                            style={{width: "12%"}}
                            body={this.extraFieldsTemplate}
                    /> : null}
                <Column field="eventLocation"
                        header="Konum"
                        style={{width: "24%"}}
                        body={this.locationTemplate}
                />
                <Column field="buttons"
                        style={{width: "11%"}}
                        body={this.buttonsTemplate}
                />
            </DataTable>
        </div>
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(EventTable)