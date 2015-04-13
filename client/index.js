'use strict';

$(document).ready(init);

// var current = 'ronaldo';
var $source;
var $target;
var arr = [];
var p1 = 'player1';
var p2 = 'player2';
var current;


function init(){

  $('#indicator').html('Please press Go to start');

  $('#go').click(function() {

    arr.push(p1, p2);
    var rand = arr[Math.floor(Math.random() * arr.length)];
    $('#indicator').html('Ok! ' + rand + ' start with FC Barcelona');
    var current = rand;
    initBoard();
    switchUser();

    $('#board').on('click', '.active', select);
    $('#board').on('click', '.empty', move);
  });
}

function move(){
  if(!$source){
    return;
  }

  var $target = $(this);
  var isKing = $source.is('.king');

  var src = {};
  var tgt = {};

  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;


  var compass = {};
  compass.north = (current === 'messi') ? -1 : 1;
  compass.east = (current === 'messi') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;


  switch(moveType(src, tgt, compass, isKing)){
    case 'move':
      console.log('move');
      movePiece($source, $target);
      switchUser();
      break;
      case 'jump':
        console.log('jump');
        movePiece($source, $target);
        killPiece(src,tgt,compass,isKing);
        $source = $target;

        $('td').each(function(e){
          if ($(this).data('y') === src.y + (compass.north * 2) && ($(this).data('x') === src.x + (compass.east * 2) || $(this).data('x') === src.x + (compass.west * 2))){
            $target = $(this)[0];

            console.log($target);

            if ($($target).hasClass('empty')){

              var enemy = (current === 'ronaldo') ? 'ronaldo' : 'messi';
              $('.valid').removeClass('enemy');
              $('.' + current).addClass('enemy');

              tgt.x = $($target).data('x');
              tgt.y = $($target).data('y');

              var checkX = ((src.x + tgt.x) / 2);
              var checkY = ((src.y + tgt.y) / 2);
              var $middle = $('td[data-x=' + checkX + '][data-y='+ checkY +']');
              $middle = $middle[0];
              $middle.addClass('enemy');

              if ($($middle).hasClass('enemy player')){
                switchUser();
              }

            }
          }
        });

        switchUser();
      }
    }

    function killPiece(src,tgt,compass,isKing){
      console.log('killing');
      var $middle = inMiddle(src,tgt,compass,isKing);
      $($middle).removeClass().addClass('valid empty');

    }

    function movePiece($target,$source){
      var sourceClasses = $source.attr('class');
      var targetClasses = $target.attr('class');

      $target.attr('class', sourceClasses);
      $source.attr('class', targetClasses);

      $target.data('y') === 0 ? $target.addClass('king kingMe') : console.log('get took');
      $target.data('y') === 7 ? $target.addClass('king kingRo') : console.log('get took');

    }

    function moveType(src, tgt, compass, isKing){
      if(isMove(src,tgt,compass,isKing)){
        return 'move';
      }
      if (isJump(src,tgt,compass,isKing) && isEnemy(inMiddle(src,tgt,compass,isKing))){
        return 'jump';
      }
    }

    function isMove(src, tgt, compass, isKing){
      return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && (src.y + compass.north === tgt.y || (isKing && src.y + compass.south === tgt.y));
    }

    function isJump(src, tgt, compass, isKing){

      var checkEast = compass.east * 2;
      var checkWest = compass.west * 2;
      var checkNorth = compass.north * 2;
      var compassSouth = compass.south * 2;

      return (src.x + checkEast === tgt.x || src.x + checkWest === tgt.x) && (src.y + checkNorth === tgt.y) || (src.y + compassSouth === tgt.y) || (isKing && src.y + compassSouth === tgt.y);
    }

    function isKing(){

      return $source.hasClass('king');

    }

    function inMiddle(src, tgt, compass, isKing){
      var checkX = (src.x + tgt.x) / 2;
      var checkY = (src.y + tgt.y) / 2;
      var $middle = ($('td[data-x='+checkX+']td[data-y='+checkY+']'));
      $middle = $middle[0];
      return $middle;
    }

    function isEnemy($middle){
      if ($($middle).hasClass('messi')&&($($source).hasClass('ronaldo')) || ($($middle).hasClass('ronaldo') && $($source).hasClass('messi'))){
        return true;
      } else if ($($middle).hasClass('kingMe')&&($($source).hasClass('kingRo')) || ($($middle).hasClass('kingRo') && $($source).hasClass('kingMe'))){
        return true;
      } else if ($($middle).hasClass('messi')&&($($source).hasClass('kingRo')) || ($($middle).hasClass('ronaldo') && $($source).hasClass('kingMe'))){
        return true;
      } else if ($($middle).hasClass('kingMe')&&($($source).hasClass('ronaldo')) || ($($middle).hasClass('kingRo') && $($source).hasClass('messi'))){
        return true;
      } else {
        return false;
      }
    }


    function select(){
      $source = $(this);
      $('.valid').removeClass('selected');
      $source.addClass('selected');
    }

    function initBoard(){
      // $('#board tr:lt(3) .valid').addClass('ronaldo player');
      // $('#board tr:gt(4) .valid').addClass('messi player');
      // $('td.valid:not(.player').addClass('empty');

      $('tbody tr:lt(3) .valid').addClass('player ronaldo');
      $('tbody tr:gt(4) .valid').addClass('player messi');
      $('tbody tr:lt(5):gt(2) .valid').addClass('empty');
    }

    function switchUser(){
      current = (current === 'messi') ? 'ronaldo' : 'messi';
      $('.valid').removeClass('active selected');
      $('.' + current).addClass('active');
    }

    function winner(){
      if($('.ronaldo').length === 0){
        $('#indicator').html('messi Won!');
      }
      else if($('.messi').length === 0){
        $('#indicator').html('ronaldo Won!')
      }
    }
