# Documentation

Text-Field Calculator uses [math.js](https://mathjs.org/) for calculations. Here's some useful links from their documentation:
 - [Data Types](https://mathjs.org/docs/datatypes/index.html)
 - [Functions](https://mathjs.org/docs/reference/functions.html)
 - [Constants](https://mathjs.org/docs/reference/constants.html)
 - [Syntax](https://mathjs.org/docs/expressions/syntax.html)

# Additional Features
Text-Field Calculator adds some additional features on top of math.js, including date and time calculations and some extra functions. See below for details.

## Date and Time

Date and time calculations can be performed using instants and durations. Where an instant represents a specific point in time, a duration represents a length of time.

### now()
Returns the current instant.

### instant(value)
Creates an instant from date/time text, time with units, or nanoseconds since epoch.

`instant("oct 17th 2025 12 PM")`, `instant(1760716800000ms)`, and `instant(1760716800000000000)` all create the same instant.

Some examples of the date/time text that is supported:
 - Today, Tomorrow, Yesterday, Last Friday, etc
 - 5 days ago
 - 2 weeks from now
 - Sat Aug 17 2013 18:40:39 GMT+0900 (JST)
 - 2014-11-30T08:15:30-05:30

Parsing is done using [chrono](https://github.com/wanasit/chrono).

### duration(value)
Creates a duration from duration text, time with units, or an object with time units.

`duration("2 hours 30 minutes")`, `duration(2 hours + 30 minutes)`, and `duration({ hours: 2, minutes: 30 })` all create the same duration.

Parsing is done using [parse-duration](https://github.com/jkroso/parse-duration).

## Additional Functions

### divmod(x, n)
Returns an array with the quotient and remainder of x divided by n.

`divmod(10, 3)` returns `[3, 1]`

### signatures(f)
Returns the signatures of a function f as an object where keys are the argument types and values are the corresponding function implementations.

`signatures(sin)` returns `{'number': function, 'Complex': function, 'BigNumber': function, 'Unit': function}`