import { createServerRenderer } from 'aspnet-prerendering';
import { createRenderer } from 'vue-server-renderer';
import { app } from './app';
import configureStore from './configureStore';



export default createServerRenderer(async function (params) {
	//return new Promise((resolve, reject) => {


	const basename = params.baseUrl.substring(0, params.baseUrl.length - 1);
	const urlAfterBasename = params.url.substring(basename.length);
	const store = configureStore(null, params.data);

	//store.dispatch(urlAfterBasename); // route to the incoming url

	const renderer = createRenderer();
	const html = await renderer.renderToString(app);
	console.log(html);

	//params.domainTasks.then(() => {
	//	resolve({
	//		html,
	//		globals: { initialVuexState: state.getState() }
	//	})
	//});

	return { html };
	//});
});
