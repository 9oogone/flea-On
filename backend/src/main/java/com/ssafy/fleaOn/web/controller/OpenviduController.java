package com.ssafy.fleaOn.web.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Recording;
import io.openvidu.java.client.RecordingProperties;
import io.openvidu.java.client.Session;

@RestController
@RequestMapping("/recording-java/api")
public class OpenviduController {

    // OpenVidu object as entrypoint of the SDK
    private OpenVidu openVidu;

    // Collection to pair session names and OpenVidu Session objects
    private Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    // Collection to pair session names and tokens (the inner Map pairs tokens and
    // role associated)
    private Map<String, Map<String, OpenViduRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();
    // Collection to pair session names and recording objects
    private Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();

    // URL where our OpenVidu server is listening
    private String OPENVIDU_URL;
    // Secret shared with our OpenVidu server
    private String SECRET;

    public OpenviduController(@Value("${openvidu.secret}") String secret, @Value("${openvidu.url}") String openviduUrl) {
        this.SECRET = secret;
        this.OPENVIDU_URL = openviduUrl;
        this.openVidu = new OpenVidu(OPENVIDU_URL, SECRET);
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @RequestMapping(value = "/get-token", method = RequestMethod.POST)
    public ResponseEntity<JsonNode> getToken(@RequestBody Map<String, Object> sessionNameParam) {

        System.out.println("Getting sessionId and token | {sessionName}=" + sessionNameParam);

        // The video-call to connect ("TUTORIAL")
        String sessionName = (String) sessionNameParam.get("sessionName");

        // Role associated to this user
        OpenViduRole role = OpenViduRole.PUBLISHER;

        // Build connectionProperties object with the serverData and the role
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
                .role(role).data("user_data").build();

        ObjectNode responseJson = objectMapper.createObjectNode();

        if (this.mapSessions.get(sessionName) != null) {
            // Session already exists
            System.out.println("Existing session " + sessionName);
            try {

                // Generate a new token with the recently created connectionProperties
                String token = this.mapSessions.get(sessionName).createConnection(connectionProperties).getToken();

                // Update our collection storing the new token
                this.mapSessionNamesTokens.get(sessionName).put(token, role);

                // Prepare the response with the token
                responseJson.put("0", token);
                responseJson.put("1",false);

                // Return the response to the client
                return new ResponseEntity<>(responseJson, HttpStatus.OK);

            } catch (OpenViduJavaClientException e1) {
                // If internal error generate an error message and return it to client
                return getErrorResponse(e1);
            } catch (OpenViduHttpException e2) {
                if (404 == e2.getStatus()) {
                    // Invalid sessionId (user left unexpectedly). Session object is not valid
                    // anymore. Clean collections and continue as new session
                    this.mapSessions.remove(sessionName);
                    this.mapSessionNamesTokens.remove(sessionName);
                }
            }
        }

        // New session
        System.out.println("New session " + sessionName);
        try {
            // Create a new OpenVidu Session
            Session session = this.openVidu.createSession();
            // Generate a new token with the recently created connectionProperties
            String token = session.createConnection(connectionProperties).getToken();
            // Store the session and the token in our collections
            this.mapSessions.put(sessionName, session);
            this.mapSessionNamesTokens.put(sessionName, new ConcurrentHashMap<>());
            this.mapSessionNamesTokens.get(sessionName).put(token, role);

            // Prepare the response with the sessionId and the token
            responseJson.put("0", token);
            responseJson.put("1",true);
            System.out.println("responseJson=" + responseJson);

            // Return the response to the client
            return new ResponseEntity<>(responseJson, HttpStatus.OK);

        } catch (Exception e) {
            // If error generate an error message and return it to client
            System.out.println(e.getMessage());
            return getErrorResponse(e);
        }
    }

    @RequestMapping(value = "/remove-user", method = RequestMethod.POST)
    public ResponseEntity<JsonNode> removeUser(@RequestBody Map<String, Object> sessionNameToken) throws Exception {

        System.out.println("Removing user | {sessionName, token}=" + sessionNameToken);

        // Retrieve the params from BODY
        String sessionName = (String) sessionNameToken.get("sessionName");
        String token = (String) sessionNameToken.get("token");

        // If the session exists
        if (this.mapSessions.get(sessionName) != null && this.mapSessionNamesTokens.get(sessionName) != null) {

            // If the token exists
            if (this.mapSessionNamesTokens.get(sessionName).remove(token) != null) {
                // User left the session
                if (this.mapSessionNamesTokens.get(sessionName).isEmpty()) {
                    // Last user left: session must be removed
                    this.mapSessions.remove(sessionName);
                }
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                // The TOKEN wasn't valid
                System.out.println("Problems in the app server: the TOKEN wasn't valid");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } else {
            // The SESSION does not exist
            System.out.println("Problems in the app server: the SESSION does not exist");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/close-session", method = RequestMethod.DELETE)
    public ResponseEntity<JsonNode> closeSession(@RequestBody Map<String, Object> sessionName) throws Exception {

        System.out.println("Closing session | {sessionName}=" + sessionName);

        // Retrieve the param from BODY
        String session = (String) sessionName.get("sessionName");

        // If the session exists
        if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
            Session s = this.mapSessions.get(session);
            s.close();
            this.mapSessions.remove(session);
            this.mapSessionNamesTokens.remove(session);
            this.sessionRecordings.remove(s.getSessionId());
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            // The SESSION does not exist
            System.out.println("Problems in the app server: the SESSION does not exist");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/fetch-info", method = RequestMethod.POST)
    public ResponseEntity<JsonNode> fetchInfo(@RequestBody Map<String, Object> sessionName) {
        try {
            System.out.println("Fetching session info | {sessionName}=" + sessionName);

            // Retrieve the param from BODY
            String session = (String) sessionName.get("sessionName");

            // If the session exists
            if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
                Session s = this.mapSessions.get(session);
                boolean changed = s.fetch();
                System.out.println("Any change: " + changed);
                return new ResponseEntity<>(this.sessionToJson(s), HttpStatus.OK);
            } else {
                // The SESSION does not exist
                System.out.println("Problems in the app server: the SESSION does not exist");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            e.printStackTrace();
            return getErrorResponse(e);
        }
    }

    @RequestMapping(value = "/fetch-all", method = RequestMethod.GET)
    public ResponseEntity<JsonNode> fetchAll() {
        try {
            System.out.println("Fetching all session info");
            boolean changed = this.openVidu.fetch();
            System.out.println("Any change: " + changed);
            ArrayNode jsonArray = objectMapper.createArrayNode();
            for (Session s : this.openVidu.getActiveSessions()) {
                jsonArray.add(this.sessionToJson(s));
            }
            return new ResponseEntity<>(jsonArray, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            e.printStackTrace();
            return getErrorResponse(e);
        }
    }

    @RequestMapping(value = "/force-disconnect", method = RequestMethod.DELETE)
    public ResponseEntity<JsonNode> forceDisconnect(@RequestBody Map<String, Object> params) {
        try {
            // Retrieve the param from BODY
            String session = (String) params.get("sessionName");
            String connectionId = (String) params.get("connectionId");

            // If the session exists
            if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
                Session s = this.mapSessions.get(session);
                s.forceDisconnect(connectionId);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                // The SESSION does not exist
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            e.printStackTrace();
            return getErrorResponse(e);
        }
    }

    @RequestMapping(value = "/force-unpublish", method = RequestMethod.DELETE)
    public ResponseEntity<JsonNode> forceUnpublish(@RequestBody Map<String, Object> params) {
        try {
            // Retrieve the param from BODY
            String session = (String) params.get("sessionName");
            String streamId = (String) params.get("streamId");

            // If the session exists
            if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
                Session s = this.mapSessions.get(session);
                s.forceUnpublish(streamId);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                // The SESSION does not exist
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            e.printStackTrace();
            return getErrorResponse(e);
        }
    }

    @RequestMapping(value = "/recording/start", method = RequestMethod.POST)
    public ResponseEntity<?> startRecording(@RequestBody Map<String, Object> params) {
        String sessionId = (String) params.get("session");
        Recording.OutputMode outputMode = Recording.OutputMode.valueOf((String) params.get("outputMode"));
        boolean hasAudio = (boolean) params.get("hasAudio");
        boolean hasVideo = (boolean) params.get("hasVideo");
        String name = (String) params.get("name");

        RecordingProperties properties = new RecordingProperties.Builder().outputMode(outputMode).hasAudio(hasAudio).hasVideo(hasVideo).name(name).resolution("405x1080").build();

        System.out.println("Starting recording for session " + sessionId + " with properties {outputMode=" + outputMode
                + ", hasAudio=" + hasAudio + ", hasVideo=" + hasVideo + "recordingName="+name+"}");

        try {
            System.out.println("1");
            Recording recording = this.openVidu.startRecording(sessionId, properties);
            System.out.println("2");
            this.sessionRecordings.put(sessionId, true);
            System.out.println("3");
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/recording/stop", method = RequestMethod.POST)
    public ResponseEntity<?> stopRecording(@RequestBody Map<String, Object> params) {
        String recordingId = (String) params.get("recording");

        System.out.println("Stoping recording | {recordingId}=" + recordingId);

        try {
            System.out.println("1");
            Recording recording = this.openVidu.stopRecording(recordingId);
            System.out.println("2");
            this.sessionRecordings.remove(recording.getSessionId());
            System.out.println("3");
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/recording/delete", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteRecording(@RequestBody Map<String, Object> params) {
        String recordingId = (String) params.get("recording");

        System.out.println("Deleting recording | {recordingId}=" + recordingId);

        try {
            this.openVidu.deleteRecording(recordingId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/recording/get/{recordingId}", method = RequestMethod.GET)
    public ResponseEntity<?> getRecording(@PathVariable(value = "recordingId") String recordingId) {

        System.out.println("Getting recording | {recordingId}=" + recordingId);

        try {
            Recording recording = this.openVidu.getRecording(recordingId);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/recording/list", method = RequestMethod.GET)
    public ResponseEntity<?> listRecordings() {

        System.out.println("Listing recordings");

        try {
            List<Recording> recordings = this.openVidu.listRecordings();

            return new ResponseEntity<>(recordings, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<JsonNode> getErrorResponse(Exception e) {
        ObjectNode errorJson = objectMapper.createObjectNode();
        errorJson.put("cause", e.getCause() != null ? e.getCause().toString() : "null");
        errorJson.put("error", e.getMessage());
        errorJson.put("exception", e.getClass().getCanonicalName());
        return new ResponseEntity<>(errorJson, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    protected JsonNode sessionToJson(Session session) {
        ObjectNode json = objectMapper.createObjectNode();
        json.put("sessionId", session.getSessionId());
        json.put("customSessionId", session.getProperties().customSessionId());
        json.put("recording", session.isBeingRecorded());
        json.put("mediaMode", session.getProperties().mediaMode().name());
        json.put("recordingMode", session.getProperties().recordingMode().name());
        ObjectNode defaultRecordingProperties = objectMapper.convertValue(session.getProperties().defaultRecordingProperties(), ObjectNode.class);
        json.set("defaultRecordingProperties", defaultRecordingProperties);

        ObjectNode connections = objectMapper.createObjectNode();
        connections.put("numberOfElements", session.getConnections().size());
        ArrayNode jsonArrayConnections = objectMapper.createArrayNode();
        session.getConnections().forEach(con -> {
            ObjectNode c = objectMapper.createObjectNode();
            c.put("connectionId", con.getConnectionId());
            c.put("role", con.getRole().name());
            c.put("token", con.getToken());
            c.put("clientData", con.getClientData());
            c.put("serverData", con.getServerData());
            ArrayNode pubs = objectMapper.createArrayNode();
            con.getPublishers().forEach(p -> {
                pubs.add(objectMapper.convertValue(p, ObjectNode.class));
            });
            ArrayNode subs = objectMapper.createArrayNode();
            con.getSubscribers().forEach(subs::add);
            c.set("publishers", pubs);
            c.set("subscribers", subs);
            jsonArrayConnections.add(c);
        });
        connections.set("content", jsonArrayConnections);
        json.set("connections", connections);
        return json;
    }
}
