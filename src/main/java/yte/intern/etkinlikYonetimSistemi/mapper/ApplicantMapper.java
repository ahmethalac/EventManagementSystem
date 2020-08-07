package yte.intern.etkinlikYonetimSistemi.mapper;

import org.mapstruct.Mapper;
import yte.intern.etkinlikYonetimSistemi.dtos.ApplicantDTO;
import yte.intern.etkinlikYonetimSistemi.dtos.EventDTO;
import yte.intern.etkinlikYonetimSistemi.entities.Applicant;
import yte.intern.etkinlikYonetimSistemi.entities.Event;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ApplicantMapper {

    ApplicantDTO mapToDto(Applicant student);

    List<ApplicantDTO> mapToDto(List<Applicant> studentList);

    Applicant mapToEntity(ApplicantDTO studentDTO);

    List<Applicant> mapToEntity(List<ApplicantDTO> studentDTOList);
}