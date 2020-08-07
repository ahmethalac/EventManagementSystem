package yte.intern.etkinlikYonetimSistemi.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import yte.intern.etkinlikYonetimSistemi.entities.Answer;

import java.io.IOException;

public class AnswerSerializer extends JsonSerializer<Answer> {
    @Override
    public void serialize(Answer answer, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("question",answer.getQuestion());
        jsonGenerator.writeStringField("answer",answer.getAnswer());
        jsonGenerator.writeEndObject();
    }
}
