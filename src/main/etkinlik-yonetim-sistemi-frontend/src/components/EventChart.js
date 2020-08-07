import React, {Component} from "react"
import {Chart} from "primereact/chart";
import axios from "axios"
import authHeader from "./Authentication/authHeader";

class EventChart extends Component {

    constructor(props) {
        super(props);
        this.chart = React.createRef();
    }

    state = {
        labels: [],
        applicantCounts: []
    }

    componentDidMount() {
        axios.get("http://localhost:8080/getEvents", {headers: authHeader()})
            .then(response => {
                response.data.forEach((e) => {
                    this.setState(prevState => ({
                        labels: [...prevState.labels, e.name],
                        applicantCounts: [...prevState.applicantCounts, e.applicantCount]
                    }))
                })
            })
    }

    render() {
        const colors = ["#ffbc5f","#4392f1","#00B295","#f93943", "#AF7595", "#595959", "#f6eb49"]
        return <div style={{padding: "10px", height: "100%"}}>
            <Chart type="bar"
                   ref={this.chart}
                   data={
                       {
                           labels: this.state.labels,
                           datasets: [
                               {
                                   label: "Katılımcı sayısı",
                                   data: this.state.applicantCounts,
                                   backgroundColor: colors,
                                   barPercentage: 0.5,
                               }
                           ],

                       }
                   }
                   style={{height: "100%"}}
                   options={
                       {
                           layout: {fontColor: "blue"},
                           legend: {display: false},
                           maintainAspectRatio: false,
                           scales: {
                               yAxes: [{
                                   type: "linear",
                                   ticks:{
                                       stepSize: 1,
                                       beginAtZero: true
                                   }
                               }
                               ],
                               xAxes: [{
                                   gridLines:{
                                       display: false
                                   }
                               }]
                           }
                       }
                   }/>
        </div>
    }
}

export default EventChart