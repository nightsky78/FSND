var Cat = function() {
    // creating the dataset
    // click counter with value = 0
    this.clickCount = ko.observable(0);
    this.name = ko.observable('Tabby');
    // Referring to each array entry using $data
    this.nickName = ko.observableArray(['nick1', 'nick2', 'nick3']);
    this.imgSrc = ko.observable('img/22252709_010df3379e_z.jpg');
    this.imgAttribution = ko.observable('whatever');

    // This is demoing the computed obeservable
    // A function is passed and the "this" variable.
    // Then there is access to the "this" object.
    this.catLevel = ko.computed(function() {
        if (this.clickCount() < 10){
            console.log(this.clickCount());
            return "newborn";

            }
        else if (this.clickCount() < 20) {
            console.log(this.clickCount());
            return "toodler";
            }
        else {
            console.log(this.clickCount());
            return "grownup";
        }
    }, this);

}


var ViewModel = function() {

    // storing the current context in the that variable. so we dont get confused
    // with using the differnt context in the html using the with variable.
    var that = this;

    this.currentCat = ko.observable( new Cat() );
    // create the functions which work with the data in the view
    this.incrCounter = function() {
        // we need to store the new value for click count in the click count function
        // the obervabale called as function returns the value.
        that.currentCat().clickCount(that.currentCat().clickCount()+1);
    }

}

// apply the bindings. This is ko standard
// this needs to be created for knockout to work
ko.applyBindings(new ViewModel());