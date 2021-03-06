define('routes_api_args',
    ['buckets', 'capabilities', 'settings', 'user_helpers'],
    function(buckets, caps, settings, user_helpers) {

    var _dev = null;
    var _device = null;
    var _limit = settings.num_per_page;

    if (caps.firefoxOS) {
        _dev = _device = 'firefoxos';
    } else if (caps.firefoxAndroid) {
        _dev = 'android';
        _device = caps.widescreen() ? 'tablet' : 'mobile';
    }

    return function() {
        return {
            lang: (navigator.l10n && navigator.l10n.language) || navigator.language || navigator.userLanguage,
            region: user_helpers.region(undefined, true),
            carrier: user_helpers.carrier(),
            dev: _dev,
            device: _device,
            limit: _limit,
            pro: buckets.profile
        };
    };

});
