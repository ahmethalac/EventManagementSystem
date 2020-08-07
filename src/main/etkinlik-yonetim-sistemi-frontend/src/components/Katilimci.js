import React, {Component} from "react"
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EventTable from "./EventTable";
import ApplyDialog from "./ApplyDialog";
import {Dialog, Menu} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import AuthService from "./Authentication/AuthService";
import axios from "axios"
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import QuestionDialog from "./QuestionDialog";

export function SimpleMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        AuthService.logout()
        window.location.reload(false)
        setAnchorEl(null);
    };

    return <div>
        <IconButton
            children={<AccountCircleIcon onClick={handleClick} style={{fontSize: "40px"}}/>}
            style={{color: "white", fontSize: "2.5em", height: "100%", padding: "0px"}}
        />
        {props.disabled ? null : <Menu open={Boolean(anchorEl)}
                                       anchorEl={anchorEl}
        >
            <MenuItem onClick={handleClose}>Çıkış Yap</MenuItem>
        </Menu>}
    </div>
}

class Katilimci extends Component {

    constructor() {
        super();
        this.applyDialog = React.createRef();
    }

    state = {
        applyDialogIsOpen: false,
        qrCodeIsOpen: false,
        questionDialogIsOpen: false,
        qrCodeRequest: ""
    }

    myAppBar() {
        return <div className="p-grid p-justify-end"
                    style={{
                        backgroundColor: "#1976D2",
                        margin: "0px",
                        boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.7)",
                        position: "sticky"
                    }}>
            <div className="p-col-fixed" style={{width: "20vw", minWidth: "150px", padding: "0px"}}>
                <div className="p-grid" style={{margin: "0px"}}>
                    <div className="p-col"
                         style={{
                             display: "flex", justifyContent: "right", alignItems: "center",
                             padding: "0px", color: "white", fontSize: "20px"
                         }}
                    >
                        {AuthService.getCurrentUser() ? AuthService.getCurrentUser().username : "Guest"}
                    </div>
                    <div className="p-col-fixed"
                         style={{padding: "5px"}}>
                        <SimpleMenu disabled={!AuthService.getCurrentUser()}/>
                    </div>
                </div>
            </div>
        </div>
    }

    qrCodeDialog() {
        return <Dialog
            open={this.state.qrCodeIsOpen}
            keepMounted
            onClose={() => {
                this.setState({qrCodeIsOpen: false})
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            maxWidth={"md"}
        >
            <DialogTitle id="alert-dialog-slide-title" style={{textAlign: "center"}}>
                Etkinliğe başarıyla kaydoldunuz.
                <br/>
                Ekranda gözüken QRCode ile etkinlik günü giriş yapabilirsiniz
            </DialogTitle>
            <DialogContent style={{padding: "0px", display: "flex", justifyContent: "center"}}>
                <img src={this.state.qrCodeRequest} alt={"ss"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({qrCodeIsOpen: false})} color={"primary"}>
                    KAPAT
                </Button>
            </DialogActions>
        </Dialog>
    }

    render() {
        return this.userPage()
    }

    userPage() {
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
            <EventTable
                onRef={ref => (this.dataTable = ref)}
                onApply={(rowData) => {
                    this.setState({applyDialogIsOpen: true})
                    this.applyDialog.setValues(rowData)
                }}
                onQuestion={(uuid, name) => {
                    this.setState({questionDialogIsOpen: true})
                    this.questionDialog.setValues(uuid)
                }}
            />
            <ApplyDialog
                onRef={ref => (this.applyDialog = ref)}
                open={this.state.applyDialogIsOpen}
                onClose={() => this.setState({applyDialogIsOpen: false})}
                onSubmit={() => this.setState({qrCodeIsOpen: true})}
                setApplicantCount={(uuid, applicantCount) => this.dataTable.setApplicantCount(uuid, applicantCount)}
                getQRCode={(e) => {
                    axios.get("http://localhost:8080/getQRCode/" + e, {responseType: "arraybuffer"})
                        .then(response => {
                                console.log(response)
                                this.setState({qrCodeRequest: "data:image/png;base64," + Buffer.from(response.data, 'binary').toString('base64')})
                            }
                        )
                }}
            />
            {this.qrCodeDialog()}
            <QuestionDialog
                onRef={ref => (this.questionDialog = ref)}
                open={this.state.questionDialogIsOpen}
                onClose={() => this.setState({questionDialogIsOpen: false})}
            />
        </div>;
    }
}

export default Katilimci