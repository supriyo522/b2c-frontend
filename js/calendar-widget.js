jQuery(document).ready(function() {
    //add CSS using jQuery for Sidebar Calendar Widget
    if (jQuery("#wp-calendar").length) {
        jQuery('#wp-calendar').removeClass('table').addClass('table');
        jQuery('#wp-calendar>tbody>tr>td').not('td.pad,td#today').removeAttr('style').attr('style', 'border: 1px solid;border-radius: 5px !important;background: #813488;color: white;text-align: center;');
    }
})