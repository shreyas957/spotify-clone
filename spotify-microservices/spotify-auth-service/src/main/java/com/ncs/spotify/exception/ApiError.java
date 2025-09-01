package com.ncs.spotify.exception;

import java.time.LocalDateTime;

public record ApiError(String requestURI, String message, int value, String service, LocalDateTime now) {
}
