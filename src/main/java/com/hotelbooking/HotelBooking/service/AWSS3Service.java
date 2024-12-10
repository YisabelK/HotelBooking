package com.hotelbooking.HotelBooking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

/*
 * AWS S3 Service: Image upload to S3 bucket
 * Updated to latest version
 */
@Service
public class AWSS3Service {
    private final S3Client s3Client;
    private final String bucketName;

    public AWSS3Service(
            @Value("${aws.s3.access.key}") String accessKey,
            @Value("${aws.s3.secret.key}") String secretKey,
            @Value("${bucket-name}") String bucketName
    ) {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);

        this.s3Client = S3Client.builder()
                .region(Region.EU_NORTH_1)
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
        this.bucketName = bucketName;
    }

    public String saveImageToS3(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
    }
}
