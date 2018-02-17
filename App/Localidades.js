var Place = (function () {
    function Place(id, name, currentWeather) {
        this.id = id;
        this.name = name;
        this.currentWeather = currentWeather;
    }
    Place.prototype.getDisplayName = function () {
        return this.name.split(',').shift();
    };
    return Place;
}());
var CurrentWeather = (function () {
    function CurrentWeather(temp, icon) {
        this.temperature = temp;
        this.icon = icon;
    }
    CurrentWeather.Default = function () {
        return new CurrentWeather(0, 'default');
    };
    return CurrentWeather;
}());
var PlaceRepository = (function () {
    function PlaceRepository(Places) {
        this.Places = Places;
    }
    PlaceRepository.prototype.resetPlaces = function (NewPlaces) {
        var _this = this;
        this.Places.splice(0);
        NewPlaces.forEach(function (np) {
            _this.Places.push(np);
        });
    };
    PlaceRepository.prototype.addPlace = function (Place) {
        this.Places.push(Place);
    };
    PlaceRepository.prototype.removePlace = function (Place) {
        var index = this.Places.indexOf(Place);
        this.Places.splice(index, 1);
    };
    PlaceRepository.prototype.removePlaceByID = function (id) {
        var index = this.Places.findIndex(function (p) { return p.id == id; });
        this.Places.splice(index, 1);
    };
    PlaceRepository.prototype.showAll = function () {
        this.Places.forEach(function (place) {
            console.log(place.name);
        });
    };
    return PlaceRepository;
}());
var DataMapper = (function () {
    function DataMapper() {
        this.showers = ["rain", "thunderstorms"];
        this.sun = ["clear"];
    }
    DataMapper.prototype.MapPlace = function (servicePlace) {
        return new Place(servicePlace.id, servicePlace.name, new CurrentWeather(0, "default"));
    };
    DataMapper.prototype.MapIcon = function (text) {
        var possibleClasses = ['sun', 'cloudy', 'showers'];
        if (this.showers.find(function (c) { return c == text; }))
            return 'showers';
        if (this.sun.find(function (c) { return c == text; }))
            return 'sun';
        return possibleClasses.find(function (c) { return text.includes(c); });
    };
    DataMapper.prototype.MapWeather = function (serviceWeather) {
        var iconClass;
        var serviceWeatherText = serviceWeather.text.toLowerCase();
        iconClass = this.MapIcon(serviceWeatherText);
        return new CurrentWeather(Number.parseInt(serviceWeather.temp), iconClass);
    };
    return DataMapper;
}());
var LocationService = (function () {
    function LocationService($http, weatherService) {
        this.locationServiceRoute = "http://localhost:8080/api/locations";
        this.$http = $http;
        this.weatherService = weatherService;
    }
    LocationService.prototype.retrieveAll = function () {
        var _this = this;
        this.$http.get(this.locationServiceRoute)
            .then(function (response) {
            var places = response.data.map(function (d) { return dataMapper.MapPlace(d); });
            _this.weatherService.loadCurrentForLocations(places);
            repo.resetPlaces(places);
        });
    };
    LocationService.prototype.deleteOne = function (id) {
        this.$http["delete"](this.locationServiceRoute + "/" + id)
            .then(function (response) {
            repo.removePlaceByID(id);
        });
    };
    LocationService.prototype.addOne = function (placeName) {
        var _this = this;
        var locationEntry = { id: 0, name: placeName };
        var parameter = JSON.stringify(locationEntry);
        this.$http.post(this.locationServiceRoute, parameter)
            .then(function (response) {
            var place = dataMapper.MapPlace(response.data);
            _this.weatherService.loadCurrentForLocation(place);
            repo.addPlace(place);
        });
    };
    return LocationService;
}());
var WeatherService = (function () {
    function WeatherService($http) {
        this.weatherServiceRoute = "http://localhost:8090/api/weather/currentweather";
        this.$http = $http;
    }
    WeatherService.prototype.loadCurrentForLocation = function (place) {
        this.$http.get(this.weatherServiceRoute, { params: { location: place.name } })
            .then(function (response) {
            place.currentWeather = dataMapper.MapWeather(response.data);
        });
    };
    WeatherService.prototype.loadCurrentForLocations = function (places) {
        var _this = this;
        places.forEach(function (p) { return _this.loadCurrentForLocation(p); });
    };
    return WeatherService;
}());
var repo = new PlaceRepository(new Array());
var dataMapper = new DataMapper();
var app = angular.module('myApp', ['ui.bootstrap', 'dialogs']);
app.controller('weatherController', function ($scope, $http, $rootScope, $timeout, $dialogs) {
    var weatherService = new WeatherService($http);
    var locationService = new LocationService($http, weatherService);
    //service.retrieveAll();
    $scope.places = repo.Places;
    $scope.remove = (function (place) {
        locationService.deleteOne(place.id);
    });
    locationService.retrieveAll();
    $scope.addDialog = function () {
        var dlg = $dialogs.create('./AddDialog.html', 'formController', {}, { key: false, back: 'static' });
        dlg.result.then(function (place) {
            locationService.addOne(place.name);
        });
    };
    $scope.detailDialog = function (place) {
        var dlg = $dialogs.create('./QueryDialog.html', 'infoDialogController', { data: place }, { key: false, back: 'static' });
    };
});
app.controller('infoDialogController', function ($scope, $modalInstance, data) {
    $scope.place = data.data;
    $scope.close = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel
    $scope.hitEnter = function (evt) {
        if (angular.equals(evt.keyCode, 13))
            $scope.close();
    }; // end hitEnter
});
app.controller('formController', function ($scope, $modalInstance, data) {
    $scope.place = new Place(undefined, '', CurrentWeather.Default());
    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel
    $scope.save = function () {
        $modalInstance.close($scope.place);
    }; // end save
    $scope.hitEnter = function (evt) {
        if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.name, null) || angular.equals($scope.name, '')))
            $scope.save();
    }; // end hitEnter
});
