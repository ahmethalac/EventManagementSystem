import React, {Component} from "react"
import Card from "@material-ui/core/Card";
import dateConverter from "../common/dateConverter";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import {ApplyDialog} from "./ApplyDialog";

class EventInformationCard extends Component{
    render(){
        return this.props.eventData ? <Card elevation="3">
            <div className="p-grid p-dir-col" style={{padding: "10px", margin: "0px"}}>
                <div className="p-col" style={{padding: "10px", textAlign: "center"}}>
                    <div style={{font: "bold 30px sans-serif", marginBottom: "10px", textTransform: "uppercase"}}>
                        {this.props.eventData.name}
                    </div>
                    <div style={{font: "lighter 15px Roboto"}}>
                        {dateConverter(this.props.eventData.startDate)}
                        {this.props.eventData.startDate === this.props.eventData.endDate ?
                            null : " - " + dateConverter(this.props.eventData.endDate)}
                    </div>
                </div>
                {this.props.mapVisible ? <div className="p-col" style={{padding: "0px", height: "200px"}}>
                    <Map
                        google={this.props.google}
                        zoom={15}
                        initialCenter={{lat: this.props.eventData.lat, lng: this.props.eventData.lng}}
                        center={{lat: this.props.eventData.lat, lng: this.props.eventData.lng}}
                        containerStyle={{position: "relative"}}
                        style={{border: "1px solid white", borderRadius: "5px", cursor: "pointer"}}
                    >
                        <Marker
                            position={{lat: this.props.eventData.lat, lng: this.props.eventData.lng}}
                        />
                    </Map>
                </div> : null}
            </div>
        </Card> : null
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(EventInformationCard)