'use strict';

function onGoogleReady() {
  angular.bootstrap(document.getElementById("customMap"), ['core.map']);
}

angular.module('core.map').controller('MapController', ['$scope', '$timeout',

    function ($scope, $timeout) {

        console.log("where was i");

        var test  =  {
                name: "Place One",
                desc: "A meeting place for games of chance",
                title: "The Place",
                lat: "38.1",
                long: "-94.6"
             };

        $scope.places = [test];

        console.log($scope.places.length);

        $scope.mapMarkers = [];

        $scope.mapOptions = {
          center: new google.maps.LatLng(39.1059,-94.57441),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById('customMap'), $scope.mapOptions);

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info){
            console.log("Log createMarker()");
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.title
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.mapMarkers.push(marker);
        }

        for (i = 0; i < $scope.places.length; i++){
            console.log("asher");
            createMarker($scope.places[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }
    }
]);
