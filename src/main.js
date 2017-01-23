var Animata = (function() {
    "use strict";

    // alias to get element
    function $(s){
        return document.querySelector(s);
    }

    // onTranistion animated function for each frame
    function animatedFrame(obj) {
        obj.func();
        window.requestAnimationFrame(function(){
            animatedFrame(obj);
        }); 
    }

    // Launch animations.
    // TODO: do it only on transition, at this time "transitionstart" 
    // event is not implemented.
    function transitions(options){
        for(var i=0; i < options.onTransition.length; i++) {
            var t = options.onTransition[i];
            for (var j=0; j < t.elems.length; j++) {
                var elem = $(t.elems[j]);
                animatedFrame(t);
            }
        }
    }

    function Animata(options){
        options.wrapper = options.wrapper || "";
        options.duration = options.duration || 1000;
        options.steps = options.steps || [];
        options.count = options.count || 0;
        options.onTransition = options.onTransition || [];

        this.animating = false;
        this.wrapper = $(options.wrapper);
        this.currentStep = 0;
        this.options = options;
        this.timers = [];
        transitions(this.options);
    }

    // fo to next step
    Animata.prototype.next = function() {
        if (this.currentStep+1> this.options.count) {
            this.reset();
        }
        this.change();
    };

    // go to previous step
    Animata.prototype.prev = function() {
        if (this.currentStep > 0 ) {
            this.wrapper.classList.remove("animata-step-"+this.currentStep);
            this.currentStep--;
        }
    };

    // reset animation
    Animata.prototype.reset = function(){
        var i;
        for (i=0; i < this.timers.length; i++) {
            clearTimeout(this.timers[i]);
        }
        this.timers = [];
        this.currentStep = 0;
        //
        // reset animation steps
        var classes=[];
        for (i=0; i < this.wrapper.classList.length; i++) {
            classes.push(this.wrapper.classList[i]);
        }
        for (i=0; i < classes.length; i++) {
            var c = classes[i];
            if (c.match(/animata-.+/)) {
                this.wrapper.classList.remove(c);
            }
        }
    };

    // play animation from current step
    Animata.prototype.start = function(){
        var i;
        var from = 0;
        if (this.currentStep > this.options.count){
            this.reset();
        }
        this.animating = true;
        // launch animation
        for (i=1; i < this.options.count+1; i++) {
            var s = this.getOverridenStep(i);
            from += s.after;
            var t = setTimeout(this.change.bind(this),from);
            this.timers.push(t);
        }
    };

    // make changes for this step
    Animata.prototype.change = function() {
        var i;
        this.currentStep++;
        this.animating = true;
        this.wrapper.classList.add("animata-in-progress");
        this.wrapper.classList.add('animata-step-' + this.currentStep);
        var s = this.getOverridenStep(this.currentStep);

        if (s.actions) {
            for(i=0; i < s.actions.length; i++) {
                s.actions[i]();
            }
        }
    };


    // Get override object for current step.
    Animata.prototype.getOverridenStep = function(idx) {
        var s = {
            after: this.options.duration
        };
        for (var i=0; i < this.options.steps.length; i++) {
            if (this.options.steps[i].step == idx) {
                s = this.options.steps[i];
            }
        }

        if (s.after === undefined) {
            s.after = this.options.duration;
        }

        return s;
    };

    return Animata;
})();
