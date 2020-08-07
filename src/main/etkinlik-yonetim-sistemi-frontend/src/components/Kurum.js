import React, {Component} from "react"
import "primeflex/primeflex.css"
import axios from "axios";
import "../styles/EventFormDialog.css"
import Button from "@material-ui/core/Button";
import "primereact/resources/primereact.css"
import "primereact/resources/primereact.min.css"
import 'react-calendar/dist/Calendar.css'
import "primereact/resources/themes/nova-light/theme.css"
import EventTable from "./EventTable";
import EventFormDialog from "./EventFormDialog";
import {Growl} from "primereact/growl";
import ApplicantsDialog from "./ApplicantsDialog";
import EventChart from "./EventChart";
import ApplicationDatesChartDialog from "./ApplicationDatesChartDialog";
import AuthService from "./Authentication/AuthService";
import authHeader from "./Authentication/authHeader";
import {SimpleMenu} from "./Katilimci";
import WebSocket from "./WebSocket";
import QandADialog from "./QandADialog";

export function goToLoginPage(history) {
    return <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "azure",
            alignItems: "center",
            fontSize: "30px"
        }}
    >
        BU SAYFAYI GÖRÜNTÜLEME YETKİNİZ YOK
        <Button
            onClick={() => history.push("/")}
            children={"GİRİŞ EKRANINA GİT"}
            style={{backgroundColor: "lightgreen", font: "30px bold sans-serif", padding: "20px", marginTop: "20px"}}
        />
    </div>;
}

class Kurum extends Component {

    state = {
        addEventDialogIsOpen: false,
        editEventDialogIsOpen: false,
        applicantsDialogIsOpen: false,
        applicationDatesChartDialogIsOpen: false,
        qandADialogIsOpen: false,
        visibleTab: "events",
        isAdmin: false
    }

    constructor(props) {
        super(props);
        this.growl = React.createRef();
    }

    componentDidMount() {
        if (AuthService.getCurrentUser()) {
            AuthService.validate()
                .catch(() => {
                    AuthService.logout()
                    window.location.reload(false)
                })
        }
        this.setState({isAdmin: AuthService.getCurrentUser() && AuthService.getCurrentUser().roles[0] === "ROLE_ADMIN"})
        if (this.state.isAdmin) {
        }
    }

    myAppBar() {
        return <div className="p-grid p-justify-between"
                    style={{
                        backgroundColor: "#1976D2",
                        margin: "0px",
                        boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.7)",
                        position: "sticky"
                    }}>
            <div className="p-col-fixed" style={{width: "50vw", minWidth: "300px", padding: "0px"}}>
                <div className="p-grid" style={{margin: "0px", height: "100%"}}>
                    <div className="p-col" style={{padding: "0px"}}>
                        <Button style={
                            {
                                height: "100%", width: "100%", padding: "0px 20px",
                                color: "white", fontSize: "15px"
                            }}
                                onClick={() => {
                                    this.setState({addEventDialogIsOpen: true})
                                }}
                        >
                            YENİ ETKİNLİK
                        </Button>
                    </div>
                    <div className="p-col" style={{padding: "0px"}}>
                        <Button style={
                            {
                                height: "100%", width: "100%", padding: "0px 20px",
                                color: "white", fontSize: "15px"
                            }}
                                onClick={() => this.setState({visibleTab: "events"})}
                        >
                            LİSTELE
                        </Button>
                    </div>
                    <div className="p-col" style={{padding: "0px"}}>
                        <Button style={
                            {
                                height: "100%", width: "100%", padding: "0px 20px",
                                color: "white", fontSize: "15px"
                            }}
                                onClick={() => {
                                    this.setState({visibleTab: "chart"})
                                }}
                        >
                            CHART
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-col-fixed" style={{width: "20vw", minWidth: "150px", padding: "0px"}}>
                <div className="p-grid" style={{margin: "0px"}}>
                    <div className="p-col"
                         style={{
                             display: "flex", justifyContent: "right", alignItems: "center",
                             padding: "0px", color: "white", fontSize: "20px"
                         }}
                    >
                        {AuthService.getCurrentUser().username}
                    </div>
                    <div className="p-col-fixed"
                         style={{padding: "5px"}}><SimpleMenu/>
                    </div>
                </div>
            </div>
        </div>
    }

    mainContent() {
        switch (this.state.visibleTab) {
            case "events":
                return <EventTable
                    editable
                    onEdit={this.openEditDialog}
                    showApplicants={this.openApplicantsDialog}
                    showChart={this.showChart}
                    openQandA={(uuid, name) => {
                        this.qandADialog.setValues(uuid, name)
                        this.setState({qandADialogIsOpen: true})
                    }}
                    onDraw={(data) => this.growl.show(
                        {
                            sticky: true,
                            severity: "info",
                            summary: "Çekilişi Kazanan",
                            detail: data.nameSurname
                        })}
                    onRef={ref => (this.dataTable = ref)}
                />
            case "chart":
                return <EventChart/>
            default:
                return null
        }
    }

    openEditDialog = (event) => {
        this.editDialog.setValues(event)
        this.setState({editEventDialogIsOpen: true})
    }

    openApplicantsDialog = (event) => {
        this.applicantsDialog.setValues(event)
        this.setState({applicantsDialogIsOpen: true})
    }

    showChart = (event) => {
        axios.get("http://localhost:8080/getApplicationDayData/" + event.uuid, {headers: authHeader()})
            .then(response => {
                console.log(response.data)
                this.applicationDatesChart.setValues(response.data)
            })
        this.setState({applicationDatesChartDialogIsOpen: true})
    }

    render() {
        return this.state.isAdmin ? this.adminPage() : goToLoginPage(this.props.history)
    }

    adminPage() {
        return <div
            style={{
                height: "100%",
                backgroundColor: "azure",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}
        >
            {this.myAppBar()}
            <Growl ref={(el) => this.growl = el}/>
            <EventFormDialog
                onRef={ref => (this.addDialog = ref)}
                open={this.state.addEventDialogIsOpen}
                close={() => this.setState({addEventDialogIsOpen: false})}
                dataTable={this.dataTable}
                growl={this.growl}
            />
            <EventFormDialog
                onRef={ref => (this.editDialog = ref)}
                open={this.state.editEventDialogIsOpen}
                type="edit"
                close={() => this.setState({editEventDialogIsOpen: false})}
                dataTable={this.dataTable}
                growl={this.growl}
            />
            <ApplicantsDialog
                onRef={ref => (this.applicantsDialog = ref)}
                open={this.state.applicantsDialogIsOpen}
                onClose={() => this.setState({applicantsDialogIsOpen: false})}
            />
            <ApplicationDatesChartDialog
                onRef={ref => (this.applicationDatesChart = ref)}
                open={this.state.applicationDatesChartDialogIsOpen}
                onClose={() => this.setState({applicationDatesChartDialogIsOpen: false})}
            />
            {this.mainContent()}
            <WebSocket
                onNotification={(msg) => {
                    this.growl.show(
                        {
                            life: 5000,
                            severity: "info",
                            summary: msg.eventName + " Yeni Başvuru",
                            detail: msg.applicantName + " - " + msg.tcKimlikNo
                        })
                }}
                topics={['/topic/applicantNotification']}
            />
            <QandADialog
                onRef={ref => (this.qandADialog = ref)}
                open={this.state.qandADialogIsOpen}
                onClose={() => this.setState({qandADialogIsOpen: false})}
            />
        </div>;
    }
}

export default Kurum