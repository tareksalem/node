import { Active } from "../../../lib/active";

class ChatBox extends Active.Component {
    constructor(options) {
        super(options);
    }
    render() {
        return /*html*/ `
            <component>
                        <form>
                            <div class="mdc-form-field mdc-form-field--align-end">
                                <h4 class="text-center">Contact Us</h4>
                                <div id="usernamefield" class="mdc-text-field mdc-text-field--fullwidth">
                                    <input type="text" id="username" class="mdc-text-field__input">
                                    <label class="mdc-floating-label" for="username">Username</label>
                                    <div class="mdc-line-ripple"></div>
                                </div>
                                <div id="emailfield" class="mdc-text-field mdc-text-field--fullwidth">
                                    <input type="email" id="email" class="mdc-text-field__input">
                                    <label class="mdc-floating-label" for="email">Email</label>
                                    <div class="mdc-line-ripple"></div>
                                </div>
                                <div class="mdc-text-field mdc-text-field--fullwidth" id="textarea">
                                    <textarea type="text" id="textarea-input" class="mdc-text-field__input"></textarea>
                                    <label class="mdc-floating-label" for="textarea-input">your message</label>
                                    <div class="mdc-line-ripple"></div>
                                </div>
                                <button id="send-message-btn" class="mdc-fab" aria-label="Favorite">
                                    <span class="mdc-fab__icon material-icons">send</span>
                                </button>
                                <label for="my-checkbox"></label>
                            </div>
                        </form>
                    </component>
        `

    }
}

export default ChatBox;