angular.module('Application.Controllers', [])

.controller("LandingController", ["$scope", "$timeout", function($scope, $timeout) {

        var isoCountries = {
            'AF' : 'Afghanistan',
            'AX' : 'Aland Islands',
            'AL' : 'Albania',
            'DZ' : 'Algeria',
            'AS' : 'American Samoa',
            'AD' : 'Andorra',
            'AO' : 'Angola',
            'AI' : 'Anguilla',
            'AQ' : 'Antarctica',
            'AG' : 'Antigua And Barbuda',
            'AR' : 'Argentina',
            'AM' : 'Armenia',
            'AW' : 'Aruba',
            'AU' : 'Australia',
            'AT' : 'Austria',
            'AZ' : 'Azerbaijan',
            'BS' : 'Bahamas',
            'BH' : 'Bahrain',
            'BD' : 'Bangladesh',
            'BB' : 'Barbados',
            'BY' : 'Belarus',
            'BE' : 'Belgium',
            'BZ' : 'Belize',
            'BJ' : 'Benin',
            'BM' : 'Bermuda',
            'BT' : 'Bhutan',
            'BO' : 'Bolivia',
            'BA' : 'Bosnia And Herzegovina',
            'BW' : 'Botswana',
            'BV' : 'Bouvet Island',
            'BR' : 'Brazil',
            'IO' : 'British Indian Ocean Territory',
            'BN' : 'Brunei Darussalam',
            'BG' : 'Bulgaria',
            'BF' : 'Burkina Faso',
            'BI' : 'Burundi',
            'KH' : 'Cambodia',
            'CM' : 'Cameroon',
            'CA' : 'Canada',
            'CV' : 'Cape Verde',
            'KY' : 'Cayman Islands',
            'CF' : 'Central African Republic',
            'TD' : 'Chad',
            'CL' : 'Chile',
            'CN' : 'China',
            'CX' : 'Christmas Island',
            'CC' : 'Cocos (Keeling) Islands',
            'CO' : 'Colombia',
            'KM' : 'Comoros',
            'CG' : 'Congo',
            'CD' : 'Congo, Democratic Republic',
            'CK' : 'Cook Islands',
            'CR' : 'Costa Rica',
            'CI' : 'Cote D\'Ivoire',
            'HR' : 'Croatia',
            'CU' : 'Cuba',
            'CY' : 'Cyprus',
            'CZ' : 'Czech Republic',
            'DK' : 'Denmark',
            'DJ' : 'Djibouti',
            'DM' : 'Dominica',
            'DO' : 'Dominican Republic',
            'EC' : 'Ecuador',
            'EG' : 'Egypt',
            'SV' : 'El Salvador',
            'GQ' : 'Equatorial Guinea',
            'ER' : 'Eritrea',
            'EE' : 'Estonia',
            'ET' : 'Ethiopia',
            'FK' : 'Falkland Islands (Malvinas)',
            'FO' : 'Faroe Islands',
            'FJ' : 'Fiji',
            'FI' : 'Finland',
            'FR' : 'France',
            'GF' : 'French Guiana',
            'PF' : 'French Polynesia',
            'TF' : 'French Southern Territories',
            'GA' : 'Gabon',
            'GM' : 'Gambia',
            'GE' : 'Georgia',
            'DE' : 'Germany',
            'GH' : 'Ghana',
            'GI' : 'Gibraltar',
            'GR' : 'Greece',
            'GL' : 'Greenland',
            'GD' : 'Grenada',
            'GP' : 'Guadeloupe',
            'GU' : 'Guam',
            'GT' : 'Guatemala',
            'GG' : 'Guernsey',
            'GN' : 'Guinea',
            'GW' : 'Guinea-Bissau',
            'GY' : 'Guyana',
            'HT' : 'Haiti',
            'HM' : 'Heard Island & Mcdonald Islands',
            'VA' : 'Holy See (Vatican City State)',
            'HN' : 'Honduras',
            'HK' : 'Hong Kong',
            'HU' : 'Hungary',
            'IS' : 'Iceland',
            'IN' : 'India',
            'ID' : 'Indonesia',
            'IR' : 'Iran, Islamic Republic Of',
            'IQ' : 'Iraq',
            'IE' : 'Ireland',
            'IM' : 'Isle Of Man',
            'IL' : 'Israel',
            'IT' : 'Italy',
            'JM' : 'Jamaica',
            'JP' : 'Japan',
            'JE' : 'Jersey',
            'JO' : 'Jordan',
            'KZ' : 'Kazakhstan',
            'KE' : 'Kenya',
            'KI' : 'Kiribati',
            'KR' : 'Korea',
            'KW' : 'Kuwait',
            'KG' : 'Kyrgyzstan',
            'LA' : 'Lao People\'s Democratic Republic',
            'LV' : 'Latvia',
            'LB' : 'Lebanon',
            'LS' : 'Lesotho',
            'LR' : 'Liberia',
            'LY' : 'Libyan Arab Jamahiriya',
            'LI' : 'Liechtenstein',
            'LT' : 'Lithuania',
            'LU' : 'Luxembourg',
            'MO' : 'Macao',
            'MK' : 'Macedonia',
            'MG' : 'Madagascar',
            'MW' : 'Malawi',
            'MY' : 'Malaysia',
            'MV' : 'Maldives',
            'ML' : 'Mali',
            'MT' : 'Malta',
            'MH' : 'Marshall Islands',
            'MQ' : 'Martinique',
            'MR' : 'Mauritania',
            'MU' : 'Mauritius',
            'YT' : 'Mayotte',
            'MX' : 'Mexico',
            'FM' : 'Micronesia, Federated States Of',
            'MD' : 'Moldova',
            'MC' : 'Monaco',
            'MN' : 'Mongolia',
            'ME' : 'Montenegro',
            'MS' : 'Montserrat',
            'MA' : 'Morocco',
            'MZ' : 'Mozambique',
            'MM' : 'Myanmar',
            'NA' : 'Namibia',
            'NR' : 'Nauru',
            'NP' : 'Nepal',
            'NL' : 'Netherlands',
            'AN' : 'Netherlands Antilles',
            'NC' : 'New Caledonia',
            'NZ' : 'New Zealand',
            'NI' : 'Nicaragua',
            'NE' : 'Niger',
            'NG' : 'Nigeria',
            'NU' : 'Niue',
            'NF' : 'Norfolk Island',
            'MP' : 'Northern Mariana Islands',
            'NO' : 'Norway',
            'OM' : 'Oman',
            'PK' : 'Pakistan',
            'PW' : 'Palau',
            'PS' : 'Palestinian Territory, Occupied',
            'PA' : 'Panama',
            'PG' : 'Papua New Guinea',
            'PY' : 'Paraguay',
            'PE' : 'Peru',
            'PH' : 'Philippines',
            'PN' : 'Pitcairn',
            'PL' : 'Poland',
            'PT' : 'Portugal',
            'PR' : 'Puerto Rico',
            'QA' : 'Qatar',
            'RE' : 'Reunion',
            'RO' : 'Romania',
            'RU' : 'Russian Federation',
            'RW' : 'Rwanda',
            'BL' : 'Saint Barthelemy',
            'SH' : 'Saint Helena',
            'KN' : 'Saint Kitts And Nevis',
            'LC' : 'Saint Lucia',
            'MF' : 'Saint Martin',
            'PM' : 'Saint Pierre And Miquelon',
            'VC' : 'Saint Vincent And Grenadines',
            'WS' : 'Samoa',
            'SM' : 'San Marino',
            'ST' : 'Sao Tome And Principe',
            'SA' : 'Saudi Arabia',
            'SN' : 'Senegal',
            'RS' : 'Serbia',
            'SC' : 'Seychelles',
            'SL' : 'Sierra Leone',
            'SG' : 'Singapore',
            'SK' : 'Slovakia',
            'SI' : 'Slovenia',
            'SB' : 'Solomon Islands',
            'SO' : 'Somalia',
            'ZA' : 'South Africa',
            'GS' : 'South Georgia And Sandwich Isl.',
            'ES' : 'Spain',
            'LK' : 'Sri Lanka',
            'SD' : 'Sudan',
            'SR' : 'Suriname',
            'SJ' : 'Svalbard And Jan Mayen',
            'SZ' : 'Swaziland',
            'SE' : 'Sweden',
            'CH' : 'Switzerland',
            'SY' : 'Syrian Arab Republic',
            'TW' : 'Taiwan',
            'TJ' : 'Tajikistan',
            'TZ' : 'Tanzania',
            'TH' : 'Thailand',
            'TL' : 'Timor-Leste',
            'TG' : 'Togo',
            'TK' : 'Tokelau',
            'TO' : 'Tonga',
            'TT' : 'Trinidad And Tobago',
            'TN' : 'Tunisia',
            'TR' : 'Turkey',
            'TM' : 'Turkmenistan',
            'TC' : 'Turks And Caicos Islands',
            'TV' : 'Tuvalu',
            'UG' : 'Uganda',
            'UA' : 'Ukraine',
            'AE' : 'United Arab Emirates',
            'GB' : 'United Kingdom',
            'US' : 'United States',
            'UM' : 'United States Outlying Islands',
            'UY' : 'Uruguay',
            'UZ' : 'Uzbekistan',
            'VU' : 'Vanuatu',
            'VE' : 'Venezuela',
            'VN' : 'Viet Nam',
            'VG' : 'Virgin Islands, British',
            'VI' : 'Virgin Islands, U.S.',
            'WF' : 'Wallis And Futuna',
            'EH' : 'Western Sahara',
            'YE' : 'Yemen',
            'ZM' : 'Zambia',
            'ZW' : 'Zimbabwe'
        };

        $scope.getCountryName = function(countryCode) {
            if (isoCountries.hasOwnProperty(countryCode)) {
                return isoCountries[countryCode];
            } else {
                return countryCode;
            }
        };

        $scope.getUniqueCountries = function(nodes) {
            var countries = [];
            for (var node in nodes) {
                if (nodes[node].callingip_country && countries.indexOf(nodes[node].callingip_country) == -1) {
                    countries.push(nodes[node].callingip_country)
                }
            }
            return countries;
        };

        $scope.getHighestBlockCount = function(nodes) {
            var block = 0;
            for (var node in nodes) {
                if (nodes[node].blockheight > block) {
                    block = nodes[node].blockheight;
                }
            }
            return block;
        };


        var map = L.map('map', {
          gestureHandling: true,
          preferCanvas: true
        }).setView([32.158175096845596, -1.6767883300781252], 2);

        L.tileLayer.grayscale('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        window.map = map;

        window.nodesToPlotLimit = 0
        window.nodesPlotted = [];

        $scope.BTHUSD = 0.00;

        $.get("/price").then(function(data) {
            if (data && data.tickers) {
                $timeout(function() {
                     var BTHUSD = 0;
                     let total_coverted_volume = 0;
                     data.tickers.forEach(function(ticker) {
                          total_coverted_volume += ticker.converted_volume.usd;
                     });
                     data.tickers = data.tickers.map(function(ticker) {
                        ticker.volume_percentage = (ticker.converted_volume.usd/total_coverted_volume)
                        return ticker;
                     })
                     data.tickers.forEach(function(ticker) {
                          BTHUSD += (ticker.volume_percentage * ticker.converted_last.usd)
                          console.log(ticker.volume_percentage, ticker.converted_last.usd)
                     });
                     if (BTHUSD > 0) $scope.BTHUSD = BTHUSD.toFixed(4);
                });
            }
        });

        $scope.nodes = []

        var updateUIData = function(data) {
            $timeout(function() {
              if (data.nodes) {


                  $scope.tiers = [
                      {tier: 0, usd: 0, bthperweek:0.1, bthperyear:5.2},
                      {tier: 1, usd: 0.5, bthperweek:1, bthperyear:52},
                      {tier: 2, usd: 5, bthperweek:3, bthperyear:156},
                      {tier: 3, usd: 25, bthperweek:10, bthperyear:520},
                      {tier: 4, usd: 50, bthperweek:15, bthperyear:780},
                      {tier: 5, usd: 250, bthperweek:25, bthperyear:1300},
                  ];

                  let getTier = function(holding) {
                      holding = holding || 0;
                      let holdingUSD = holding * $scope.BTHUSD;
                      for (var index in $scope.tiers) {
                          if (holdingUSD < $scope.tiers[index].usd) {
                              return $scope.tiers[index-1] || {};
                          }
                      }
                      return $scope.tiers[$scope.tiers.length-1];
                  };

                  var highestPOU = 0;
                  data.nodes.forEach(function(node) {
                      if (node.pou_shares > highestPOU) {
                          highestPOU = node.pou_shares;
                      }
                  });

                  data.nodes = data.nodes.map(function(node) {
                      node.latitude = parseFloat(node.callingip_lat)
                      node.longitude = parseFloat(node.callingip_long)
                      node.radius = 10
                      node.uptime = (highestPOU ? (node.pou_shares / highestPOU) * 100 : 0).toFixed(2)
                      node.fillKey = 'node'
                      node.tier = getTier(node.balance);
                      node.payout = node.tier.bthperweek || 0;
                      node.bonus = 0;
                      return node;
                  });

                  $scope.recentlyactivenodes = data.nodes.filter(function(node) {
                        return node.isup || node.last_reported_on_formatted.indexOf("hour") > -1 || node.last_reported_on_formatted.indexOf("minute") > -1
                  });

                  data.nodes.sort(function(nA, nB) {
                      return nB.pou_shares - nA.pou_shares;
                  });

                  $scope.nodes = data.nodes;

                  data.nodes = data.nodes.filter(function(node) {
                      return node.latitude && node.longitude;
                  });

                  if (window.nodesPlotted.length == 0 || (window.nodesPlotted.length != data.nodes.length && window.nodesPlotted.length != window.nodesToPlotLimit) ) {

                        window.nodesPlotted = data.nodes;
                        console.log("Plotting", data.nodes.length, "nodes");
                        data.nodes.forEach(function(node) {
                              L.circleMarker([node.latitude, node.longitude], {
                                color: "#FFC345"
                              }).addTo(map)
                        });
                  }
              }
          })
        };

        var fetch = function() {
            // let base = "http://node.bithereum.network";
            let base = "";
            $.get(base + "/all").then(updateUIData)
        };

        fetch();
}])
