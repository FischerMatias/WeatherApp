package com.Locaciones.locacionesREST;

import org.springframework.data.annotation.Id;

final class Location {

    @Id
    private String id;

    private String name;

    public Location() {}

    private Location(Builder builder) {
        this.name = builder.locationName;
    }

    static Builder getBuilder() {
        return new Builder();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void update(String name) {
        checkLocationName(name);

        this.name = name;
    }

    @Override
    public String toString() {
        return String.format(
                "Location[id=%s, locationName=%s]",
                this.id,
                this.name
        );
    }

    static class Builder {

        private String locationName;

        private String title;

        private Builder() {}

        Builder locationName(String locationName) {
            this.locationName = locationName;
            return this;
        }

        Builder title(String title) {
            this.title = title;
            return this;
        }

        Location build() {
            Location build = new Location(this);

            build.checkLocationName(build.getName());

            return build;
        }
    }

    private void checkLocationName(String locationName) {
        if (locationName == null)
            throw new IllegalArgumentException("Location is required");
    }
}
