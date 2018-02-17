package com.Locaciones.locacionesREST;

import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

interface LocationRepository extends Repository<Location, String> {

    /**
     * Deletes a location entry from the database.
     * @param deleted   The deleted location entry.
     */
    void delete(Location deleted);

    /**
     * Finds all location entries from the database.
     * @return  The information of all location entries that are found from the database.
     */
    List<Location> findAll();

    /**
     * Finds the information of a single location entry.
     * @param id    The id of the requested location entry.
     * @return      The information of the found location entry. If no location entry
     *              is found, this method returns an empty {@link java.util.Optional} object.
     */
    Optional<Location> findOne(String id);

    /**
     * Saves a new location entry to the database.
     * @param saved The information of the saved location entry.
     * @return      The information of the saved location entry.
     */
    Location save(Location saved);
}
