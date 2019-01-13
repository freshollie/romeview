# Romeview

A React front-end to the `romegen` api.

Used to translate decimal numbers to roman numerals and vice-versa.

I chose to make the front-end dumb and perform all validation checks server-side.
I understand how it would make sense to perform some validation on the client
but I assumed for this it would be unnessesary.

Romeview is designed to scale to all device sizes.

I am not a UX/UI designer, so it is hard for me to decide what layout looks good.
However I am experienced with writing CSS, and I have hopefully demonstrated my
ability here to implement modular CSS for components.

This is also my first React application, so please understand any mistakes
I might have made in regards to convention.

## Improvements

Debounce api requests. At the moment any keystroke makes a request to the API, which could
prove to be unsustainable. A better approach would be to only make requests once the user stops typing
though this would be slightly less interactive.

## Running

Start the `romegen` server. By default, this front-end points to
localhost for the api, so ensure that it is running on the same machine.

1. `yarn` to install all required dependencies
2. `yarn start` to start in development mode

## Testing

TDD has been implemented in this project, ensuring full code coverage.

`yarn test` should be used to run tests.

Tests also runs linting checks, ensuring consitent code.
