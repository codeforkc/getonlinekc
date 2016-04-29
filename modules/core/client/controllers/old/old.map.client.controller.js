'use strict';
// function onGoogleReady() {
//   angular.bootstrap(document.getElementById("customMap"), ['core.map']);
// }
angular.module('core.map').controller('MapController', ['$scope', '$timeout', '$http', '$state', '$stateParams', 'Authentication', 'courseIndexService',  'placeIndexService', '$location',
    function ($scope, $timeout, $http, $state, $stateParams, Authentication, courseIndexService, placeIndexService, $location) {

            courseIndexService.getCourses(function(courses) {
                $scope.courses = courses;
                var i;
                for (i = 0; i < $scope.courses.length; i++){
                    console.log($scope.courses[i]);
                    createMarker($scope.courses[i]);
                }
            });

            placeIndexService.getPlaces(function(places) {
                $scope.places = places;
                var i;
                for (i=0;i<$scope.places.length;i++){
                    createMarker($scope.places[i]);
                }
            });

            // $http({
            //     method: 'GET',
            //     url: '/api/courses'
            // }).then(function successCallback(response) {
            //     $scope.panelData = response.data;
            //     angular.forEach($scope.panelData, function(item){
            //     console.log("log title =>");
            //     console.log(item.title);
            //     console.log("lat: " + item.lat + " lng: " + item.lng );
            //     });

                // var self = this;
                // var data = response.data;
                // self.tableParams = new NgTableParams({}, { dataset: data});

            //     return response.data;
            // }, function errorCallback(response) {
            //     console.log("error");
            //     return response.status;
            // });

            $scope.mapMarkers = [];

            $scope.mapOptions = {
              center: new google.maps.LatLng(39.1059,-94.57441),
              zoom: 15,
              // mapTypeId: google.maps.MapTypeId.ROADMAP,
              mapTypeControl: true,
              mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: [
                  google.maps.MapTypeId.ROADMAP,
                  google.maps.MapTypeId.TERRAIN
                ]
              }
            };




            var initialLocation;
            var sprintCenter = new google.maps.LatLng(39.097951,-94.616262);
            var siteVisitor;
            var infoWindow = new google.maps.InfoWindow();
            var browserSupportFlag =  new Boolean();




            if(navigator.geolocation) {

                browserSupportFlag = true;

                navigator.geolocation.getCurrentPosition(function(position) {

                  initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                  console.log("Log initialLocation");
                  console.log(position.coords.latitude + " " + position.coords.longitude);
                  $scope.map.setCenter(initialLocation);
                  setVisitorMarker(position.coords);

                }, function() {

                  handleNoGeolocation(browserSupportFlag);

                });
              }
              else {
                browserSupportFlag = false;
                handleNoGeolocation(browserSupportFlag);
              }

              function handleNoGeolocation(errorFlag) {

                if (errorFlag == true) {
                  alert("Geolocation service failed.");
                  initialLocation = sprintCenter;
                } else {
                  alert("Your browser doesn't support geolocation.");
                  initialLocation = sprintCenter;
                }
                map.setCenter(initialLocation);

              }

            $scope.map = new google.maps.Map(document.getElementById('customMap'), $scope.mapOptions);




            var setIcon = function(obj) {
                if (obj.iconMatcher === "day") {
                    return $scope.icons.dayTraining;
                } else if (obj.iconMatcher === "evening") {
                    return $scope.icons.nightTraining;
                } else if (obj.iconMatcher === "publicWifi") {
                    return $scope.icons.publicWifi;
                } else if (obj.iconMatcher === "customerWifi") {
                    return $scope.icons.customerWifi;
                } else if (obj.iconMatcher === "pcAccess") {
                    return $scope.icons.publicAccess;
                } else if (obj.iconMatcher === "pcResale") {
                    return $scope.icons.retailPcs;
                } else {
                    return $scope.icons.siteVisitor;
                }
            }



            var setVisitorMarker = function(loc){
              console.log('loc');
              console.log(loc);
              var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(loc.latitude, loc.longitude),
                    icon: setIcon(loc)
                });
              $scope.mapMarkers.push(marker);
            };

             var createMarker = function (info) {
                console.log("******Logging createMarker(info)");
                console.log(info.iconMatcher);
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.lat, info.lng),
                    title: info.title,
                    icon: setIcon(info),
                    caption: info.caption
                });
// console.log("creating new marker*******");
                  // console.log($scope.icons.courses.day.path);
                // var marker = new Marker({
                //   map: $scope.map,
                //   position: new google.maps.LatLng(info.lat,info.lng),
                //   icon: {
                //     path: $scope.icons.dayCourse,
                //     fillColor: '#00CCBB',
                //     fillOpacity: 1,
                //     strokeColor: '',
                //     strokeWeight: 0
                //   },
                //   map_icon_label: '<span class="map-icon map-icon-point-of-interest"></span>'
                // });

                console.log("***Inspect marker");
                console.log("*marker");
                console.log(marker);
                console.log("***Close results");
                marker.content = '<div class="infoWindowContent">' + '<h3>' + info.caption + '</h3><h4>' +info.phone+'</h4>'+info.address1+', '+info.city+', '+info.state+', '+info.zip+'<br>' +'<br><a ng-click="">More Details</a></div>';
                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);
                });
                $scope.mapMarkers.push(marker);
            }
            $scope.openInfoWindow = function(e, selectedMarker){
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            }
    }
]);