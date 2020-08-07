package yte.intern.etkinlikYonetimSistemi.dtos;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import yte.intern.etkinlikYonetimSistemi.entities.ExtraField;
import yte.intern.etkinlikYonetimSistemi.serializers.LocalDateDeserializer;

import javax.persistence.Column;
import javax.validation.constraints.*;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@ToString
public class EventDTO {

    private String uuid;

    @NotBlank(message = "Event name can't be empty")
    private String name;

    @FutureOrPresent
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate startDate;


    @Column(name = "END_DATE")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate endDate;

    @AssertTrue
    public boolean isEndDateValid(){
        return !startDate.isAfter(endDate);
    }

    @Min(value = 1, message = "Quota must be greater than 0")
    private int quota;

    //Coordinates
    private double lat;
    private double lng;

    private Set<ExtraField> extraFields;

    private int applicantCount;
}
