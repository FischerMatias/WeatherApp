package com.Locaciones.locacionesREST;

public class LocationNotFoundException extends RuntimeException {

    public LocationNotFoundException(String id) {
        super(String.format("No todo entry found with id: <%s>", id));
    }
}
