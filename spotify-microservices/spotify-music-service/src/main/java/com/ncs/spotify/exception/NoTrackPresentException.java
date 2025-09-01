package com.ncs.spotify.exception;

public class NoTrackPresentException extends RuntimeException {
    public NoTrackPresentException(String message) {
        super(message);
    }
}
