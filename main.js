$( document ).ready(function() {

const $circle = $('.circle');
let device = 'something';

////////// СКРИПТ В СЛУЧАЕ ЕСЛИ КОЛИЧЕСТВО ЛЕТ БУДЕТ БОЛЬШЕ ИЛИ МЕНЬШЕ ЗАДАННОГО /////////////

    let items = $('.circle > div');
    let middle = Math.round(items.length / 2);
    let count = 360;
    let degree = 10;
    for(i = middle-1; i < items.length; i++){
        $(items[i]).css('transform', 'rotate('+count+'deg)');
        count += degree;
    }
    count = 360;
    for(i = middle -2; i >= 0; i--){
        count -= degree;
        $(items[i]).css('transform', 'rotate('+count+'deg)');
    }

    count = 360;

//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////СКОЛ ПО КЛИКУ /////////////////////////////////////////

    $('.circle > div span').on('click', function(){
        clearActive();
        $(this).parent().addClass('active')
        let activeItem = ($(items).index($(this).parent()));
        let degreeBlock = 360;
        if(activeItem + 1 != middle){
            degreeBlock += degree * (middle - (activeItem + 1));
        }
        rotation(degreeBlock, null)
        count = degreeBlock;
    })

//////////////////////////////////СКРОЛ КОЛЕСОМ МЫШИ/////////////////////////////////////////

    $($circle).on('mousewheel DOMMouseScroll', function(e){
        if(typeof e.originalEvent.detail == 'number' && e.originalEvent.detail !== 0) {
          if(e.originalEvent.detail > 0) {
            if(checkBorder('left')){
                count += degree;
                rotation(count, true)
            }
          } else if(e.originalEvent.detail < 0){
            if(checkBorder('right')){
                count -= degree;
                rotation(count, false)
            }
          }
        } else if (typeof e.originalEvent.wheelDelta == 'number') {
          if(e.originalEvent.wheelDelta < 0) {
            if(checkBorder('left')){
                count += degree;
                rotation(count, true)
            }
          } else if(e.originalEvent.wheelDelta > 0) {
            if(checkBorder('right')){
                count -= degree;
                rotation(count, false)
            }
          }
        }
      }).children().find('span').on('mousewheel', function(e){
            e.stopPropagation();
        })
        
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////СКРОЛ КАСАНИЕМ/////////////////////////////////////////

var ts;
let counter = 0;

$($circle).bind('touchstart', function(e) {
    ts = e.originalEvent.touches[0].clientY;
    $('body').css('overflow-y', 'hidden')
});

$($circle).bind('touchmove', function(e) {
    if(device != 'tablet'){
        $('body').css('overflow-y', 'hidden')
        var te = e.originalEvent.changedTouches[0].clientY;
        counter++;
        if(counter > 10){
            if (ts > te) {
                if(checkBorder('left')){
                    count += degree;
                    rotation(count, true);
                    counter = 0;
                }
            } else {
                if(checkBorder('right')){
                    count -= degree;
                    rotation(count, false);
                    counter = 0;
                }
            }
            return null
        }
    }
});

$($circle).bind('touchend', function(e) {
    $('body').css('overflow-y', 'auto')
});

////////////////////////////////////////////////////////////////////////////////////////////

      $($circle).hover(
        function() {
                $('body').css('overflow', 'hidden')
            }, 
        function() {
            $('body').css('overflow-y', 'auto')
        } 
      )
      
      $($circle).children().find('span').hover(function(e){
          e.stopPropagation();
      })
      
    function checkBorder(side){
        if(side == 'left'){
            return $(items).index($('.active')) != 0 ?  true :  false;
        }else{
             return $(items).index($('.active')) != $(items).length -1 ?  true :  false;
        }
    }

    function clearActive(){
        $('.active').removeClass('active');
    }

    function rotation(num, state){
        let lastActive = $(items).index($('.active'));
            if(!state && checkBorder('right') && state != null){
                clearActive()
                $(items[lastActive]).next().addClass('active')
            }else if(state && checkBorder('left') && state != null){
                clearActive()
                $(items[lastActive]).prev().addClass('active')
            }
            $($circle).css({
                transform : 'rotate('+num+'deg)',
                transition : 'all .3s'
            })
            $('.activeDetail').toggleClass('activeDetail');
            let newDetail = $('.active span').html();
            $('[data-year='+newDetail+']').toggleClass('activeDetail');
    }

    $('.navigation > div:last-of-type, .dropDown > div:first-of-type').on('click', function(){
        $('.navigation').toggleClass('activeDropdown');
        $('body').toggleClass('fixedMobile')
    })

    $(document).mouseup(function (e) {
        var container = $(".dropDown");
        let dropState = $('.navigation').hasClass('activeDropdown');
        if (container.has(e.target).length === 0 && dropState){
            $('.activeDropdown').toggleClass('activeDropdown');
            $('body').toggleClass('fixedMobile')
        }
    });

    checkTablet();

    $( window ).resize(function() {
        checkTablet()
    });

    function checkTablet(){
        let touchDevice = "ontouchstart" in document.documentElement;
        if($(window).width() > 470 &&  touchDevice){
            device = 'tablet'
        }else{
            device = 'something'
        }
    };

})