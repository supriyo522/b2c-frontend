var WIDGETS = {
    // this function will take care of search submit
    searchWidget: function() {
        function searchInputValiadation(se, sf) {
            var sel_value = se.val().trim();
            se.val(sel_value);
            var msg = "";
            var reg_exp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:/g;
            se.siblings(".input-error-msg").remove();
            if (!sel_value || sel_value === null) {
                msg = "Search keyword is required.";
            } else if (sel_value.indexOf("byjus.com/") != -1) {
                sel_value = sel_value
                    .split("byjus.com/")[1]
                    .split("/")
                    .join(" ");
                se.val(sel_value.trim());
                // } else if (sel_value.match(reg_exp)) {
                // 	msg = "Special characters not allowed.";
                // } else if (sel_value.length > 50) {
                // 	msg = "Allowed maximum 50 characters only.";
            }

            if (msg) {
                se.addClass("input-error").removeClass("input-valid");
                se.after('<div class="input-error-msg">' + msg + "</div>");
                return false;
            } else {
                se.removeClass("input-error");
                se.addClass("input-valid");
                return true;
            }
            return false;
        }

        // desktop
        var se = jQuery("#search-widget input");
        var sf = jQuery("#search-widget form");
        se.on("blur change", function(e) {
            searchInputValiadation(se, sf);
        });

        sf.submit(function(e) {
            if (!searchInputValiadation(se, sf)) {
                e.preventDefault();
            } else {
                if (GA_FLAG)
                    ga(
                        "send",
                        "event",
                        "SearchWidget",
                        "On search form submit",
                        "Search Keyword: " + se.val() + ",Page Url: " + C_URL
                    );
            }
        });

        // mobile
        var se_m = jQuery("#search-bar-m input");
        var sf_m = jQuery("#search-bar-m form");
        se_m.on("blur change", function(e) {
            searchInputValiadation(se_m, sf_m);
        });

        sf_m.submit(function(e) {
            if (!searchInputValiadation(se_m, sf_m)) {
                e.preventDefault();
            } else {
                if (GA_FLAG)
                    ga(
                        "send",
                        "event",
                        "SearchWidget",
                        "On search form submit",
                        "Search Keyword: " + se.val() + ",Page Url: " + C_URL
                    );
            }
        });
    },
    // this function will take care of search submit
    joinByjusFormSubmitForm: function(e, ele) {
        e.preventDefault();
        var sel = jQuery(ele);
        sel
            .find('input[name="mx_Inbound_Enquiry_Date"]')
            .val(UTILITIES.getCurrentDateTime("yyyy-mm-dd hh:mm:ss-UTC")); // setting current time
        var formInputs = sel.find(".form-group input");
        var formSelect = sel.find(".form-group select");
        if ((sel.find(".form-group input.input-valid").length == formInputs.length) && sel.find(".form-group select.input-valid")) {
            UTILITIES.addToastMessage(
                'page-form-popup-and-widget-0',
                "Form details are submitting.."
            );

            sel
                .find('button[type="submit"]')
                .attr('disabled', true)
                .html("Loading.."); // TO disable submit button
            // Changed grade & LS table name & pageId
            sel = getLSTableIdByGradeName(sel);
            // to call LS API
            var post_data = sel.serialize();
            //Adding value for utm parameters
            var utmSource, utmCampaign, utmContent, getWebsite;
            utmSource = UTILITIES.getParameterByName('utm_source', C_URL);
            utmCampaign = UTILITIES.getParameterByName('utm_campaign', C_URL);
            utmContent = UTILITIES.getParameterByName('utm_content', C_URL);
            getWebsite = UTILITIES.getParamValueByName('Website', post_data);
            var gclid = UTILITIES.getParamValueByName('gclid', C_URL);
            post_data += '&SourceCampaign=' + (utmCampaign ? utmCampaign : "") + '&SourceMedium=' + (utmSource ? utmSource : "") + '&SourceContent=' + (utmContent ? utmContent : "") + (gclid ? '&mx_Gclid=' + gclid : '');
            if (!getWebsite) {
                post_data += '&Website=' + escape(C_URL);
            } else {
                post_data = UTILITIES.updateParamValueByName(post_data, "Website", escape(C_URL));
            }
            post_data += '&slugName=' + "pageWidgetForm";
            post_data += '&Website_URL=' + visitedURL;
            post_data += '&Platform=' + (typeof navigator.isMobile != 'undefined' ? (navigator.isMobile ? "website_mobile" : "website_desktop") : "");
            post_data += '&Lead_Magnet_Type=' + "SIDEBAR_JOIN_BYJUS_FORM";
            post_data += '&Device_Details=' + (typeof navigator.detectDeviceAgent != "undefined" ? navigator.detectDeviceAgent : "");
            post_data += '&Device_UserAgent=' + (typeof navigator.userAgent != "undefined" ? navigator.userAgent : "");

            function findAndReplaceEmptyKeyValuePair(str) { // 
                var arrayOfKeyValue = str.split('&')
                var arrayOfKeyValueLength = arrayOfKeyValue.length;
                var finalArray = [];
                for (var i = 0; i < arrayOfKeyValueLength; i++) {
                    if (arrayOfKeyValue[i].indexOf('=') !== arrayOfKeyValue[i].length - 1) {
                        finalArray.push(arrayOfKeyValue[i])
                    }
                }
                finalArray = [...new Set(finalArray)];
                return finalArray.join('&');
            }


            jQuery.ajax({
                type: 'POST',
                url: COMMON_UTILS_ENDPOINT_KEY + "leads/",
                data: findAndReplaceEmptyKeyValuePair(post_data),
                complete: function(xhr, status) {

                    if (xhr.status === 200) {
                        UTILITIES.removeToastMessage('page-form-popup-and-widget-0');
                        sel.addClass('hidden');
                        if (!sel.find('.register-form-widget-success-block').length) {
                            var successHtml = '' +
                                '<div class="register-form-widget-success-block">' +
                                '<div class="text-center success-message">' +
                                '<svg style="width:60px;height:60px" viewBox="0 0 24 24"><path fill="green" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" /></svg>' +
                                '<br>';
                            // check Instance name then display success msg
                            if (INSTANCE_NAME === 'free-ias-prep') {
                                jQuery("#register-modal-widget").addClass('submitted-successfully');
                                successHtml += ' <h4>Congrats! You\'re a step closer to your IAS dream</h4>' +
                                    'Our mentors shall get in touch with you soon to help you plan your preparation better.' +
                                    ' Good Luck!'
                            } else {
                                successHtml = successHtml + ' <h4>Thank you for connecting with BYJU\'S!!,</h4> Our Counsellors will get in touch with you soon and help you get started with your ' +
                                    FORM_NAME + ' Preparation';
                            }
                            successHtml += '</div>' +
                                '</div>';
                            sel.after(successHtml);
                        } else {
                            sel.find('.register-form-widget-success-block').removeClass('hidden');
                        }

                        if (sel.attr('id') == 'register-popup-form-widget') { // identifying is it popup
                            UTILITIES.setCookie(
                                "pagebformypopupj",
                                1,
                                15
                            ); // on successfully submition of page form popup we are not showing this popup for next 15 days.

                            GA_FLAG && ga("send", "event", INSTANCE_NAME + " Popup Form Successful", "Form Submission activity created Successfully", "URL: " + C_URL); // GA
                        }
                    } else {
                        UTILITIES.addToastMessage(
                            'page-form-popup-and-widget-0',
                            xhr.responseJSON.message
                        ); // on fail showing error toast message. Please try again later!

                        GA_FLAG && ga("send", "event", INSTANCE_NAME + " Popup Form Failed", "Form Submission activity created Failed", "URL: " + C_URL); // GA
                    }

                }
            });
        } else {
            e.preventDefault();
            formInputs.each(function(i, ele) {
                jQuery(ele).blur();
            });
            formSelect.blur();
        }

        //ga
        if (GA_FLAG) {
            var formId = jQuery(ele).attr('id');
            if (formId === 'register-popup-form-widget') {
                ga("send", "event", "Form Popup Button Click: " + FORM_NAME, "On Submitting Form", "Form Values: " + jQuery(ele).serialize());
            } else if (formId === 'join-byjus-form-widget') {
                ga("send", "event", "Join BYJU'S Form Button Click: " + FORM_NAME, "On Submitting Form", "Form Values: " + jQuery(ele).serialize());
            }
        }

    }
};

function getLSTableIdByGradeName(obj) {
    var gradeNameEle = obj.find('[name="grade"]'); //GR-288: this would always return the jquery object even if the children is not found
    if (gradeNameEle.val() !== null) {
        var pageIDTableNameCourseName = gradeNameEle.find('option:selected').attr('data-value');
        //GR-288: adding a check for pages that do not have grades drop down
        if (pageIDTableNameCourseName) {
            var courseNames = pageIDTableNameCourseName.split('_');
            if (courseNames[0] != 'undefined') {
                obj.find('[name="mx_Course_Name"]').val(courseNames[0]);
            }
            if (courseNames[1] != 'undefined') {
                obj.find('[name="MXHOrgCode"]').val(courseNames[1]);
            }
            if (courseNames[2] != 'undefined') {
                obj.find('[name="MXHLandingPageId"]').val(courseNames[2]);
            }

        }

    }
    return obj;
}
jQuery(document).ready(function() {
    WIDGETS.searchWidget();

})