package yte.intern.etkinlikYonetimSistemi.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.boot.jackson.JsonComponent;
import yte.intern.etkinlikYonetimSistemi.entities.ExtraField;

import java.io.IOException;

@JsonComponent
public class ExtraFieldJsonSerializer extends JsonSerializer<ExtraField> {
    @Override
    public void serialize(ExtraField extraField, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeString(extraField.getQuestion());
    }
}
