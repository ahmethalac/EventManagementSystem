package yte.intern.etkinlikYonetimSistemi.helpers;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import yte.intern.etkinlikYonetimSistemi.entities.Applicant;

public class QRCodeGenerator {
    public static byte[] getQRCodeImage(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "png", byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }

    public static byte[] getApplicantQRCode(Applicant applicant, int width, int height) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        String qrText =
                "Etkinlik Adı: "
                        + applicant.getEvent().getName()
                        + "\nBaşlangıç Tarihi: "
                        + applicant.getEvent().getStartDate().format(formatter)
                        + "\nBitiş Tarihi: "
                        + applicant.getEvent().getEndDate().format(formatter)
                        + "\nAd Soyad: "
                        + applicant.getNameSurname()
                        + "\nTC Kimlik No: "
                        + applicant.getTcKimlikNo();
        return getQRCodeImage(qrText, width, height);
    }
}
