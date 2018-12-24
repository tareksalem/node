import { Active } from "../../lib/active";
import { MDCFormField } from '@material/form-field';
import { MDCTextField } from '@material/textfield';
import FloatingBtn from "./floating-btn/floating-btn.js";
import ChatBox from "./chat-box/chat-box";
class ChatUsComponent extends Active.Component {
    constructor(options) {
        super(options);
    }
    load() {
        const formField = new MDCFormField(this.self);
        const usernameField = new MDCTextField(this.self.querySelector('#usernamefield'));
        const emailField = new MDCTextField(this.self.querySelector('#emailfield'));
        const textarea = new MDCTextField(this.self.querySelector('#textarea'));
    }
    render() {
        return /*html*/ `
            <component>
                <container-chat expname="chatBox" class="mdc-card">
                    
                </container-chat>
                <floating-btn>     
                </floating-btn>
            </component>
        `
    }
    methods() {
        var clicks = 0;
        return {
            floatingBtn: {
                click: (e) => {
                    clicks++;
                    if (clicks == 1) {
                        // clicks = 0;
                        this.chatBox.style.display = "block";
                        this.floatingBtnIcon.innerHTML = "close";
                    } else {
                        this.chatBox.style.display = "none";
                        this.floatingBtnIcon.innerHTML = "chat_bubble";
                        clicks = 0;
                    }
                }
            }
        };
    }
}


var chatUsComponent = new ChatUsComponent({
    parent: "container-chat-us",
    childComponents: [{
            component: FloatingBtn,
            options: {
                parent: "floating-btn"
            }
        },
        {
            component: ChatBox,
            options: {
                parent: "container-chat"
            }
        }
    ],
    style: {
        "container-chat": {
            display: "none"
        }
    }
})

export default chatUsComponent;