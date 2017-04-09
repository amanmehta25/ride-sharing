'use strict';

/**
 * @ngdoc function
 * @name rideSharing.controller:Owners
 * @description
 * # Owners
 * Controller of the rideSharing
 */
angular
    .module('rideSharing')
    .controller('Owners', [
        '$scope', '$filter', '$state', '$http', '$window',
        function ($scope, $filter, $state, $http, $window) {
            var owners = this, allRoutes, allCommuters, currentUser;

            currentUser = JSON.parse($window.localStorage.getItem('currentUser'));

            if (!currentUser.isOwner) {
                $state.go('ride-share.commuters');
                return;
            }

            owners.route = {};
            owners.availableOwners = [];
            owners.isRiding = false;
            owners.isOnRidingScreen = false;

            if ($window.localStorage.getItem('commuters')) {
                allCommuters = JSON.parse($window.localStorage.getItem('commuters'));
            } else {
                allCommuters = [];
            }

            function findRoute(routes) {
                angular.forEach(routes, function (routePath) {
                    if (routePath.phone === currentUser.phone) {
                        owners.route = {
                            source: routePath.route.source,
                            destination: routePath.route.destination,
                            seats: routePath.seats,
                            isSet: true
                        };
                    }
                });
            }

            if ($window.localStorage.getItem('routes')) {
                allRoutes = JSON.parse($window.localStorage.getItem('routes'));
                findRoute(allRoutes);
            } else {
                $http({
                    method: 'GET',
                    url: 'json/routes.json'
                }).then(function (response) {
                    allRoutes = response.data;
                    findRoute(allRoutes);
                    $window.localStorage.setItem('routes', JSON.stringify(allRoutes));
                });
            }

            owners.saveRoute = function () {
                var flag = 0;
                owners.route.isSet = true;
                angular.forEach(allRoutes, function (routePath) {
                    if (routePath.phone === currentUser.phone) {
                        flag = 1;
                        routePath.route.source = owners.route.source;
                        routePath.route.destination = owners.route.destination;
                        routePath.seats = owners.route.seats;
                    }
                });
                if (flag === 0) {
                    allRoutes.push({
                        name: currentUser.name,
                        phone: currentUser.phone,
                        ratings: null,
                        route: {
                            source: owners.route.source,
                            destination: owners.route.destination
                        },
                        seats: owners.route.seats
                    });
                }
                $window.localStorage.setItem('routes', JSON.stringify(allRoutes));
            };

            owners.startRide = function () {
                owners.isRiding = true;
                owners.isOnRidingScreen = true;
                owners.commuters = [];

                // find commuters for the rider
                angular.forEach(allCommuters, function (commuters) {
                    if (commuters.phone === currentUser.phone) {
                        owners.commuters = commuters.commuters;
                    }
                });
            };
        }
    ]);
