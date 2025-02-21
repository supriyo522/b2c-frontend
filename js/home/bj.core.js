jQuery(function($) {
    initWinPageScroll();
    initTMCarouselNorm();
    initAos();
});

$('.initCarousel').slick({
    infinite: true,
    // dots: true,
    centerPadding: '60px',
    slidesToScroll: 3,
    slidesToShow: 3,
    prevArrow: $('.carousel-control-prev'),
    nextArrow: $('.carousel-control-next'),
    responsive: [{
            breakpoint: 800,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }

    ]
});

function initWinPageScroll() {
    $(window).scroll(function() {
        var scrollPos = $(document).scrollTop();
        if (scrollPos > 60) {
            $('.navbar').addClass('animate');
        } else {
            $('.navbar').removeClass('animate');
        }
    });
}

function initAos() {
    setTimeout(function() {
        AOS.init();
    }, 100);
}

function initTMCarouselNorm() {
    setTimeout(function() {
        carouselNormalization($('#bjTmCarouselMob .carousel-item'));
        carouselNormalization($('#bjTmCarousel .carousel-item'));
    }, 100);
}

function carouselNormalization(e) {
    var items = e,
        heights = [],
        tallest;

    if (items.length) {
        function normalizeHeights() {
            items.each(function() {
                heights.push($(this).height());
            });
            tallest = Math.max.apply(null, heights);
            items.each(function() {
                $(this).css('min-height', tallest + 'px');
            });
        };
        normalizeHeights();

        $(window).on('resize orientationchange', function() {
            tallest = 0, heights.length = 0;
            items.each(function() {
                $(this).css('min-height', '0');
            });
            normalizeHeights();
        });
    }
}

function getParameterByName(e, t) {
    t = t ? "?" + t : window.location.search;
    var a = new RegExp("[?&]" + e.replace(/\[/g, "\\[").replace(/\]/g, "\\]") + "(?:=([^&#]*))?(?:[&#]|$)").exec(t);
    return a ? (a[1] ? decodeURIComponent(a[1].replace(/\+/g, " ")) : "") : null;
}