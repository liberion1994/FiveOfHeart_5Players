/**
 * Created by liboyuan on 16/8/16.
 */

function cardToText(card, split) {
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
}

function updateCard (card, index, xInPar, yInPar, deg, rx, ry, trasition) {
    var rot = 'rotate(' + deg + 'deg)';
    var rog = rx + 'px ' + ry + 'px';
    card.view
        .attr('inhand-index', index)
        .attr('status', 'inHand') // all returned to inHand
        .css('left', xInPar + 'px')
        .css('top', yInPar + 'px')
        .css('transform', rot)
        .css('transform-origin', rog)
        .css('-ms-transform', rot)
        .css('-ms-transform-origin', rog)
        .css('-moz-transform', rot)
        .css('-moz-transform-origin', rog)
        .css('-webkit-transform', rot)
        .css('-webkit-transform-origin',rog)
        .css('-o-transform', rot)
        .css('-o-transform-origin', rog)
        .css('transition', trasition);
}

function drawCard (card, index, cardWidth, cardHeight, parDiv, xInPar, yInPar, deg, rx, ry, onTapstart) {
    var color = 'font-red';
    if (card.color == '♠' || card.color == '♣' || card.color == 'J' && card.number == 0)
        color = 'font-black';
    var rot = 'rotate(' + deg + 'deg)';
    var rog = rx + 'px ' + ry + 'px';
    var cardDiv = $('<div>')
        .attr('inhand-index', index) //id is used to bind model
        .attr('class', 'card ' + color)
        .attr('status', 'inHand')
        .css('width', cardWidth + 'px')
        .css('height', cardHeight + 'px')
        .css('left', xInPar + 'px')
        .css('top', yInPar + 'px')
        .css('transform', rot)
        .css('transform-origin', rog)
        .css('-ms-transform', rot)
        .css('-ms-transform-origin', rog)
        .css('-moz-transform', rot)
        .css('-moz-transform-origin', rog)
        .css('-webkit-transform', rot)
        .css('-webkit-transform-origin',rog)
        .css('-o-transform', rot)
        .css('-o-transform-origin', rog)
        .click(onTapstart);

    var txt = cardToText(card, '<br>');
    var cardTop = $('<div>')
        .attr('class', 'card-top')
        .html(txt);
    var cardCenter = $('<div>')
        .attr('class', 'card-center')
        .css('line-height', cardWidth / 2 + 'px')
        .html(card.color);
    var carBottom = $('<div>')
        .attr('class', 'card-bottom')
        .html(txt);
    cardDiv.append(cardTop);
    cardDiv.append(cardCenter);
    cardDiv.append(carBottom);
    cardDiv.appendTo(parDiv);
    card.view = cardDiv;
}

function setAnimation (target, type, option, callback) {
    target
        .on('transitionend', function () { callback() })
        .on('webkitTransitionEnd', function () { callback() })
        .on('oTransitionEnd', function () { callback() })
        .on('msTransitionEnd', function () { callback() })
        .on('mozTransitionEnd', function () { callback() })
        .attr('animating', true)
        .css('transform', type)
        .css('-ms-transform', type)
        .css('-moz-transform', type)
        .css('-webkit-transform', type)
        .css('-o-transform', type)
        .css('transition', option)
}
