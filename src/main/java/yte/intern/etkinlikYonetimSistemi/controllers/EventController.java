package yte.intern.etkinlikYonetimSistemi.controllers;

import lombok.RequiredArgsConstructor;
import org.hibernate.validator.internal.constraintvalidators.bv.NotBlankValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import yte.intern.etkinlikYonetimSistemi.dtos.ApplicantDTO;
import yte.intern.etkinlikYonetimSistemi.dtos.EventDTO;
import yte.intern.etkinlikYonetimSistemi.entities.Applicant;
import yte.intern.etkinlikYonetimSistemi.entities.Event;
import yte.intern.etkinlikYonetimSistemi.helpers.QRCodeGenerator;
import yte.intern.etkinlikYonetimSistemi.mapper.ApplicantMapper;
import yte.intern.etkinlikYonetimSistemi.mapper.EventMapper;
import yte.intern.etkinlikYonetimSistemi.services.ManageEventService;

import javax.mail.MessagingException;
import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class EventController {

    private final ManageEventService manageEventService;
    private final EventMapper eventMapper;
    private final ApplicantMapper applicantMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/addEvent")
    @PreAuthorize("hasRole('ADMIN')")
    public EventDTO addEvent(@RequestBody @Valid EventDTO eventDTO){
        Event event = eventMapper.mapToEntity(eventDTO);
        event.setUuid(UUID.randomUUID().toString());
        event.setApplicants(Set.of());
        Event addedEvent = manageEventService.addEvent(event);
        return eventMapper.mapToDto(addedEvent);
    }

    @GetMapping("/getEvents")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EventDTO> getEvents(){
        List<Event> events = manageEventService.getEvents();
        return eventMapper.mapToDto(events);
    }

    @GetMapping("/getFutureEvents")
    public List<EventDTO> getFutureEvents(){
        List<Event> events = manageEventService.getFutureEvents();
        return eventMapper.mapToDto(events);
    }

    @PostMapping("/updateEvent")
    @PreAuthorize("hasRole('ADMIN')")
    public EventDTO editEvent(@RequestBody @Valid EventDTO eventDTO){
        Event event = manageEventService.updateEvent(eventDTO.getUuid(), eventMapper.mapToEntity(eventDTO));
        return eventMapper.mapToDto(event);
    }

    @PostMapping("/deleteEvent/{uuid}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteEvent(@PathVariable String uuid){
        manageEventService.deleteEventByUuid(uuid);
    }

    @PostMapping("/applyEvent/{uuid}")
    public ResponseEntity<Object> applyEvent(@PathVariable String uuid, @RequestBody @Valid ApplicantDTO applicantDTO) throws IOException, MessagingException {
        if (applicantDTO
                .getAnswers()
                .stream()
                .anyMatch(answer -> answer.getAnswer().isBlank()))
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ek sorular boş bırakılamaz");
        }
        Event event = manageEventService.getEventByUuid(uuid);
        if (event.getApplicants().size() >= event.getQuota()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("quota");
        }
        if (event
                .getApplicants()
                .stream()
                .anyMatch(applicant -> applicant.getTcKimlikNo().equals(applicantDTO.getTcKimlikNo())))
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Bu TC Kimlik No ile başvuru yapılmış");
        }
        else{
            Applicant applicant = applicantMapper.mapToEntity(applicantDTO);
            applicant.setUuid(UUID.randomUUID().toString());
            applicant.setEvent(event);
            manageEventService.addApplicant(applicant);
            new Thread(() -> {
                try {
                    manageEventService.sendQRCodeMail(applicant);
                } catch (MessagingException | IOException e) {
                    e.printStackTrace();
                }
            }).start();
            Map<String, String> websocketMessage = new HashMap<>();
            websocketMessage.put("eventName", event.getName());
            websocketMessage.put("applicantName", applicant.getNameSurname());
            websocketMessage.put("tcKimlikNo", applicant.getTcKimlikNo());
            this.messagingTemplate.convertAndSend("/topic/applicantNotification", websocketMessage);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(applicant.getUuid());
        }
    }

    @GetMapping("/getApplicants/{uuid}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ApplicantDTO> getApplicants(@PathVariable String uuid){
        List<Applicant> applicants = manageEventService.getApplicantsFromEvent(uuid);
        return applicantMapper.mapToDto(applicants);
    }

    @GetMapping("/getQRCode/{uuid}")
    public ResponseEntity<byte[]> getQRCode(@PathVariable String uuid){
        Applicant applicant = manageEventService.getApplicantByUuid(uuid);
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.IMAGE_PNG)
                .body(QRCodeGenerator.getApplicantQRCode(applicant,300,300));
    }

    @GetMapping("/getApplicationDayData/{uuid}")
    public Map<Object,Long> getApplicationDayData(@PathVariable String uuid){
        manageEventService.getEventByUuid(uuid).getApplicants().forEach(applicant -> {
            if(applicant.getNameSurname().equals("ahmet")){
                applicant.setCreationDate(LocalDateTime.of(2020,7,24,10,10));
            }
        });
        return manageEventService
                .getEventByUuid(uuid)
                .getApplicants()
                .stream()
                .collect(Collectors.groupingBy(applicant -> applicant.getCreationDate().toLocalDate(), Collectors.counting()));
    }

    @GetMapping("/getEventFromApplicant/{uuid}")
    public EventDTO getEventFromApplicant(@PathVariable String uuid){
        System.out.println(uuid);
        Applicant applicant = manageEventService.getApplicantByUuid(uuid);
        EventDTO eventDTO = null;
        if (applicant != null) {
            if (applicant.getEvent() != null) {
                eventDTO = eventMapper.mapToDto(applicant.getEvent());
            }
        }
        System.out.println(eventDTO == null);
        return eventDTO;
    }

    @PostMapping("/checkApplicantForQandA/{uuid}/{tcKimlikNo}")
    public String checkApplicantForQandA(@PathVariable("uuid") String uuid, @PathVariable("tcKimlikNo") String tcKimlikNo){
        Event event = manageEventService.getEventByUuid(uuid);
        Optional<Applicant> searchResult = event
                .getApplicants()
                .stream()
                .filter(applicant -> applicant.getTcKimlikNo().equals(tcKimlikNo))
                .findAny();
        if (searchResult.isPresent()){
            if (searchResult.get().isAttended()) {
                return searchResult.get().getNameSurname();
            }
            else{
                return "notAttended";
            }
        }else{
            return "notFound";
        }
    }

    @GetMapping("/setAttendedProperty/{uuid}/{value}")
    public void setAttendedProperty(@PathVariable("uuid") String uuid, @PathVariable("value") Boolean value){
        Applicant applicant = manageEventService.getApplicantByUuid(uuid);
        applicant.setAttended(value);
        manageEventService.addApplicant(applicant);
    }

    @GetMapping("/pickRandomParticipant/{uuid}")
    public ApplicantDTO pickRandomParticipant(@PathVariable String uuid){
        Applicant applicant = manageEventService.getRandomParticipant(uuid);
        return applicant == null ? null : applicantMapper.mapToDto(applicant);
    }
}
