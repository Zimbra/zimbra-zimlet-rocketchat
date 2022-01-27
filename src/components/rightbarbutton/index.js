import { createElement } from 'preact';
import { Text } from 'preact-i18n';
import { MenuItem } from '@zimbra-client/components';
import { compose } from 'recompose';
import { withIntl } from '../../enhancers';
import { useCallback } from 'preact/hooks';
import { getCookie, setCookie } from '../../utils';

function RightbarButton(props, context) {
	const toggleDisplay = useCallback(() => {
		const frame = window.parent.document.querySelector(".rocketchat-zimlet-frame");
		const isCollapsed = frame.classList.toggle("zimbra-frame-rocketchat-collapsed");
		const zimlet = window.parent.document.querySelector(".zimbra-client_right-side-zimlet-slot_zimletPanel");
		zimlet.classList.toggle("zimbra-client_right-side-zimlet-slot_zimletPanel-expanded");

		setCookie('zimbra-zimlet-rocketchat-collapsed', isCollapsed);
	}, []);

	const childIcon = (
		<div class="zimbra-icon-rocketchat-rightbar">
		</div>);
	return (
		<MenuItem icon={childIcon} responsive onClick={toggleDisplay}></MenuItem>
	);
}

export default compose(withIntl())(RightbarButton);
