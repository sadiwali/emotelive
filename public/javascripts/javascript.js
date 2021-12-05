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

var CLOSENESS_FACTOR = 0.05;
var minDim;
var clickPaused = false;

var viewMode = 0;
/*
0: default view mode, show all points and just the cube
1: text view mode, similar people
2: show just similar points and the cube
3: text view mode, different people
4: show just distant ponts and the cuve
*/


$(document).ready(function () {
  updateUsers();
  updateBackground();
  setInterval(updateUsers, 1000);
  tapCount(false);
  $(window).resize(resizeMapView)
});

function tapCount(increment) {
  if (selfIndex == -1 || clickPaused) return;
  if (increment && userData.length >= 2) viewMode++;

  if (viewMode >= 5) {
    viewMode = 0;
  }



  if (viewMode == 0) {
    $("#defaultCanvas0").show();
    $("#toplist").hide();

  } else if (viewMode == 1) {
    $("#defaultCanvas0").hide();
    $("#toplist").show();

    if (closestWithinBubble.length == 0) {
      $("#top3").text("No one feels the like you today.");
      $("#bottom3").text("");
    } else {
      $("#top3").text("These people feel the most similar to you today.")
      var strBuild = "";
      for (var i = 0; i <= 2 && i < closestWithinBubble.length; i++) {
        strBuild += closestWithinBubble[i].name + ", "
      }
      strBuild = strBuild.slice(0, strBuild.length - 2);
      $("#bottom3").text(strBuild)
    }

  } else if (viewMode == 2) {
    // no logic
    $("#defaultCanvas0").show();
    $("#toplist").hide();
  } else if (viewMode == 3) {
    $("#defaultCanvas0").hide();
    $("#toplist").show();

    if (furthestOutsideBubble.length == 0) {
      $("#top3").text("Not enough people submitted their mood today.")
      $("#bottom3").text("");
    } else {

      $("#top3").text("These people feel most different to you today.")
      var strBuild = "";
      for (var i = 0; i <= 2 && i < furthestOutsideBubble.length; i++) {
        strBuild += furthestOutsideBubble[i].name + ", "
      }
      strBuild = strBuild.slice(0, strBuild.length - 2);
      $("#bottom3").text(strBuild)
    }
  } else if (viewMode == 4) {
    // no logic
    $("#defaultCanvas0").show();
    $("#toplist").hide();
  }

  resizeMapView();

}


function resizeMapView() {
  minDim = Math.min($(window).width(), $(window).height()) / 2;
  $("#p5canvas").css("height", minDim.toString() + "px");
  // $("#p5canvas").css("height", minDim.toString() + "px");
}

function updateBackground() {
  r = $("#r").val();
  g = $("#g").val();
  b = $("#b").val();
  $("#nameInput").blur();
  if (selfIndex != -1) {
    userData[selfIndex].r = $("#r").val();
    userData[selfIndex].g = $("#g").val();
    userData[selfIndex].b = $("#b").val();
  }
}

function updateUsers() {


  $.post("/get_users", function (data, status, jqXHR) {
    userData = JSON.parse(JSON.stringify(data));
    userData.findIndex(function (item, i) {
      if (item.userId === Cookies.get("idCookie")) {
        selfIndex = i;
        userData[selfIndex].r = $("#r").val();
        userData[selfIndex].g = $("#g").val();
        userData[selfIndex].b = $("#b").val();
      }

      getSortedUserData();
      return;
    });
  });

}

function displayTop() {
  // closest circle
  // for (var i = 0; i <= 2; i++) {
  //   if (i >= sortedUserData.length - 1) break;
  //   $("#" + i).text(sortedUserData[i].name + "(" + sortedUserData[i].distance.toFixed(2) + ")");
  // }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function submitConfirmation() {
  clickPaused = true;
  $("#defaultCanvas0").hide();
  $("#toplist").show();
  $("#top3").text("Your emote has been recorded!")
  $("#bottom3").text("Tap the cube to check vibes.");
  resizeMapView();
  setTimeout(function (context) {
    $("#defaultCanvas0").show();
    $("#toplist").hide();
    clickPaused = false;
    viewMode = 0;
    tapCount(false);
  }, 3000);
}


