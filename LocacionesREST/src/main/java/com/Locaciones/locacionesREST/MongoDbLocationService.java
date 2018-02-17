package com.Locaciones.locacionesREST;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
final class MongoDBLocationService implements LocationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MongoDBLocationService.class);

    private final LocationRepository repository;

    @Autowired
    MongoDBLocationService(LocationRepository repository) {
        this.repository = repository;
    }

    @Override
    public LocationDTO create(LocationDTO location) {
        Location persisted = Location.getBuilder()
                .locationName(location.getName())
                .build();

        persisted = repository.save(persisted);
        return convertToDTO(persisted);
    }

    @Override
    public LocationDTO delete(String id) {
        LOGGER.info("Deleting a location entry with id: {}", id);

        Location deleted = findLocationById(id);
        repository.delete(deleted);

        LOGGER.info("Deleted location entry with informtation: {}", deleted);

        return convertToDTO(deleted);
    }

    @Override
    public List<LocationDTO> findAll() {
        LOGGER.info("Finding all location entries.");

        List<Location> locationEntries = repository.findAll();

        LOGGER.info("Found {} location entries", locationEntries.size());

        return convertToDTOs(locationEntries);
    }

    private List<LocationDTO> convertToDTOs(List<Location> models) {
        return models.stream()
                .map(this::convertToDTO)
                .collect(toList());
    }

    @Override
    public LocationDTO findById(String id) {
        LOGGER.info("Finding location entry with id: {}", id);

        Location found = findLocationById(id);

        LOGGER.info("Found location entry: {}", found);

        return convertToDTO(found);
    }

    @Override
    public LocationDTO update(LocationDTO location) {
        LOGGER.info("Updating location entry with information: {}", location);

        Location updated = findLocationById(location.getId());
        updated.update(location.getName());
        updated = repository.save(updated);

        LOGGER.info("Updated location entry with information: {}", updated);

        return convertToDTO(updated);
    }

    private Location findLocationById(String id) {
        Optional<Location> result = repository.findOne(id);
        return result.orElseThrow(() -> new LocationNotFoundException(id));

    }

    private LocationDTO convertToDTO(Location model) {
        LocationDTO dto = new LocationDTO();

        dto.setId(model.getId());
        dto.setName(model.getName());

        return dto;
    }
}
