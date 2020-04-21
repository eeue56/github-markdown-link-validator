import * as lib from './lib';

test('links aren\'t found in empty text', () => {
    expect(lib.extractLinks('')).toStrictEqual([]);
});

test('a single link is found', () => {
    const text =
`
![some image](images/image.png)
[Some text](https://google.com)
`

    const outcome = ['[Some text](https://google.com)'];

    expect(lib.extractLinks(text)).toStrictEqual(outcome);
});


test('multiple links are found', () => {
    const text =
`
![some image](images/image.png) [Some text on the same line](https://google.com)
[Some text](https://google.com)
`

    const outcome = [
        '[Some text on the same line](https://google.com)',
        '[Some text](https://google.com)'
    ];

    expect(lib.extractLinks(text)).toStrictEqual(outcome);
});

test('relative links are found', () => {
    const text =
`
![some image](images/image.png) [Some text on the same line](https://google.com)
[Some text](src/README.md)
`

    const outcome = [
        '[Some text on the same line](https://google.com)',
        '[Some text](src/README.md)'
    ];

    expect(lib.extractLinks(text)).toStrictEqual(outcome);
});

test('relative links filter correctly', () => {
    const text =
`
![some image](images/image.png) [Some text on the same line](https://google.com)
[Some text](src/README.md)
[something on the page](#page)
`
    const links = lib.extractLinks(text);

    const outcome = [
        '[Some text](src/README.md)'
    ];

    expect(lib.relativeLinks(links)).toStrictEqual(outcome);
});

test('curly brackets inside brackets are ignored', () => {
    const text =
`
[Some text (with brackets inside the text)](src/README.md)
`
    const links = lib.extractLinks(text);
    const relativeLinks = lib.relativeLinks(links);
    const resourceLink = lib.linkUrl(relativeLinks[0]);

    const outcome = 'src/README.md';

    expect(resourceLink).toStrictEqual(outcome);
});
