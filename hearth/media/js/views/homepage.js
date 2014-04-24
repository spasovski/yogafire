define('views/homepage',
    ['format', 'l10n', 'log', 'models', 'urls', 'utils_local'],
    function(format, l10n, log, models, urls, utils_local) {
    'use strict';

    var gettext = l10n.gettext;
    var console = log('homepage');

    var app_models = models('app');

    var catElm = '<li><a class="cat-{0} cat-icon-a" data-cat-slug="{0}" href="{1}">{2}</a></li>';

    return function(builder, args, params) {
        params = params || {};

        builder.z('title', '');  // We don't want a title on the homepage.

        builder.z('type', 'root');
        builder.z('search', params.name);
        builder.z('title', params.name);

        builder.z('cat', 'all');
        builder.z('show_cats', true);

        if ('src' in params) {
            delete params.src;
        }

        utils_local.checkOnline().then(function() {
            builder.start('category_yogafire/main.html', {
                endpoint: urls.api.unsigned.url('category', [''], params),
                sort: params.sort,
                app_cast: app_models.cast
            });
        }).fail(function() {
            endpoint = ;
            builder.start('category_yogafire/main.html', {
                endpoint: '/db/preloaded.json',
                sort: params.sort,
                app_cast: app_models.cast
            });
        });


    };
});
