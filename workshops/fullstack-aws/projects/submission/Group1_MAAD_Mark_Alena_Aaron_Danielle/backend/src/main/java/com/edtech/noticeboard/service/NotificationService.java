package com.edtech.noticeboard.service;

import com.edtech.noticeboard.model.ProgressLog;
import com.edtech.noticeboard.repository.ProgressLogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final ProgressLogRepository progressLogRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${notification.recipient}")
    private String recipientAddress;

    public NotificationService(ProgressLogRepository progressLogRepository, JavaMailSender mailSender) {
        this.progressLogRepository = progressLogRepository;
        this.mailSender = mailSender;
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendBlockedTraineeDigest() {
        List<ProgressLog> blocked = progressLogRepository.findByStatus("BLOCKED");
        if (blocked.isEmpty()) {
            return;
        }

        String body = blocked.stream()
                .map(this::describe)
                .collect(Collectors.joining("\n"));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(recipientAddress);
        message.setSubject("Blocked trainees digest (" + blocked.size() + ")");
        message.setText(body);
        mailSender.send(message);
    }

    private String describe(ProgressLog log) {
        String note = log.getSubmissionNote() != null ? ": " + log.getSubmissionNote() : "";
        return "Trainee " + log.getTraineeId() + " is blocked on module " + log.getModuleId() + note;
    }
}
