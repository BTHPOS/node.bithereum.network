angular.module('Application.Controllers', [])

.controller("RichlistController", ["$scope", "$timeout", function($scope, $timeout) {
      $scope.richlist = {};
      $.get("/api/richlist")
        .then(function(data) {
            $timeout(function() {
                $scope.richlist = data.richlist;
            })
        });
}])

.controller("ShirtController", ["$scope", "$timeout", function($scope, $timeout) {
}])

.controller("AddressConverterController", ["$scope", "$timeout", function($scope, $timeout) {
      $scope.convert = function() {
          $scope.bthaddress = "";
          if ($scope.btcaddress) {
              try {
                var decoded = bitcoin.address.fromBase58Check($scope.btcaddress);
                var version = decoded['version']
                switch (version) {
                  case 0:
                    $scope.message = "Your BTH P2PKH Address";
                    version = 25;
                    break;
                  case 25:
                    $scope.message = "Your BTC P2PKH Address";
                    version = 0;
                    break;
                  case 5:
                    $scope.message = "Your BTH P2SH Address";
                    version = 40;
                    break;
                  case 40:
                    $scope.message = "Your BTC P2SH Address";
                    version = 5;
                    break;
                  default:
                    break;
                }
                if (version) $scope.bthaddress = bitcoin.address.toBase58Check(decoded['hash'], version);
                else $scope.message = "Invalid BTC address. Please type a valid BTC address."
              }
              catch(e) {
                  $scope.message = "Invalid BTC address. Please type a valid BTC address."
              }
          }
      };
      $scope.$watch("btcaddress", function() {
          if (!$scope.btcaddress) {
              $scope.message = "";
              $scope.bthaddress = "";
          }
      });
}])
