package yte.intern.etkinlikYonetimSistemi.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class QuestionController {
    final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/question")
    public void getQuestion(Question question) throws Exception{
        System.out.println(question.toString());
        this.simpMessagingTemplate.convertAndSend("/topic/answers/" + question.getEventUuid(), question.toString());
        this.simpMessagingTemplate.convertAndSend("/topic/question/" + question.getTcKimlikNo(), "Mesajınız iletildi");
    }
}
