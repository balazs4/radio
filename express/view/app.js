//var angular = require('angular');
//var ngMaterial = require('angular-material');

import 'angular-material/angular-material.css!';
import angular from 'angular';
import ngMaterial from 'angular-material';

angular
	.module('RadioApp', [ngMaterial])
	.factory('RadioSrv', ['$http', ($http) => {
		var radio = {};
		radio.getChannels = function () {
			return [{
				"name": "1.FM High Voltage",
				"url": "http://205.164.62.20:8035",
				"cover": "http://www.asenation.com/images/1fm.png"
			}, {
				"name" : "StarFM From Hell",
					"url": "http://87.230.53.43:7000",
					"cover": "http://static.radio.de/images/broadcasts/c6/10/6615/c175.png"
				}, {
					"name" : "StarFM",
					"url": "http://87.230.53.43:8004",
					"cover": "http://i.img.co/radio/45/19/1945_145.png"
				}, {
					"name" : "Rockradio.com Metalcore",
					"url": "http://pub10am.rockradio.com:80/rr_metalcore",
					"cover": "http://static.radio.de/images/broadcasts/59/89/15093/c175.png"
				}, {
					"name" : "Drum N Bass Heaven",
					"url": "http://91.121.138.222:8000",
					"cover": "http://static.radio.net/images/broadcasts/40/42/14809/c175.png"
				}];
		}
		return radio;
	}])
	.controller("MainCtrl", ['$scope', 'RadioSrv', ($scope, radio) => {
		console.log("MainCtrl initialized..");
		$scope.channels = radio.getChannels();
	}]);

angular.element(document).ready(() => {
	angular.bootstrap(document, ['RadioApp']);
});
