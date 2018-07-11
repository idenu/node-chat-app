const moment = require('moment');

var createdAt = 1234
var date = moment(createdAt);

date.add(2, 'hours');

console.log(date.format('H:mm'));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);