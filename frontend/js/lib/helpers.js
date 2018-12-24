const ActiveHelpers = {};

ActiveHelpers.component = {};


// fade in the component
ActiveHelpers.component.fadingIn = (self, componentElement) => {
    if (self.options.fadingIn) {
        if (!self.options.fadingIn.cb) {
            componentElement.fadingIn(self.options.fadingIn.duration);
        } else if (self.options.fadingIn.cb) {
            componentElement.fadingIn(self.options.fadingIn.duration, self.options.fadingIn.cb());
        }
    }
}

// animate the component
ActiveHelpers.component.animating = (self, componentElement) => {
    if (self.options.animate) {
        componentElement.animating(
            self.options.animate.animations,
            self.options.animate.options,
            self.options.animate.callback ? self.options.animate.callback : null
        );
    }
}

// slide down the component
ActiveHelpers.component.slideDown = (self, componentElement) => {
    if (self.options.slideDown) {
        if (!self.options.slideDown.cb) {
            componentElement.slideDown(self.options.slideDown.duration);
        } else if (self.options.slideDown.cb) {
            componentElement.slideDown(
                self.options.slideDown.duration,
                self.options.slideDown.cb()
            );
        }
    }
}

// add the style to the component
ActiveHelpers.component.style = (self, componentElement) => {
    if (self.options.style) {
        var style = self.options.style;
        Object.keys(style).forEach(function(el) {
            if (el == 'component') {
                var cssElement = componentElement;
                Object.keys(style[el]).forEach(function(objStyle) {
                    componentElement.style[objStyle] = style[el][objStyle];
                });
            } else if (el == 'parent') {
                let cssElement = self.options.parent;
                Object.keys(style[el]).forEach(function(objStyle) {
                    cssElement.style[objStyle] = style[el][objStyle];
                });
            } else {
                var cssElements = componentElement.querySelectorAll(el);
                cssElements.forEach(function(cssElement) {
                    Object.keys(style[el]).forEach(function(objStyle) {
                        cssElement.style[objStyle] = style[el][objStyle];
                    });
                });
            }
        });
    }
}

// generateRandomName
ActiveHelpers.generateRandomName = () => {
    var NumberOfWords = 28;

    var words = new BuildArray(NumberOfWords);

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

    function BuildArray(size) {
        this.length = size;
        for (var i = 1; i <= size; i++) {
            this[i] = null;
        }
        return this;
    }
    // Generate a random number between 1 and NumberOfWords
    var rnd = Math.ceil(Math.random() * NumberOfWords);
    return words[rnd];
}

