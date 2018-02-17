"use strict";
exports.__esModule = true;
var Place = (function () {
    function Place(id, name, currentWeather) {
        this.id = id;
        this.name = name;
        this.currentWeather = currentWeather;
    }
    return Place;
}());
exports.Place = Place;
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
exports.CurrentWeather = CurrentWeather;
var PlaceRepository = (function () {
    function PlaceRepository(Places) {
        this.Places = Places;
    }
    PlaceRepository.prototype.addPlace = function (Place) {
        this.Places.push(Place);
    };
    PlaceRepository.prototype.removePlace = function (Place) {
        var index = this.Places.indexOf(Place);
        this.Places.splice(index, 1);
    };
    PlaceRepository.prototype.showAll = function () {
        this.Places.forEach(function (place) {
            console.log(place.name);
        });
    };
    return PlaceRepository;
}());
exports.PlaceRepository = PlaceRepository;
