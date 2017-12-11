# PostCode.nl REST Client

A rest client for the postcode.nl api.

## Author
[Jurien Hamaker](https://kings-dev.io)


## Usage

All functionalities are based off of the [Postcode.nl documentation](https://api.postcode.nl/documentation) for their rest api.

### Installation
Run the following to add it to your project;
`npm install --save postcodenl`


### Usage

#### Initialization
```
let postcodenl = require('postcodenl');
let postCodeNLClient = new postcodenl(key, secret);
```


All functionalities are named as in the documentation and with their respective responses.

#### [viewByPostcode](https://api.postcode.nl/documentation/address-api/viewByPostcode/json-rest)

**viewByPostcode(postcode:string,houseNumber:string[,houseNumberAddition:string]);**
```
postCodeNLClient.viewByPostcode(postcode, housenumber)
.then(result => console.log)
.catch(err => console.log);
```

#### [matchExact](https://api.postcode.nl/documentation/address-api/matchExact/json-rest)

**matchExact(city:string,street:string,houseNumber:string[,houseNumberAddition:string]);**
```
postCodeNLClient.matchExact(city, street, houseNumber)
.then(result => console.log)
.catch(err => console.log);
```

#### [viewByRd](https://api.postcode.nl/documentation/address-api/viewByRd/json-rest)

**viewByRd(rdX:Number,rdY:Number);**
```
postCodeNLClient.viewByRd(rdX, rdy)
.then(result => console.log)
.catch(err => console.log);
```

#### [viewByLatLon](https://api.postcode.nl/documentation/address-api/viewByLatLon/json-rest)

**viewByLatLon(latitude:Number,longitude:Number);**
```
postCodeNLClient.viewByLatLon(latitude, longitude)
.then(result => console.log)
.catch(err => console.log);
```

#### [postcodeRanges](https://api.postcode.nl/documentation/address-api/PostcodeRange/viewByPostcode/json-rest)
This is the only call with deviant naming, because this uses the same name as "viewByPostcode" but has a different namespace within the postcodenl api.

**postcodeRanges(postcode:string);**
```
postCodeNLClient.postcodeRanges(postcode)
.then(result => console.log)
.catch(err => console.log);
```