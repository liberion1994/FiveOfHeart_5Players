/**
 * Created by liboyuan on 16/8/16.
 */

angular.module('myApp', [])
    .directive('tableArea', function () {
        return {
            restrict: 'AE',
            transclude: true,
            template: "<div id='table' ng-style='tableAreaSize()'></div>"
        }
    })
    .directive('inHandArea', function () {
        return {
            restrict: 'AE',
            transclude: true,
            template: "<div id='cardsInHand' ng-style='inHandAreaSize()'></div>"
        }
    })
    .directive('cardDis', function () {
        return {
            restrict: 'AE',
            scope: {cardModel: '='},
            template: "<div ng-class='card'><div class='card-top' ng-bind='cardToText(card-model)'></div><div class='card-center'></div><div class='card-bottom'></div></div>"
        }
    })
    .controller('mainCtrl', function($scope, $window) {

        $scope.inHandAreaSize = function () {
            return {
                width: $window.width - 20,
                height: $scope.cardSize.height * 1.5 + 40
            };
        };

        $scope.tableAreaSize = function () {
            return {
                width: $window.width - 20,
                height: $window.innerHeight - $scope.inHandAreaSize().height - 120
            };
        };

        $scope.cardToText = function (card) {
            var split = '<br>';
            var num = card.number;
            switch (num) {
                case 11:
                    num = 'J';
                    break;
                case 12:
                    num = 'Q';
                    break;
                case 13:
                    num = 'K';
                    break;
                case 14:
                    num = 'A';
                    break;
                default:
                    break;
            }
            var txt = card.color + split + num;
            if (card.color == 'J') {
                if (card.number == 0)
                    txt = '小' + split + '王';
                else
                    txt = '大' + split + '王';
            }
            return txt;
        };

        $scope.cardSize = { width: 60, height: 90 };
        $scope.cardsInHand = [
            { number: 1, color: 'J', type: 6 },
            { number: 1, color: 'J', type: 6 },
            { number: 0, color: 'J', type: 6 },
            { number: 3, color: '♥', type: 5 },
            { number: 3, color: '♥', type: 5 },
            { number: 3, color: '♦', type: 4 },
            { number: 3, color: '♦', type: 4 },
            { number: 7, color: '♥', type: 3 },
            { number: 7, color: '♥', type: 3 },
            { number: 7, color: '♠', type: 2 },
            { number: 7, color: '♦', type: 2 },
            { number: 12, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 10, color: '♠', type: 0 },
            { number: 8, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 },
            { number: 3, color: '♠', type: 0 },
            { number: 14, color: '♦', type: 0 },
            { number: 8, color: '♦', type: 0 },
            { number: 5, color: '♦', type: 0 },
            { number: 9, color: '♣', type: 0 },
            { number: 8, color: '♣', type: 0 },
            { number: 6, color: '♣', type: 0 },
            { number: 5, color: '♣', type: 0 },
            { number: 5, color: '♣', type: 0 },
            { number: 3, color: '♣', type: 0 },
            { number: 3, color: '♣', type: 0 },
            { number: 2, color: '♣', type: 0 }
        ];

        //init bootstrap popovers
        $('[data-toggle="popover"]').popover();
    });