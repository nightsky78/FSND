// MAP FUNCTION
// example for map function of a array.
// to manipulate array functions
var bills = [50.23, 19.12, 34.01,
    100.11, 12.15, 9.90, 29.11, 12.99,
    10.00, 99.22, 102.20, 100.10, 6.77, 2.22
];

var totals = bills.map(function (elem) {
    elem = elem * 1.15;
    return Number(elem.toFixed(2));
});

console.log(totals);

// NESTED ARRAY
// For loop over nested array example to replace array values
var numbers = [
    [243, 12, 23, 12, 45, 45, 78, 66, 223, 3],
    [34, 2, 1, 553, 23, 4, 66, 23, 4, 55],
    [67, 56, 45, 553, 44, 55, 5, 428, 452, 3],
    [12, 31, 55, 445, 79, 44, 674, 224, 4, 21],
    [4, 2, 3, 52, 13, 51, 44, 1, 67, 5],
    [5, 65, 4, 5, 5, 6, 5, 43, 23, 4424],
    [74, 532, 6, 7, 35, 17, 89, 43, 43, 66],
    [53, 6, 89, 10, 23, 52, 111, 44, 109, 80],
    [67, 6, 53, 537, 2, 168, 16, 2, 1, 8],
    [76, 7, 9, 6, 3, 73, 77, 100, 56, 100]
];

for (var row = 0; row < numbers.length; row++){
    for (var column = 0; column < numbers[row].length; column++){
        if (numbers[row][column] % 2 === 0)
            { numbers[row][column] = "even"}
        else {numbers[row][column] = "odd"}
    }
}

// OBJECT DEFINITION
// defines an object and call one of the properties
var breakfast = {
    name : 'The Lumberjack',
    price : '$9.95',
    ingredients : ["eggs", "sausage", "toast", "hashbrowns", "pancakes"]
};

console.log(breakfast.price);

// FUNCTION AS PART OF OBJECT
// EXAMPLE 1
var savingsAccount = {
    balance: 1000,
    interestRatePercent: 1,
    deposit: function addMoney(amount) {
        if (amount > 0) {
            savingsAccount.balance += amount;
        }
    },
    withdraw: function removeMoney(amount) {
        var verifyBalance = savingsAccount.balance - amount;
        if (amount > 0 && verifyBalance >= 0) {
            savingsAccount.balance -= amount;
        }
    },
    printAccountSummary: function(){
        return 'Welcome! \nYour balance is currently $' +
        savingsAccount.balance +' and your interest rate is ' + savingsAccount.interestRatePercent + '%.';
    }
};

console.log(savingsAccount.printAccountSummary());


//EXAMPLE  2
var facebookProfile = {
    name : 'Johannes',
    friends : 58,
    message : ['message1', 'message2', 'message3'],
    postMessage : function(message) {
        facebookProfile.message.push(message);
    },
    deleteMessage : function(index) {
        facebookProfile.message.splice(index,1)
    }
}
// Access to method in the object
facebookProfile.postMessage('message4')
// accessing value in the object
console.log(facebookProfile.message[3])

// IIFE Function Example (Immediately invoked function expression)
// clear the screen for testing
document.body.innerHTML = '';

var nums = [1,2,3];

// Let's loop over the numbers in our array
for (var i = 0; i < nums.length; i++) {

    // This is the number we're on...
    var num = nums[i];

    // We're creating a DOM element for the number
    var elem = document.createElement('div');
    elem.textContent = num;

    // ... and when we click, alert the value of `num`
    elem.addEventListener('click', (function(numCopy) {   // The function(numCopy) is the outer function
                                                          // The value is know as numCopy there
                                                          // the event lister function gets passed num as agrument
                                                          // the num value gets transferred to numCopy.
                                                          // The syntax for IIFE is (function(valCopy){ Do something })(val)
                                                          // Lastly, the outer function returns the inner function to the event listener
        return function() {
            alert(numCopy);
        };
    })(num));

    document.body.appendChild(elem);
};

