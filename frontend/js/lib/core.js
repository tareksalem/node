import { Router } from './router';
import ActiveHelpers from './helpers';

function ActiveClass() {
    this.ready = cb => {
        let loadInterval = setInterval(() => {
            if (document.readyState == 'complete') {
                clearInterval(loadInterval);
                return cb();
            }
        }, 100);
    };
    this.whileLoading = (cb, after) => {
        var i = 0;
        let loadInterval = setInterval(() => {
            if (document.readyState == 'complete') {
                clearInterval(loadInterval);
                setTimeout(() => {
                    if (after) {
                        return after();
                    } else {
                        return true;
                    }
                }, 100);
            } else {
                i++;
                if (i === 1) {
                    return cb();
                }
            }
        }, 1);
    };
    // some helpers methods
    this.helpers = {};
    this.helpers.checkEmpty = function(element, cb) {
        var elementVal = typeof element === 'object' ?
            element.value :
            typeof element === 'string' ? element : '';
        if (elementVal == '') {
            if (!cb) {
                return true;
            }
            if (cb) {
                var empty = true;
                return cb(empty);
            }
        } else {
            if (cb) {
                var empty = false;
                return cb(empty);
            } else {
                return false;
            }
        }
    };
    this.helpers.checkEmail = function(element, cb) {
        var elementVal = typeof element === 'object' ?
            element.value :
            typeof element === 'string' ? element : '';
        var regEx = new RegExp('@', 'gi');
        if (elementVal !== '') {
            if (cb) {
                var test = regEx.test(elementVal);
                return cb(test);
            } else {
                return regEx.test(elementVal);
            }
        }
    };
    // function to check if it is number
    this.helpers.checkIsNumber = function(element, cb) {
        var elementVal = typeof element === 'object' ?
            element.value :
            typeof element === 'string' ? element : '';
        if (elementVal !== '') {
            var testNumber = Number.isInteger(Number(elementVal));
            if (cb) {
                return cb(testNumber);
            } else {
                return testNumber;
            }
        }
    };

    // function to check if contains a number
    this.helpers.checkContainsNumber = function(element, count, cb) {
        var elementVal = typeof element === 'object' ?
            element.value :
            typeof element === 'string' ? element : '';
        if (typeof count === 'function' && !cb) {
            cb = count;
        }
        count = typeof count === 'number' ? count : 1;
        var numArr = [];
        if (elementVal !== '') {
            Array.from(elementVal).forEach(function(letter) {
                if (Number.isInteger(Number(letter))) {
                    numArr.push(letter);
                }
            });
            if (numArr.length === count) {
                let result = true;
                if (cb) {
                    return cb(result);
                } else {
                    return result;
                }
            } else {
                let result = false;
                if (cb) {
                    return cb(result);
                } else {
                    return result;
                }
            }
        }
    };
    // method to make alert and confirm boxes
    this.dialogs = {};
    this.dialogs.alert = function(options) {
            var parentElement = document.createElement('container-box');
            parentElement.id = 'containerBox';
            document.body.appendChild(parentElement);
            if (options.sound) {
                let audio = new Audio(options.sound);
                audio.play();
            }
            active.renderComponent(
                    data => {
                        return `
                <alarm-box>
                    <style>
                        container-box#containerBox{
                            z-index: 10000000000000000000000000000000000000000000000000000000000000000000000;
                            display:block;
                            width:100%;
                            height:100%;
                            position:fixed;
                            top:0;
                            bottom:0;
                            right:0;
                            left:0;
                            background: rgba(0, 0, 0, .30);
                            transition: .5s ease-in-out;
                        }
                        alarm-box{
                            background: #fff;
                            position: fixed;
                            z-index: 100000000000000000000000000000000000000000000000000000000000000000000000;
                            width:40%;
                            right:30%;
                            top: -100%;
                            height:auto;
                            min-height:50px;
                            padding:10px;
                            border-radius: 5px;
                            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                            text-align: center;
                            color:black;
                            display: block;
                            overflow:hidden;
                            margin-top:20px;
                        }
                        alarm-box button{
                            border:none;
                            outline: none;
                            background:#2196f3;
                            color:white;
                            display:block;
                            margin: 30px 0 10px 0;
                            float:right;
                            border-radius: 5px;
                            padding:10px;
                            cursor:pointer;
                        }
                        alarm-box button:hover{
                            background:#0d8aec;
                            transition: .4s ease-in-out;
                        }
                    </style>
                    ${data.message ? `<h4>${data.message}</h4>` : ''}
                    <button expName="closeBtn">${data.buttonText ? data.buttonText : 'Ok, close'}</button>
                </alarm-box>
            `;
      },
      {
        render: true,
        parent: parentElement,
        data: {
          message: options.message,
          buttonText: options.buttonText,
        },
        name: Math.random ().toString (26),
        animate: {
          animations: [
            {
              top: '-100%',
            },
            {
              top: '0',
            },
          ],
          options: {
            duration: 500,
            fill: 'forwards',
          },
        },
      },
      component => {
        let button = component.closeBtn;
        component.self.style.top = 'unset';
        const hideAlert = e => {
          component.self.animating (
            [{top: '0'}, {top: '-100%'}],
            {
              duration: 500,
              fill: 'forwards',
            },
            function () {
              active.removeComponent (component.name);
              parentElement.removeThis ();
            }
          );
        };
        button.addEvent ('click', hideAlert);
        var keyDownHandler = e => {
          if (e.keyCode === 13) {
            return hideAlert (e);
          }
        };
        document.addEventListener ('keydown', keyDownHandler);
      }
    );
  };
  this.dialogs.confirm = (options, cb) => {
    var parentElement = document.createElement ('container-box');
    parentElement.id = 'containerBox';
    document.body.appendChild (parentElement);

    if (options.sound) {
      let audio = new Audio (options.sound);
      audio.play ();
    }
    active.renderComponent (
      data => {
        return `
                <confirm-box>
                    <style>
                        container-box#containerBox{
                            z-index: 10000000000000000000000000000000000000000000000;
                            display:block;
                            width:100%;
                            height:100%;
                            position:fixed;
                            top:0;
                            bottom:0;
                            right:0;
                            left:0;
                            background: rgba(0, 0, 0, .30);
                            transition: .5s ease-in-out;
                        }
                        confirm-box{
                            background: #fff;
                            position: fixed;
                            z-index: 10000000000000000000000000000000000000000000000;
                            width:40%;
                            right:30%;
                            top: -100%;
                            height:auto;
                            min-height:50px;
                            padding:10px;
                            border-radius: 5px;
                            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                            text-align: center;
                            color:black;
                            display: block;
                            overflow:hidden;
                            margin-top:20px;
                        }
                        confirm-box button{
                            border:none;
                            outline: none;
                            background:#2196f3;
                            color:white;
                            display:block;
                            margin: 30px 0 10px 0;
                            border-radius: 5px;
                            padding:10px;
                            cursor:pointer;
                        }
                        confirm-box button:hover{
                            background:#0d8aec;
                            transition: .4s ease-in-out;
                        }
                        confirm-box .confirm-yes-btn{
                            float:right;
                        }
                        confirm-box .confirm-no-btn{
                            float:left;
                        }
                    </style>
                    ${data.message ? `<h4>${data.message}</h4>` : ''}
                    <button class="confirm-yes-btn" expName="yes">Yes</button>
                    <button class="confirm-no-btn" expName="no">No</button>
                </confirm-box>
            `;
      },
      {
        render: true,
        parent: parentElement,
        data: {
          message: options.message,
        },
        name: Math.random ().toString (26),
        animate: {
          animations: [
            {
              top: '-100%',
            },
            {
              top: '0',
            },
          ],
          options: {
            duration: 500,
            fill: 'forwards',
          },
        },
      },
      component => {
        let yes = component.yes;
        let no = component.no;
        component.self.style.top = 'unset';

        const hideConfirm = e => {
          component.self.animating (
            [{top: '0'}, {top: '-100%'}],
            {
              duration: 500,
              fill: 'forwards',
            },
            function () {
              active.removeComponent (component.name);
              parentElement.removeThis ();
              if (e.target === yes) {
                return cb (true);
              } else if (e.target === no) {
                return cb (false);
              }
            }
          );
        };
        yes.addEvent ('click', hideConfirm);
        no.addEvent ('click', hideConfirm);
      }
    );
  };
  // prompt dialog
  this.dialogs.prompt = (options, cb) => {
    var parentElement = document.createElement ('container-box');
    parentElement.id = 'containerBox';
    document.body.appendChild (parentElement);
    if (options.sound) {
      let audio = new Audio (options.sound);
      audio.play ();
    }
    active.renderComponent (
      data => {
        return `
                <prompt-box>
                    <style>
                        container-box#containerBox{
                            z-index: 100000000000000000000000000000000000000000000000000000000000000000000000;
                            display:block;
                            width:100%;
                            height:100%;
                            position:fixed;
                            top:0;
                            bottom:0;
                            right:0;
                            left:0;
                            background: rgba(0, 0, 0, .30);
                            transition: .5s ease-in-out;
                        }
                        prompt-box{
                            background: #fff;
                            position: fixed;
                            z-index: 10000000000000000000000000000000000000000000000000000000000000000000000000;
                            width:40%;
                            right:30%;
                            top: -100%;
                            height:auto;
                            min-height:50px;
                            padding:10px;
                            border-radius: 5px;
                            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                            text-align: center;
                            color:black;
                            display: block;
                            overflow:hidden;
                            margin-top:20px;
                        }
                        prompt-box button{
                            border:none;
                            outline: none;
                            background:#2196f3;
                            color:white;
                            display:block;
                            margin: 30px 0 10px 0;
                            border-radius: 5px;
                            padding:10px;
                            cursor:pointer;
                        }
                        prompt-box button:hover{
                            background:#0d8aec;
                            transition: .4s ease-in-out;
                        }
                        prompt-box .confirm-yes-btn{
                            float:right;
                        }
                        prompt-box .confirm-no-btn{
                            float:left;
                        }
                        prompt-box input{
                            border:none;
                            outline: none;
                            padding:10px;
                            display: block;
                            margin:10px auto 10px auto;
                            border-bottom:1px solid black;
                            color:black;
                        }
                    </style>
                    ${data.message ? `<h4>${data.message}</h4>` : ''}
                    <input expName="promptInput" placeholder="write here" type="text"/>
                    <button class="confirm-yes-btn" expName="submit">submit</button>
                    <button class="confirm-no-btn" expName="close">close</button>
                </confirm-box>
            `;
      },
      {
        render: true,
        parent: parentElement,
        data: {
          message: options.message,
        },
        name: Math.random ().toString (26),
        animate: {
          animations: [
            {
              top: '-100%',
            },
            {
              top: '0',
            },
          ],
          options: {
            duration: 500,
            fill: 'forwards',
          },
        },
      },
      component => {
        let submit = component.submit;
        let close = component.close;
        component.self.style.top = 'unset';
        const hidePrompt = (e, callback) => {
          component.self.animating (
            [{top: '0'}, {top: '-100%'}],
            {
              duration: 500,
              fill: 'forwards',
            },
            function () {
              active.removeComponent (component.name);
              parentElement.removeThis ();
              if (e.target === submit) {
                // grape the value of input
                let promptInput = component.promptInput;
                if (promptInput.value.length === 0) {
                  return cb (false);
                } else {
                  return cb (promptInput.value);
                }
              } else if (e.target === close) {
                return cb (false);
              } else if (e.keyCode == 13) {
                let promptInput = component.promptInput;
                if (promptInput.value.length === 0) {
                  cb (false);
                  return callback ();
                } else {
                  cb (promptInput.value);
                  return callback ();
                }
              }
            }
          );
        };
        submit.addEvent ('click', hidePrompt);
        close.addEvent ('click', hidePrompt);
        var keyDownHandler = e => {
          if (e.keyCode === 13) {
            hidePrompt (e, () => {
              document.removeEvent ('keydown', keyDownHandler, false);
            });
          }
        };
        let promptInput = component.promptInput;
        promptInput.addEvent ('focus', function (e) {
          document.addEventListener ('keydown', keyDownHandler);
        });
      }
    );
  };
  var getAllMethods = function(obj, deep = Infinity) {
    let props = []

    while (
        (obj = Object.getPrototypeOf(obj)) && // walk-up the prototype chain
        Object.getPrototypeOf(obj) && // not the the Object prototype methods (hasOwnProperty, etc...)
        deep !== 0
    ) {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter(
                (p, i, arr) =>
                typeof obj[p] === 'function' && // only the methods
                p !== 'constructor' && // not the constructor
                (i == 0 || p !== arr[i - 1]) && // not overriding in this prototype
                props.indexOf(p) === -1 // not overridden in a child
            )
        props = props.concat(l)
        deep--
    }

    return props
}

class Component {
    constructor(options) {
        this.childComponents = typeof options == "object" && Array.isArray(options.childComponents) ? options.childComponents : undefined;
        this.data = {};
        this.options = options;
        this.parent = typeof this.options == "object" ? typeof this.options.parent == "string" ? document.querySelector(this.options.parent) : typeof this.options.parent == 'object' ? this.options.parent : undefined : undefined;
        console.log(this.parent)
        // if (this.parent.hasAttribute('data')) {
        //   try {
        //     this.data = JSON.parse(this.parent.getAttribute("data"));
        //     this.parent.removeAttribute("data");
        //   } catch(e) {
            
        //   }
        // }
        if (this.options) {
            if (this.options.whileLoading) {
                this.options.whileLoading(this.parent);
            }
        }
    }
    update(name, value, cb) {
        var interval = setInterval(() => {
            if (this.self !== undefined) {
                if (this[name] !== undefined) {
                    this[name] = value;
                    this.parent.removeChild(this.self);
                    this.init(this.cb);
                }
                if (cb) {
                    cb();
                }
                clearInterval(interval);
            }
        }, 10);
    }
    getDom(cb) {
        var interval = setInterval(() => {
          var self = this;
            if (this.self !== undefined) {
                var allElements = this.self.querySelectorAll ('*');
                var elem = this.self.querySelectorAll (`[expName]`);
                allElements.forEach (function (el, i) {
                // component[el.getAttribute("expName")] = el;
                if (el.getAttribute ('expName')) {
                      if (el.getAttribute ('expName') === el.getAttribute ('expName')) {
                        var arr = [];
                        try {
                            elem.forEach (function (it, x) {
                              if (it.getAttribute ('expName') === el.getAttribute ('expName')) {
                                var attr = el.getAttribute ('expName');
                                arr.push (it);
                                if (arr.length === 1) {
                                  self[attr] = arr[0];
                                } else if (arr.length > 1) {
                                  self[attr] = arr;
                                }
                              }
                            });
                            cb();
                        } catch(e) {
                          clearInterval(interval);
                          cb();
                        }
                  }
                }
            });
                clearInterval(interval);
            }
        }, 10);
    }
    init(cb) {
        var chComponent;
        var self = this;
        // array of methods inside the extended class
        var methodsArr = [];
        // get all methods and functions of the extended class
        var allMethods = getAllMethods(this, 1);
        // remove render method of extended class
        var renderIndex = allMethods.indexOf("render");
        allMethods.splice(renderIndex, 1);
        var methodsIndex = allMethods.indexOf("methods");        
        allMethods.splice(methodsIndex, 1);
        var loadIndex = allMethods.indexOf("load");        
        allMethods.splice(loadIndex, 1);
        allMethods.forEach((funcName, i) => {
            // push all methods to promise array to resolve them
            methodsArr.push(this[funcName]())
        })
        if (methodsArr.length >= 1) {
            this.parent = typeof this.options == "object" ? typeof this.options.parent == "string" ? document.querySelector(this.options.parent) : typeof this.options.parent == 'object' ? this.options.parent : undefined : undefined;
            // wait all methods until done and then render html code
            Promise.all(methodsArr).then(() => {
                self.stringDom = self.render();
                var containerElem = document.createElement("div");
                containerElem.innerHTML = this.stringDom;
                var componentElement = containerElem.firstElementChild;
                self.self = componentElement;
                if (self.childComponents) {
                    self.childComponents.forEach((childComp) => {
                        let parent = typeof childComp.options.parent == "object" ? childComp.options.parent : componentElement.querySelector(childComp.options.parent);
                        let compOptions = childComp.options || {};
                        compOptions.parent = parent;
                        let compCb = typeof childComp.cb == "function" ? childComp.cb : () => {};
                        compOptions.parent = parent;
                        let chComponent = new childComp.component(compOptions);
                        chComponent.init(compCb);
                    })
                }
                // set some properties for the component
                this.name = this.options && this.options.name ?
                    this.options.name :
                    ActiveHelpers.generateRandomName();
                    // set an id for the component
                this.id = Math.random().toString(36).substr(2, 9);
                // set a callback for the component
                if (cb && typeof cb == "function") {
                    this.cb = cb;
                }
                // set some options for the component
                if (this.options) {
                    //   helpers component
                    ActiveHelpers.component.style(this, componentElement);
                    ActiveHelpers.component.slideDown(this, componentElement);
                    ActiveHelpers.component.fadingIn(this, componentElement);
                    ActiveHelpers.component.animating(this, componentElement);
                }
                // append the component to its parent
                self.parent.appendChild(componentElement);
                ActiveHelpers.component.activeDom(this);
                if (this.methods) {
                  ActiveHelpers.component.methods(this, componentElement);
                }
                if (this.load) {
                  this.load();
                }
                this.getDom(() => {
                  if (cb && typeof cb == "function") {
                    return cb(this);
                    
                  }
                })
                if (this.options.onload) {
                    this.options.onload(this.parent);
                }
            }).catch((err) => {
                self.stringDom = self.render();
                var containerElem = document.createElement("div");
                containerElem.innerHTML = this.stringDom;
                var componentElement = containerElem.firstElementChild;
                self.self = containerElem.self;
                if (self.childComponents) {
                    self.childComponents.forEach((childComp) => {
                        let parent = typeof childComp.options.parent == "object" ? childComp.options.parent : componentElement.querySelector(childComp.options.parent);
                        let compOptions = childComp.options || {};
                        let compCb = typeof childComp.cb == "function" ? childComp.cb : () => {};
                        compOptions.parent = parent;
                        let chComponent = new childComp.component(compOptions);
                        chComponent.init(compCb);
                    })
                }
                // set some properties for the component
                this.name = this.options && this.options.name ?
                this.options.name :
                ActiveHelpers.generateRandomName();
                this.id = Math.random().toString(36).substr(2, 9);
                this.self = componentElement;
                if (cb && typeof cb == "function") {
                    this.cb = cb;
                }
                if (this.options) {
                    //   helpers component
                    ActiveHelpers.component.style(this, componentElement);
                    ActiveHelpers.component.slideDown(this, componentElement);
                    ActiveHelpers.component.fadingIn(this, componentElement);
                    ActiveHelpers.component.animating(this, componentElement);
                }
                // append the component to its parent
                self.parent.appendChild(componentElement);
                ActiveHelpers.component.activeDom(this);
                if (this.methods) {
                  ActiveHelpers.component.methods(this, componentElement);
                }
                if (this.load) {
                  this.load();
                }
                this.getDom(() => {
                  if (cb && typeof cb == "function") {
                    return cb(this);
                  }
                })
                if (this.options.onload) {
                    this.options.onload(this.parent);
                }
                    // var component = this;
            });
        } else {
            self.stringDom = self.render();
            var containerElem = document.createElement("div");
            containerElem.innerHTML = self.stringDom;
            var componentElement = containerElem.firstElementChild;
            // append the child components if there are
            if (self.childComponents) {
                    self.childComponents.forEach((childComp) => {
                        let parent = typeof childComp.options.parent == "object" ? childComp.options.parent : componentElement.querySelector(childComp.options.parent);
                        console.log(componentElement);
                        let compOptions = childComp.options || {};
                        compOptions.parent = parent;
                        let compCb = typeof childComp.cb == "function" ? childComp.cb : () => {};
                        compOptions.parent = parent;
                        let chComponent = new childComp.component(compOptions);
                        chComponent.init(compCb);
                    })
            }
            // get the parent of component
            this.parent = typeof this.options == "object" ? typeof this.options.parent == "string" ? document.querySelector(this.options.parent) : typeof this.options.parent == 'object' ? this.options.parent : undefined : undefined;
            this.self = componentElement;

            this.name = this.options && this.options.name ?
            this.options.name :
            ActiveHelpers.generateRandomName();
            this.id = Math.random().toString(36).substr(2, 9);
            if (cb && typeof cb == "function") {
                this.cb = cb;
            }
            if (this.options) {
                //   helpers component
                ActiveHelpers.component.style(this, componentElement);
                ActiveHelpers.component.slideDown(this, componentElement);
                ActiveHelpers.component.fadingIn(this, componentElement);
                ActiveHelpers.component.animating(this, componentElement);
            }
            if (this.methods) {
                ActiveHelpers.component.methods(this, componentElement);
            }
            // append the component to its parent
            this.parent.appendChild(componentElement);
            ActiveHelpers.component.activeDom(this);
            if (this.load) {
              this.load();
            }
            this.getDom(() => {
              if (cb && typeof cb == "function") {
                return cb(this);
              }
            });
            if (this.options && this.options.onload) {
                this.options.onload(this.parent);
            }
        }
    }
}
this.Component = Component;
  this.uploadFile = (fileInput, dataInput) => {
    var file = typeof fileInput == 'string'
      ? document.querySelector (fileInput)
      : fileInput;
    fileInput.addEventListener ('click', () => {
    });
    var fileDataInput = dataInput
      ? typeof dataInput === 'string'
          ? document.querySelector (dataInput)
          : typeof dataInput === 'function'
              ? dataInput
              : typeof dataInput == 'object' ? dataInput : false
      : false;
    function setFileInfo (fileData, filesData, filesDataArray) {
      var fileReader = new FileReader ();
      fileReader.readAsDataURL (fileData);
      let nameArr = fileData.name.split ('.');
      let extName = nameArr.length - 1;
      extName = '.' + nameArr[extName];
      var fileInfo = {
        fileName: fileData.name,
        size: fileData.size,
        type: fileData.type,
        extName: extName,
      };
      fileReader.addEventListener ('load', function () {
        var result = fileReader.result;
        result = result.substring (result.indexOf (',') + 1);
        fileInfo.result = result;
        fileInfo.binary = fileReader.result;
        filesDataArray.push (fileInfo);
        if (filesData.length === filesDataArray.length) {
          filesDataArray = filesDataArray.length === 1
            ? filesDataArray[0]
            : filesDataArray;
          if (fileDataInput && typeof fileDataInput == 'object') {
            return (fileDataInput.value = JSON.stringify (filesDataArray));
          } else if (typeof dataInput === 'function') {
            return dataInput (filesDataArray);
          } else if (!dataInput) {
            return filesDataArray;
          }
        }
      });
    }
    file.addEventListener ('change', function (e) {
      var filesDataArray = [];
      var filesData = file.files;
      for (let i = 0; i < filesData.length; i++) {
        return setFileInfo (filesData[i], filesData, filesDataArray);
        // var fileData = filesData[i];
      }
    });
    // document.body.addEventListener("focus", () => {
    //     alert("e")
    // })
  };

  // localStorage methods
  this.storage = {
    setItemAsync: function (key, data, returning = true) {
      return new Promise (function (resolved, rejected) {
        data = typeof data === 'object' ? JSON.stringify (data) : data;
        try {
          localStorage.setItem (key, data);
          var item;
          if (returning === true) {
            item = localStorage.getItem (key);
            return resolved (item);
          } else {
            return resolved ();
          }
        } catch (error) {
          return rejected (error);
        }
      });
    },
    getItemAsync: function (key) {
      return new Promise (function (resolved, rejected) {
        if (localStorage.getItem (key) === null) {
          return rejected (new Error ('not found item'));
        } else {
          let item = localStorage.getItem (key);
          return resolved (item);
        }
      });
    },
    setItem: function (key, data) {
      data = typeof data === 'object' ? JSON.stringify (data) : data;
      localStorage.setItem (key, data);
    },
    getItem: function (key) {
      return localStorage.getItem (key);
    },
  };

  // function for making a promises

  var route;
  // global variables
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  var cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.oCancelAnimationFrame;

  // function to check if the obkect is empty
  Object.defineProperty(Object.prototype, "isEmpty", {
    value: function () {
        if (this && typeof this === 'object') {
          if (Array.from (Object.keys (this)).length === 0) {
            return true;
          } else {
            return false;
          }
        }
      }
  })
  this.removeComponent = function (componentName) {
    if (componentName) {
      let component = this.getComponent (componentName);
      if (component) {
        let componentIndex = DomComponents.indexOf (component.name);
        DomComponents.splice (componentIndex, 1);
        component.self.removeThis ();
      }
    }
  };
  HTMLElement.prototype.removeThis = function () {
    if (this.parentNode) {
      if (this.parentNode.hasChildNodes (this)) {
        this.parentNode.removeChild (this);
        // if (this.parentElement.hasChildNodes(this)) {
        //     this.parentElement.removeChild(this);
        // }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  Element.prototype.appendElements = function (content) {
    if (typeof content === 'object') {
      return this.appendChild (content);
    } else if (typeof content === 'string') {
      // var container = document.createElement("div");
      // container.innerHTML = content;
      return this.insertAdjacentHTML ('beforeEnd', content);
    }
  };
  Element.prototype.reset = function () {
    if (this.tagName === 'FORM') {
      Array.from (this.querySelectorAll ('input')).forEach (input => {
        if (input.getAttribute ('type') !== 'submit') {
          input.value = '';
        }
      });
    } else if (this.tagName === 'INPUT') {
      this.value = '';
    }
  };
  // get the parents of element
  Element.prototype.parents = function (parent) {
    var element = this;
    var els = [];
    while (element) {
      els.unshift (element);
      element = element.parentNode;
    }
    if (parent === undefined) {
      return els;
    } else {
      parent = typeof parent === 'string'
        ? document.querySelectorAll (parent)
        : parent;
      if (parent.length > 0) {
        var par = [];
        parent.forEach (function (paren) {
          els.forEach (function (el) {
            if (el === paren) {
              par.push (paren);
            }
          });
        });
        return par[0];
      } else {
        var par = [];
        els.forEach (function (el) {
          if (el === parent) {
            par.push (parent);
          }
        });
        return par[0];
      }
    }
  };
  Element.prototype.insertAfter = function (element) {
    if (typeof element === 'string') {
      this.insertAdjacentHTML ('afterend', element);
    } else if (typeof element === 'object') {
      this.parentNode.insertBefore (element, this.nextSibling);
    }
  };
  // array of dom components
  this.DomComponents = [];
  const DomComponents = this.DomComponents;
  //global variable
  var active = this;

  //functions to get the current params of location
  var params = {};
  window.location.search.substring (1).split ('&').forEach (function (pair) {
    pair = pair.split ('=');
    if (pair[1] !== undefined) {
      var key = decodeURIComponent (pair[0]),
        val = decodeURIComponent (pair[1]),
        val = val ? val.replace (/\++/g, ' ').trim () : '';

      if (key.length === 0) {
        return;
      }
      if (params[key] === undefined) {
        params[key] = val;
      } else {
        if ('function' !== typeof params[key].push) {
          params[key] = [params[key]];
        }
        params[key].push (val);
      }
    }
  });
  window.location.params = params;
  // end functions to get the current params of location

  //function to get a component from dom components array
  this.getComponent = function (name) {
    var components = [];
    DomComponents.forEach (function (component) {
      if (component.name === name) {
        components.push (component);
      } else {
        return component;
      }
    });
    if (components.length === 1) {
      return components[0];
    } else if (components.length > 1) {
      return components[0];
    }
  };
  //end function to get a component from dom components array

  //function to refresh a component
  this.refreshComponent = function (component) {
    active.removeComponent (component.name);
    active.filterContent (component.parent, () => {
      this.renderComponent (component.cb, component.options, component.finish);
    });
  };
  //end function to refresh a component

  document.liveEvent = function (event, target, cb, option) {
    document.addEventListener (
      event,
      function (e) {
        // check if the type of target is string # Means Element
        if (typeof target == 'string') {
          var targetElements = document.querySelectorAll (target);
          var targetElement = Array.from (targetElements).find (el => {
            return el == e.target;
          });
          if (targetElement) {
            return cb (e);
          } else {
            return null;
          }
        }
      },
      option ? option : false
    );
  };
  //functions of dome events

  Element.prototype.getSiblings = function () {
    let elem = this;
    if (Array.isArray (elem)) {
      Array.from (elem).forEach (elm => {
        let siblings = [];
        var sibling = elem.parentNode.firstChild;
        var skipMe = elm;
        for (; sibling; sibling = sibling.nextSibling) {
          if (sibling.nodeType == 1 && sibling != skipMe) {
            siblings.push (sibling);
            return siblings;
          }
        }
      });
    } else {
      var siblings = [];
      var sibling = elem.parentNode.firstChild;
      var skipMe = elem;
      for (; sibling; sibling = sibling.nextSibling) {
        if (sibling.nodeType == 1 && sibling != skipMe) {
          siblings.push (sibling);
          return siblings;
        }
      }
    }
  };
  /*function to make an events of the dom with on event*/
  Object.defineProperty(Object.prototype, "addEvent", {
    value: function (event, cb, option) {
        let self = this;
        if (self) {
          if (self.length !== undefined && self.length > 0) {
            try {
              Array.from (self).forEach (elem => {
                if (
                  typeof elem == 'object' &&
                  'nodeType' in elem &&
                  elem.nodeType === 1 &&
                  elem.cloneNode
                ) {
                  try {
                    elem.addEventListener (
                      event,
                      e => {
                        return cb (e, elem);
                      },
                      option ? option : true
                    );
                  } catch (e) {
                    return true;
                  }
                }
              });
            } catch (e) {
              return true;
            }
          } else {
            try {
              self.addEventListener (
                event,
                e => {
                  return cb (e, self);
                },
                option ? option : true
              );
            } catch (e) {
              return true;
            }
          }
        }
      },
      writable: true
  })

  HTMLElement.prototype.addEvent = function (event, cb, option) {
    let self = this;
    try {
      self.addEventListener (
        `${event}`,
        e => {
          return cb (e, self);
        },
        option ? option : true
      );
    } catch (e) {
      return true;
    }
  };
  Object.defineProperty(Object.prototype, "removeEvent", {
    value: function (event, cb, option) {
      let self = this;
      if (self) {
        if (self.length !== undefined && self.length > 0) {
          try {
            self.forEach (elem => {
              if (
                typeof elem == 'object' &&
                'nodeType' in elem &&
                elem.nodeType === 1 &&
                elem.cloneNode
              ) {
                try {
                  elem.removeEventListener (
                    event,
                    e => {
                      return cb (e, elem);
                    },
                    option ? option : true
                  );
                } catch (e) {
                  return true;
                }
              }
            });
          } catch (e) {
            return true;
          }
        } else {
          try {
            self.removeEventListener (
              event,
              e => {
                return cb (e, self);
              },
              option ? option : true
            );
          } catch (e) {
            return true;
          }
        }
      }
    },
    writable: true
  })

  /*function to make an events of the dom with on event*/
  HTMLElement.prototype.removeEvent = (event, cb, option) => {
    var self = this;
    try {
      self.removeEventListener (
        event,
        e => {
          return cb (e, self);
        },
        option ? option : true
      );
    } catch (e) {
      return true;
    }
  };
  /*function to make toggle click of a specific element, it returns a two callback the first one for the first click and the second callback for the second click*/

Object.defineProperty(Object.prototype, "toggleClick", {
  value: function (cb1, cb2) {
    var trgetElem = this;
    var clicked = 0;
    if (cb1 && cb2) {
      try {
        if (trgetElem.length > 1) {
          Array.from (trgetElem).forEach (function (el, i) {
            el.addEventListener ('click', function (event) {
              clicked++;
              if (clicked === 1) {
                return cb1 (event);
              } else if (clicked === 2) {
                cb2 (event);
                return (clicked = 0);
              }
            });
          });
        } else if (trgetElem.length === 1) {
          trgetElem.addEventListener ('click', function (event) {
            clicked++;
            if (clicked === 1) {
              return cb1 (event);
            } else if (clicked === 2) {
              cb2 (event);
              return (clicked = 0);
            }
          });
        }
      } catch (e) {
        return true;
      }
    }
  },
  writable: true
})
  HTMLElement.prototype.toggleClick = (cb1, cb2) => {
    let trgetElem = this;
    let clicked = 0;
    trgetElem.addEventListener ('click', function (event) {
      clicked++;
      if (clicked === 1) {
        return cb1 (event);
      } else if (clicked === 2) {
        cb2 (event);
        return (clicked = 0);
      }
    });
  };
  //end toggle click function

  /*function to make toggle hover of a specific element, it returns a two callback the first one for the first hover and the second callback for the second hover*/
  Object.defineProperty(Object.prototype, "toggleHover", {
    value: function (cb1, cb2) {
      var trgetElem = this;
      if (cb1 && cb2) {
        try {
          if (trgetElem.length > 1) {
            Array.from (trgetElem).forEach (function (el, i) {
              el.addEventListener ('mouseenter', function (event) {
                return cb1 (event);
              });
              el.addEventListener ('mouseleave', function (event) {
                return cb2 (event);
              });
            });
          } else if (trgetElem.length === 1) {
            trgetElem.addEventListener ('mouseenter', function (event) {
              return cb1 (event);
            });
            trgetElem.addEventListener ('mouseleave', function (event) {
              return cb2 (event);
            });
          }
        } catch (e) {
          return true;
        }
      }
    },
    writable: true
  })
  HTMLElement.prototype.toggleHover = (cb1, cb2) => {
    let trgetElem = this;
    trgetElem.addEventListener ('mouseenter', function (event) {
      return cb1 (event);
    });
    trgetElem.addEventListener ('mouseleave', function (event) {
      return cb2 (event);
    });
  };
  //end toggle hover function

  //end functions of dom events

  // animation functions

  // slidedown function

  HTMLElement.prototype.slideDown = function (time, display, cb) {
    var element = this;
    window.onload = function () {
      makeSliding (element);
    };
    function makeSliding (element) {
      if (element) {
        var displayStatus =
          getComputedStyle (element, null).getPropertyValue ('display') ||
          element.style.display;
        if (typeof display === 'function') {
          cb = display;
        }
        if (displayStatus === 'none' || displayStatus === '') {
          element.style.display = display && typeof display === 'string'
            ? display
            : 'block';
          var originalHeight =
            getComputedStyle (element).getPropertyValue ('height') ||
            element.style.height ||
            element.offsetHeight;
          var splitHeight = parseInt (originalHeight);
          var typeHeight = originalHeight.split (splitHeight)[1];

          var currentHeight = 0;
          if (originalHeight.match (/px/gi)) {
            element.style.height = currentHeight + 'px';
          } else if (originalHeight.match (/%/gi)) {
            element.style.height = currentHeight + '%';
          }
          currentTime = splitHeight / (time / 10);
          var animate = function () {
            currentHeight += currentTime;
            if (originalHeight.match (/px/gi)) {
              element.style.height = currentHeight + 'px';
            } else if (originalHeight.match (/%/gi)) {
              element.style.height = currentHeight / 10 + '%';
            } else if (originalHeight.match (/auto/gi)) {
              element.style.height = currentHeight + 'auto';
            }
            if (element.style.height === originalHeight) {
              cancelAnimationFrame (animate);
              element.style.height = originalHeight;
            } else {
              requestAnimationFrame && requestAnimationFrame (animate);
            }
          };
          animate ();
        }
        if (cb) {
          setTimeout (function () {
            return cb (element);
          }, time);
        }
      }
    }
    if (document.readyState === 'complete') {
      makeSliding (element);
    }
  };

  //end slide down function

  // slideup function

  HTMLElement.prototype.slidingUp = function (time, cb) {
    var element = this;
    if (element) {
      var originalHeight =
        getComputedStyle (element).getPropertyValue ('height') ||
        element.style.height;
      var displayStatus =
        getComputedStyle (element).getPropertyValue ('display') ||
        element.style.display;
      var splitHeight = parseInt (originalHeight);
      var typeHeight = originalHeight.split (splitHeight)[1];
      var currentHeight = Number.parseInt (originalHeight);
      if (displayStatus !== 'none') {
        currentTime = splitHeight / (time / 10);
        var animate = function () {
          currentHeight -= currentTime;
          element.style.height = currentHeight + typeHeight;
          if (currentHeight <= 0) {
            cancelAnimationFrame (animate);
            element.style.display = 'none';
            element.style.height = originalHeight;
          } else {
            requestAnimationFrame (animate);
          }
        };
        requestAnimationFrame (animate);
      }

      if (cb) {
        setTimeout (function () {
          return cb (element);
        }, time);
      }
    }
  };

  //end slide up function

  // function for fade toggle

  HTMLElement.prototype.fadeToggle = function (duration, displayTo, cb) {
    var element = this;
    if (!displayTo || typeof displayTo === 'function') {
      displayTo = 'block';
    }
    if (typeof displayTo === 'function') {
      cb = displayTo;
    }
    if (
      getComputedStyle (element).getPropertyValue ('display') === '' ||
      getComputedStyle (element).getPropertyValue ('display') !== 'none'
    ) {
      element.fadingOut (duration, cb);
    }
    if (element.style.opacity < 1) {
      element.fadingIn (duration, displayTo, cb);
    } else if (element.style.opacity > 0) {
      element.fadingOut (duration, cb);
    }
  };
  // end function for fade toggle

  // function for slideToggle

  HTMLElement.prototype.slideToggle = function (duration, displayTo, cb) {
    var element = this;
    if (!displayTo || typeof displayTo === 'function') {
      displayTo = 'block';
    }
    if (typeof displayTo === 'function') {
      cb = displayTo;
    }
    if (
      getComputedStyle (element).getPropertyValue ('display') === '' ||
      getComputedStyle (element).getPropertyValue ('display') !== 'none'
    ) {
      element.slidingUp (duration, cb);
    }
    if (element.style.opacity < 1) {
      element.slideDown (duration, displayTo, cb);
    } else if (element.style.opacity > 0) {
      element.slidingUp (duration, cb);
    }
  };
  // end function for slideToggle

  // fade in function
  HTMLElement.prototype.fadingIn = function (duration, display, cb) {
    if (typeof display === 'function') {
      cb = display;
    }
    var element = this;
    element.style.opacity = 0;
    var last = +new Date ();
    var animate = function () {
      element.style.opacity =
        +element.style.opacity + (new Date () - last) / duration;
      last = +new Date ();
      element.style.display = display && typeof display === 'string'
        ? display
        : 'block';
      if (+element.style.opacity < 1) {
        requestAnimationFrame && requestAnimationFrame (animate);
      } else {
        window.cancelAnimationFrame (animate);
        element.style.opacity = 1;
      }
    };
    animate ();
    if (cb) {
      setTimeout (function () {
        return cb (element);
      }, duration);
    }
  };

  // fade out function
  HTMLElement.prototype.fadingOut = function (duration, cb) {
    var element = this;
    element.style.opacity = 1;
    var last = +new Date ();
    var animate = function () {
      element.style.opacity =
        +element.style.opacity - (new Date () - last) / duration;
      last = +new Date ();
      if (+element.style.opacity < 0) {
        window.cancelAnimationFrame (animate);
        element.style.display = 'none';
        element.style.opacity = 0;
      } else {
        requestAnimationFrame && requestAnimationFrame (animate);
      }
    };
    animate ();
    if (cb) {
      setTimeout (function () {
        return cb (element);
      }, duration);
    }
  };
  // end fade out function

  // animating function
  HTMLElement.prototype.animating = function (
    boxRotationKeyframes,
    boxRotationTiming,
    cb
  ) {
    this.animate (
      boxRotationKeyframes,
      boxRotationTiming
    ).onfinish = function () {
      if (cb && typeof cb === 'function') {
        return cb ();
      }
    };
  };
  // end animating function
  // function to remove a script
  this.removeScript = function (path, parent) {
    parent = typeof parent === 'string'
      ? document.querySelector (parent)
      : parent;
    let script = parent.querySelector ('script');
    if (script) {
      script.removeThis ();
    }
  };
  //function to require a javascript file
  this.require = function (path, parent) {
    var script = document.createElement ('script');
    script.src = path;
    script.type = 'text/javascript';
    if (typeof parent === 'string') {
      let ParentElem = document.querySelector (parent);
      let allScripts = ParentElem.querySelectorAll ('scripts');
      let getScript = Array.from (allScripts).find (scr => {
        return scr.src === path;
      });
      if (getScript) {
        return null;
      } else {
        document.querySelector (parent).appendChild (script);
      }
    } else if (typeof parent === 'object') {
      let ParentElem = parent;
      let allScripts = ParentElem.querySelectorAll ('scripts');
      let getScript = Array.from (allScripts).find (scr => {
        return scr.src === path;
      });
      if (getScript) {
        return null;
      } else {
        parent.appendChild (script);
      }
    }
  };
  //end function to require a javascript file

  // function to render a component and show it in the dom

  this.render = function (status, path, parent, name, cb) {
    try {
      parent = typeof parent === 'object'
        ? parent
        : document.querySelector (parent);
      var script = document.createElement ('script');
      script.src = path;
      if (name) {
        script.setAttribute ('name', name);
      }
      if (status === true) {
        if (parent.innerHTML === '') {
          parent.appendChild (script);
          script.addEventListener ('load', function () {
            if (cb) {
              return cb ();
            }
          });
        } else {
          parent.appendChild (script);
          script.addEventListener ('load', function () {
            if (cb) {
              return cb ();
            }
          });
        }
      } else {
        let allScripts = parent.querySelectorAll ('script');
        let getScript = Array.from (allScripts).find (scr => {
          return scr.src === path;
        });
        if (getScript) {
          return null;
        } else {
          parent.appendChild (script);
          script.addEventListener ('load', function () {
            if (cb) {
              return cb ();
            }
          });
        }
      }
    } catch (e) {
      return true;
    }
  };

  // end function to render a component and show it in the dom

  // function to filter the parent of component

  this.filterContent = function (element, options, cb) {
    var parentElement = typeof element === 'string'
      ? document.querySelector (element)
      : element;
    if (typeof options === 'function') {
      cb = options;
    }
    if (typeof options == 'object') {
      options.element = options.element || parentElement.children[0];
      if (options.beforeRender) {
        if (parentElement.innerHTML === '') {
          options.beforeRender.execute (parentElement);
        }
        setTimeout (function () {
          parentElement.innerHTML = '';
          if (typeof cb == 'function') {
            return cb (parentElement);
          } else {
            return true;
          }
        }, options.beforeRender.duration ? options.beforeRender.duration : 500);
      } else if (options.element) {
        var cont = typeof options.element == 'string'
          ? parentElement.querySelector (options.element)
          : options.element;
        if (cont) {
          if (options.fadingOut) {
            cont.fadingOut (options.fadingOut, function () {
              setTimeout (function () {
                parentElement.innerHTML = '';
                if (typeof cb == 'function') {
                  return cb (parentElement);
                } else {
                  return true;
                }
              }, options.fadingOut + 100);
            });
          }
          if (options.slidingUp) {
            cont.slidingUp (options.slidingUp);
            setTimeout (function () {
              parentElement.innerHTML = '';
              if (typeof cb == 'function') {
                return cb (parentElement);
              } else {
                return true;
              }
            }, options.slidingUp + 100);
          }
          if (options.animate) {
            cont.animating (
              options.animate.animations,
              options.animate.options
            );
            setTimeout (function () {
              parentElement.innerHTML = '';
              if (typeof cb == 'function') {
                return cb (parentElement);
              } else {
                return true;
              }
            }, options.animate.options.duration + 100);
          }
        }
        if (!cont) {
          parentElement.innerHTML = '';
          if (typeof cb == 'function') {
            return cb (parentElement);
          } else {
            return true;
          }
        }
      } else {
        parentElement.innerHTML = '';
        if (typeof cb == 'function') {
          return cb (parentElement);
        } else {
          return true;
        }
      }
    } else {
      parentElement.innerHTML = '';
      if (typeof cb == 'function') {
        return cb (parentElement);
      } else {
        return true;
      }
    }
  };

  // function to filter the parent of component

  //function to loop array inside the component

  this.loopElements = function (data, cb) {
    if (typeof data === 'string') {
      data = JSON.parse (data);
    } else if (typeof data == 'number') {
      let count = data;
      data = [];
      data.length = count;
    }
    if (Array.isArray (data)) {
      return data
        .map (function (item, i) {
          return cb (item, i);
        })
        .join ('');
    } else if (typeof data === 'object') {
      return Object.keys (data)
        .map (function (item, i) {
          return cb (data[item], data[i]);
        })
        .join ('');
    }
  };

  //end function to loop array inside the component

  // function to render a new component
  this.renderComponent = function (cb, options, finish) {
    var parent = typeof options.parent == 'string'
      ? document.querySelector (options.parent)
      : options.parent;
    if (options.whileLoading) {
      options.whileLoading (parent);
    }
    var renderOption = options.render;
    var container = document.createElement ('div');
    var animations;
    var allData;
    var self = this;
    var da = Date.now ();
    var testData;
    function writeIt (data) {
      testData = data;
      var newElement = cb (data);
      container.innerHTML = newElement;
      if (options && options.scripts) {
        try {
          options.scripts.forEach (function (src) {
            if (src.match (/.js$/)) {
              var script = document.createElement ('script');
              script.src = src;
              container.firstElementChild.appendChild (script);
            }
          });
        } catch (e) {
          return true;
        }
      }
      if (options && options.childComponents) {
        options.childComponents.forEach (childComponent => {
          var parentString = childComponent.parent;
          let childParent = childComponent.parent;
          let component = childComponent.component;
          try {
            childParent = container.querySelector (childParent);
            component.parent = childParent;
            component.options.parent = childParent;
            component.options.render = true;
            active.useComponent (component, childParent);
            container.querySelector (parentString).innerHTML =
              component.stringDom;
          } catch (e) {
            return null;
          }
        });
      }
      if (options && options.style) {
        var style = options.style;
        Object.keys (style).forEach (function (el) {
          if (el === 'component') {
            var cssElement = container.firstElementChild;
            Object.keys (style[el]).forEach (function (objStyle) {
              cssElement.style[objStyle] = style[el][objStyle];
            });
          } else if (el === 'parent') {
            let cssElement = typeof parent == 'string'
              ? document.querySelector (parent)
              : parent;
            Object.keys (style[el]).forEach (function (objStyle) {
              cssElement.style[objStyle] = style[el][objStyle];
            });
          } else {
            var cssElements = container.firstElementChild.querySelectorAll (el);
            cssElements.forEach (function (cssElement) {
              Object.keys (style[el]).forEach (function (objStyle) {
                cssElement.style[objStyle] = style[el][objStyle];
              });
            });
          }
        });
      }
      function Elements () {
        this.element = container.firstElementChild.cloneNode (true);
      }
      var elements = new Elements ();
      var element = elements.element;
    if (options && typeof options === 'object') {
        if (options.slideDown) {
          function makeSlideIn () {
            if (!options.slideDown.cb) {
              element.slideDown (options.slideDown.duration);
            } else if (options.slideDown.cb) {
              element.slideDown (
                options.slideDown.duration,
                options.slideDown.cb ()
              );
            }
          }
          loadCssFile ()
            .then (function () {
              makeSlideIn ();
            })
            .catch (function () {
              makeSlideIn ();
            });
        }
        if (options.fadingIn) {
          if (!options.fadingIn.cb) {
            element.fadingIn (options.fadingIn.duration);
          } else if (options.fadingIn.cb) {
            element.fadingIn (options.fadingIn.duration, options.fadingIn.cb ());
          }
        }
        if (options.animate) {
          element.animating (
            options.animate.animations,
            options.animate.options,
            options.animate.callback ? options.animate.callback : null
          );
        }
      }
      var component = {};
      component.finish = finish;
      component.data = data;
      component.options = options;
      component.parent = typeof parent === 'string'
        ? document.querySelector (parent)
        : parent;
      component.stringDom = cb (data);
      component.cb = cb;
      component.self = elements.element;
      // function to generate a random name for the component
      function generateRandomName () {
        var NumberOfWords = 28;

        var words = new BuildArray (NumberOfWords);

        // Use the following variables to
        // define your random words:
        words[1] = 'escapology';
        words[2] = 'brightwork';
        words[3] = 'verkrampte';
        words[4] = 'protectrix';
        words[5] = 'nudibranch';
        words[6] = 'grandchild';
        words[7] = 'newfangled';
        words[8] = 'flugelhorn';
        words[9] = 'mythologer';
        words[10] = 'pluperfect';
        words[11] = 'jellygraph';
        words[12] = 'quickthorn';
        words[13] = 'rottweiler';
        words[14] = 'technician';
        words[15] = 'cowpuncher';
        words[16] = 'middlebrow';
        words[17] = 'jackhammer';
        words[18] = 'triphthong';
        words[19] = 'wunderkind';
        words[20] = 'dazzlement';
        words[21] = 'jabberwock';
        words[22] = 'witchcraft';
        words[23] = 'pawnbroker';
        words[24] = 'thumbprint';
        words[25] = 'motorcycle';
        words[26] = 'cryptogram';
        words[27] = 'torchlight';
        words[28] = 'bankruptcy';

        function BuildArray (size) {
          this.length = size;
          for (var i = 1; i <= size; i++) {
            this[i] = null;
          }
          return this;
        }
        // Generate a random number between 1 and NumberOfWords
        var rnd = Math.ceil (Math.random () * NumberOfWords);
        return words[rnd];
      }
      component.name = options && options.name
        ? options.name
        : generateRandomName ();
      component.id = Math.random ().toString (36).substr (2, 9);

      DomComponents.push (component);
      var countsArr = [];
      component.update = function () {
        parent = typeof parent === 'string'
          ? document.querySelector (parent)
          : parent;
        countsArr.push (parent);
        if (countsArr.length === 1) {
          parent.innerHTML = '';
          return writeIt (component.data);
        } else {
          return null;
        }
      };
      if (options && options.methods && typeof options.methods === 'object') {
        Array.from (Object.keys (options.methods)).forEach (function (el) {
          if (el === 'component') {
            element = elements.element;
            var methodsEvents = options.methods[el];
          } else {
            var element = elements.element.querySelector (el);
            var matchedElements = [];
            if (element == null) {
              let allElements = elements.element.querySelectorAll ('[expName]');
              if (allElements) {
                Array.from (allElements).forEach (ele => {
                  if (ele.getAttribute ('expName') === el) {
                    matchedElements.push (ele);
                  }
                });
              } else {
              }
            } else {
              matchedElements.push (element);
            }
            var methodsEvents = options.methods[el];
            try {
              Array.from (Object.keys (methodsEvents)).forEach (function (
                event
              ) {
                var EventHappen = methodsEvents[event];
                Array.from (matchedElements).forEach (function (ele) {
                  ele.addEvent (`${event}`, EventHappen);
                });
              });
            } catch (e) {
              return true;
            }
          }
        });
      }
      //function to check about the scripts
      function checkScripts (resolve, rejected) {
        if (options && options.scripts && options.scripts.length > 0) {
          options.scripts.forEach (function (src) {
            if (src.match (/.css$/)) {
              var style = document.createElement ('link');
              style.rel = 'stylesheet';
              style.href = src;
              style.as = 'style';
              document.head.appendChild (style);
              if (document.head.hasChildNodes (style)) {
                return resolve (style);
              } else {
                return resolve (style);
              }
            } else {
              return rejected ();
            }
          });
        } else {
          return rejected ();
        }
      }
      //function to load css files with promises
      function loadCssFile () {
        return new Promise (function (resolve, rejected) {
          return checkScripts (resolve, rejected);
        });
      }
      // function to auto working for manipulating easy component events
      (function () {
        var controllerElements = elements.element.querySelectorAll ('[event]');
        if (controllerElements.length > 0) {
          controllerElements.forEach (function (controller) {
            var eventType = controller.getAttribute ('eventType');
            var eventType2 = controller.getAttribute ('eventType2');
            var thisEventType = controller.getAttribute ('thisEventType');
            var thisEventType2 = controller.getAttribute ('thisEventType2');
            var thisEvent = controller.getAttribute ('thisEvent');
            var notElement = elements.element.querySelector (
              controller.getAttribute ('notElement')
            );
            let compArr = [];
            let clicked = 0;
            controller.getAttribute ('targetElement') === 'component'
              ? compArr.push (elements.element)
              : (compArr = []);
            var targetElements = controller.getAttribute ('targetElement') ===
              'component'
              ? compArr
              : elements.element.querySelectorAll (
                  controller.getAttribute ('targetElement')
                );
            function responseTwo (targetElement) {
              var responseType2 = targetElement.getAttribute ('responseType2');
              if (responseType2) {
                if (responseType2 === 'animating') {
                  var animationFrom2 = targetElement.getAttribute (
                    'animationFrom2'
                  );
                  var animationTo2 = targetElement.getAttribute (
                    'animationTo2'
                  );
                  var animationOptions2 = targetElement.getAttribute (
                    'animationOptions2'
                  );
                  var ObjOptions2 = {};
                  var animationOptionsArr2 = animationOptions2.split (',');
                  animationOptionsArr2.forEach (function (option) {
                    var splitedOption2 = option.split (':');
                    ObjOptions2[splitedOption2[0]] = splitedOption2[1];
                  });
                  if (ObjOptions2.duration) {
                    ObjOptions2.duration = Number.parseInt (
                      ObjOptions2.duration
                    );
                  }
                  var fromArray2 = animationFrom2.split (',');
                  var toArray2 = animationTo2.split (',');
                  var ObjectFrom2 = {};
                  var ObjectTo2 = {};
                  fromArray2.forEach (function (fromAn, i) {
                    var splitedFrom2 = fromAn.split (':');
                    var splitedTo2 = toArray2[i].split (':');
                    ObjectFrom2[splitedFrom2[0]] = splitedFrom2[1];
                    ObjectTo2[splitedTo2[0]] = splitedTo2[1];
                  });
                  targetElement.animating (
                    [ObjectFrom2, ObjectTo2],
                    ObjOptions2
                  );
                } else if (responseType2 === 'display') {
                  var display2 = targetElement.getAttribute ('display2');
                  targetElement.style.display = display2;
                } else if (responseType2 === 'slideUp') {
                  let slideUpDuration = Number.parseInt (
                    targetElement.getAttribute ('slideUpDuration')
                  );
                  targetElement.slidingUp (slideUpDuration);
                } else if (responseType2 === 'slideDown') {
                  let duration = Number.parseInt (
                    targetElement.getAttribute ('slideDuration')
                  );
                  let slideDisplay = targetElement.getAttribute (
                    'slideDisplay'
                  );
                  targetElement.slideDown (duration, slideDisplay);
                } else if (responseType2 === 'fadingIn') {
                  let fadeDuration = Number.parseInt (
                    targetElement.getAttribute ('fadeDuration')
                  );
                  let fadeDisplay = targetElement.getAttribute ('fadeDisplay');
                  fadeDisplay = fadeDisplay !== undefined
                    ? fadeDisplay
                    : 'block';
                  targetElement.fadingIn (fadeDuration, fadeDisplay);
                } else if (responseType2 === 'fadingOut') {
                  let fadeDuration = Number.parseInt (
                    targetElement.getAttribute ('fadeDuration')
                  );
                  targetElement.fadingIn (fadeDuration);
                } else {
                  var responseDuration2 = targetElement.getAttribute (
                    'duration'
                  );
                  targetElement[responseType2] (
                    Number.parseInt (responseDuration2)
                  );
                }
              }
            }
            function responseOne (targetElement) {
              var responseType = targetElement.getAttribute ('responseType');
              if (responseType === 'animating') {
                var animationFrom = targetElement.getAttribute (
                  'animationFrom'
                );
                var animationTo = targetElement.getAttribute ('animationTo');
                var animationOptions = targetElement.getAttribute (
                  'animationOptions'
                );
                var ObjOptions = {};
                var animationOptionsArr = animationOptions.split (',');
                animationOptionsArr.forEach (function (option) {
                  var splitedOption = option.split (':');
                  ObjOptions[splitedOption[0]] = splitedOption[1];
                });
                if (ObjOptions.duration) {
                  ObjOptions.duration = Number.parseInt (ObjOptions.duration);
                }
                var fromArray = animationFrom.split (',');
                var toArray = animationTo.split (',');
                var ObjectFrom = {};
                var ObjectTo = {};
                fromArray.forEach (function (fromAn, i) {
                  var splitedFrom = fromAn.split (':');
                  var splitedTo = toArray[i].split (':');
                  ObjectFrom[splitedFrom[0]] = splitedFrom[1];
                  ObjectTo[splitedTo[0]] = splitedTo[1];
                });

                targetElement.animating ([ObjectFrom, ObjectTo], ObjOptions);
              } else if (responseType === 'display') {
                var display1 = targetElement.getAttribute ('display1');
                targetElement.style.display = display1;
              } else if (responseType === 'cssStyle') {
                var css = targetElement.getAttribute ('css');
                targetElement.style.cssText += css;
              } else if (responseType === 'slideDown') {
                let duration = Number.parseInt (
                  targetElement.getAttribute ('slideDuration')
                );
                let slideDisplay = targetElement.getAttribute ('slideDisplay');
                targetElement.slideDown (duration, slideDisplay);
              } else if (responseType === 'slideUp') {
                let slideUpDuration = Number.parseInt (
                  targetElement.getAttribute ('slideUpDuration')
                );
                targetElement.slidingUp (slideUpDuration);
              } else if (responseType === 'fadingIn') {
                let fadeDuration = Number.parseInt (
                  targetElement.getAttribute ('fadeDuration')
                );
                let fadeDisplay = targetElement.getAttribute ('fadeDisplay');
                fadeDisplay = fadeDisplay !== undefined ? fadeDisplay : 'block';
                targetElement.fadingIn (fadeDuration, fadeDisplay);
              } else if (responseType === 'fadingOut') {
                let fadeDuration = Number.parseInt (
                  targetElement.getAttribute ('fadeDuration')
                );
                targetElement.fadingIn (fadeDuration);
              }
            }

            // function to make response one function to this element
            function responseThisOne (targetElement) {
              var thisResponseType = targetElement.getAttribute (
                'thisResponseType'
              );
              if (thisResponseType === 'animating') {
                var thisAnimationFrom = targetElement.getAttribute (
                  'thisAnimationFrom'
                );
                var thisAnimationTo = targetElement.getAttribute (
                  'thisAnimationTo'
                );
                var thisAnimationOptions = targetElement.getAttribute (
                  'thisAnimationOptions'
                );
                var ObjOptions = {};
                var animationOptionsArr = thisAnimationOptions.split (',');
                animationOptionsArr.forEach (function (option) {
                  var splitedOption = option.split (':');
                  ObjOptions[splitedOption[0]] = splitedOption[1];
                });
                if (ObjOptions.duration) {
                  ObjOptions.duration = Number.parseInt (ObjOptions.duration);
                }
                var fromArray = thisAnimationFrom.split (',');
                var toArray = thisAnimationTo.split (',');
                var ObjectFrom = {};
                var ObjectTo = {};
                fromArray.forEach (function (fromAn, i) {
                  var splitedFrom = fromAn.split (':');
                  var splitedTo = toArray[i].split (':');
                  ObjectFrom[splitedFrom[0]] = splitedFrom[1];
                  ObjectTo[splitedTo[0]] = splitedTo[1];
                });

                targetElement.animating ([ObjectFrom, ObjectTo], ObjOptions);
              } else if (thisResponseType === 'display') {
                var thisDisplay1 = targetElement.getAttribute ('thisDisplay1');
                targetElement.style.display = thisDisplay1;
              } else if (thisResponseType === 'cssStyle') {
                var css = targetElement.getAttribute ('thisCss');
                targetElement.style.cssText += css;
              } else if (thisResponseType === 'slideUp') {
                let slideUpDuration = Number.parseInt (
                  targetElement.getAttribute ('slideUpDuration')
                );
                targetElement.slidingUp (slideUpDuration);
              } else if (thisResponseType === 'slideDown') {
                let duration = Number.parseInt (
                  targetElement.getAttribute ('slideDuration')
                );
                let slideDisplay = targetElement.getAttribute ('slideDisplay');
                targetElement.slideDown (duration, slideDisplay);
              } else if (thisResponseType === 'fadingIn') {
                let fadeDuration = Number.parseInt (
                  targetElement.getAttribute ('fadeDuration')
                );
                let fadeDisplay = targetElement.getAttribute ('fadeDisplay');
                fadeDisplay = fadeDisplay !== undefined ? fadeDisplay : 'block';
                targetElement.fadingIn (fadeDuration, fadeDisplay);
              } else if (thisResponseType === 'fadingOut') {
                let fadeDuration = Number.parseInt (
                  targetElement.getAttribute ('fadeDuration')
                );
                targetElement.fadingIn (fadeDuration);
              }
            }
            // this response2 function
            function responseThisTwo (targetElement) {
              var thisResponseType2 = targetElement.getAttribute (
                'thisResponseType2'
              );
              if (thisResponseType2 === 'animating') {
                var thisAnimationFrom2 = targetElement.getAttribute (
                  'thisAnimationFrom2'
                );
                var thisAnimationTo2 = targetElement.getAttribute (
                  'thisAnimationTo2'
                );
                var thisAnimationOptions2 = targetElement.getAttribute (
                  'thisAnimationOptions2'
                );
                var ObjOptions = {};
                var animationOptionsArr = animationOptions2.split (',');
                animationOptionsArr.forEach (function (option) {
                  var splitedOption = option.split (':');
                  ObjOptions[splitedOption[0]] = splitedOption[1];
                });
                if (ObjOptions.duration) {
                  ObjOptions.duration = Number.parseInt (ObjOptions.duration);
                }
                var fromArray = animationFrom2.split (',');
                var toArray = animationTo2.split (',');
                var ObjectFrom = {};
                var ObjectTo = {};
                fromArray.forEach (function (fromAn, i) {
                  var splitedFrom = fromAn.split (':');
                  var splitedTo = toArray[i].split (':');
                  ObjectFrom[splitedFrom[0]] = splitedFrom[1];
                  ObjectTo[splitedTo[0]] = splitedTo[1];
                });

                targetElement.animating ([ObjectFrom, ObjectTo], ObjOptions);
              } else if (thisResponseType2 === 'display') {
                var thisDisplay12 = targetElement.getAttribute ('thisDisplay2');
                targetElement.style.display = thisDisplay2;
              } else if (thisResponseType2 === 'cssStyle') {
                var css2 = targetElement.getAttribute ('thisCss2');
                targetElement.style.cssText += css2;
              } else if (thisResponseType2 === 'slideUp') {
                let slideUpDuration = Number.parseInt (
                  targetElement.getAttribute ('slideUpDuration')
                );
                targetElement.slidingUp (slideUpDuration);
              } else if (thisResponseType2 === 'slideDown') {
                let duration = Number.parseInt (
                  targetElement.getAttribute ('slideDuration')
                );
                let slideDisplay = targetElement.getAttribute ('slideDisplay');
                targetElement.slideDown (duration, slideDisplay);
              } else if (thisResponseType2 === 'fadingIn') {
                let fadeDuration = Number.parseInt (
                  targetElement.getAttribute ('fadeDuration')
                );
                let fadeDisplay = targetElement.getAttribute ('fadeDisplay');
                fadeDisplay = fadeDisplay !== undefined ? fadeDisplay : 'block';
                targetElement.fadingIn (fadeDuration, fadeDisplay);
              } else if (thisResponseType2 === 'fadingOut') {
                let fadeDuration = Number.parseInt (
                  targetElement.getAttribute ('fadeDuration')
                );
                targetElement.fadingIn (fadeDuration);
              }
            }
            // listen for
            // make event listener for this event
            if (thisEvent === 'true') {
              let events = 0;
              if (thisEventType === 'click' && thisEventType2 === 'click') {
                controller.addEvent (`${thisEventType}`, function (e) {
                  events++;
                  if (events === 1) {
                    responseThisOne (e.target);
                  }
                  if (events === 2) {
                    responseThisTwo (e.target);
                    events = 0;
                  }
                });
              } else {
                controller.addEvent (`${thisEventType}`, function (e) {
                  responseThisOne (e.target);
                  controller.addEvent (`${thisEventType2}`, function (e) {
                    responseThisTwo (e.target);
                  });
                });
              }
            }
            //  check if the event type is click
            if (eventType === 'click' && eventType2 === 'click') {
              controller.addEvent (`${eventType}`, function (e) {
                clicked++;
                targetElements.forEach (function (targetElement) {
                  if (clicked === 1) {
                    return responseOne (targetElement);
                  }
                });
              });
              targetElements.forEach (function (targetElement, i) {
                let clickClose = targetElement.getAttribute ('clickClose');
                if (clickClose === 'true') {
                  document.addEventListener ('click', function (e) {
                    if (clicked === 1) {
                      if (e.target === controller) {
                        return null;
                      } else if (e.target === targetElement) {
                        return null;
                      } else if (
                        e.target.parents (targetElement) !== undefined
                      ) {
                        return null;
                      } else {
                        controller.click ();
                        clicked = 0;
                      }
                    }
                  });
                }
              });
              if (eventType2 !== undefined) {
                controller.addEvent (`${eventType2}`, function (e) {
                  responseThisOne (e.target);
                  if (clicked === 2) {
                    targetElements.forEach (function (targetElement) {
                      responseTwo (targetElement);
                      clicked = 0;
                    });
                  }
                });
              }
            } else {
              controller.addEvent (`${eventType}`, function (e) {
                clicked++;
                targetElements.forEach (function (targetElement) {
                  responseOne (targetElement);
                });
                if (eventType2 !== undefined) {
                  if (eventType2 !== 'mouseleave' || 'mouseout') {
                    document.body.addEvent ('mousemove', function (bEvent) {
                      if (clicked === 0) {
                        return null;
                      } else {
                        if (notElement) {
                          if (
                            bEvent.target === controller ||
                            bEvent.target === notElement ||
                            bEvent.target.parents (notElement) !== undefined
                          ) {
                            return null;
                          } else {
                            targetElements.forEach (function (targetElement) {
                              responseTwo (targetElement);
                              clicked = 0;
                            });
                          }
                        } else {
                          if (bEvent.target !== controller) {
                            targetElements.forEach (function (targetElement) {
                              responseTwo (targetElement);
                              clicked = 0;
                            });
                          }
                        }
                      }
                    });
                  } else {
                    controller.addEvent (`${eventType2}`, function (e) {
                      targetElements.forEach (function (targetElement) {
                        responseTwo (targetElement);
                        clicked = 0;
                      });
                    });
                  }
                }
              });
            }
          });
        }
      }) ();
      // end function to auto working for manipulating easy component events

      if (finish) {
        //function to access on the elements inside component with its expName attribute
        (function () {
          var allElements = component.self.querySelectorAll ('*');
          var elem = elements.element.querySelectorAll (`[expName]`);
          allElements.forEach (function (el, i) {
            // component[el.getAttribute("expName")] = el;
            if (el.getAttribute ('expName')) {
              if (el.getAttribute ('expName') === el.getAttribute ('expName')) {
                var arr = [];
                elem.forEach (function (it, x) {
                  if (
                    it.getAttribute ('expName') === el.getAttribute ('expName')
                  ) {
                    var attr = el.getAttribute ('expName');
                    arr.push (it);
                    if (arr.length === 1) {
                      component[attr] = arr[0];
                    } else if (arr.length > 1) {
                      component[attr] = arr;
                    }
                  }
                });
              }
            }
          });
        }) ();
        //function to append elements to element
        component.append = function (elem, content) {
          if (typeof content === 'object') {
            return elem.appendChild (content);
          }
          if (typeof content === 'string');
          return elem.insertAdjacentHTML ('beforeend', content);
        };
        if (typeof parent === 'string') {
          loadCssFile ()
            .then (function (style) {
              return setTimeout (function () {
                if (renderOption === true) {
                  if (options.onload) {
                    options.onload (parent);
                    setTimeout (() => {
                      try {
                        document
                          .querySelector (parent)
                          .appendChild (elements.element);
                      } catch (e) {
                        return true;
                      }
                      if (
                        document
                          .querySelector (parent)
                          .hasChildNodes (elements.element)
                      ) {
                        elements.element.insertBefore (
                          style,
                          elements.element.children[0]
                        );
                      }
                      return finish (component);
                    }, 10);
                  } else {
                    document
                      .querySelector (parent)
                      .appendChild (elements.element);
                    try {
                      document
                        .querySelector (parent)
                        .appendChild (elements.element);
                    } catch (e) {
                      return true;
                    }
                    if (
                      document
                        .querySelector (parent)
                        .hasChildNodes (elements.element)
                    ) {
                      elements.element.insertBefore (
                        style,
                        elements.element.children[0]
                      );
                    }
                    return finish (component);
                  }
                } else if (
                  renderOption === false ||
                  renderOption === undefined
                ) {
                  elements.element.insertBefore (
                    style,
                    elements.element.children[0]
                  );
                  return component;
                }
              }, 30);
            })
            .catch (function () {
              if (renderOption === true) {
                if (options.onload) {
                  options.onload (parent);
                  setTimeout (() => {
                    if (document.querySelector (parent)) {
                      try {
                        document
                          .querySelector (parent)
                          .appendChild (elements.element);
                      } catch (e) {
                        return true;
                      }
                      return finish (component);
                    }
                  }, 10);
                } else {
                  if (document.querySelector (parent)) {
                    try {
                      document
                        .querySelector (parent)
                        .appendChild (elements.element);
                    } catch (e) {
                      return true;
                    }
                    return finish (component);
                  }
                }
              } else if (renderOption === false || renderOption === undefined) {
                return component;
              }
            });
        } else if (typeof parent === 'object') {
          loadCssFile ()
            .then (function (style) {
              return setTimeout (function () {
                if (renderOption === true) {
                  if (options.onload) {
                    options.onload (parent);
                    setTimeout (() => {
                      try {
                        parent.appendChild (elements.element);
                      } catch (e) {
                        return true;
                      }
                      if (parent.hasChildNodes (elements.element)) {
                        elements.element.insertBefore (
                          style,
                          elements.element.children[0]
                        );
                      }
                      return finish (component);
                    }, 10);
                  } else {
                    try {
                      parent.appendChild (elements.element);
                    } catch (e) {
                      return true;
                    }
                    if (parent.hasChildNodes (elements.element)) {
                      elements.element.insertBefore (
                        style,
                        elements.element.children[0]
                      );
                    }
                    return finish (component);
                  }
                } else if (
                  renderOption === false ||
                  renderOption === undefined
                ) {
                  elements.element.insertBefore (
                    style,
                    elements.element.children[0]
                  );
                  return component;
                }
              }, 30);
            })
            .catch (function () {
              if (renderOption === true) {
                if (options.onload) {
                  options.onload (parent);
                  setTimeout (() => {
                    try {
                      parent.appendChild (elements.element);
                    } catch (e) {
                      return true;
                    }
                    return finish (component);
                  }, 10);
                } else {
                  try {
                    parent.appendChild (elements.element);
                  } catch (e) {
                    return true;
                  }
                  return finish (component);
                }
              } else if (renderOption === false || renderOption === undefined) {
                return component;
              }
            });
        }
      } else {
        (function () {
          var allElements = component.self.querySelectorAll ('*');
          var elem = elements.element.querySelectorAll (`[expName]`);
          allElements.forEach (function (el, i) {
            // component[el.getAttribute("expName")] = el;
            if (el.getAttribute ('expName')) {
              if (el.getAttribute ('expName') === el.getAttribute ('expName')) {
                var arr = [];
                elem.forEach (function (it, x) {
                  if (
                    it.getAttribute ('expName') === el.getAttribute ('expName')
                  ) {
                    var attr = el.getAttribute ('expName');
                    arr.push (it);
                    if (arr.length === 1) {
                      component[attr] = arr[0];
                    } else if (arr.length > 1) {
                      component[attr] = arr;
                    }
                  }
                });
              }
            }
          });
        }) ();
        //function to append elements to element
        component.append = function (elem, content) {
          if (typeof content === 'object') {
            return elem.appendChild (content);
          }
          if (typeof content === 'string');
          return elem.insertAdjacentHTML ('beforeend', content);
        };
        if (typeof parent === 'string') {
          loadCssFile ()
            .then (function (style) {
              return setTimeout (function () {
                if (renderOption === true) {
                  if (options.onload) {
                    options.onload (parent);
                    setTimeout (() => {
                      document
                        .querySelector (parent)
                        .appendChild (elements.element);
                      if (
                        document
                          .querySelector (parent)
                          .hasChildNodes (elements.element)
                      ) {
                        elements.element.insertBefore (
                          style,
                          elements.element.children[0]
                        );
                      }
                    }, 10);
                  } else {
                    document
                      .querySelector (parent)
                      .appendChild (elements.element);
                    if (
                      document
                        .querySelector (parent)
                        .hasChildNodes (elements.element)
                    ) {
                      elements.element.insertBefore (
                        style,
                        elements.element.children[0]
                      );
                    }
                  }
                } else if (
                  renderOption === false ||
                  renderOption === undefined
                ) {
                  elements.element.insertBefore (
                    style,
                    elements.element.children[0]
                  );
                  return component;
                }
              }, 30);
            })
            .catch (function () {
              if (renderOption === true) {
                if (options.onload) {
                  options.onload (parent);
                  setTimeout (() => {
                    return document
                      .querySelector (parent)
                      .appendChild (elements.element);
                  }, 10);
                } else {
                  return document
                    .querySelector (parent)
                    .appendChild (elements.element);
                }
              } else if (renderOption === false || renderOption === undefined) {
                return component;
              }
            });
        } else if (typeof parent === 'object') {
          loadCssFile ()
            .then (function () {
              return setTimeout (function () {
                if (renderOption === true) {
                  if (options.onload) {
                    options.onload (parent);
                    setTimeout (() => {
                      parent.appendChild (elements.element);
                      if (parent.hasChildNodes (elements.element)) {
                        elements.element.insertBefore (
                          style,
                          elements.element.children[0]
                        );
                      }
                    }, 10);
                  } else {
                    parent.appendChild (elements.element);
                    if (parent.hasChildNodes (elements.element)) {
                      elements.element.insertBefore (
                        style,
                        elements.element.children[0]
                      );
                    }
                  }
                } else if (
                  renderOption === false ||
                  renderOption === undefined
                ) {
                  elements.element.insertBefore (
                    style,
                    elements.element.children[0]
                  );
                  return component;
                }
              }, 30);
            })
            .catch (function () {
              if (renderOption === true) {
                if (options.onload) {
                  options.onload (parent);
                  setTimeout (() => {
                    return parent.appendChild (elements.element);
                  }, 10);
                } else {
                  return parent.appendChild (elements.element);
                }
              } else if (renderOption === false || renderOption === undefined) {
                return component;
              }
            });
        }
      }
      return component;
    }
    if (options && options.get) {
      var dataArr = [];
      if (options.render === true) {
        if (options.get) {
          if (options.get.fetch === true) {
            self.http.get (options.get, function (err, response) {
              var ajax = {};
              if (err) {
                ajax.error = err;
              }
              if (response) {
                ajax.data = response.data;
              }
              if (options.get.callback) {
                options.get.callback (err, response);
              }
              if (options.data) {
                allData = options.data;
              } else {
                allData = {};
              }
              allData.ajax = ajax;
              return writeIt (allData);
            });
          } else {
            function getPromise () {
              new Promise (function (resolve, reject) {
                self.http.get (
                  {
                    url: options.get.url,
                    headers: options.get.headers,
                    credentials: options.get.credentials,
                    origin: options.get.origin,
                    onProgress: function (xhttp) {
                      da = Date.now ();
                      if (options.get.onProgress) {
                        options.get.onProgress (xhttp);
                      }
                    },
                    onStart: function (xhttp) {
                      if (options.get.onStart) {
                        options.get.onStart (xhttp);
                      }
                    },
                  },
                  function (err, data) {
                    ajax = {};
                    if (err) {
                      ajax.error = err;
                      resolve (ajax);
                    }
                    if (data) {
                      ajax.data = data;
                      resolve (ajax);
                    }
                    if (options.get.callback) {
                      return options.get.callback (err, data);
                    }
                  }
                );
              });
            }
            return getPromise ().then (function (resolve) {
              if (options && options.data) {
                allData = options.data;
              }
              allData.ajax = resolve;
              return writeIt (allData);
            });
          }
        }
      } else {
        if (options.data) {
          return writeIt (options.data);
        } else {
          return writeIt ();
        }
      }
    } else {
      if (options && options.data) {
        allData = options.data;
        return writeIt (allData);
      } else {
        return writeIt ();
      }
    }
  };
  this.useComponent = function (component, parent) {
    var newComponent = component;
    parent = parent || component.options.parent;
    var componentParent = newComponent.options.parent || parent;
    newComponent.options.render = true;
    newComponent.options.parent = typeof parent === 'string'
      ? document.querySelector (componentParent)
      : componentParent;
    newComponent.parent = newComponent.options.parent;
    active.renderComponent (
      newComponent.cb,
      newComponent.options,
      newComponent.finish
    );
  };
  // end function to render a new component

  // function to use to start the application
  this.intiApplication = function () {
    var headerApp = document.createElement ('header-app');
    var contentPages = document.createElement ('content-app');
    var sideBar = document.createElement ('side-app');
    var footerApp = document.createElement ('footer-app');
    document.body.insertBefore (headerApp, document.querySelector ('script'));
    document.body.insertBefore (
      contentPages,
      document.querySelector ('script')
    );
    document.body.insertBefore (sideBar, document.querySelector ('script'));
    document.body.insertBefore (footerApp, document.querySelector ('script'));
  };
  // end function to use to start the application

  // function to load static component to still showing it in all pages as you want

  this.loadStaticComponents = function (cb) {
    return cb ();
  };

  // end function to load static component to still showing it in all pages as you want

  // function to parse the data

  this.parseData = function (data, cb) {
    if (typeof data === 'string') {
      data = JSON.parse (data);
    }
    if (Array.isArray (data)) {
      data.map (function (item, i) {
        return cb (item, i);
      });
    }
    if (typeof data === 'object') {
      Object.keys (data).map (function (item, i) {
        return cb (data[item], data[i]);
      });
    }
  };

  // end function to parse the data

  // using the router module for routing process
  this.Router = new Router(active);
  //end using the router module for routing process

  // http module and ajax
  function Ajax () {
    var xhr = new XMLHttpRequest ();
    this.get = function (options, cb) {
      if (options.fetch === true) {
        var resArr = [];
        var err, response = {};
        return fetch (options.url, options)
          .then (function (res) {
            response.res = res;
            return res.json ();
          })
          .then (function (data) {
            response.data = data;
            resArr.push (response);
            return cb (err, response);
          })
          .catch (function (error) {
            err = error;
            resArr.push ({err: err});
            return cb (err, response);
          })
          .then (function (component) {
            return component;
          });
      } else {
        xhr.open ('get', options.url, options.async ? options.async : true);
        if (options.type) {
          this.responseType = options.type;
        }
        if (options.headers) {
          Object.keys (options.headers).forEach (function (index) {
            xhr.setRequestHeader (index, options.headers[index]);
          });
        }
        xhr.onreadystatechange = function () {
          if (this.readyState === 0) {
            if (options.beforStart) {
              options.beforStart ();
            }
          }
          if (this.readyState === 1) {
            if (options.onStart) {
              options.onStart (xhr);
            }
          }
          if (this.readyState === 3) {
            if (options.onProgress) {
              options.onProgress (xhr);
            }
          }
          var err;
          var data;
          if (this.readyState === 4) {
            if (
              this.status === 404 ||
              this.status === 403 ||
              this.status === 500
            ) {
              err = {status: this.status};
            }
            if (this.readyState === 4 && this.status === 200) {
              data = {
                response: this.response,
                responseText: this.responseText,
                responseUrl: this.responseURL,
                responseXML: this.responseXML,
                responseType: this.responseType,
              };
            }
            return cb (err, data);
          }
        };
        xhr.send ();
        // console.clear();
      }
    };
    this.post = function (options, cb) {
      if (options.fetch === true) {
        var response = {};
        options.method = options.method !== undefined &&
          options.method.toLowerCase () === 'post'
          ? options.method
          : 'post';
          options.body = JSON.stringify(options.data);
        fetch (options.url, options)
          .then (function (res) {
            response.res = res;
            return res.json ();
          })
          .then (function (data) {
            response.data = data;
            return cb (false, response);
          })
          .catch (function (err) {
            return cb (err, false);
          });
      } else if (options.fetch === false || options.fetch === undefined) {
        if (options.fetch !== undefined) {
          delete options.fetch;
        }
        var err;
        var data;
        var formData = new FormData ();
        if (options.url) {
          xhr.open ('post', options.url, options.async ? options.async : true);
          if (options.headers) {
            Object.keys (options.headers).forEach (function (index) {
              xhr.setRequestHeader (index, options.headers[index]);
            });
          }
          if (options.fullAjax) {
            return fullAjax (this);
          }
          if (options.data) {
            if (options.upload) {
              var file;
              file = options.upload.file;
              Array.from (file).forEach (function (fil) {
                formData.append (options.upload.fileName, fil);
              });
              if (options.upload.onload) {
                xhr.upload.onload = function (e) {
                  return options.upload.onload (e);
                };
              }
              if (options.upload.onprogress) {
                xhr.upload.onprogress = function (e) {
                  return options.upload.onprogress (e);
                };
              }
              if (options.upload.onerror) {
                xhr.upload.onerror = function (e) {
                  return options.upload.onerror (e);
                };
              }
            }
            if (typeof options.data === 'object') {
              if (options.headers['content-type'] === 'application/json') {
                options.data = JSON.stringify (options.data);
              } else {
                Object.keys (options.data).forEach (function (item) {
                  formData.append (item, options.data[item]);
                });
                options.data = formData;
              }
            } else if (typeof options.data === 'string') {
              xhr.setRequestHeader (
                'Content-type',
                'application/x-www-form-urlencoded'
              );
            }
            xhr.setRequestHeader ('ajax', 'active');
            if (options.onabort) {
              xhr.onabort = function (e) {
                return options.onabort (e);
              };
            }
            xhr.onreadystatechange = function () {
              if (this.readyState === 0) {
                if (options.beforStart) {
                  options.beforStart ();
                }
              }
              if (this.readyState === 1) {
                if (options.onStart) {
                  options.onStart ();
                }
              }
              if (this.readyState === 3) {
                if (options.onProgress) {
                  options.onProgress ();
                }
              }

              if (
                this.status === 404 ||
                this.status === 403 ||
                this.status === 500
              ) {
                err = {status: this.status};
              }
              if (this.readyState === 4 && this.status === 200) {
                data = {
                  response: this.response,
                  responseText: this.responseText,
                  responseUrl: this.responseURL,
                  responseXML: this.responseXML,
                  responseType: this.responseType,
                };
              }
              if (cb) {
                return cb (err, data);
              }
            };
            xhr.send (options.data);
          } else {
            err = new Error ('bad request');
            return console.error ('cannot send empty data');
          }
        } else {
          err = new Error ('bad request');
          return console.error ('cannot send empty url');
        }
      }
    };
  }
  // end http module and ajax
  // using the http module and ajax
  this.http = new Ajax ();
  // end using the http module and ajax
  // function to maek popstate
}
export {ActiveClass};