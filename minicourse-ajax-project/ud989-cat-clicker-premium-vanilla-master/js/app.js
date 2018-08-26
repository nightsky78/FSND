
/* ======= Model ======= */

var model = {
    currentCat: null,
    adminmode: false,
    cats: [
        {
            clickCount : 0,
            name : 'Tabby',
            imgSrc : 'img/434164568_fea0ad4013_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/bigtallguy/434164568'
        },
        {
            clickCount : 0,
            name : 'Tiger',
            imgSrc : 'img/4154543904_6e2428c421_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904'
        },
        {
            clickCount : 0,
            name : 'Scaredy',
            imgSrc : 'img/22252709_010df3379e_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709'
        },
        {
            clickCount : 0,
            name : 'Shadow',
            imgSrc : 'img/1413379559_412a540d29_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559'
        },
        {
            clickCount : 0,
            name : 'Sleepy',
            imgSrc : 'img/9648464288_2516b35537_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288'
        }
    ]
};


/* ======= Octopus ======= */

var octopus = {

    init: function() {
        // set our current cat to the first one in the list
        model.currentCat = model.cats[0];

        // tell our views to initialize
        catListView.init();
        catView.init();
        catAdminView.init();
    },

    getCurrentCat: function() {
        return model.currentCat;
    },

    getCats: function() {
        return model.cats;
    },

    getAdminMode: function() {
        return model.adminmode;
    },

    setAdminMode: function(val) {
        model.adminmode = val
    },

    // set the currently-selected cat to the object passed in
    setCurrentCat: function(cat) {
        model.currentCat = cat;
    },

    setName : function(newName) {
        model.currentCat.name = newName;
    },
    setURL : function(newURL) {
        model.currentCat.imgAttribution = newURL;
    },
    setCounter : function(newCounter) {
        model.currentCat.clickCount = newCounter;
    },

    // increments the counter for the currently-selected cat
    incrementCounter: function() {
        model.currentCat.clickCount++;
        catView.render();
    }
};


/* ======= View ======= */

var catView = {

    init: function() {
        // store pointers to our DOM elements for easy access later
        this.catElem = document.getElementById('cat');
        this.catNameElem = document.getElementById('cat-name');
        this.catImageElem = document.getElementById('cat-img');
        this.countElem = document.getElementById('cat-count');

        // on click, increment the current cat's counter
        this.catImageElem.addEventListener('click', function(){
            octopus.incrementCounter();
        });

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current cat
        var currentCat = octopus.getCurrentCat();
        this.countElem.textContent = currentCat.clickCount;
        this.catNameElem.textContent = currentCat.name;
        this.catImageElem.src = currentCat.imgSrc;
    }
};

var catListView = {

    init: function() {
        // store the DOM element for easy access later
        this.catListElem = document.getElementById('cat-list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();

        // empty the cat list
        this.catListElem.innerHTML = '';

        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.textContent = cat.name;

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    octopus.setCurrentCat(catCopy);
                    catView.render();
                };
            })(cat));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
        }
    }
};

var catAdminView = {

    init : function() {
        // get the active elements out of the DOM.
        this.adminArea = document.getElementById('adminform');
        this.adminButton = document.getElementById('adminbutton');
        this.cancelButton = document.getElementById('cancel');
        this.saveButton = document.getElementById('save');
        this.content = document.getElementById('new-note-form')

        this.cancelButton.addEventListener('click', function(){
            octopus.setAdminMode(false);
            console.log("set to false");
            catAdminView.render();
        });

        this.adminButton.addEventListener('click', function(){
            octopus.setAdminMode(true);
            console.log("set to true");
            catAdminView.render();
        });

        this.saveButton.addEventListener('click', function(){
            catAdminView.save();
        });


        this.render();

    },

    render : function(){
        // get the current status of the admin mode
        this.mode = octopus.getAdminMode();
        console.log(this.mode);
        if (!this.mode) {
            this.adminArea.style.display = "none";
        }
        else {
            this.adminArea.style.display = "block";
        }

    },

    save : function(){

        var newName = this.content[0].value;
        var newURL = this.content[1].value;
        var newCounter = this.content[2].value;

        octopus.setName(newName);
        octopus.setURL(newURL);
        octopus.setCounter(newCounter);
        catListView.render();
        catView.render();

    }

};

// make it go!
octopus.init();
