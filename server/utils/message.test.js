const expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        var from = 'Joe';
        var text = 'Some text';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message.from).toBe(from);
        expect(message.text).toBe(text);

        // store res in veriable
        // assert from match
        // assert text match
        // assert createdAt is a number
    });
});
