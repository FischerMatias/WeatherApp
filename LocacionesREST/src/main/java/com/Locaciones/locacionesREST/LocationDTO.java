package com.Locaciones.locacionesREST;

import org.springframework.util.StringUtils;

public final class LocationDTO {

    private String id;
    private String name;

    public LocationDTO() {

    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }


    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return String.format(
                "LocationDTO[id=%s, locationName=%s]",
                StringUtils.isEmpty(this.id) ? "0" : this.id,
                this.name
        );
    }
}
