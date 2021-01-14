import { createElement } from "preact";
import { withIntl } from "./enhancers";
import App from "./components/app";
import { MenuItem } from "@zimbra-client/components";

import './public/styles.css';

export default function Zimlet(context) {
	const { plugins } = context;
	const exports = {};

	exports.init = function init() {
		// The zimlet slots to load into, and what is being loaded into that slot
		// (CustomMenuItem and Router are both defined below)
		plugins.register("slot::chatapps-tab-item", CustomTabItemInner);

		// Only needed if you need to create a new url route, like for a menu tab, or print, etc
		plugins.register("slot::routes", Router);
	};

	// Register a new route with the preact-router instance
	function Router() {
		return [<App path={`/chatapps/rocketchat`} context={context}></App>];
	}

		// Create a main nav menu item.
		const CustomTabItemInner = () => {
			const childIcon = (
				<span class="zimbra-icon-rocketchat">
				</span>);
			return (
				<MenuItem icon={childIcon} responsive href={`/chatapps/rocketchat`}>
					Rocket Chat
				</MenuItem>
			);
		};


	//create user account on rocket chat side
	try {
		console.log("create account for user on rocket chat");
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/service/extension/rocket?action=createUser');
		xhr.setRequestHeader("Content-Type", "text/plain");
		xhr.send();
	} catch (err) { }

	return exports;
}
