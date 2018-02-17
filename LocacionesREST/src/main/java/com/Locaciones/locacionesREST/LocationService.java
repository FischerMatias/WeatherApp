package com.Locaciones.locacionesREST;

import java.util.List;

interface LocationService {

    /**
     * Creates a new location entry.
     * @param location  The information of the created location entry.
     * @return      The information of the created location entry.
     */
    LocationDTO create(LocationDTO location);

    /**
     * Deletes a location entry.
     * @param id    The id of the deleted location entry.
     * @return      THe information of the deleted location entry.
     * @throws LocationNotFoundException if no location entry is found.
     */
    LocationDTO delete(String id);

    /**
     * Finds all location entries.
     * @return      The information of all location entries.
     */
    List<LocationDTO> findAll();

    /**
     * Finds a single location entry.
     * @param id    The id of the requested location entry.
     * @return      The information of the requested location entry.
     * @throws LocationNotFoundException if no location entry is found.
     */
    LocationDTO findById(String id);

    /**
     * Updates the information of a location entry.
     * @param location  The information of the updated location entry.
     * @return      The information of the updated location entry.
     * @throws LocationNotFoundException if no location entry is found.
     */
    LocationDTO update(LocationDTO location);
}
