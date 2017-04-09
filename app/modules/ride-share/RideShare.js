'use strict';

/**
 * @ngdoc function
 * @name rideSharing.controller:RideShare
 * @description
 * # MainCtrl
 * Controller of the rideSharing
 */
angular
    .module('rideSharing')
    .controller('RideShare', [
        '$state', '$window',
        function ($state, $window) {
            var rideShare = this;

            if (!$window.localStorage.getItem('isLoggedIn')) {
                $state.go('auth.log-in');
                return;
            }

            rideShare.logOut = function () {
                $window.localStorage.removeItem('isLoggedIn');
                $state.go('auth.log-in');
            };
        }
    ]);
