$(function() {

    // on the bottom of the function the octopus is initialized.

    // Generate the initial dataset
    // ID is 0 an the Pizzas are empty.
    var data = {
        lastID: 0,
        pizzas: []
    };

    // The octopus object has 4 function
    // add a pizza
    // remove a pizza
    // get the visible pizzas
    // initialize the view
    var octopus = {
        addPizza: function() {
            // get the lastID from the data
            // and store it under thisID
            var thisID = ++data.lastID;

            // Create a new entry for data object in the pizzas array
            // It has the id of the pizza and whether its visible
            data.pizzas.push({
                id: thisID,
                visible: true
            });
            // Add a new pizza
            view.render();
        },

        removePizza: function(pizza) {
            var clickedPizza = data.pizzas[ pizza.id - 1 ];
            clickedPizza.visible = false;
            view.render();
        },

        //
        getVisiblePizzas: function() {
            var visiblePizzas = data.pizzas.filter(function(pizza) {
                console.log(pizza);
                return pizza.visible;
            });
            console.log(visiblePizzas);
            return visiblePizzas;
        },

        init: function() {
            view.init();
        }
    };

    // Once the view is initialized
    // the view object has 2 fuction
    // init
    // render
    var view = {
        // It seems like this init function maintain the page.
        init: function() {
            // If the Pizza button is clicked, the add Pizza function is called .
            var addPizzaBtn = $('.add-pizza');
            addPizzaBtn.click(function() {
                octopus.addPizza();
            });

            // grab elements and html for using in the render function
            // the pizza list I need later to listen to where it is clicked
            this.$pizzaList = $('.pizza-list');
            // This just grabs some text to create a template.
            this.pizzaTemplate = $('script[data-template="pizza"]').html();

            // Delegated event to listen for removal clicks
            // It listens to clicks on the whole pizza list on class remove pizza.

            this.$pizzaList.on('click', '.remove-pizza', function(e) {
                // in the listener function is a callback function which gets the pizza object
                var pizza = $(this).parents('.pizza').data();
                console.log('This is var pizza: ' + pizza.id);
                // the selected pizza is then removed.
                octopus.removePizza(pizza);
                return false;
            });

            this.render();
        },

        render: function() {
            // Cache vars for use in forEach() callback (performance)
            var $pizzaList = this.$pizzaList,
                pizzaTemplate = this.pizzaTemplate;

            // Clear and render
            $pizzaList.html('');
            octopus.getVisiblePizzas().forEach(function(pizza) {
                // Replace template markers with data
                var thisTemplate = pizzaTemplate.replace(/{{id}}/g, pizza.id);
                $pizzaList.append(thisTemplate);
            });
        }
    };

    octopus.init();
}());
