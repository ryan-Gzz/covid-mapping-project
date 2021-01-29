let myMap;
let canvas;
let mappa = new Mappa('Leaflet');
let data, curData;
let colors;
let curStyle;

// Store all tile map styles
let styles = ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png'];

// Lets put all our map options in a single object
let options = {
  lat: 40.030497, 
  lng: -101.428547,
  zoom: 4.4
};

//Loads the data
function preload(){
  data = loadTable('statesData.csv', 'csv', 'header');
}

function setup() { 

  colorMode(HSB, 360, 100, 100);
  canvas = createCanvas(windowWidth-50,windowHeight-200);
  // Get get user input for color theme
  
  curStyle = prompt("Choose Color Scheme (Type number):\n1: Normal\n2: Dark\n3: Watercolor");

  //Get user input for the type of data
  curData = prompt("Choose data to display (Type Exact Text):\n1: Confirmed\n2: Recovered\n3: Deaths");

  options.style = styles[curStyle-1];

  // Create a tile map with the options declared
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas);

  // Creates the different colors for ellipses + text
  colors = {
    confirmed: color(33, 83, 100),
    recovered: color(124, 100, 100),
    deaths: color(347, 100, 96)
  };


}

function draw(){
  // var salinas = myMap.latLngToPixel(36.677180, -121.658263);
  // ellipse(salinas.x, salinas.y, 20, 20);
  myMap.onChange(drawPosition);
  drawTable();

}



function drawTable() {
  var yPos = 20;
  var xPos = 50;
  // Draw Rectangle Background
  var numRows = (data.getRowCount()-1)/((height-20)/12)+1;
  rectMode(CORNERS);

  // Decide color for rect outline based on curData
  if(curData == 'Confirmed')
    stroke(colors.confirmed);
  else if(curData == 'Recovered')
    stroke(colors.recovered);
  else if(curData == 'Deaths')
    stroke(colors.deaths);
  strokeWeight(4);
  // Decide color for rect and for text based on curData
  if(options.style == styles[0]) { // Light style
    fill(0, 0, 90);
    rect(xPos-10, yPos-15, numRows*150+15, height);
    fill(0, 0, 20);
  }
  else { // Dark or Watercolor styles
    fill(0, 0, 20);
    rect(xPos-10, yPos-15, numRows*150+15, height);
    fill(0, 0, 90);
  }
  noStroke();

  
  // Display text for each state
  for(var i = 0; i < data.getRowCount(); i++){
    var states = data.getString(i, 'Province_State');
    var value = Number(data.getString(i, curData));
    text(states+": " + value, xPos, yPos)
    yPos+=13;
    if(yPos>=height) {
      yPos=20;
      xPos+=150;
    }
  }
}

function drawPosition(){
  clear();
  // Displays the data (curData) point using latitude + longitude
  for(var i = 0; i < data.getRowCount(); i++){

    var latitude = Number(data.getString(i, 'Lat'));
    var longitude = Number(data.getString(i, 'Long_'));

    if(myMap.map.getBounds().contains({lat: latitude, lng:longitude})){
      var pos = myMap.latLngToPixel(latitude, longitude);
      var size = data.getString(i, curData);
      size = map(size, 558, 458121, 1, 25) + myMap.zoom();
      noStroke();
      //Changes the color of points depending on curData
      if(curData=='Confirmed')
        fill(colors.confirmed);
      else if(curData=='Recovered')
        fill(colors.recovered);
      else if(curData=='Deaths')
        fill(colors.deaths);
      ellipse(pos.x, pos.y, size, size);

    }
  }
  
}