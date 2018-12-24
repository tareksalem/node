import { Active } from "../../lib/active";
import { MDCRipple } from '@material/ripple';

class SolutionsComponent extends Active.Component {
    constructor(options) {
        super(options);
    }
    load() {
        const selectors = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
        const ripples = [].map.call(this.self.querySelectorAll(selectors), function(el) {
            return new MDCRipple(el);
        });
    }
    render() {
        return ( /*html*/ `
            <component>
                <h1 class="text-center">Our solutions</h1>
                <div class="container-cards">
                    <div class="mdc-layout-grid">
                        <div class="mdc-layout-grid__inner">
                            <div class="mdc-layout-grid__cell">
                                <div class="mdc-card component-card">
                                    <!-- ... content ... -->
                                    <div class="mdc-card__primary-action text-center">
                                        <i class="material-icons web-icon">
                                            web
                                        </i>
                                        <h1>Web Development Solutions</h1>
                                        <p>A solid solutions fo all web development purposes</p>
                                    </div>
                                    <div class="mdc-card__actions">
                                        <div class="mdc-card__action-buttons">
                                            <button class="mdc-button mdc-card__action mdc-card__action--button">Start Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mdc-layout-grid__cell">
                                <div class="mdc-card component-card">
                                    <!-- ... content ... -->
                                    <div class="mdc-card__primary-action text-center">
                                        <i class="material-icons android-icon">
                                            android
                                        </i>
                                        <h1>Mobile Development Solutions</h1>
                                        <p>A solid solutions fo all web development purposes</p>
                                    </div>
                                    <div class="mdc-card__actions">
                                        <div class="mdc-card__action-buttons">
                                            <button class="mdc-button mdc-card__action mdc-card__action--button">Start Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mdc-layout-grid__cell">
                                <div class="mdc-card component-card">
                                    <!-- ... content ... -->
                                    <div class="mdc-card__primary-action text-center">
                                        <i class="material-icons desktop-icon">
                                        desktop_windows
                                        </i>
                                        <h1>Desktop Development Solutions</h1>
                                        <p>A solid solutions fo all web development purposes</p>
                                    </div>
                                    <div class="mdc-card__actions">
                                        <div class="mdc-card__action-buttons">
                                            <button class="mdc-button mdc-card__action mdc-card__action--button">Start Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </component>
        `)
    }
}
var solutionsComponent = new SolutionsComponent({
    parent: ".our-solutions",
    style: {
        ".component-card": {
            // width: "400px",
            height: "auto"
        }
    }
});
export default solutionsComponent;