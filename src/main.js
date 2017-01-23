function Animata(options){

    // alias to get element
    function $(s){
        return document.querySelector(s);
    }


    // Get override object for current step.
    function getOverridenStep(idx) {
        var s = {
            after: options.duration
        };
        for (var i=0; i < options.steps.length; i++) {
            if (options.steps[i].step == idx) {
                s = options.steps[i]
            }
        }

        if (s.after === undefined) {
            s.after = options.duration;
        }
        return s;
    }

    // Launch animations.
    // TODO: do it only on transition, at this time "transitionstart" 
    // event is not implemented.
    function transitions(){
        for(var i=0; i < options.onTransition.length; i++) {
            var t = options.onTransition[i];
            for (var j=0; j < t.elems.length; j++) {
                var elem = $(t.elems[j]);
                var f = function(){
                    t.func();
                    window.requestAnimationFrame(f); 
                }
                window.requestAnimationFrame(f); 
            }
        
        }
    }

    // make changes for this step
    function change(){
        var i;
        this.currentStep++;
        this.animating = true;
        this.wrapper.classList.add("animata-in-progress");
        this.wrapper.classList.add('animata-step-' + this.currentStep);
        var s = getOverridenStep(this.currentStep);

        if (s.actions) {
            for(i=0; i < s.actions.length; i++) {
                s.actions[i]();
            }
        }
    };

    // reset animation
    function reset(){
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
    }

    // go to next stem
    function next() {
        if (this.currentStep+1> options.count) {
            this.reset()
        }
        this.change()
    }

    // go to previous step
    function prev(){
        if (this.currentStep > 0 ) {
            this.wrapper.classList.remove("animata-step-"+this.currentStep)
            this.currentStep--
        }
    }


    // play animation from current step
    function start(){
        var i;
        var from = 0;
        console.log(this.currentStep, options.count)
        if (this.currentStep > options.count){
            this.reset();
        }
        this.animating = true;
        // launch animation
        for (i=1; i < options.count+1; i++) {
            s = getOverridenStep(i);
            from += s.after;
            var t = setTimeout(this.change.bind(this),from);
            this.timers.push(t)
        }
    }



    options.wrapper = options.wrapper || "";
    options.duration = options.duration || 1000;
    options.steps = options.steps || [];
    options.count = options.count || 0;
    options.onTransition = options.onTransition || [];

    console.log(options)
    this.animating = false;
    this.wrapper = $(options.wrapper);
    this.currentStep = 0;
    this.options = options;
    this.start = start;
    this.next = next;
    this.prev = prev;
    this.reset = reset;
    this.change = change;
    this.timers = [];
    transitions();
}
