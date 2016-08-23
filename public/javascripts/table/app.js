/**
 * Created by liboyuan on 16/8/16.
 */

var AgentCommandType = {
    IntoTable:  1,
    LeaveTable: 2,
    Prepare:    3,
    UnPrepare:  4,
    InGame:     5,
    Disconnect: 6
};

var AgentStatus = {
    HALL        : 1,
    UNPREPARED  : 2,
    PREPARED    : 3,
    IN_GAME     : 4
};

var GameStatus = {
    OFFER_MAJOR_AMOUNT  : 1,
    CHOOSE_MAJOR_COLOR  : 2,
    RESERVE_CARDS       : 3,
    CHOOSE_A_COLOR      : 4,
    PLAY_CARDS          : 5
};


angular.module('myApp', [])
    .service('clientService', function ($http) {

        this.socket = io();

        this.handleEvent = function (handler) {
            this.socket.on('event', function (event) {
                handler(event);
            });
        };



        this.emitCommand = function (commandType, commandContent, error) {
            this.socket.emit('command', { type: commandType, actionContent: commandContent });
            //TODO start a timer and call error if timeout
        };

        this.fetchInfo = function (succ, err) {
            $http({
                url: '/tables/current_table/info',
                method: 'GET'
            }).success(function(data, header, config, status){
                succ(data);
            }).error(function(data, header, config, status){
                err(data);
            });
        };
    })
    .directive('tableArea', function () {
        return {
            restrict: 'AE',
            scope: { table: '=' },
            replace: true,
            template: 
            "<div id='table-area'>" +
            "   <div id='seat-top'>" +
            "       <a id='seat2' class='seat' data-container='body' data-toggle='popover' " +
            "           data-placement='right' title='座位2' data-content={{seatData(2)}} ng-bind='seatUser(2)'></a>" +
            "       <a id='seat3' class='seat' data-container='body' data-toggle='popover' " +
            "           data-placement='left' title='座位3' data-content={{seatData(3)}} ng-bind='seatUser(3)'></a>" +
            "   </div>" +
            "   <div id='seat-bottom'>" +
            "       <a id='seat1' class='seat' data-container='body' data-toggle='popover' " +
            "           data-placement='right' title='座位1' data-content={{seatData(1)}} ng-bind='seatUser(1)'></a>" +
            "       <a id='seat0' class='seat' data-container='body' data-toggle='popover' " +
            "           data-placement='top' title='座位0' data-content={{seatData(0)}} ng-bind='seatUser(0)'></a>" +
            "       <a id='seat4' class='seat' data-container='body' data-toggle='popover' " +
            "           data-placement='left' title='座位4' data-content={{seatData(4)}} ng-bind='seatUser(4)'></a>" +
            "   </div>" +
            "</div>",
            link: function($scope, $element) {
                $scope.seatData = function (relativeSid) {
                    if ($scope.table.seats == null)
                        return '加载中...';
                    var sid = ($scope.table.agentSid + relativeSid) % 5;
                    return '打到:' + $scope.table.seats[sid].majorNumberInGame + '<br>得分:' + $scope.table.seats[sid].points;
                };
                $scope.seatUser = function (relativeSid) {
                    if ($scope.table.seats == null)
                        return '加载中...';
                    var sid = ($scope.table.agentSid + relativeSid) % 5;
                    return ($scope.table.seats[sid].status == AgentStatus.IN_GAME) ?
                        $scope.table.seats[sid].user + ':' + $scope.table.seats[sid].inGameStatus :
                    $scope.table.seats[sid].user + ':' + $scope.table.seats[sid].status;
                };
            }
        }
    })
    .directive('operationArea', ['clientService', function (clientService) {
        return {
            restrict: 'AE',
            replace: true,
            scope: { table: '=' },
            template:
            "<div id='operation-area'>" +
            "   <div ng-repeat='card in table.game.cards'>" +
            "       <card-dis card-model='card' card-width='{{getCardWidth()}}' card-height='{{getCardHeight()}}'" +
            "           card-c-x='{{getCardCX($index)}}' card-c-y='{{getCardCY($index)}}' " +
            "           card-r-x='{{getCardRX($index)}}' card-r-y='{{getCardRY($index)}}' " +
            "           card-deg='{{getCardDeg($index)}}'>" +
            "       </card-dis>" +
            "   </div>" +
            "       <a type='button' class='btn btn-default' id='playCardBtn' ng-show='playCardBtnShown()'>出牌</a>" +
            "       <a type='button' class='btn btn-default' id='prepareBtn' ng-show='prepareBtnShown()' ng-click='setPrepare(true)'>准备</a>" +
            "       <a type='button' class='btn btn-default' id='unPrepareBtn' ng-show='unPrepareBtnShown()' ng-click='setPrepare(false)'>取消</a>" +
            "       <a type='button' class='btn btn-default' id='leaveBtn' ng-show=leaveBtnShown()>离开</a>" +
            "   </div>",
            link: function($scope, $element) {

                $scope.cardSize = { width: 60, height: 90 };
                $scope.MinOneLineCardAmount = 13;

                $scope.size = {
                    width: parseInt($element.css('width')),
                    height: parseInt($element.css('height'))
                };

                $scope.active = function () {
                    if ($scope.table.currentTurn == null || $scope.table.currentTurn.length == 0)
                        return false;
                    return $scope.table.currentTurn[0] == table.agentSid;

                };

                $scope.setPrepare = function (prepared) {
                    if (prepared)
                        clientService.emitCommand(AgentStatus.PREPARED, null, function () {});
                    else
                        clientService.emitCommand(AgentStatus.UNPREPARED, null, function () {});
                };

                $scope.agentStatus = $scope.table.seat[$scope.table.agentSid].status;

                $scope.prepareBtnShown = function () { return $scope.table.agentStatus == AgentStatus.UNPREPARED };
                $scope.unPrepareBtnShown = function () { return $scope.table.agentStatus == AgentStatus.PREPARED };
                $scope.leaveBtnShown = function () { return $scope.table.agentStatus == AgentStatus.PREPARED
                    || $scope.table.agentStatus == AgentStatus.UNPREPARED };
                $scope.playCardBtnShown = function () { return $scope.active() && $scope.table.game.status == GameStatus.PLAY_CARDS };


                /**
                 * 获得当前下标对应的牌的参数
                 * @param index
                 * @returns {{centerX, centerY, rotateX, rotateY}|*}
                 */
                $scope.getParam = function (index) {
                    var len = $scope.table.game.cards.length;
                    if (len <= $scope.MinOneLineCardAmount)
                        return {
                            centerX: ($scope.size.width - $scope.cardSize.width) / 2,
                            centerY: $scope.size.height - $scope.cardSize.height * 1.25 + 5,
                            rotateX: $scope.cardSize.width / 2,
                            rotateY: $scope.size.width - $scope.cardSize.width * 0.866
                        };
                    var tmp = parseInt(len * 0.55);
                    if (index < tmp)
                        return {
                            centerX: ($scope.size.width - $scope.cardSize.width) / 2,
                            centerY: $scope.size.height - $scope.cardSize.height * 1.5 + 5,
                            rotateX: $scope.cardSize.width / 2,
                            rotateY: $scope.size.width - $scope.cardSize.width * 0.866
                        };
                    return {
                        centerX: ($scope.size.width - $scope.cardSize.width) / 2,
                        centerY: $scope.size.height - $scope.cardSize.height + 5,
                        rotateX: $scope.cardSize.width / 2,
                        rotateY: $scope.size.width - $scope.cardSize.width * 0.866 - $scope.cardSize.height / 2
                    };
                };
                /**
                 * 获得当前下标对应的牌的旋转角度
                 * @param index
                 * @returns {number}
                 */
                $scope.getAngle = function (index) {
                    var total = $scope.table.game.cards.length;
                    if (total > $scope.MinOneLineCardAmount) {
                        var tmp = parseInt(total * 0.55);
                        if (index < tmp)
                            total = tmp;
                        else {
                            total -= tmp;
                            index -= tmp;
                        }
                    }
                    if (total == 1) return 0;
                    return -30 + 60 * index / (total - 1);
                };

                $scope.getCardWidth = function () { return $scope.cardSize.width };
                $scope.getCardHeight = function () { return $scope.cardSize.height };
                $scope.getCardCX = function (index) { return $scope.getParam(index).centerX };
                $scope.getCardCY = function (index) { return $scope.getParam(index).centerY };
                $scope.getCardRX = function (index) { return $scope.getParam(index).rotateX };
                $scope.getCardRY = function (index) { return $scope.getParam(index).rotateY };
                $scope.getCardDeg = function (index) { return $scope.getAngle(index) };

            }
        }
    }])
    .directive('cardDis', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                cardModel: '=',
                cardWidth: '@', cardHeight: '@',
                cardCX: '@', cardCY: '@',
                cardRX: '@', cardRY: '@', cardDeg: '@'},
            template: "<div class='card' ng-style='getCardStyle()'><div class='card-top' ng-bind='cardToText(cardModel)'></div>" +
            "<div class='card-center' ng-bind='cardModel.color'></div>" +
            "<div class='card-bottom' ng-bind='cardToText(cardModel)'></div></div>",
            link: function($scope) {

                $scope.getColor = function () {
                    var card = $scope.cardModel;
                    if (card.color == '♠' || card.color == '♣' || card.color == 'J' && card.number == 0)
                        return 'black';
                    return 'red';
                };

                $scope.cardToText = function (card) {
                    var split = '\n';
                    var num = card.number;
                    switch (num) {
                        case 11: num = 'J'; break;
                        case 12: num = 'Q'; break;
                        case 13: num = 'K'; break;
                        case 14: num = 'A'; break;
                        default: break;
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

                $scope.getCardStyle = function () {
                    var rot = 'rotate(' + $scope.cardDeg + 'deg)';
                    var rog = $scope.cardRX + 'px ' + $scope.cardRY + 'px';
                    return {
                        'width': $scope.cardWidth + 'px',
                        'height': $scope.cardHeight + 'px',
                        'left': $scope.cardCX + 'px',
                        'top': $scope.cardCY + 'px',
                        'transform': rot,
                        'transform-origin': rog,
                        '-ms-transform': rot,
                        '-ms-transform-origin': rog,
                        '-moz-transform': rot,
                        '-moz-transform-origin': rog,
                        '-webkit-transform': rot,
                        '-webkit-transform-origin':rog,
                        '-o-transform': rot,
                        '-o-transform-origin': rog,
                        'color': $scope.getColor()
                    }
                        
                };
            }
        }
    })
    .controller('mainCtrl', function($scope, $window, $element, clientService) {

        $scope.synchronize = function () {
            clientService.fetchInfo(
                function (info) {
                    for (var key in info) {
                        if (key == 'game') {
                            var gameInfo = info[key];
                            if (gameInfo != null) {
                                for (var key2 in gameInfo) {
                                    $scope.tableInfo['game'][key2] = info[key2];
                                }
                            }
                        }
                        else
                            $scope.tableInfo[key] = info[key];
                    }
                },
                function (msg) { alert(msg) });
        };

        $scope.handler = function (event) {
            console.log(event);

            $scope.$apply(function() {
                for (var content in event.updated) {
                    $scope.tableInfo[content] = event.updated[content];
                }
            });

        };

        $scope.tableInfo = {
            agentSid: null,

            id: null,
            status: null,
            seats: null,
            currentEventId: null,
            masterInGame: null,

            game: {
                currentTurn: null,

                majorNumber: null,
                majorColor: null,
                aColor: null,
                result: null,

                cards: null,
                reservedCards: null
            }
        };

        $scope.cardSize = { width: 60, height: 90 };

        $scope.synchronize();
        clientService.handleEvent($scope.handler);
        clientService.emitCommand(AgentCommandType.IntoTable, null, function (msg) { alert(msg) });

        $element.find('#operation-area')
            .css('height', $scope.cardSize.width * 1.5 + 40);
        $element.find('#table-area')
            .css('height', parseInt($element.css('height')) -
                parseInt($element.find('#bottom-area').css('height')) - 20);

        //init bootstrap popovers
        $('[data-toggle="popover"]').popover({html: true});
    });