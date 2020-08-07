package yte.intern.etkinlikYonetimSistemi.websocket;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    private String questioner;
    private String question;
    private String tcKimlikNo;
    private String eventUuid;

    @Override
    public String toString() {
        return questioner + ": " + question;
    }
}
