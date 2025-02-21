(function() {
    // polyfill

    if ('NodeList' in window && !NodeList.prototype.forEach) {
        console.info('polyfill for IE11');
        NodeList.prototype.forEach = function(callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }
    // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
    (function(arr) {
        arr.forEach(function(item) {
            if (item.hasOwnProperty('prepend')) {
                return;
            }
            Object.defineProperty(item, 'prepend', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function prepend() {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function(argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    this.insertBefore(docFrag, this.firstChild);
                }
            });
        });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

    // browser detect
    navigator.who = (function() {
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();

    // is check mobile and tablet
    navigator.isMobileTablet = (function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    })();

    // is actual mobile check
    navigator.isMobile = (function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    })();
    /**
     * utm params conditions
     */
    jQuery('[data-learn-login-btn]').length && jQuery('[data-learn-login-btn]').on('click', function(event) {
        event.preventDefault();
        var link = jQuery(this).attr('href');
        var utmCampaign = UTILITIES.getParamValueByName("utm_campaign", C_URL) || "login-button";
        var utmSource = UTILITIES.getParameterByName("utm_source", C_URL) || "website";
        var utmCategory = UTILITIES.getParamValueByName("mx_Page_Category", C_URL) || "Home";
        if (utmCampaign) {
            link = UTILITIES.replaceAll('ENCODED_UTM_CAMPAIGN', utmCampaign, link);
        }
        if (utmSource) {
            link = UTILITIES.replaceAll('ENCODED_UTM_SOURCE', utmSource, link);
        }

        if (utmCategory) {
            link = UTILITIES.replaceAll('ENCODED_PAGE_CATEGORY', utmCategory, link);
        }
        jQuery(this).attr('href', link);
        if (typeof(cleverTapProdTrigger) !== "undefined") {
            cleverTapProdTrigger('homepage_login_button');
        }
        setTimeout(function() {
            window.location.href = link;
        }, 400)
    });

    var youtubeLinks = jQuery(".announcement-banner a[href*='youtube.com']");
    youtubeLinks.each(function() {
        jQuery(this).attr("data-toggle", "popup");
        jQuery(this).attr("data-target", "#yt-video-player");
        jQuery(this).attr("data-yt-video-player", "");

    });



    var RAG_WIDTH = window.innerWidth;
    var RAG_HEIGHT = window.innerHeight;
    var isMobile = RAG_WIDTH < 768 ? 1 : 0;
    window.addEventListener("resize", function() {
        RAG_WIDTH = window.innerWidth;
        RAG_HEIGHT = window.innerHeight;
        isMobile = RAG_WIDTH < 768 ? 1 : 0;
    });
    var HOME = {
        onScrollEvent: function() {
            var header = document.getElementById('primary-top-navbar');
            var offsetContant = 2;
            window.onscroll = function(e) {
                if (this.oldScroll > this.scrollY) {
                    // up
                } else {
                    // down
                    //  for lazy
                    RAG_SCROLL_TOP = (window.scrollY || window.pageYOffset) + window.innerHeight + 0;
                }
                this.oldScroll = this.scrollY;

                // irrespective of scroll direction
                insideScrollEvent(this);
            }

            insideScrollEvent();

            function insideScrollEvent(ele) {
                ele = (typeof ele !== 'undefined') ? ele : window;
                if (ele.scrollY < offsetContant) header.className = header.className.replace(/\ animate\b/g, "");
                else if (header.className.indexOf('animate') == -1) header.className += ' animate';
            }
        },

        carousel: function() {
            var slider = document.querySelectorAll('.carousel');
            var slidesViewCount = slider.find;
            var indicators = document.querySelectorAll('.carousel .carousel-indicators li');
            var leftControle = document.querySelector(".carousel-controles.left");
            var rightControle = document.querySelector(".carousel-controles.right");

            function slideAction(control) {
                // alert('left');
                // 1st - active right
                // 0th - prev right
                //
                // alert('right');
                // 1st - active left
                // 2nd  - next left
                //
                try {
                    var dir = control == 'left' ? 'right' : 'left';
                    var dir_regualar_exp = control == 'left' ? /\ right\b/g : /\ left\b/g;
                    var toDir = control == 'left' ? 'prev' : 'next';
                    var toDir_reg = control == 'left' ? /\ prev\b/g : /\ next\b/g;

                    $slides = document.querySelectorAll('.carousel .item');
                    $slidesCount = $slides.length;
                    $active = document.querySelectorAll('.carousel .item.active')[0];
                    $aboutToActive = $active.previousElementSibling;
                    if (!$aboutToActive) $aboutToActive = $slides[$slidesCount - 1];

                    $aboutToActive.className += ' ' + toDir;
                    $aboutToActive.offsetWidth; // force reflow
                    $active.className += ' ' + dir;

                    $aboutToActive.className += ' ' + dir;
                } catch (error) {
                    // error
                }

                function carouselSlide() {
                    try {
                        $active.className = $active.className.replace(/\ active\b/g, '');
                        $active.className = $active.className.replace(dir_regualar_exp, '');
                        $aboutToActive.className = $aboutToActive.className.replace(dir_regualar_exp, '');
                        $aboutToActive.className = $aboutToActive.className.replace(toDir_reg, '');

                        $aboutToActive.className = $aboutToActive.className.replace(/\ active\b/g, '');
                        $aboutToActive.className += ' active';

                        $slides.forEach(function(item, i) {
                            if (item.className.indexOf('active') != -1) {
                                $activeIndex = i;
                            }
                        });
                        $indicators = document.querySelectorAll('.carousel .carousel-indicators li');
                        $activeIndicator = document.querySelectorAll('.carousel .carousel-indicators li.active')[0];
                        $activeIndicator.className = $activeIndicator.className.replace(/\active\b/g, '');
                        $indicators[$activeIndex].className += 'active';
                    } catch (error) {

                    }
                }

                try {
                    if (HOME.transitionEnd()) {
                        $active.addEventListener(HOME.transitionEnd(), function(e) {
                            carouselSlide();
                        })
                    } else {
                        carouselSlide();
                    }
                } catch (error) {

                }
            }

            if (!leftControle) return;
            leftControle.addEventListener("click", function() {
                slideAction('left');
            });

            if (!rightControle) return;
            rightControle.addEventListener("click", function() {
                slideAction('right');
            });
        },

        navigatorDetect: function() {
            var ua = navigator.userAgent,
                tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }

            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        },

        transitionEnd: function() {
            var el = document.createElement('div') //what the hack is bootstrap
            var transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            }
            for (var name in transEndEventNames) {
                if (el.style[name] !== undefined) {
                    return transEndEventNames[name];
                }
            }
            return false // explicit for ie8 (  ._.)
        },

        popupClose: function(popupId) {
            var ifr = document.querySelector('#yt-video-player .popup-body iframe');
            if (ifr != null) ifr.parentNode.removeChild(ifr);

            var popup = document.querySelector(popupId);
            popup.style.display = 'none';

            // body
            var b = document.body.className.split(' ');
            if (b.indexOf('popup-open') != -1) {
                b.splice(b.indexOf('popup-open'), 1);
            }
            document.body.className = b.join(' ');
        },

        popupOpen: function(popupId) {
            var popup = document.querySelector(popupId);
            var arr = popup.className.split(' ');

            // for close operation
            popup.addEventListener('click', function(event) {
                event.preventDefault();
                HOME.popupClose(popupId);
            })

            // body
            var b = document.body.className.split(' ');
            if (b.indexOf('popup-open') == -1) {
                b.push('popup-open');
            }
            document.body.className = b.join(' ');

            if (arr.indexOf('vm') != -1) {
                popup.style.display = 'table';
            } else {
                popup.style.display = 'block';
            }
        },

        getChildren: function(n, skipMe) {
            var r = [];
            for (; n; n = n.nextSibling)
                if (n.nodeType == 1 && n != skipMe)
                    r.push(n);
            return r;
        },

        getSiblings: function(n) {
            return getChildren(n.parentNode.firstChild, n);
        },

        animate: function(elem, style, unit, from, to, time, prop) {
            if (!elem) {
                return;
            }
            var start = new Date().getTime(),
                timer = setInterval(function() {
                    var step = Math.min(1, (new Date().getTime() - start) / time);
                    if (prop) {
                        elem[style] = (from + step * (to - from)) + unit;
                    } else {
                        elem.style[style] = (from + step * (to - from)) + unit;
                    }
                    if (step === 1) {
                        clearInterval(timer);
                    }
                }, 25);
            if (prop) {
                elem[style] = from + unit;
            } else {
                elem.style[style] = from + unit;
            }
        },

        getParameterByName: function(name, entairString) {
            entairString = !entairString ? window.location.search : '?' + entairString;
            var res = new RegExp('[\?&]' + name.replace(/\[/g, '\\\[').replace(/\]/g, '\\\]') + '(?:=([^&#]*))?(?:[&#]|$)').exec(entairString);
            return res ? (res[1] ? decodeURIComponent(res[1].replace(/\+/g, ' ')) : '') : null;
        },

        youtubeVideoPopup: function() {
            // formate: <a href="http://www.youtube.com/watch?v=rjGWHJQkIYs" class="wp-tabs-video-block" target="_blank" data-yt-video-popup="1" data-yt-url="">
            var yt = document.querySelectorAll('[data-yt-video-player]').forEach(function(item, i) {
                item.addEventListener('click', function(event) {
                    event.preventDefault();
                    var ytUrl = this.getAttribute('href') || this.getAttribute('data-yt-url');
                    var ytId = HOME.getParameterByName('v', ytUrl);
                    var ytSrc = "https://www.youtube.com/embed/" + ytId + "?autoplay=1&rel=0";

                    var yti = document.createElement('iframe');
                    yti.src = ytSrc;
                    yti.allowfullscreen = '';
                    yti.width = 455;
                    yti.height = 256;
                    yti.style.borderWidth = 0;

                    // document.querySelector('#yt-video-player .popup-body').innerHTML = yti;
                    var ifr = document.querySelector('#yt-video-player .popup-body iframe');
                    if (ifr != null) ifr.parentNode.removeChild(ifr);
                    document.querySelector('#yt-video-player .popup-body').appendChild(yti);


                    // ga
                    if (GA_FLAG) {

                        // for engaging videos
                        var gasss = item.getAttribute('data-ga-engaging-videos');
                        if (gasss) {
                            ga('send', 'event', 'Engaging Video Links', 'video click', 'Engaging Video Link: ' + gasss);
                        }

                    }

                })
            })
        },

        getParamValueByName: function(name, url) {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return '';
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },

        UTMCarryForWord: function() {
            // utm carryforword ---------------------------------------------
            var utmReferer = document.referrer;
            if (utmReferer) {
                if ((utmReferer.indexOf('.byjus') == -1 || utmReferer.indexOf('.byjusweb') == -1) && HOME.getParamValueByName('utm_campaign', URL)) {
                    localStorage.setItem('UTM', URL);
                } else if (HOME.getParamValueByName('utm_campaign', URL)) {
                    localStorage.setItem('UTM', URL);
                } else if ((utmReferer.indexOf('.byjus') != -1 || utmReferer.indexOf('.byjusweb') == -1) && localStorage.getItem('UTM')) {
                    localStorage.setItem('UTM', localStorage.getItem('UTM'));
                } else {
                    localStorage.setItem('UTM', '');
                }
            } else {
                if (HOME.getParamValueByName('utm_campaign', URL)) {
                    localStorage.setItem('UTM', URL);
                } else {
                    localStorage.setItem('UTM', '');
                }
            }
            // end utm carryforword -----------------------------------------
        },

        studentUrlAttacher: function() {
            document.querySelectorAll('[data-student-source-medium]').forEach(function(item) {
                var sourceMedium = item.getAttribute('data-student-source-medium');
                var sourceMode = item.getAttribute('data-student-source-mode') ? item.getAttribute('data-student-source-mode') : null;
                var sourceAuth = item.getAttribute('data-student-source-auth') ? item.getAttribute('data-student-source-auth') : 'oauth/authorize';
                var sourceSetAttr = item.getAttribute('data-student-set-to-attr') ? item.getAttribute('data-student-set-to-attr') : 'href';
                item.setAttribute(sourceSetAttr, HOME.studentUrlBuilder(sourceMedium, sourceMode, sourceAuth)); // setting student url
            });
        },

        // to build studentUrl
        studentUrlBuilder: function(sourceMedium, sourceMode, sourceAuth) {
            var hostName = window.location.host;
            var studentsAuthUrl = 'https://students' + (hostName !== 'byjus.com' ? '-staging' : '') + '.byjus.com/' + (sourceAuth ? sourceAuth : ''); //auth_url

            var studentsCallBackUrl = 'https://learn' + (hostName !== 'byjus.com' ? '-staging' : '') + '.byjus.com/callback'; //callback_url
            if (sourceMedium === 'homePageNewTopRegister') {
                studentsCallBackUrl = 'https://learn' + ((hostName !== 'byjus.com') ? '-staging' : '') + '.byjus.com';
            }

            var clientId = (hostName != 'byjus.com') ? '2979e85921c80d97050353a570107342ab6e87e1882f63a3a24286299ceb7020' : '1f267a0cb39bfe566e0218659508cb1949be4bdea023351a989a1b80b7d0c460'; //client_id

            var referrer = document.referrer;
            var url = window.location.href;

            var referrerParams = '' +
                'mx_Source_of_Lead=' + 'ByjusWeb' + '&' +
                'mx_Campaign_Type=' + (HOME.getParamValueByName('utm_campaign', url) ? 'Paid' : 'Organic') + '&' +
                'SourceMedium=' + sourceMedium + '&' +
                'mx_Page_Category=' + 'byjusHome' + '&' +
                'Website=' + window.location.origin + '&' +
                'SourceIPAddress=' + '' + '&' +
                'SourceReferrerURL=' + referrer + '&' +
                'mx_ad_Id=' + HOME.getParamValueByName('ad_id', url) + '&' +
                'mx_adset_id=' + HOME.getParamValueByName('adset_id', url) + '&' +
                'mx_pid=' + HOME.getParamValueByName('pid', url) + '&' +
                'mx_site_id=' + HOME.getParamValueByName('site_id', url) + '&' +
                'SourceCampaign=' + HOME.getParamValueByName('utm_campaign', url) + '&' +
                'mx_Source_Campaign_Id=' + HOME.getParamValueByName('utm_campaign_id', url) + '&' +
                'mx_utm_Term=' + HOME.getParamValueByName('utm_Term', url) + '&' +
                'SourceContent=' + HOME.getParamValueByName('utm_content', url); // to build referrer params

            var referrerFinalParams = '' +
                'referrer=' + referrerParams + '&' +
                'utm_campaign=' + HOME.getParamValueByName('utm_campaign', url) + '&' +
                'utm_source=' + 'ByjusWeb' + '&' +
                'utm_medium=' + sourceMedium; // to build referrer final params

            var finalParams = '' +
                'redirect_uri=' + studentsCallBackUrl + '?' + referrerFinalParams + '&' +
                'client_id=' + clientId + '&' +
                'response_type=' + 'token' + '&' +
                'scope=' + 'profile manage_doubts'; // to build final url params

            return studentsAuthUrl + '?' + (sourceMode ? 'mode=' + sourceMode + '&' : '') + finalParams + '&' + referrerFinalParams;
        },

        callAirtelAPI: function(api_url) {
            jQuery.ajax({
                type: 'GET',
                url: api_url,
                contentType: false,
                crossDomain: true,
                cache: false,
                processData: false,
                success: function(data) {
                    if (data) {
                        // console.log("Success");
                    }
                },
                fail: function() {
                    // console.log("Failed");
                }
            });
        },

        onPageLoadFunctions: function() {
            HOME.onScrollEvent();

            HOME.carousel();

            HOME.youtubeVideoPopup();

            HOME.UTMCarryForWord();


            HOME.studentUrlAttacher(); // Students url attacher

            var utmCampaign = HOME.getParamValueByName('utm_campaign', C_URL);

            //This api will call only if utm_campaign is airtel
            if (utmCampaign && utmCampaign == "airtel") {
                HOME.callAirtelAPI(BASE_URL + 'wp-json/spidy/v1/airtel_api_landing/?wp-json_allow');
            }

            // app store
            document.querySelectorAll('[data-app-store]').forEach(function(appbtn, index) {
                appbtn.addEventListener('click', function(event) {
                    event.preventDefault();
                    var appName = appbtn.getAttribute('data-app-store');
                    var redirectDesktopUrl = appbtn.getAttribute('href');
                    var redirectMobileUrl = appbtn.getAttribute('data-m-href');
                    GA_FLAG && ga('send', 'event', appName + ' download app', 'Download app Button click', 'Download app Button type: ' + appName);
                    window.location.href = navigator.isMobileTablet ? redirectMobileUrl : redirectDesktopUrl;
                });
            });

            // popup
            document.querySelectorAll('[data-toggle="popup"]').forEach(function(pbtn, index) {
                // event.preventDefault();
                pbtn.addEventListener('click', function(event) {

                    event.preventDefault();
                    var popupId = pbtn.getAttribute('data-target');
                    var popup = document.querySelector(popupId);
                    popup.addEventListener('click', function(event) {
                        event.preventDefault();
                        HOME.popupClose(popupId);
                    })

                    var popupInner = popup.querySelector('.popup-content');
                    popupInner.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });

                    // for menu slide
                    var sm = document.querySelector('#top-navbar-collapse');
                    var sm_arr = sm.className.split(' ');
                    var sm_c_i = sm_arr.indexOf('animate');
                    if (sm_c_i != -1) {
                        sm_arr.splice(sm_c_i, 1);
                        sm.className = sm_arr.join(' ');
                    }

                    HOME.popupOpen(popupId);
                })
            });

            // next item

            // scroll to ele
            document.querySelectorAll('[data-scroll-to]').forEach(function(item, index) {
                item.addEventListener('click', function(event) {
                    event.preventDefault();
                    var targetEleId = item.getAttribute('href')
                    var toSec = document.querySelector(targetEleId);
                    var toSecOffset = toSec.offsetTop;
                    var offH = RAG_WIDTH > 767 ? 76 : 57;
                    toSecOffset = toSecOffset - offH;
                    var scrollingEle = Math.round(document.scrollingElement.scrollTop);
                    if (scrollingEle != toSecOffset) {
                        window.scrollTop = toSecOffset;
                        var wind = document.scrollingElement || document.documentElement;
                        wind.scrollTop = toSecOffset;
                    }
                });
            });

            // for demo counselling popup
            // popup
            document.querySelectorAll('[free-counselling-popup]').forEach(function(pbtn, index) {
                pbtn.addEventListener('click', function(event) {
                    var type = this.getAttribute('free-counselling-popup');
                    var gfec = document.getElementById('gfec-items');
                    var oldifr = document.querySelector('#gfec-items iframe');
                    if (oldifr != null) oldifr.parentNode.removeChild(oldifr);
                    var srcUrl = (type === 'fc') ? HOME.studentUrlBuilder('homePageNewFreeconseling', 'popup', null) : HOME.studentUrlBuilder('homePageNewFreeDemo', 'popup', null);
                    var ifrm = document.createElement("iframe");
                    ifrm.setAttribute("src", srcUrl);
                    ifrm.width = "360";
                    ifrm.height = "352";
                    ifrm.className = "iframe";
                    ifrm.allow = 'geolocation';
                    ifrm.setAttribute("frameborder", 0);
                    gfec.prepend(ifrm);

                    HOME.popupOpen('#get-free-expert-counselling-popup');
                    GA_FLAG && ga("send", "event", "BTLA Register Form", "BTLA Register Form Click", "Get Free Expert Counselling Form");
                });
            });

            // ga
            if (GA_FLAG) {
                document.querySelectorAll('#primary-top-navbar a') && document.querySelectorAll('#primary-top-navbar a').forEach(function(item, index) {
                    ga('send', 'event', 'Top Bar', 'navigation link click', 'link name: ' + item.innerText);
                });
            }
            try {
                document.querySelector('[data-ga-sharukan]').addEventListener("click", function() {
                    ga('send', 'event', 'Video 1', 'video 1 click', 'video 1: Sharukh khan, position: top banner');
                });
            } catch (error) {
                // error
            }
            try {
                var classes = ['testimonial-link'];
                classes.forEach(function(ele) {
                    document.querySelectorAll('.' + ele).forEach(function(element, index) {
                        element.addEventListener('click', function() {
                            var link = element.getAttribute('detail-link');
                            location.replace(link);
                        });
                    });
                });
            } catch (error) {
                // error
            }
        }
    }

    HOME.onPageLoadFunctions();
    arrowScrollHandler();
    animationAccordingIos(CDN + 'byjusweb/img/landing-pages/btla-home/'); // if ios < 14 then put static image

    //GA Event on BOOK FREE CLASS click on nav in Home page
    if (jQuery("[data-book-free-class-nav-event]").length) {
        jQuery("[data-book-free-class-nav-event]").click(function() {
            GA_FLAG && ga("send", "event", "Book Free Class Primary Nav Click", "Book Free Class Primary Nav Link Click", "URL: " + C_URL);
        });
    }

    jQuery(function() {
        jQuery('[data-toggle="popover"]').popover({
            trigger: 'click'
        });
    });


    //open image as Popup modal on click of View a sample Progress Report btn
    jQuery("[data-img-popup-btn]").click(function() {
        if (!jQuery('#myModal').length) {
            var htmlString = '<div id="myModal" class="sample-progress-report-modal fade">' +
                '<img class="lazy sample-progress-report-modal-content" id="popupImg" src="https://cdn1.byjus.com/byjusweb/img/landing-pages/btla-home/sample-progress-card-view.png">' +
                '<div id="sample-progress-report-modal-caption"></div>' +
                '</div>';
            jQuery('[data-progess-report-card]').after(htmlString);
            jQuery('#myModal').modal('show');
        } else {
            jQuery('#myModal').modal('show');
        }

        // jQuery(document).on('click')
        GA_FLAG && ga("send", "event", "BTLA Home Page", "BTLA_PReport Click", "BTLA_PReport click");
    });

    imageLoadOnScroll(); // load image on Scroll
})();

