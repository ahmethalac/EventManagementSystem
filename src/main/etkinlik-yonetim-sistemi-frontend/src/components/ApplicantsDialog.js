import React, {Component} from "react"
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Zoom from "@material-ui/core/Zoom";
import axios from "axios"
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import authHeader from "./Authentication/authHeader";
import {Checkbox} from "@material-ui/core";

const ZoomTransition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

class ApplicantsDialog extends Component {

    constructor() {
        super();
        this.nameInput = React.createRef();
        this.messages = React.createRef();
    }

    state = {
        eventData: "",
        applicants: []
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    setValues(data){
        this.setState({eventData: data})
        axios.get("http://localhost:8080/getApplicants/" + data.uuid, {headers: authHeader()})
            .then(response => this.setState({applicants: response.data}))
    }

    extraFieldTemplate(rowData, column){
        let result = ""
        rowData.answers.forEach(value => {
            if (value.question === column.field){
                result = value.answer
            }
        })
        return result
    }

    editApplicant(rowData, checked) {
        let index = this.state.applicants.findIndex((e) => e.uuid === rowData.uuid)
        rowData.attended = checked
        let newApplicants = this.state.applicants
        console.log(rowData)
        newApplicants.splice(index, 1, rowData)
        this.setState({events: newApplicants})
    }

    attendedTemplate = (rowData) => {
        return <Checkbox
            checked={Boolean(rowData.attended)}
            onChange={(event, checked) => {
                axios.get("http://localhost:8080/setAttendedProperty/" + rowData.uuid + "/" + checked)
                this.editApplicant(rowData,checked)
            }}
            color="black"
        />
    }

    content(){
        return <DataTable
            emptyMessage={"Henüz bu etkinliğe başvuran bulunmamaktadır"}
            header={(this.state.eventData ? this.state.eventData.name.toUpperCase() : "" )+ " ETKİNLİĞİ KATILIMCI LİSTESİ "}
            footer={"Toplam katılımcı sayısı: " + this.state.applicants.length}
            value={this.state.applicants}
            resizableColumns
            reorderableColumns
            scrollable
            scrollHeight={"400px"}
            autoLayout
            rowHover
            columnResizeMode={"expand"}
            style={{width: ((this.state.eventData ? this.state.eventData.extraFields.length * 150 : 0) + 700) + "px", maxWidth: "100%"}}
        >
            <Column field="nameSurname"
                    header="İsim Soyisim"
                    sortable
                    filter
                    filterPlaceholder="İsme göre ara"
                    filterMatchMode="contains"
                    style={{width: "200px"}}
            />
            <Column field="tcKimlikNo"
                    header="TC Kimlik Numarası"
                    style={{width: "150px"}}
            />
            <Column field="email"
                    header="E-Posta Adresi"
                    style={{width: "200px"}}
            />
            {this.state.eventData ? this.state.eventData.extraFields.map(value => {
                return <Column field={value} header={value} body={this.extraFieldTemplate}/>
            }) : null}
            <Column field="attended"
                    header="Katıldı mı?"
                    style={{width: "100px"}}
                    body={this.attendedTemplate}
            />
        </DataTable>
    }

    render() {
        return <Dialog
            open={this.props.open}
            TransitionComponent={ZoomTransition}
            keepMounted
            onClose={() => {
                this.props.onClose()
            }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            maxWidth={"lg"}
        >
            <DialogContent style={{padding: "20px"}}>
                {this.content()}
            </DialogContent>
        </Dialog>
    }
}

export default ApplicantsDialog