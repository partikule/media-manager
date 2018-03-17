let mix = require('laravel-mix');

mix.sass('resources/assets/sass/media-manager.scss', 'public/css/')
    .js('resources/assets/js/components/media-manager/media-manager.js', 'public/js/')
    .copy('resources/assets/fonts', 'public/fonts/')