package yte.intern.etkinlikYonetimSistemi.entities;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import yte.intern.etkinlikYonetimSistemi.serializers.LocalDateDeserializer;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idgen", sequenceName = "EVENT_SEQ")
public class Event extends BaseEntity {

    private String uuid;

    @Column(name = "NAME")
    private String name;

    @Column(name = "START_DATE")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate startDate;

    @Column(name = "END_DATE")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate endDate;

    @Column(name = "QUOTA")
    private int quota;

    //Coordinates
    @Column(name = "LAT_COORDINATE")
    private double lat;
    @Column(name = "LNG_COORDINATE")
    private double lng;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id")
    @OrderBy("id")
    private Set<ExtraField> extraFields;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private Set<Applicant> applicants;

    public void setValues(Event event){
        this.setName(event.getName());
        this.setStartDate(event.getStartDate());
        this.setEndDate(event.getEndDate());
        this.setQuota(event.getQuota());
        this.setLat(event.getLat());
        this.setLng(event.getLng());
        this.setExtraFields(event.getExtraFields());
    }

}
