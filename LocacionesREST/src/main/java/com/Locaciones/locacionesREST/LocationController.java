package com.Locaciones.locacionesREST;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
final class LocationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(LocationController.class);

    private final LocationService service;

    @Autowired
    LocationController(LocationService service) {
        this.service = service;
    }

    @RequestMapping("/greeting")
    String greet() {
        return "Hola!";
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    LocationDTO create(@RequestBody @Valid LocationDTO locationEntry) {
        LOGGER.info("Creating a new location entry with information: {}", locationEntry);

        LocationDTO created = service.create(locationEntry);
        LOGGER.info("Created a new location entry with information: {}", created);

        return created;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    LocationDTO delete(@PathVariable("id") String id) {
        LOGGER.info("Deleting location entry with id: {}", id);

        LocationDTO deleted = service.delete(id);
        LOGGER.info("Deleted location entry with information: {}", deleted);

        return deleted;
    }

    @RequestMapping(method = RequestMethod.GET)
    List<LocationDTO> findAll() {
        LOGGER.info("Finding all location entries");

        List<LocationDTO> locationEntries = service.findAll();
        LOGGER.info("Found {} location entries", locationEntries.size());

        return locationEntries;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    LocationDTO findById(@PathVariable("id") String id) {
        LOGGER.info("Finding location entry with id: {}", id);

        LocationDTO locationEntry = service.findById(id);
        LOGGER.info("Found location entry with information: {}", locationEntry);

        return locationEntry;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PUT)
    LocationDTO update(@RequestBody @Valid LocationDTO locationEntry) {
        LOGGER.info("Updating location entry with information: {}", locationEntry);

        LocationDTO updated = service.update(locationEntry);
        LOGGER.info("Updated location entry with information: {}", updated);

        return updated;
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void handleLocationNotFound(LocationNotFoundException ex) {
        LOGGER.error("Handling error with message: {}", ex.getMessage());
    }
}
