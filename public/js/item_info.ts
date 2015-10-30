/// <reference path="../../typings/jquery/jquery.d.ts" />

declare var modpack;
function _hoverFunc() {
    var el = $(this);
    if (!el.data('loaded')) {
        el.data('loaded', true);
        $.get('/pack/' + modpack + '/api/popup/' + el.data('item-type') + '/' + el.data('item-name'), function(response) {
            var po = (<any> el.unbind('hover')).popover({
                content: response,
                html: true
            });
            po.popover('show');
        });
    }
}
$(document).ready(function() {
    $("*[data-item-name]").hover(_hoverFunc);
});