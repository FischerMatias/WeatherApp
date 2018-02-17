class Place {
    id: string;
    name: string;
    currentWeather: CurrentWeather
    constructor(id: string, name: string, currentWeather:CurrentWeather) {
        this.id = id;
        this.name = name;
        this.currentWeather = currentWeather;
    }

    getDisplayName(){
        return this.name.split(',').shift();
    }
}

 type IconClass = "sun" | "cloudy" | "showers" | "default";

 class CurrentWeather {
    temperature: number;
    icon: IconClass;

    static Default(){
    return new CurrentWeather(0,'default');
    }
    
    constructor(temp: number, icon : IconClass) {
        this.temperature = temp;
        this.icon = icon;
    }
}

 class PlaceRepository {
    Places: Array<Place>;

    constructor(Places: Array<Place>) {
        this.Places = Places;
    }

    resetPlaces(NewPlaces : Array<Place>){
        this.Places.splice(0);
        NewPlaces.forEach(np =>{
            this.Places.push(np);
        });
    }

    addPlace(Place: Place) {
        this.Places.push(Place);
    }

    removePlace(Place: Place) {
        let index = this.Places.indexOf(Place);
        this.Places.splice(index, 1);
    }

    removePlaceByID(id: String) {
        let index = this.Places.findIndex((p) => p.id == id);
        this.Places.splice(index, 1);
    }

    showAll() {
        this.Places.forEach((place) => {
            console.log(place.name);
        });
    }
}

 interface IServicePlace{
    id: string;
    name: string;
}

 interface IServiceWeather{
    code: string;
    temp: string;
    text: string;
}

class DataMapper{
    MapPlace(servicePlace: IServicePlace) : Place{
        return new Place(servicePlace.id, servicePlace.name, new CurrentWeather(0,"default"));
    }

    showers : Array<string> = ["rain","thunderstorms"];
    sun : Array<string> = ["clear"];

    MapIcon(text : String) : IconClass{
        let possibleClasses: Array<IconClass> = ['sun', 'cloudy', 'showers'];

        if(this.showers.find(c => c == text))
            return 'showers';

        if(this.sun.find(c => c == text))
            return 'sun';

        return possibleClasses.find(c => text.includes(c));
    }

    MapWeather(serviceWeather: IServiceWeather): CurrentWeather{
        
        let iconClass : IconClass;
        let serviceWeatherText = serviceWeather.text.toLowerCase()

        iconClass = this.MapIcon(serviceWeatherText);

        return new CurrentWeather(Number.parseInt(serviceWeather.temp), iconClass);
    }
}

class LocationService{
    locationServiceRoute : String = "http://localhost:8080/api/locations";
    weatherService : WeatherService;
    $http : any;

    constructor($http, weatherService : WeatherService) {
        this.$http = $http;
        this.weatherService = weatherService;
    }

    retrieveAll(){
        this.$http.get(this.locationServiceRoute)
        .then((response)  => {
            let places = response.data.map(d => dataMapper.MapPlace(d));
            this.weatherService.loadCurrentForLocations(places);
            repo.resetPlaces(places);   
        });
    }

    deleteOne(id : String){
        this.$http.delete(this.locationServiceRoute + "/" + id)
        .then((response) =>{
            repo.removePlaceByID(id);
        });
    }

    addOne(placeName : String){
        var locationEntry = {id: 0, name: placeName};
        var parameter = JSON.stringify(locationEntry);

        this.$http.post(this.locationServiceRoute,parameter)
            .then((response) => {
                let place = dataMapper.MapPlace(response.data);
                this.weatherService.loadCurrentForLocation(place);
                repo.addPlace(place);
            });
    }

}

class WeatherService{
    weatherServiceRoute : String = "http://localhost:8090/api/weather/currentweather";
    $http : any;

    constructor($http) {
        this.$http = $http;
    }

    loadCurrentForLocation(place : Place){
        this.$http.get(this.weatherServiceRoute,{ params: { location: place.name } })
        .then(function(response) {
            place.currentWeather = dataMapper.MapWeather(response.data);
        });
    }

    loadCurrentForLocations(places : Array<Place>){
        places.forEach(p => this.loadCurrentForLocation(p));
    }
}


let repo = new PlaceRepository(new Array<Place>());
let dataMapper : DataMapper = new DataMapper();

var app = angular.module('myApp', ['ui.bootstrap','dialogs']);

app.controller('weatherController', function($scope,$http,$rootScope,$timeout,$dialogs) {
    let weatherService  = new WeatherService($http);
    let locationService = new LocationService($http,weatherService);
   
    //service.retrieveAll();
    
    $scope.places  = repo.Places;
  
   $scope.remove= ((place : Place) =>{
    locationService.deleteOne(place.id);
  });

  locationService.retrieveAll();


  
  $scope.addDialog = function(){
   var dlg = $dialogs.create('./AddDialog.html','formController',{},{key: false,back: 'static'});
    dlg.result.then(function(place : Place){
        locationService.addOne(place.name);
    });
  };

  $scope.detailDialog = function(place){
    var dlg = $dialogs.create('./QueryDialog.html','infoDialogController',{data: place},{key: false,back: 'static'});
  };
});

app.controller('infoDialogController',function($scope,$modalInstance,data){

    $scope.place = data.data;
  $scope.close = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.hitEnter = function(evt){
    if(angular.equals(evt.keyCode,13))
				$scope.close();
  }; // end hitEnter
})


app.controller('formController',function($scope,$modalInstance,data){
  $scope.place = new Place(undefined,'',CurrentWeather.Default());

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.place);
  }; // end save
  
  $scope.hitEnter = function(evt){
    if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.name,null) || angular.equals($scope.name,'')))
				$scope.save();
  }; // end hitEnter
})
