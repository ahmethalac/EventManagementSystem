import React, {Component} from "react"
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Zoom from "@material-ui/core/Zoom";
import dateConverter from "../common/dateConverter";
import {Chart} from "primereact/chart";

const ZoomTransition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

class ApplicationDatesChartDialog extends Component {

    state = {
        labels: [],
        data: []
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    setValues(data){
        //Data is a Java Map as JSON object
        this.setState({labels: [], data: []})
        Object.keys(data).forEach(value => {
            this.setState(prevState => ({
                labels: [...prevState.labels, dateConverter(value)],
                data: [...prevState.data, data[value]]
            }))
        })
    }

    content(){
        const colors = ["#ffbc5f","#4392f1","#00B295","#f93943", "#AF7595", "#595959", "#f6eb49"]
        return <Chart type="pie"
                      data={
                          {
                              labels: this.state.labels,
                              datasets: [
                                  {
                                      label: "Başvuran kişi sayısı",
                                      data: this.state.data,
                                      backgroundColor: colors,
                                  }
                              ],

                          }
                      }
                      style={{height: "450px"}}
                      options={{
                          maintainAspectRatio: false,
                          legend: {
                              position: 'left',
                              labels:{
                                  fontSize: 14,
                                  fontColor: "black",
                                  fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                  usePointStyle: true
                              }
                          }
                      }}
        />
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
            fullWidth
            maxWidth={"sm"}>
            <DialogTitle style={{textAlign: "center"}}>
                BAŞVURULAN GÜNLERE GÖRE GRAFİK
            </DialogTitle>
            <DialogContent>
                {this.content()}
            </DialogContent>
        </Dialog>
    }
}

export default ApplicationDatesChartDialog