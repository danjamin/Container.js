// Containerfile.js
(function(Containerfile, undefined) {
    var env = 'dev';
    var containerfile = {
        document: document,
        window: window,
        env: env
    };

    if (env === 'dev') {
        containerfile['dev'] = 5;
    }

    Containerfile(containerfile);

})(Containerfile);