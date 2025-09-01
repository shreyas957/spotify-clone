package com.ncs.spotify.exception;

public class WishlistAlreadyExistsException extends RuntimeException {
    public WishlistAlreadyExistsException(String message) {
        super(message);
    }
}