function submit_emotions() {
  var r = $("#r").val();
  var g = $("#g").val();
  var b = $("#b").val();
  var name = $("#nameInput").val();

  submitConfirmation();

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

function remap(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function remapUserToPoint(list, ind, box) {
  remappedPoints = {}
  remappedPoints.x = remap(list[ind].r, 0, 255, -boxSize.x / 2, boxSize.x / 2);
  remappedPoints.y = remap(list[ind].g, 0, 255, -boxSize.y / 2, boxSize.y / 2);
  remappedPoints.z = remap(list[ind].b, 0, 255, -boxSize.z / 2, boxSize.z / 2);
  return remappedPoints;
}

var furthestOutsideBubble = [];
var closestWithinBubble = [];

function getDistance(p1, p2) {

  var a = p2.x - p1.x;
  var b = p2.y - p1.y;
  var c = p2.z - p1.z;

  return Math.sqrt(a * a + b * b + c * c);
}

function getSortedUserData() {
  furthestOutsideBubble = [];
  closestWithinBubble = [];
  if (selfIndex == -1) return;
  for (var j = 0; j < userData.length; j++) {
    if (selfIndex == j) continue;
    var me = remapUserToPoint(userData, selfIndex, boxSize);
    var other = remapUserToPoint(userData, j, boxSize);
    var distance = getDistance(me, other);
    // outside circle
    furthestOutsideBubble.push(userData[j]);
    furthestOutsideBubble[furthestOutsideBubble.length - 1].distance = distance;
  }
  // sort the distances
  furthestOutsideBubble = furthestOutsideBubble.sort(function (a, b) {
    return a.distance - b.distance;
  });
  furthestOutsideBubble = furthestOutsideBubble.reverse();
  for (var i = 0; i < furthestOutsideBubble.length; i++) {
    if (furthestOutsideBubble[i].distance <= minDim*CLOSENESS_FACTOR) {
      closestWithinBubble.push(furthestOutsideBubble[i]);
    }
  }
  displayTop();
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
  background(25);
  minDim = Math.min($(window).width(), $(window).height()) / 2;
  resizeCanvas(minDim, minDim);
  boxSize = {
    x: minDim / 4,
    y: minDim / 4,
    z: minDim / 4
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
  sphere(width / 75);
  pop();

  if (viewMode == 2) {
    // closest people
    remappedCurrentPoint = remapUserToPoint(userData, selfIndex, boxSize);
    var _closestWithinBubble = JSON.parse(JSON.stringify(furthestOutsideBubble)).reverse();
    for (var i = 0; i < _closestWithinBubble.length; i++) {
      // every other point
      var remappedOtherPoint = remapUserToPoint(_closestWithinBubble, i, boxSize);
      // calculate distance between the points

 
      if (i <= 2 && _closestWithinBubble[i].distance < minDim*CLOSENESS_FACTOR) {
        stroke(155, 155, 155, remap(_closestWithinBubble[i].distance, 0, minDim * CLOSENESS_FACTOR, 225, 100));
        strokeWeight(remap(_closestWithinBubble[i].distance, 0, minDim * CLOSENESS_FACTOR, 5, 0.25));
        line(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z, remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);

        push();


        translate(remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        noStroke();
        fill(_closestWithinBubble[i].r, _closestWithinBubble[i].g, _closestWithinBubble[i].b);
        sphere(width / 200);
        pop();
      } else {
        push();

        translate(remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        noStroke();
        fill(200, 200, 200);
        sphere(width / 300);
        pop();
      }

    }

  } else if (viewMode == 4) {
    remappedCurrentPoint = remapUserToPoint(userData, selfIndex, boxSize);
    for (var i = 0; i < furthestOutsideBubble.length; i++) {
      // every other point
      var remappedOtherPoint = remapUserToPoint(furthestOutsideBubble, i, boxSize);
      // calculate distance between the points


      if (i <= 2) {
        // draw the line
        stroke(155, 155, 155, remap(furthestOutsideBubble[i].distance, 0, minDim * CLOSENESS_FACTOR, 225, 100));
        strokeWeight(minDim / 200);
        line(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z, remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        // draw the sphere
        push();
        translate(remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        noStroke();
        fill(furthestOutsideBubble[i].r, furthestOutsideBubble[i].g, furthestOutsideBubble[i].b);
        sphere(width / 200);
        pop();
      } else {
        // just draw the spheres
        push();
        translate(remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        noStroke();
        fill(200, 200, 200);
        sphere(width / 300);
        pop();
      }

    }
  } else if (viewMode == 0) {

    for (var i = 0; i < userData.length; i++) {
      // current point
      remappedCurrentPoint = remapUserToPoint(userData, i, boxSize);
      // every other point
      for (var j = 0; j < userData.length; j++) {
        if (i == j) continue; // don't compare point to itself
        var remappedOtherPoint = remapUserToPoint(userData, j, boxSize);
        // calculate distance between the points
        var distance = dist(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z, remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        if (distance <= minDim * CLOSENESS_FACTOR) {
          // draw line between points if distance is aunder a certain valuea
          stroke(155, 155, 155, remap(distance, 0, minDim * CLOSENESS_FACTOR, 225, 100));
          strokeWeight(remap(distance, 0, minDim * CLOSENESS_FACTOR, 5, 0.25));
          line(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z, remappedOtherPoint.x, remappedOtherPoint.y, remappedOtherPoint.z);
        }

      }

      if (i == selfIndex) continue;
      push();
      translate(remappedCurrentPoint.x, remappedCurrentPoint.y, remappedCurrentPoint.z);
      fill(userData[i].r, userData[i].g, userData[i].b);
      noStroke();
      sphere(width / 300);
      pop();
    }

  }
  stroke(50, 50, 50);
  strokeWeight(2);
  box(boxSize.x, boxSize.y, boxSize.z);
  pop();

}