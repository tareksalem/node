import { Active } from "../../lib/active";
// import { MDCList } from "@material/list";
import { MDCDrawer } from "@material/drawer";
import { MDCTopAppBar } from '@material/top-app-bar/index';
import SideNav from './../sidenav/sidenav';

class Header extends Active.Component {
    constructor(options) {
        super(options);
    }
    load() {
        // const list = MDCList.attachTo(this.self);
        // list.wrapFocus = true;
        try {
            const topAppBarElement = this.self.querySelector("header");
            const topAppBar = MDCTopAppBar.attachTo(topAppBarElement);
            // topAppBar.setScrollTarget(document.getElementById('main-content'));
            const drawer = MDCDrawer.attachTo(this.self.querySelector(".mdc-drawer"));
            topAppBar.listen('MDCTopAppBar:nav', () => {
                drawer.open = !drawer.open;
            });
        } catch (e) {

        }
    }
    render() {
        return ( /*html*/ `
        <div id="root">
            <div class="drawer-frame-root">
                <aside class="mdc-drawer mdc-drawer--modal"></aside>
                <div class="mdc-drawer-scrim">
                    </div>
                    <div class="drawer-frame-app-content">
                        <header class="mdc-top-app-bar drawer-top-app-bar">
                            <div class="mdc-top-app-bar__row">
                                <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                                    <button class="material-icons mdc-top-app-bar__navigation-icon mdc-ripple-upgraded--unbounded mdc-ripple-upgraded" style="--mdc-ripple-fg-size:28px; --mdc-ripple-fg-scale:1.71429; --mdc-ripple-left:10px; --mdc-ripple-top:10px;">menu</button><span class="mdc-top-app-bar__title">Site name</span>
                                </section>
                                <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                                    <a href="#" class="navigation-link">Home</a>
                                    <a href="#" class="navigation-link">About Us</a>
                                    <a href="#" class="navigation-link">Contact Us</a>
                                </section>
                            </div>
                        </header>
                        <div class="drawer-main-content">
                            <div class="mdc-top-app-bar--fixed-adjust">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `)
    }
}



var header = new Header({
    parent: document.querySelector("app-header"),
    style: {
        ".navigation-link": {
            color: "white",
            margin: "0 10px",
            textDecoration: "none"
        },
        ".mdc-drawer-scrim": {
            "z-index": "100"
        }
    },
    childComponents: [{
        component: SideNav,
        options: {
            parent: "aside",
            style: {
                parent: {
                    "z-index": "101"
                }
            }
        }
    }],
    fadingIn: {
        duration: 1000
    },
});


export default header;