// methods of the component
ActiveHelpers.component.methods = (self, componentElement) => {
    if (self.methods) {
        var methods = self.methods();
        if (typeof methods == "object") {
            // var element;
            Array.from(Object.keys(methods)).forEach(function(el) {
                if (el == 'component') {
                    var element = componentElement;
                    var methodsEvents = methods[el];
                } else {
                    var element = componentElement.querySelector(el);
                    var matchedElements = [];
                    if (element == null) {
                        let allElements = componentElement.querySelectorAll('[expName]');
                        if (allElements) {
                            Array.from(allElements).forEach(ele => {
                                if (ele.getAttribute('expName') === el) {
                                    matchedElements.push(ele);
                                }
                            });
                        } else {}
                    } else {
                        matchedElements.push(element);
                    }
                    var methodsEvents = methods[el];
                    try {
                        Array.from(Object.keys(methodsEvents)).forEach(function(
                            event
                        ) {
                            var EventHappen = methodsEvents[event];
                            Array.from(matchedElements).forEach(function(ele) {
                                ele.addEvent(`${event}`, EventHappen);
                            });
                        });
                    } catch (e) {
                        return true;
                    }
                }
            });
        }
    }
}
ActiveHelpers.component.activeDom = (self) => {
    var elements = {
        element: self.self
    }
    var controllerElements = elements.element.querySelectorAll('[event]');
    if (controllerElements.length > 0) {
        controllerElements.forEach(function(controller) {
            var eventType = controller.getAttribute('eventType');
            var eventType2 = controller.getAttribute('eventType2');
            var thisEventType = controller.getAttribute('thisEventType');
            var thisEventType2 = controller.getAttribute('thisEventType2');
            var thisEvent = controller.getAttribute('thisEvent');
            var notElement = elements.element.querySelector(
                controller.getAttribute('notElement')
            );
            let compArr = [];
            let clicked = 0;
            controller.getAttribute('targetElement') === 'component' ?
                compArr.push(elements.element) :
                (compArr = []);
            var targetElements = controller.getAttribute('targetElement') ===
                'component' ?
                compArr :
                elements.element.querySelectorAll(
                    controller.getAttribute('targetElement')
                );

            function responseTwo(targetElement) {
                var responseType2 = targetElement.getAttribute('responseType2');
                if (responseType2) {
                    if (responseType2 === 'animating') {
                        var animationFrom2 = targetElement.getAttribute(
                            'animationFrom2'
                        );
                        var animationTo2 = targetElement.getAttribute(
                            'animationTo2'
                        );
                        var animationOptions2 = targetElement.getAttribute(
                            'animationOptions2'
                        );
                        var ObjOptions2 = {};
                        var animationOptionsArr2 = animationOptions2.split(',');
                        animationOptionsArr2.forEach(function(option) {
                            var splitedOption2 = option.split(':');
                            ObjOptions2[splitedOption2[0]] = splitedOption2[1];
                        });
                        if (ObjOptions2.duration) {
                            ObjOptions2.duration = Number.parseInt(
                                ObjOptions2.duration
                            );
                        }
                        var fromArray2 = animationFrom2.split(',');
                        var toArray2 = animationTo2.split(',');
                        var ObjectFrom2 = {};
                        var ObjectTo2 = {};
                        fromArray2.forEach(function(fromAn, i) {
                            var splitedFrom2 = fromAn.split(':');
                            var splitedTo2 = toArray2[i].split(':');
                            ObjectFrom2[splitedFrom2[0]] = splitedFrom2[1];
                            ObjectTo2[splitedTo2[0]] = splitedTo2[1];
                        });
                        targetElement.animating(
                            [ObjectFrom2, ObjectTo2],
                            ObjOptions2
                        );
                    } else if (responseType2 === 'display') {
                        var display2 = targetElement.getAttribute('display2');
                        targetElement.style.display = display2;
                    } else if (responseType2 === 'slideUp') {
                        let slideUpDuration = Number.parseInt(
                            targetElement.getAttribute('slideUpDuration')
                        );
                        targetElement.slidingUp(slideUpDuration);
                    } else if (responseType2 === 'slideDown') {
                        let duration = Number.parseInt(
                            targetElement.getAttribute('slideDuration')
                        );
                        let slideDisplay = targetElement.getAttribute(
                            'slideDisplay'
                        );
                        targetElement.slideDown(duration, slideDisplay);
                    } else if (responseType2 === 'fadingIn') {
                        let fadeDuration = Number.parseInt(
                            targetElement.getAttribute('fadeDuration')
                        );
                        let fadeDisplay = targetElement.getAttribute('fadeDisplay');
                        fadeDisplay = fadeDisplay !== undefined ?
                            fadeDisplay :
                            'block';
                        targetElement.fadingIn(fadeDuration, fadeDisplay);
                    } else if (responseType2 === 'fadingOut') {
                        let fadeDuration = Number.parseInt(
                            targetElement.getAttribute('fadeDuration')
                        );
                        targetElement.fadingIn(fadeDuration);
                    } else {
                        var responseDuration2 = targetElement.getAttribute(
                            'duration'
                        );
                        targetElement[responseType2](
                            Number.parseInt(responseDuration2)
                        );
                    }
                }
            }

            function responseOne(targetElement) {
                var responseType = targetElement.getAttribute('responseType');
                if (responseType === 'animating') {
                    var animationFrom = targetElement.getAttribute(
                        'animationFrom'
                    );
                    var animationTo = targetElement.getAttribute('animationTo');
                    var animationOptions = targetElement.getAttribute(
                        'animationOptions'
                    );
                    var ObjOptions = {};
                    var animationOptionsArr = animationOptions.split(',');
                    animationOptionsArr.forEach(function(option) {
                        var splitedOption = option.split(':');
                        ObjOptions[splitedOption[0]] = splitedOption[1];
                    });
                    if (ObjOptions.duration) {
                        ObjOptions.duration = Number.parseInt(ObjOptions.duration);
                    }
                    var fromArray = animationFrom.split(',');
                    var toArray = animationTo.split(',');
                    var ObjectFrom = {};
                    var ObjectTo = {};
                    fromArray.forEach(function(fromAn, i) {
                        var splitedFrom = fromAn.split(':');
                        var splitedTo = toArray[i].split(':');
                        ObjectFrom[splitedFrom[0]] = splitedFrom[1];
                        ObjectTo[splitedTo[0]] = splitedTo[1];
                    });

                    targetElement.animating([ObjectFrom, ObjectTo], ObjOptions);
                } else if (responseType === 'display') {
                    var display1 = targetElement.getAttribute('display1');
                    targetElement.style.display = display1;
                } else if (responseType === 'cssStyle') {
                    var css = targetElement.getAttribute('css');
                    targetElement.style.cssText += css;
                } else if (responseType === 'slideDown') {
                    let duration = Number.parseInt(
                        targetElement.getAttribute('slideDuration')
                    );
                    let slideDisplay = targetElement.getAttribute('slideDisplay');
                    targetElement.slideDown(duration, slideDisplay);
                } else if (responseType === 'slideUp') {
                    let slideUpDuration = Number.parseInt(
                        targetElement.getAttribute('slideUpDuration')
                    );
                    targetElement.slidingUp(slideUpDuration);
                } else if (responseType === 'fadingIn') {
                    let fadeDuration = Number.parseInt(
                        targetElement.getAttribute('fadeDuration')
                    );
                    let fadeDisplay = targetElement.getAttribute('fadeDisplay');
                    fadeDisplay = fadeDisplay !== undefined ? fadeDisplay : 'block';
                    targetElement.fadingIn(fadeDuration, fadeDisplay);
                } else if (responseType === 'fadingOut') {
                    let fadeDuration = Number.parseInt(
                        targetElement.getAttribute('fadeDuration')
                    );
                    targetElement.fadingIn(fadeDuration);
                }
            }

            // function to make response one function to this element
            function responseThisOne(targetElement) {
                var thisResponseType = targetElement.getAttribute(
                    'thisResponseType'
                );
                if (thisResponseType === 'animating') {
                    var thisAnimationFrom = targetElement.getAttribute(
                        'thisAnimationFrom'
                    );
                    var thisAnimationTo = targetElement.getAttribute(
                        'thisAnimationTo'
                    );
                    var thisAnimationOptions = targetElement.getAttribute(
                        'thisAnimationOptions'
                    );
                    var ObjOptions = {};
                    var animationOptionsArr = thisAnimationOptions.split(',');
                    animationOptionsArr.forEach(function(option) {
                        var splitedOption = option.split(':');
                        ObjOptions[splitedOption[0]] = splitedOption[1];
                    });
                    if (ObjOptions.duration) {
                        ObjOptions.duration = Number.parseInt(ObjOptions.duration);
                    }
                    var fromArray = thisAnimationFrom.split(',');
                    var toArray = thisAnimationTo.split(',');
                    var ObjectFrom = {};
                    var ObjectTo = {};
                    fromArray.forEach(function(fromAn, i) {
                        var splitedFrom = fromAn.split(':');
                        var splitedTo = toArray[i].split(':');
                        ObjectFrom[splitedFrom[0]] = splitedFrom[1];
                        ObjectTo[splitedTo[0]] = splitedTo[1];
                    });

                    targetElement.animating([ObjectFrom, ObjectTo], ObjOptions);
                } else if (thisResponseType === 'display') {
                    var thisDisplay1 = targetElement.getAttribute('thisDisplay1');
                    targetElement.style.display = thisDisplay1;
                } else if (thisResponseType === 'cssStyle') {
                    var css = targetElement.getAttribute('thisCss');
                    targetElement.style.cssText += css;
                } else if (thisResponseType === 'slideUp') {
                    let slideUpDuration = Number.parseInt(
                        targetElement.getAttribute('slideUpDuration')
                    );
                    targetElement.slidingUp(slideUpDuration);
                } else if (thisResponseType === 'slideDown') {
                    let duration = Number.parseInt(
                        targetElement.getAttribute('slideDuration')
                    );
                    let slideDisplay = targetElement.getAttribute('slideDisplay');
                    targetElement.slideDown(duration, slideDisplay);
                } else if (thisResponseType === 'fadingIn') {
                    let fadeDuration = Number.parseInt(
                        targetElement.getAttribute('fadeDuration')
                    );
                    let fadeDisplay = targetElement.getAttribute('fadeDisplay');
                    fadeDisplay = fadeDisplay !== undefined ? fadeDisplay : 'block';
                    targetElement.fadingIn(fadeDuration, fadeDisplay);
                } else if (thisResponseType === 'fadingOut') {
                    let fadeDuration = Number.parseInt(
                        targetElement.getAttribute('fadeDuration')
                    );
                    targetElement.fadingIn(fadeDuration);
                }
            }
            // this response2 function
            function responseThisTwo(targetElement) {
                var thisResponseType2 = targetElement.getAttribute(
                    'thisResponseType2'
                );
                if (thisResponseType2 === 'animating') {
                    var thisAnimationFrom2 = targetElement.getAttribute(
                        'thisAnimationFrom2'
                    );
                    var thisAnimationTo2 = targetElement.getAttribute(
                        'thisAnimationTo2'
                    );
                    var thisAnimationOptions2 = targetElement.getAttribute(
                        'thisAnimationOptions2'
                    );
                    var ObjOptions = {};
                    var animationOptionsArr = animationOptions2.split(',');
                    animationOptionsArr.forEach(function(option) {
                        var splitedOption = option.split(':');
                        ObjOptions[splitedOption[0]] = splitedOption[1];
                    });
                    if (ObjOptions.duration) {
                        ObjOptions.duration = Number.parseInt(ObjOptions.duration);
                    }
                    var fromArray = animationFrom2.split(',');
                    var toArray = animationTo2.split(',');
                    var ObjectFrom = {};
                    var ObjectTo = {};
                    fromArray.forEach(function(fromAn, i) {
                        var splitedFrom = fromAn.split(':');
                        var splitedTo = toArray[i].split(':');
                        ObjectFrom[splitedFrom[0]] = splitedFrom[1];
                        ObjectTo[splitedTo[0]] = splitedTo[1];
                    });

                    targetElement.animating([ObjectFrom, ObjectTo], ObjOptions);
                } else if (thisResponseType2 === 'display') {
                    var thisDisplay12 = targetElement.getAttribute('thisDisplay2');
                    targetElement.style.display = thisDisplay2;
                } else if (thisResponseType2 === 'cssStyle') {
                    var css2 = targetElement.getAttribute('thisCss2');
                    targetElement.style.cssText += css2;
                } else if (thisResponseType2 === 'slideUp') {
                    let slideUpDuration = Number.parseInt(
                        targetElement.getAttribute('slideUpDuration')
                    );
                    targetElement.slidingUp(slideUpDuration);
                } else if (thisResponseType2 === 'slideDown') {
                    let duration = Number.parseInt(
                        targetElement.getAttribute('slideDuration')
                    );
                    let slideDisplay = targetElement.getAttribute('slideDisplay');
                    targetElement.slideDown(duration, slideDisplay);
                } else if (thisResponseType2 === 'fadingIn') {
                    let fadeDuration = Number.parseInt(
                        targetElement.getAttribute('fadeDuration')
                    );
                    let fadeDisplay = targetElement.getAttribute('fadeDisplay');
                    fadeDisplay = fadeDisplay !== undefined ? fadeDisplay : 'block';
                    targetElement.fadingIn(fadeDuration, fadeDisplay);
                } else if (thisResponseType2 === 'fadingOut') {
                    let fadeDuration = Number.parseInt(
                        targetElement.getAttribute('fadeDuration')
                    );
                    targetElement.fadingIn(fadeDuration);
                }
            }
            // listen for
            // make event listener for this event
            if (thisEvent === 'true') {
                let events = 0;
                if (thisEventType === 'click' && thisEventType2 === 'click') {
                    controller.addEvent(`${thisEventType}`, function(e) {
                        events++;
                        if (events === 1) {
                            responseThisOne(e.target);
                        }
                        if (events === 2) {
                            responseThisTwo(e.target);
                            events = 0;
                        }
                    });
                } else {
                    controller.addEvent(`${thisEventType}`, function(e) {
                        responseThisOne(e.target);
                        controller.addEvent(`${thisEventType2}`, function(e) {
                            responseThisTwo(e.target);
                        });
                    });
                }
            }
            //  check if the event type is click
            if (eventType === 'click' && eventType2 === 'click') {
                controller.addEvent(`${eventType}`, function(e) {
                    clicked++;
                    targetElements.forEach(function(targetElement) {
                        if (clicked === 1) {
                            return responseOne(targetElement);
                        }
                    });
                });
                targetElements.forEach(function(targetElement, i) {
                    let clickClose = targetElement.getAttribute('clickClose');
                    if (clickClose === 'true') {
                        document.addEventListener('click', function(e) {
                            if (clicked === 1) {
                                if (e.target === controller) {
                                    return null;
                                } else if (e.target === targetElement) {
                                    return null;
                                } else if (
                                    e.target.parents(targetElement) !== undefined
                                ) {
                                    return null;
                                } else {
                                    controller.click();
                                    clicked = 0;
                                }
                            }
                        });
                    }
                });
                if (eventType2 !== undefined) {
                    controller.addEvent(`${eventType2}`, function(e) {
                        responseThisOne(e.target);
                        if (clicked === 2) {
                            targetElements.forEach(function(targetElement) {
                                responseTwo(targetElement);
                                clicked = 0;
                            });
                        }
                    });
                }
            } else {
                controller.addEvent(`${eventType}`, function(e) {
                    clicked++;
                    targetElements.forEach(function(targetElement) {
                        responseOne(targetElement);
                    });
                    if (eventType2 !== undefined) {
                        if (eventType2 !== 'mouseleave' || 'mouseout') {
                            document.body.addEvent('mousemove', function(bEvent) {
                                if (clicked === 0) {
                                    return null;
                                } else {
                                    if (notElement) {
                                        if (
                                            bEvent.target === controller ||
                                            bEvent.target === notElement ||
                                            bEvent.target.parents(notElement) !== undefined
                                        ) {
                                            return null;
                                        } else {
                                            targetElements.forEach(function(targetElement) {
                                                responseTwo(targetElement);
                                                clicked = 0;
                                            });
                                        }
                                    } else {
                                        if (bEvent.target !== controller) {
                                            targetElements.forEach(function(targetElement) {
                                                responseTwo(targetElement);
                                                clicked = 0;
                                            });
                                        }
                                    }
                                }
                            });
                        } else {
                            controller.addEvent(`${eventType2}`, function(e) {
                                targetElements.forEach(function(targetElement) {
                                    responseTwo(targetElement);
                                    clicked = 0;
                                });
                            });
                        }
                    }
                });
            }
        });
    }
}
export default ActiveHelpers;