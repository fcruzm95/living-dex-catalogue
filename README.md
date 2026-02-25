# living-dex-catalogue

Living pokedex Catalogue

This app will be a standalone react app.
This is a Living Pokedex Catalogue for the first generation pokemon games.
It will have a box view in which you can see all of the pokemon sprites separated in boxes.
As the boxes in gen 1 have a capacity of 20, this will be shown in the interface.
There will be 3 states:

- not caught
- caught
- have another stage

Box 1
[1, 2, 3, 4, 5]
[6, 7, 8, 9, 10]
[11, 12, 13, 14, 15]
[16, 17, 18, 19, 20]
...
Box N

## API

It will use the PokeAPI for data fetching.

## Hexagonal Architecture

This app will follow the principles of hexagonal architecture just for the front end.

- Separation of concerns
- Dependency rule
- Ports & Adapters
- Interchangeability

## Testing

Will try to use TDD for testing implementation.

## Features

- [ ] Has a list of pokemon ordered by dex number.
- [ ] You can select which pokemon have you catched.
- [ ] It will have persistance in-app.
- [ ] It will have tests for the domain level entities.
