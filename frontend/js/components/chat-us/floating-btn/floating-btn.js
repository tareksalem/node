import { Active } from "../../../lib/active";
import { MDCRipple } from '@material/ripple';
class FloatingBtn extends Active.Component {
    constructor(options) {
        super(options);
    }
    load() {
        const fabRipple = new MDCRipple(this.self);
    }
    render() {
        return ( /*html*/ `
        <button expName="floatingBtn" class="mdc-fab app-fab--absolute" aria-label="Favorite">
            <span expName="floatingBtnIcon" class="mdc-fab__icon material-icons">chat_bubble</span>
        </button>
        `)
    }
}

export default FloatingBtn;