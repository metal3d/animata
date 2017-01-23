# Animata JS

Animata is a tiny JS (vanilla) to make use of CSS to create simple animation. 

# Usage

Import main.js file and use it like this:

```javascript
var animata1 = new Animata({
    count: 6; // number of animation step
    wrapper: "#anim1", // element that wraps your animation
    duration: 1000, // duration for each step
    onTransition: [
        {
            elems: ["#block1"], 
            func: function(){
                 //... function to
                 // launch continuously.
                 // Animata execute that function
                 // on requestAnimationFrame
            }
        }
    ],
    steps: [
        {
            step: 4, // eg. to override step 4
            after: 3000, // step 4 will take 4s,
            actions: [
                func(){}, //... functions to launch at step 4
            ]
        }
    ]
})

animata1.start(); // => launch animation 
```

When "start" is launched, Animata will set "animata-step-N" class to the wrapper element where "N" is the number of current step. Each step is added, that means that wrapper element will have "animata-step-1 animata-step-2 animata-step-3" classes at step 3.

A new call to "start" removes the entire animata classes from the wrapper element, and animation will start again from step 1.


You can now create your CSS. 


Example:

```css

/* make div elements to be animated with nice transition */
#anim1 div {
    transition: 1s all linear; 
}

/* block to animate */
#anim1 .block1 {
    opacity: 0;
    background-color: #FFFFFF;
}

/* Step 1, reveal block and move it to 150px left */
#anim1.animata-step-1 .block1 {
    opacity: 1;
    margin-left: 150px;
}

/* Step 2, change background color */
#anim1.animata-step-2 .block1 {
    background-color: #AFAFAF
}

```

And associated HTML

```html
<div id="#anim1">
    <div class="block1">The animated block</div>
</div>
```


And finally, the JS:

```javascript
var animata = new Animata({
    count: 2;
    wrapper: "#anim1",
    actions: [
        {
            step: 1,
            func: function(){
                console.log("this is the step 1 !")
            }
        }
    ]
});
animata.start()
```


You can also use "next()" and "prev()" method to create a "player" and let user go step forward and backward.
