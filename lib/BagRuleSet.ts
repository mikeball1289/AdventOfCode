import { uniq } from './math/settools';

export interface BagContent {
    amount: number;
    color: string;
}

export interface BagRule {
    color: string;
    contains: BagContent[];
}

const bagRegex = /^([\w ]+) bags contain (.+)\.$/;
const contentRegex = /^(\d+) ([\w ]+) bags?$/;

function parseBagContent(line: string): BagContent {
    const contentMatch = line.match(contentRegex);
    if (!contentMatch) throw new Error(`"${line}" isn't a valid bag content`);
    const [, amount, color] = contentMatch;

    return {
        amount: parseInt(amount, 10),
        color,
    };
}

export function parseBagRule(line: string): BagRule {
    const lineMatch = line.match(bagRegex);
    if (!lineMatch) throw new Error(`"${line}" isn't a valid bag rule`);
    const [, color, contentLine] = lineMatch;
    if (contentLine === 'no other bags') {
        return {
            color,
            contains: [],
        };
    }
    const contains = contentLine.split(', ').map(parseBagContent);

    return {
        color,
        contains,
    };
}

export class BagRuleSet {
    constructor(public readonly rules: BagRule[]) { }

    static fromText(rulesText: string) {
        const rules = rulesText
            .split(/\r?\n/)
            .filter(l => l !== '')
            .map(parseBagRule);

        return new BagRuleSet(rules);
    }

    parentsOf(color: string): string[] {
        return this.rules
            .filter(r => r.contains.some(content => content.color === color))
            .map(r => r.color);
    }

    ancestorsOf(color: string): string[] {
        const parents = this.parentsOf(color);
        return uniq(parents.flatMap(p => this.ancestorsOf(p)).concat(parents));
    }

    /**
     * Compute the total number of bags that exist within the space of a single color.
     * This counds the bag itself along with all of the bags inside of it, and inside of
     * those and so on
     * @param color The root color of bag to start counting from
     */
    totalBagsForColor(color: string): number {
        const rule = this.rules.find(r => r.color === color);
        if (!rule) return 1;

        // add one so we count the current bag
        return 1 + rule.contains
            // get the total bags for each bag color inside this one, times the number of bags of that color
            .map(contents => this.totalBagsForColor(contents.color) * contents.amount)
            // sum up the totals
            .reduce((a, b) => a + b, 0);
    }
}
