/// <reference path="../../typings/jquery/jquery.d.ts" />

declare var modpack;
function _hoverFunc(e) {
    var el = $(this);
    if (e.type == 'mouseenter') {
        // still show the popover if the user left and returned hover
        el.data('cancelled', false);

        if (!el.data('loaded')) {
            el.data('loaded', true);

            $.get('/pack/' + modpack + '/api/popup/' + el.data('item-type') + '/' + el.data('item-name'), function (response) {
                var po = (<any> el.unbind('hover')).popover({
                    content: response,
                    html: true
                });
                po.popover(el.data('cancelled') ? 'hide' : 'show');
            });
        }
    } else if (e.type == 'mouseleave') {
        // don't show the popover when it loads
        el.data('cancelled', true);
    }
}
$(document).ready(function() {
    $("*[data-item-name]").hover(_hoverFunc);
});