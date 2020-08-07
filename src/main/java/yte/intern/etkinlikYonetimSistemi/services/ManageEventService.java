package yte.intern.etkinlikYonetimSistemi.services;

import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.context.support.ServletContextResource;
import yte.intern.etkinlikYonetimSistemi.entities.Applicant;
import yte.intern.etkinlikYonetimSistemi.entities.Event;
import yte.intern.etkinlikYonetimSistemi.entities.ExtraField;
import yte.intern.etkinlikYonetimSistemi.helpers.QRCodeGenerator;
import yte.intern.etkinlikYonetimSistemi.repositories.ApplicantRepository;
import yte.intern.etkinlikYonetimSistemi.repositories.EventRepository;
import yte.intern.etkinlikYonetimSistemi.repositories.ExtraFieldRepository;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ManageEventService {

    private final EventRepository eventRepository;
    private final ExtraFieldRepository extraFieldRepository;
    private final ApplicantRepository applicantRepository;
    private final JavaMailSender javaMailSender;

    public List<Event> getEvents(){
        return eventRepository.findAll();
    }

    public List<Event> getFutureEvents(){
        return eventRepository.findByEndDateGreaterThanEqual(LocalDate.now());
    }

    public Event addEvent(Event event){
        return eventRepository.save(event);
    }

    public Event updateEvent(String uuid, Event newEvent){
        Event eventFromDB = eventRepository.findByUuid(uuid);
        ArrayList<Long> oldExtraFieldIds = new ArrayList<>();
        eventFromDB.getExtraFields().forEach(extraField -> oldExtraFieldIds.add(extraField.getId()));
        eventFromDB.setValues(newEvent);
        oldExtraFieldIds.forEach(extraFieldRepository::deleteById);
        return eventRepository.save(eventFromDB);
    }

    public void deleteEventByUuid(String uuid){
        eventRepository.deleteByUuid(uuid);
    }

    public Event getEventByUuid(String uuid){
        return eventRepository.getByUuid(uuid);
    }

    public List<Applicant> getApplicantsFromEvent(String uuid){
        Event event = eventRepository.getByUuid(uuid);
        return applicantRepository.getAllByEvent(event);
    }
    public Applicant addApplicant(Applicant applicant){
        return applicantRepository.save(applicant);
    }

    public Applicant getApplicantByUuid(String uuid){
        return applicantRepository.getByUuid(uuid);
    }

    public void sendQRCodeMail(Applicant applicant) throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message,true);

        helper.setFrom("ytedeneme1@gmail.com");
        helper.setTo(applicant.getEmail());

        helper.setSubject("Etkinlik başvurunuz onaylandı");
        helper.setText(
              "<html>"
              + "<body>"
              + "<div>Etkinlik günü bu QRCode'u kullanarak giriş yapabilirsiniz"
                + "<div><img src='cid:qrCode'/></div></body></html>",true);

        Resource res = new UrlResource("http://localhost:8080/getQRCode/" + applicant.getUuid());
        helper.addInline("qrCode",res);
        javaMailSender.send(message);
    }

    public Applicant getRandomParticipant(String uuid){
        Event event = getEventByUuid(uuid);
        return applicantRepository.getRandomParticipant(event.getId());
    }
}
