package yte.intern.etkinlikYonetimSistemi.mapper;

import jdk.jfr.Name;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;
import yte.intern.etkinlikYonetimSistemi.dtos.EventDTO;
import yte.intern.etkinlikYonetimSistemi.entities.Applicant;
import yte.intern.etkinlikYonetimSistemi.entities.Event;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface EventMapper {

    @Mappings({
            @Mapping(source = "applicants", target = "applicantCount", qualifiedByName = "applicantsToApplicantCount" )
    })
    EventDTO mapToDto(Event student);

    List<EventDTO> mapToDto(List<Event> studentList);

    Event mapToEntity(EventDTO studentDTO);

    List<Event> mapToEntity(List<EventDTO> studentDTOList);

    @Named("applicantsToApplicantCount")
    public static int applicantsToApplicantCount(Set<Applicant> set){
        return set.size();
    }
}