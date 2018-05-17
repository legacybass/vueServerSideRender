import { createServerRenderer } from 'aspnet-prerendering';
import { createRenderer } from 'vue-server-renderer';
import Vue from 'vue';
import configureStore from './configureStore';
//import App from './components/app-root';
import App from './components/temp-component';
import router from './router';

export default createServerRenderer(async function (params) {
	const basename = params.baseUrl.substring(0, params.baseUrl.length - 1);
	const urlAfterBasename = params.url.substring(basename.length);
	const store = configureStore(null, params.data);

	store.dispatch(urlAfterBasename); // route to the incoming url

	const vueApp = new Vue({
		store,
		router,
		...App
	});


	const renderer = createRenderer();
	const html = await renderer.renderToString(vueApp);

	await params.domainTasks;

	return {
		html,
		globals: { initialVuexState: store.state }
	};
});
