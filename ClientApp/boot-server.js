var prerendering = require('aspnet-prerendering');
const renderer = require('vue-server-renderer').createRenderer();
const app = require('./app').default;

module.exports = prerendering.createServerRenderer(function (params) {
    return new Promise((resolve, reject) => {
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1);
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(null, params.data);

        //store.dispatch(urlAfterBasename); // route to the incoming url


        const html = renderer.renderToString(app)

        params.domainTasks.then(() => {
            resolve({
                html,
                globals: { initialVuexState: state.getState() }
            })
        });
    });
});
