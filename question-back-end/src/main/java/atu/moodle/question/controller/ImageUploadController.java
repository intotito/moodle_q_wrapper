package atu.moodle.question.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "/api/upload")
public class ImageUploadController {

    private static final String UPLOADED_FOLDER = "C:\\users\\intot\\cdn\\";

    // Endpoint to handle file uploads
    @PostMapping("/file")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("image") MultipartFile file) {
        // print request
    	System.out.println("File Upload Request: " + file.getOriginalFilename());
    	Map<String, Object> response = new HashMap<>();
        try {
            // Check if file is empty
            if (file.isEmpty()) {
                response.put("success", 0);
                response.put("message", "File is empty");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // Ensure the uploads directory exists
            File dir = new File(UPLOADED_FOLDER);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Save the file locally
            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOADED_FOLDER + file.getOriginalFilename());
            Files.write(path, bytes);

            // Create response with file URL
            response.put("success", 1);
            Map<String, String> fileData = new HashMap<>();
            fileData.put("url", "http://zerofourtwo.net/api/cdn/" + file.getOriginalFilename());
            response.put("file", fileData);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("success", 0);
            response.put("message", "Upload failed");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Endpoint to handle image URL fetch

    
    @PostMapping("/url")
    public ResponseEntity<Map<String, Object>> fetchImageByUrl(@RequestBody Map<String, String> imageMap) throws URISyntaxException {
    	// print request header and body
    	System.out.println("Image URL Fetch Request: " + imageMap);
    	var imageUrl = imageMap.get("url");
        Map<String, Object> response = new HashMap<>();

        try {
            // Download the image
            URL url = new URI(imageUrl).toURL();
            InputStream inputStream = url.openStream();

            // Generate a unique name for the file
            String fileExtension = getFileExtensionFromUrl(imageUrl);
            String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;
            Path path = Paths.get(UPLOADED_FOLDER + uniqueFileName);

            // Ensure the uploads directory exists
            File dir = new File(UPLOADED_FOLDER);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Save the file locally
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
            IOUtils.closeQuietly(inputStream);

            // Return the image URL
            response.put("success", 1);
            Map<String, String> fileData = new HashMap<>();
            fileData.put("url", "http://zerofourtwo.net/api/cdn/" + uniqueFileName);
            response.put("file", fileData);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("success", 0);
            response.put("message", "Failed to fetch image from URL");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper method to extract file extension from a URL
    private String getFileExtensionFromUrl(String url) {
        String fileName = url.substring(url.lastIndexOf('/') + 1);
        if (fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf('.') + 1);
        } else {
            return "jpg";  // Default to jpg if no extension is found
        }
    }
}

