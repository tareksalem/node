import { Active } from "../../lib/active";

class SideNav extends Active.Component {
    constructor(options) {
        super(options);
    }
    render() {
        return ( /*html*/ `
        <aside-component>
            <div class="mdc-drawer__header">
                <h3 class="mdc-drawer__title">Mail</h3>
                <h6 class="mdc-drawer__subtitle">email@material.io</h6>
            </div>
            <div class="mdc-drawer__content">
                <nav class="mdc-list">
                    <a class="mdc-list-item mdc-list-item--activated" href="#" tabindex="0" aria-selected="true">
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
                        Inbox
                    </a>
                    <a class="mdc-list-item" href="#" tabindex="-1">
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>
                        Star
                    </a>
                    <a class="mdc-list-item" href="#" tabindex="-1">
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>Sent Mail
                    </a>
                    <a class="mdc-list-item" href="#" tabindex="-1"><i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>Drafts
                    </a>
                    <hr class="mdc-list-divider">
                    <h6 class="mdc-list-group__subheader">Labels</h6>
                    <a class="mdc-list-item" href="#" tabindex="-1">
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
                        Family
                    </a>
                    <a class="mdc-list-item" href="#" tabindex="-1"><i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
                        Friends
                    </a>
                    <a class="mdc-list-item" href="#" tabindex="-1"><i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
                       Work
                    </a>
                    <hr class="mdc-list-divider">
                    <a class="mdc-list-item" href="#" tabindex="-1">
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>
                        Settings
                    </a>
                    <a class="mdc-list-item" href="#" tabindex="-1">
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">announcement</i>
                        Help &amp; feedback
                    </a>
                </nav>
            </div>
        </aside-component>
    `)
    }
}

export default SideNav;