function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return parseInt(v[1], 10);
    }
}

function animationAccordingIos(imagePath) {
    var version = iOSversion();
    if (typeof iPhoneOsVersionSupported !== 'undefined' && version < iPhoneOsVersionSupported) {
        jQuery('[lottie-replaced-mobile-img="engaging-video-lessons"]').attr("src", imagePath + 'Engaging Video Lessons.png')
        jQuery('[lottie-replaced-mobile-img="personalased-learning-journey"]').attr("src", imagePath + 'Personalased Learning Journey.png')
        jQuery('[lottie-replaced-mobile-img="adaptive-tools"]').attr("src", imagePath + 'Adaptive tools.png')
        jQuery('[lottie-replaced-mobile-img="unlimited-practice"]').attr("src", imagePath + 'Unlimited Practice.png')
        jQuery('[lottie-replaced-mobile-img="one-on-one-guidance"]').attr("src", imagePath + 'One on One guidance.png')
        jQuery('[lottie-replaced-mobile-img="comprehensive-study"]').attr("src", imagePath + 'Comprehensive Study.png')
        jQuery('[lottie-mobile]').removeClass('visible-xs').addClass('hidden');
    }
}

function arrowScrollHandler() {
    // left and right arrow functionality
    var buttonLeft = jQuery('[data-slide="prev"]');
    var buttonRight = jQuery('[data-slide="next"]');
    var latestNewsEle = jQuery('[data-horizontal-scroll-wrapper]');
    var cardsCount = latestNewsEle.children('div').length;
    var slideCardsCount = 3;
    var slideCardsCountTablet = 2;
    if (IS_MOBILE) {
        slideCardsCount = 1;
        slideCardsCountTablet = 1;
    }

    var slideCount = Math.round(cardsCount / slideCardsCount);
    var slideCountTablet = Math.round(cardsCount / slideCardsCountTablet);
    var cardWidth = latestNewsEle.children('div').first().outerWidth();

    cardSpacing = 20;
    slideCounter = 1; //slides counter
    slideWidth = (cardWidth * slideCardsCount) + (cardSpacing * slideCardsCount);
    slideWidthTablet = (cardWidth * slideCardsCountTablet) + (cardSpacing * slideCardsCountTablet);

    if (!IS_WINDOW_BELLOW_992) {
        buttonRight.on('click', onRight);
        buttonLeft.on('click', onLeft);
    } else {
        buttonRight.on('click', onRightTablet);
        buttonLeft.on('click', onLeftTablet);
    }
    buttonLeft.addClass("disable");
    buttonLeft.addClass('opacity-50');

    function onLeft() {
        var scrollSize = 0;
        if (slideCounter == slideCount) { //last slide
            scrollSize = slideWidth;
        } else {
            scrollSize = slideCounter * slideWidth;
            buttonLeft.addClass("disable");
            buttonLeft.addClass('opacity-50');
        }
        latestNewsEle.animate({
            scrollLeft: '-=' + scrollSize
        }, 0);
        buttonRight.removeClass("disable");
        if (slideCounter > 1 && slideCounter < 7) {
            slideCounter--;
        }
    }

    function onRight() {
        if (slideCounter > 0 && slideCounter < 3) {
            slideCounter++;
        }
        var scrollSize = 0;
        if (slideCounter == slideCount) { //last slide
            scrollSize = slideCounter * slideWidth;
            buttonRight.addClass("disable");
        } else {
            scrollSize = slideWidth;
        }
        latestNewsEle.animate({
            scrollLeft: '+=' + scrollSize
        }, 0);
        buttonLeft.removeClass("disable");
    }

    function onLeftTablet() {
        var scrollSize = 0;
        if (slideCounter > 1 && slideCounter < 5) {
            slideCounter--;
        }
        scrollSize = slideWidthTablet;
        if (slideCounter == slideCardsCountTablet - 1) { //last slide
            buttonLeft.addClass("disable");
            buttonLeft.addClass('opacity-50');
        }
        latestNewsEle.animate({
            scrollLeft: '-=' + scrollSize
        }, 0);
        buttonRight.removeClass("disable");
        buttonRight.attr("src", 'https://cdn1.byjus.com/home/right-angle.svg');
    }

    function onRightTablet() {
        if (slideCounter > 0 && slideCounter < 4) {
            slideCounter++;
        }
        var scrollSize = 0;
        scrollSize = slideWidthTablet;
        if (slideCounter == slideCountTablet) { //last slide
            buttonRight.addClass("disable");
        }
        latestNewsEle.animate({
            scrollLeft: '+=' + scrollSize
        }, 0);
        buttonLeft.removeClass("disable");
    }

    jQuery('[data-horizontal-scroll-wrapper]').scroll(function(event) {
        var latestNewsEle = jQuery('[data-horizontal-scroll-wrapper]');
        var newsScrollWidth = latestNewsEle.prop('scrollWidth');
        var newsOuterWidth = latestNewsEle.outerWidth();
        if (latestNewsEle.scrollLeft()) {
            buttonLeft.removeClass("disable");
            buttonRight.removeClass("disable");
            buttonLeft.attr("src", 'https://cdn1.byjus.com/home/right-angle.svg');
            buttonRight.attr("src", 'https://cdn1.byjus.com/home/right-angle.svg');
        }

        if (Math.trunc(latestNewsEle.scrollLeft()) === newsScrollWidth - newsOuterWidth) {
            buttonRight.addClass("disable");
            buttonRight.addClass('opacity-50');
        } else if (latestNewsEle.scrollLeft() === 0) {
            buttonLeft.addClass("disable");
            buttonLeft.addClass('opacity-50');
        }
    });
}

function imageLoadOnScroll() {
    jQuery(window).on('scroll', function(event) {
        jQuery('body').find("img.on-scroll").each(function() {
            var imageSelector = jQuery(this);
            imageSelector.attr("src", imageSelector.attr("data-src")).removeAttr("data-src").removeClass("on-scroll");
        });
    });
}

/* Home page banner Banner interval */
jQuery(document).ready(function() {
    var bannerHome = jQuery('.home-page-banner-change');
    if (bannerHome && bannerHome.length > 1) {
        var bannerHomeDefault = 0;
        setInterval(function() {
            var bannerBlockEq = bannerHome.eq(bannerHomeDefault);
            if (bannerBlockEq.hasClass('active')) {
                bannerHomeDefault++;
            }
            bannerHome.removeClass('active').eq(bannerHomeDefault).addClass('active');
            bannerHomeDefault++;
            if (bannerHomeDefault >= bannerHome.length) {
                bannerHomeDefault = 0;
            }
        }, 5000);
    }
});