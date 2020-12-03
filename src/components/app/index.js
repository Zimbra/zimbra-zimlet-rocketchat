import { createElement, Component } from 'preact';
import { withIntl } from '../../enhancers';
import { Sidebar } from '@zimbra-client/components';

// Can also use shimmed decorators like graphql or withText.
// Or, utils, like callWtih. Refer to zm-x-web, zimbraManager/shims.js
// More shims can be added here if necessary; also requires an update to zimlet-cli

@withIntl()
export default class App extends Component {
    constructor(props) {
        super(props);
        this.zimletContext = props.context;
        //Get all zimlets
        const zimlets = this.zimletContext.getAccount().zimlets
        this.globalConfig = new Map();
        //Get demo zimlet
        const zimlet = zimlets.zimlet.find(zimlet => zimlet.zimlet[0].name === "zimbra-zimlet-rocketchat");

        //Add all demo zimlet configuration properties to an ES6 Map
        if (zimlet) {
            const globalConfig = zimlet.zimletConfig[0].global[0].property || [];
            for (var i = 0; i < globalConfig.length; i++) {
                this.globalConfig.set(globalConfig[i].name, globalConfig[i].content);
            };
        }
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
        //now you can get a property value by doing: this.globalConfig.get('name-of-property')
    };
    render() {
        return (
            <iframe style="height:100%;width:100%;border:0px;" src={this.globalConfig.get('rocketurl') || "/service/extension/rocket"}>
            </iframe>
        );
    }
}
