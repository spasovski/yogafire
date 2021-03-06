define('previews',
    ['flipsnap', 'log', 'models', 'templates', 'capabilities', 'yogahandles', 'underscore', 'z'],
    function(Flipsnap, log, models, nunjucks, caps, handles, _, z) {

    var console = log('previews');

    // magic numbers!
    var THUMB_WIDTH = 150;
    var THUMB_PADDED = 165;

    var slider_pool = [];

    z.page.on('click', '.dot', function() {
        console.log('Dot clicked, repositioning trays');
        var $this = $(this);
        $this.closest('.tray')[0].slider.moveToPoint($this.index());
    });

    function populateTray() {
        // preview trays expect to immediately follow a .mkt-tile.
        var $tray = $(this);
        if (!$tray.prev().hasClass('mkt-tile') ||
            $tray.hasClass('single') ||
            $tray.hasClass('init')) {
            return;
        }

        var numPreviews = $tray.find('li').length;
        var $content = $tray.find('.content');

        var width = numPreviews * THUMB_PADDED - 15;

        $content.css({
            width: width + 'px',
            margin: '0 ' + ($tray.width() - THUMB_WIDTH) / 2 + 'px'
        });

        $tray.addClass('init');
        var slider = Flipsnap(
            $tray.find('.content')[0],
            {distance: THUMB_PADDED}
        );
        this.slider = slider;
        var $pointer = $tray.find('.dots .dot');

        slider.element.addEventListener('fsmoveend', setActiveDot, false);

        // Show as many thumbs as possible to start (zero-indexed).
        slider.moveToPoint(~~($tray.width() / THUMB_PADDED / 2) - 1);

        slider_pool.push(slider);

        function setActiveDot() {
            $pointer.filter('.current').removeClass('current');
            $pointer.eq(slider.currentPoint).addClass('current');
        }
        setActiveDot();

        // Tray can fit 3 desktop thumbs before paging is required.
        if (numPreviews > 1) {
            handles.attachHandles(slider, $tray.find('.slider'));
        }

    }

    // Reinitialize Flipsnap positions on resize.
    z.doc.on('saferesize.tray', function() {
        $('.tray').each(function() {
            var $tray = $(this);
            $tray.find('.content').css('margin', '0 ' + ($tray.width() - THUMB_WIDTH) / 2 + 'px');
        });
        for (var i = 0, e; e = slider_pool[i++];) {
            e.refresh();
        }
    });

    // We're leaving the page, so destroy Flipsnap.
    z.win.on('unloading.tray', function() {
        for (var i = 0, e; e = slider_pool[i++];) {
            e.destroy();
        }
        slider_pool = [];
    });

    z.page.on('dragstart dragover', function(e) {
        e.preventDefault();
    }).on('populatetray', function() {
        console.log('Populating trays');
        $('.listing.expanded .mkt-tile + .tray').each(populateTray);
    });

});
