export class WeatherService{

}

export class LocationService{
    route : String = "localhost:8080/api/locations";
    $http : any;

    /**
     *
     */
    constructor($http) {
        this.$http = $http;
    }

    getAll()
}

