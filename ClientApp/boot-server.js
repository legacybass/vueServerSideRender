import { createServerRenderer } from 'aspnet-prerendering';
import { createRenderer } from 'vue-server-renderer';
//const renderer = require('vue-server-renderer').createRenderer();
//const app = require('./app').default;

export default createServerRenderer(function (params) {
	return new Promise((resolve, reject) => {

		return resolve({ html: '<h1>You made it!</h1>' });

		//const basename = params.baseUrl.substring(0, params.baseUrl.length - 1);
		//const urlAfterBasename = params.url.substring(basename.length);
		//const store = configureStore(null, params.data);

		////store.dispatch(urlAfterBasename); // route to the incoming url


		//const html = renderer.renderToString(app)

		//params.domainTasks.then(() => {
		//	resolve({
		//		html,
		//		globals: { initialVuexState: state.getState() }
		//	})
		//});
	});
});
