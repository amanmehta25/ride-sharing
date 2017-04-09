'use strict';

/**
 * @ngdoc function
 * @name rideSharing.controller:Commuters
 * @description
 * # Commuters
 * Controller of the rideSharing
 */
angular
    .module('rideSharing')
    .controller('Commuters', [
        '$scope', '$filter', '$state', '$http', '$window',
        function ($scope, $filter, $state, $http, $window) {
            var commuters = this, allRoutes, currentUser, allCommuters;

            currentUser = JSON.parse($window.localStorage.getItem('currentUser'));

            if (currentUser.isOwner) {
                $state.go('ride-share.owners');
                return;
            }

            commuters.route = {};
            commuters.availableRiders = [];
            commuters.isRiderSelected = false;
            commuters.isRiderConfirmed = false;

            if ($window.localStorage.getItem('routes')) {
                allRoutes = JSON.parse($window.localStorage.getItem('routes'));
            } else {
                $http({
                    method: 'GET',
                    url: 'json/routes.json'
                }).then(function (response) {
                    allRoutes = response.data;
                    $window.localStorage.setItem('routes', JSON.stringify(allRoutes));
                });
            }

            if ($window.localStorage.getItem('commuters')) {
                allCommuters = JSON.parse($window.localStorage.getItem('commuters'));
            } else {
                allCommuters = [];
            }

            commuters.searchLocation = function () {
                commuters.availableRiders = [];
                angular.forEach(allRoutes, function (routePath) {
                    if (routePath.route.source === commuters.route.source &&
                        routePath.route.destination === commuters.route.destination &&
                        routePath.seats > 0) {
                        commuters.availableRiders.push(routePath);
                    }
                });
            };

            commuters.selectRider = function (rider) {
                angular.forEach(commuters.availableRiders, function (riders) {
                    riders.isSelected = false;
                });
                rider.isSelected = true;
                commuters.isRiderSelected = true;
                commuters.selectedRider = rider;
            };

            commuters.confirmRide = function () {
                var flag = 0;
                commuters.isRiderConfirmed = true;

                // change the seats avaialble for the selected rider
                angular.forEach(allRoutes, function (routePath) {
                    if (routePath.phone === commuters.selectedRider.phone) {
                        routePath.seats = commuters.selectedRider.seats - 1;
                    }
                });
                $window.localStorage.setItem('routes', JSON.stringify(allRoutes));

                // add commuter to the rider's co-passengers list
                angular.forEach(allCommuters, function (commuter) {
                    if (commuter.phone === commuters.selectedRider.phone) {
                        flag = 1;
                        commuter.commuters.push({
                            name: currentUser.name,
                            phone: currentUser.phone
                        });
                    }
                });
                if (flag === 0) {
                    allCommuters.push({
                        name: commuters.selectedRider.name,
                        phone: commuters.selectedRider.phone,
                        commuters: [
                            {
                                name: currentUser.name,
                                phone: currentUser.phone
                            }
                        ]
                    });
                }
                $window.localStorage.setItem('commuters', JSON.stringify(allCommuters));
            };

            commuters.cancelRide = function () {
                angular.forEach(allRoutes, function (routePath) {
                    if (routePath.phone === commuters.selectedRider.phone) {
                        routePath.seats += 1;
                    }
                });
                $window.localStorage.setItem('routes', JSON.stringify(allRoutes));
                commuters.isRiderConfirmed = false;
                commuters.isRiderSelected = false;
                commuters.selectedRider = {};
                angular.forEach(commuters.availableRiders, function (riders) {
                    riders.isSelected = false;
                });
            };
        }
    ]);
