import { BagRule, BagRuleSet, parseBagRule } from './BagRuleSet';

const testText =
    'light red bags contain 1 bright white bag, 2 muted yellow bags.\n' +
    'dark orange bags contain 3 bright white bags, 4 muted yellow bags.\n' +
    'bright white bags contain 1 shiny gold bag.\n' +
    'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.\n' +
    'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.\n' +
    'dark olive bags contain 3 faded blue bags, 4 dotted black bags.\n' +
    'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.\n' +
    'faded blue bags contain no other bags.\n' +
    'dotted black bags contain no other bags.\n';

const parsedTestText: BagRule[] = [
    { color: 'light red', contains: [{ amount: 1, color: 'bright white' }, { amount: 2, color: 'muted yellow' }] },
    { color: 'dark orange', contains: [{ amount: 3, color: 'bright white' }, { amount: 4, color: 'muted yellow' }] },
    { color: 'bright white', contains: [{ amount: 1, color: 'shiny gold' }] },
    { color: 'muted yellow', contains: [{ amount: 2, color: 'shiny gold' }, { amount: 9, color: 'faded blue' }] },
    { color: 'shiny gold', contains: [{ amount: 1, color: 'dark olive' }, { amount: 2, color: 'vibrant plum' }] },
    { color: 'dark olive', contains: [{ amount: 3, color: 'faded blue' }, { amount: 4, color: 'dotted black' }] },
    { color: 'vibrant plum', contains: [{ amount: 5, color: 'faded blue' }, { amount: 6, color: 'dotted black' }] },
    { color: 'faded blue', contains: [] },
    { color: 'dotted black', contains: [] },
];

describe('parseBagRule', () => {
    it('should throw an error when given an invalid bag rule line', () => {
        const testFn = () => parseBagRule('this isnt even a rule.');

        expect(testFn).toThrowError();
    });

    it('should throw an error when given malformed bag contents', () => {
        const testFn = () => parseBagRule('test bags contain this isnt even bag contents.');

        expect(testFn).toThrowError();
    });

    it('should extract the color and give no contents for bags that contain nothing', () => {
        const result = parseBagRule('test bags contain no other bags.');

        const expectedResult: BagRule = {
            color: 'test',
            contains: [],
        };

        expect(result).toStrictEqual(expectedResult);
    });

    it('should extract the color and a single content for bags that contain one thing', () => {
        const result = parseBagRule('test bags contain 1 other bag.');

        const expectedResult: BagRule = {
            color: 'test',
            contains: [{
                amount: 1,
                color: 'other',
            }],
        };

        expect(result).toStrictEqual(expectedResult);
    });

    it('should extract the color and multiple contents for bags that contian multiple things', () => {
        const result = parseBagRule('test bags contain 2 other bags, 1 last bag.');

        const expectedResult: BagRule = {
            color: 'test',
            contains: [{
                amount: 2,
                color: 'other',
            }, {
                amount: 1,
                color: 'last',
            }],
        };

        expect(result).toStrictEqual(expectedResult);
    });

    it('should pass the given test cases', () => {
        const testCases = testText.split('\n').filter(l => l !== '');
        const results = testCases.map(parseBagRule);

        expect(results).toStrictEqual(parsedTestText);
    });
});

describe('BagRuleSet', () => {
    describe('constructor', () => {
        it('should construct with the given rules', () => {
            const result = new BagRuleSet([parseBagRule('test bags contain 1 other bag.')]);

            expect(result).toBeDefined();
        });

        it('should construct with no rules', () => {
            const result = new BagRuleSet([]);

            expect(result).toBeDefined();
        });
    });

    describe('fromText', () => {
        it('should create a BagRuleSet with the rules given in the text', () => {
            const result = BagRuleSet.fromText(testText);

            expect(result.rules).toStrictEqual(parsedTestText);
        });

        it('should throw an error if the rules text is malformed', () => {
            const testFn = () => BagRuleSet.fromText('not even a rule set');

            expect(testFn).toThrowError();
        });
    });

    describe('parents', () => {
        const ruleSet = BagRuleSet.fromText(testText);

        it('should get the list of bags that can directly contain the given color', () => {
            const result = ruleSet.parentsOf('shiny gold');

            expect(result).toStrictEqual(['bright white', 'muted yellow']);
        });

        it('should return an empty list for a top-level bag color', () => {
            const result = ruleSet.parentsOf('light red');

            expect(result).toStrictEqual([]);
        });

        it('should return an empty list for a bag color that isn\'t part of any rule', () => {
            const result = ruleSet.parentsOf('not a color');

            expect(result).toStrictEqual([]);
        });
    });

    describe('ancestors', () => {
        const ruleSet = BagRuleSet.fromText(testText);

        it('should get the list of bags that can eventually contain the given color', () => {
            const result = ruleSet.ancestorsOf('shiny gold');

            expect(result.sort()).toStrictEqual(['bright white', 'muted yellow', 'dark orange', 'light red'].sort());
        });

        it('should return an empty list for a top-level bag color', () => {
            const result = ruleSet.ancestorsOf('light red');

            expect(result).toStrictEqual([]);
        });

        it('should return an empty list for a bag color that isn\'t part of any rule', () => {
            const result = ruleSet.ancestorsOf('not a color');

            expect(result).toStrictEqual([]);
        });
    });

    describe('totalBagsForColor', () => {
        const testRules =
            'shiny gold bags contain 2 dark red bags.\n' +
            'dark red bags contain 2 dark orange bags.\n' +
            'dark orange bags contain 2 dark yellow bags.\n' +
            'dark yellow bags contain 2 dark green bags.\n' +
            'dark green bags contain 2 dark blue bags.\n' +
            'dark blue bags contain 2 dark violet bags.\n' +
            'dark violet bags contain no other bags.\n';

        const ruleSet = BagRuleSet.fromText(testRules);

        it('should count the total number of bags required to bring a bag of a given color onto the plane', () => {
            const result = ruleSet.totalBagsForColor('shiny gold');

            // the test result given in the problem is 126, but they don't count the outermost bag and we do, so off-by-one
            expect(result).toBe(127);
        });

        it('should return 1 for a bag not in the rule set', () => {
            const result = ruleSet.totalBagsForColor('not a color');

            expect(result).toBe(1);
        });

        it('should return 1 for a bag that doesn\'t contain any other bags', () => {
            const result = ruleSet.totalBagsForColor('dark violet');

            expect(result).toBe(1);
        });
    });
});
