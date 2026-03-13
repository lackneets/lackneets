/*jslint browser:true */
/*jshint browser:true, jquery:true */

(function ($) {
    'use strict';

    var options = $.lazyLoadXT;

    options.selector += ',video,iframe[data-src]';
    options.videoPoster = 'data-poster';

    $(document).on('lazyshow', 'video', function (e, $el) {
        var srcAttr = $el.lazyLoadXT.srcAttr,
            isFuncSrcAttr = $.isFunction(srcAttr);

        $el[0].setAttribute('poster', $el.attr(options.videoPoster));
        $el[0].src = $el.children('source[data-src]').attr('data-src');

    });

})(window.jQuery || window.Zepto || window.$);
