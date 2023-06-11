import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
    let pipe: TruncatePipe;

    beforeEach(() => {
        pipe = new TruncatePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should truncate text that is longer than the specified length', () => {
        const text = 'Lorem ipsum dolor sit amet';
        const length = 10;
        const truncatedText = pipe.transform(text, length);

        expect(truncatedText).toEqual('Lorem ipsu ...');
    });

    it('should not truncate text that is shorter than or equal to the specified length', () => {
        const text = 'Lorem ipsum dolor sit amet';
        const length = 50;
        const truncatedText = pipe.transform(text, length);

        expect(truncatedText).toEqual(text);
    });

    it('should use the default length and suffix if not provided', () => {
        const text = 'Lorem ipsum dolor sit amet';
        const truncatedText = pipe.transform(text);

        expect(truncatedText).toEqual('Lorem ipsum dolor sit amet');
    });

    it('should use pipe with undefined text',()=>{
        expect(pipe.transform()).toBeUndefined()
    });
});
