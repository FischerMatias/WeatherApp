export class Place {
    id: string;
    name: string;
    currentWeather: CurrentWeather

    constructor(id: string, name: string, currentWeather:CurrentWeather) {
        this.id = id;
        this.name = name;
        this.currentWeather = currentWeather;
    }
}

export type IconClass = "sun" | "cloudy" | "showers" | "default";

export class CurrentWeather {
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

export class PlaceRepository {
    Places: Array<Place>;

    constructor(Places: Array<Place>) {
        this.Places = Places;
    }

    addPlace(Place: Place) {
        this.Places.push(Place);
    }

    removePlace(Place: Place) {
        let index = this.Places.indexOf(Place);
        this.Places.splice(index, 1);
    }

    showAll() {
        this.Places.forEach((place) => {
            console.log(place.name);
        });
    }
}

export interface IServicePlace{
    id: string;
    name: string;
}

export interface IServiceWeather{
    code: string;
    temp: string;
    text: string;
}
