function countrySelectionPopupStrip(pageType) {
    if (jQuery('[data-country-popup-strip]').length > 0) {
        var countryCode;
        var formDataCountryPopup = {
            'page_type': pageType,
            'url_path': C_URL,
            'place': ''
        };

        jQuery.ajax({
            type: 'POST',
            url: COUNTRY_CHECK_API,
            data: formDataCountryPopup,
            success: function(response) {
                if (response.success) {
                    var htmlStringOption;
                    if (!response.data.segement) {
                        if (pageType === 'me') {
                            showMECitiesByCountryCode(response.data.country_code);
                        }
                        if (response.data.popup) {
                            if (pageType === 'home' || pageType === 'me') { // add popup strip before Header of India Home Page
                                jQuery('header').before(jQuery('#geo-country-selection-popup'));
                            }

                            // Check if country code and requested page are for same country then hide country popup strip
                            if (
                                (response.data.flag === 'IN' && (response.data.logo == '//' || response.data.logo == '/support-center/')) ||
                                (response.data.flag === 'CA' && response.data.logo == '/ca/') ||
                                (response.data.flag === 'US' && response.data.logo == '/us/') ||
                                (response.data.flag === 'MX' && response.data.logo == '/mx/') ||
                                (response.data.flag === 'AU' && response.data.logo == '/au/') ||
                                (response.data.flag === 'UK' && response.data.logo == '/uk/') ||
                                (response.data.flag === 'ME' && response.data.logo == '/me/') ||
                                (response.data.flag === 'BR' && response.data.logo == '/br/') ||
                                (response.data.flag === 'GLOBAL' && response.data.logo == '/global/')
                            ) {
                                jQuery('[data-country-popup-strip]').addClass('hidden');
                            } else {
                                var path_name = document.location.pathname;

                                jQuery('[data-country-popup-strip]').removeClass('hidden');
                                htmlStringOption = '<option ' + ((response.data.flag === 'CA') ? 'selected' : '') + ' value="ca/' + response.data.segment + '"> Canada </option>';
                                htmlStringOption += '<option ' + ((response.data.flag === 'US') ? 'selected' : '') + ' value="us/' + response.data.segment + '"> USA </option>';
                                htmlStringOption += '<option ' + ((response.data.flag === 'IN') ? 'selected' : '') + ' value="' + response.data.segment + '"> India </option>';
                                if (response.data.segment !== 'faq' && response.data.segment !== 'support-center') {
                                    htmlStringOption += '<option ' + ((response.data.flag === 'MX') ? 'selected' : '') + ' value="mx/' + response.data.segment + '"> Mexico </option>';
                                    htmlStringOption += '<option ' + ((response.data.flag === 'AU') ? 'selected' : '') + ' value="au/' + response.data.segment + '"> Australia </option>';
                                    htmlStringOption += '<option ' + ((response.data.flag === 'UK') ? 'selected' : '') + ' value="uk/' + response.data.segment + '"> United Kingdom </option>';
                                    htmlStringOption += '<option ' + ((response.data.flag === 'BR') ? 'selected' : '') + ' value="br/' + response.data.segment + '"> Brazil </option>';
                                    htmlStringOption += '<option ' + ((response.data.flag === 'ME') ? 'selected' : '') + ' value="me/' + response.data.segment + '"> Middle East </option>';
                                    htmlStringOption += '<option ' + ((response.data.flag === 'GLOBAL') ? 'selected' : '') + ' value="global/' + response.data.segment + '"> Global </option>';
                                }
                                jQuery('[data-country-dropdown]').append(htmlStringOption);

                                var IS_POPUP_CLICKED = getCookie("popUpClicked");; // Get cookie value

                                //todo : Need to check, what is the logic behind IF condition
                                if (!IS_POPUP_CLICKED && (
                                        (path_name == '/' || path_name == '' && response.data.flag == 'US') ||
                                        (path_name == '/' || path_name == '' && response.data.flag == 'MX')
                                    )) {
                                    jQuery('head').after('<link rel="stylesheet" href="https://cdn1.byjus.com/byjusweb/css/custom-bootstrap.css" type="text/css" />');
                                    setTimeout(function() {
                                        var popupHtmlString = '<div class="modal fade country-popup-for-us" id="country-popup-for-us-modal" data-backdrop="static" data-keyboard="false" role="dialog">' +
                                            '<div class="modal-dialog country-popup-dialog-for-us">' +
                                            '<div class="modal-content">' +
                                            '<div class="modal-body country-popup-body">' +
                                            '<p class="choose-region-text"><span>Choose your country or region</span>  <br> to see content specific <br> to your location.</p>' +
                                            '<div class="geo-country-selection-dropdown">' +
                                            '<form>' +
                                            '<div class="form-group form-group-us-country">' +
                                            '<select class="form-control" id="country-popup-page" data-country-dropdown-us data-country-dropdown></select>' +
                                            '</div>' +
                                            '<input type="button" class="btn btn-info countinue-btn" role="button" value="Continue" onclick="continueFun(\'popup\')">' +
                                            '</form>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>';
                                        jQuery('body').after(popupHtmlString);
                                        jQuery('[data-country-dropdown-us]').append(htmlStringOption);
                                        jQuery('#country-popup-for-us-modal').modal('show');
                                    }, 1500);
                                }
                                jQuery('[data-country-dropdown]').after('<input type="hidden" data-country-flag="' + response.data.flag + '">');
                            }
                        }
                    }
                }
            },
            error: function(error) {
                console.log('error:', error);
            }
        });
    }
}

function continueFun(continueFrom) {
    var selCountry = jQuery('#country').val();

    if (continueFrom == 'popup') { // for us popup form
        selCountry = jQuery('#country-popup-page').val();

        // Set to cookies
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
        var popUpClickedValue = encodeURIComponent(selCountry + countryFlag); // value should have IP as well in combination
        document.cookie = "popUpClicked" + "=" + (popUpClickedValue || "") + expires + "; path=/";
    }
    var countryFlag = jQuery('.geo-country-selection-dropdown').find('[data-country-flag]').attr('data-country-flag');
    //Event capture when user is on Byjus home page in US and selected US from country dropdown
    var path_name = document.location.pathname;
    if (GA_FLAG && (path_name == '/' || path_name == '') && selCountry == 'us/' && countryFlag == 'US') {
        // trigger event on basis of popup
        (continueFrom == 'popup') ? ga("send", "event", "Country Popup Continue Btn", "Country Block Popup US Selection", 'Country Block Popup US Selection'): ga("send", "event", "Country Popup Continue Btn", "Country Popup US Selection", 'Country Popup US Selection');
    }
    return window.open(BASE_URL + selCountry, "_self");
}

function closeBtn() {
    jQuery('[data-country-popup-strip]').addClass('hidden');
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}