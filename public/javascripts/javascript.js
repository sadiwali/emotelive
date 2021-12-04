var r = 0;
var g = 0;
var b = 0;

const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
userData = [];
selfIndex = -1;
/*
r: integer
g: integer
b: integer
name: string
userId: UUID
*/


$(document).ready(function () {

  updateUsers();
  updateBackground();



  setInterval(updateUsers, 1000);
});



function updateBackground() {
  r = $("#r").val();
  g = $("#g").val();
  b = $("#b").val();
  if (selfIndex != -1) {
    userData[selfIndex].r = r;
    userData[selfIndex].g = g;
    userData[selfIndex].b = b;
  }
}

function updateUsers() {


  $.post("/get_users", function (data, status, jqXHR) {
    userData = JSON.parse(JSON.stringify(data));
    userData.findIndex(function (item, i) {
      if (item.userId === Cookies.get("idCookie")) {
        selfIndex = i;
        getSortedUserData();
        updateBackground();
        return;
      }
    });

  });

}

function displayTop3() {
  console.log(sortedUserData);
  for (var i = 0; i <= 2; i++) {
    if (i >= sortedUserData.length-1) break;
    $("#" + i).text(sortedUserData[i].name + "(" + sortedUserData[i].distance.toFixed(2) + ")");
  }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function submit_emotions() {
  var r = $("#r").val();
  var g = $("#g").val();
  var b = $("#b").val();
  var name = $("#name").val();


  $.post("/process_emotion", {
    "r": r,
    "g": g,
    "b": b,
    "name": name
  }, function (data, status, jqXHR) {

    updateUsers();
  });

}


function preload() {
  fontRegular = loadFont('../assets/fonts/Roboto-Light.ttf');

}


function showMatches() {
  $("#p5canvas").hide();
}

function hideCanvas() {
  $("#p5canvas").show();
}

function remap(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function remapUserToPoint(ind, box) {
  remappedPoints = {}
  remappedPoints.x = remap(userData[ind].r, 0, 255, -boxSize.x / 2, boxSize.x / 2);
  remappedPoints.y = remap(userData[ind].g, 0, 255, -boxSize.y / 2, boxSize.y / 2);
  remappedPoints.z = remap(userData[ind].b, 0, 255, -boxSize.z / 2, boxSize.z / 2);
  return remappedPoints;
}

function getSortedUserData() {

  sortedUserData = JSON.parse(JSON.stringify(userData));
  console.log(sortedUserData);
  for (var j = 0; j < sortedUserData.length; j++) {
    if (selfIndex == j) {
      sortedUserData[j].distance = -1;
    } else {
      var me = remapUserToPoint(selfIndex, boxSize);
      var other = remapUserToPoint(j, boxSize);
      sortedUserData[j].distance = dist(me.x, me.y, me.z, other.x, other.y, other.z);
    }
  }
  // sort the distances
  sortedUserData = sortedUserData.sort(function (a, b) {
    return a.distance - b.distance;
  });
  sortedUserData = sortedUserData.reverse();
  displayTop3();
}



boxSize = {}

function setup() {
  var canvas = createCanvas(1000, 1000, WEBGL);
  canvas.parent('p5canvas');
  textFont(fontRegular);
  boxSize = {
    x: 200,
    y: 200,
    z: 200
  }
  pixelDensity(2);
}


function draw() {
  background(255);
  var minDim = Math.min($(window).width(), $(window).height());
  resizeCanvas(minDim/2, minDim/2);
  boxSize = {
    x: width/8,
    y: width/8,
    z: width/8
  }

  push();
  scale(2);
  rotateZ(frameCount * 0.001);
  rotateX(frameCount * 0.001);
  rotateY(frameCount * 0.001);
  noFill();

  // draw the user's circle
  push();
  var x = remap(r, 0, 255, -boxSize.x / 2, boxSize.x / 2);
  var y = remap(g, 0, 255, -boxSize.y / 2, boxSize.y / 2);
  var z = remap(b, 0, 255, -boxSize.z / 2, boxSize.z / 2);
  translate(x, y, z);
  fill(r, g, b);
  noStroke();
  sphere(width/150);
  pop();

  var MAX_CONNECT_DIST = 100;
  var sortedUserData = []; // userData sorted by distance

  for (var i = 0; i < userData.length; i++) {
    // current point
    remappedCurrentPoint = remapUserToPoint(i, boxSize);
    var distancesToOtherPoints = [];
    var newUserData
    // every other point
    console.log(selfIndex);
    if (selfIndex != -1 && i == selfIndex){
      for (var j = 0; j < userData.length; j++) {
        if (i == j) continue; // don't compare point to itself
        var remappedOtherPoint = remapUserToPoint(j, boxSize);
        // calculate distance between the points
        var distance = dist(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z, remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        if (distance < MAX_CONNECT_DIST) {
          // draw line between points if distance is aunder a certain valuea
          stroke(155, 155, 155, remap(distance, 0, MAX_CONNECT_DIST, 225, 100));
          strokeWeight(remap(distance, 0, MAX_CONNECT_DIST, 5, 0.25));
          line(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z, remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        }
      }
    }
    

    if (i == selfIndex) continue;
    push();
    translate(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z);
    fill(userData[i].r, userData[i].g, userData[i].b);
    noStroke();
    sphere(width/300);
    pop();

  }
  stroke(50, 50, 50);
  strokeWeight(2);
  box(boxSize.x, boxSize.y, boxSize.z);
  pop();

}