import { ints, openAoC, roughParse } from '../../../lib/input/openAoC';
import { InclusiveRange } from '../../../lib/math/InclusiveRange';
import { intersect, only, prod, reduction, sum, transpose } from '../../../lib/math/settools';

const blocks = openAoC('./2020/input/day16input.txt', ['\n\n']);

const ticketRules = roughParse(blocks[0], ['\n', ': '])
    .map(([title, conditions]) => ({
        title,
        conditions: roughParse(conditions, [' or ', '-'], ints).map(([min, max]) => new InclusiveRange(min, max))
    }));

const nearbyTickets = roughParse(blocks[2].split(':\n')[1], ['\n', ','], ints);

const validRanges = ticketRules.flatMap(tr => tr.conditions);
const completelyInvalidFields = nearbyTickets.flat().filter(v => !validRanges.some(r => r.contains(v)));

console.log(sum(completelyInvalidFields)); // 23925

const myTicket = roughParse(blocks[1].split(':\n')[1], [','], ints);

// compute all possible fields each value could validate as
const possibleFieldTitlesOnTickets = nearbyTickets.map(ticket =>
    // for each value on the ticket
    ticket.map(field =>
        ticketRules
            // find all fields that value would be valid for
            .filter(tr => tr.conditions.some(c => c.contains(field)))
            // and get that field's title
            .map(tr => tr.title)
    )
).filter(fvs => !fvs.some(fv => fv.length === 0)); // filter invalid tickets

// The possible titles for each field is the intersection of each field's possible values
// among all tickets
const possibleFieldTitles = transpose(possibleFieldTitlesOnTickets)
    .map(allPossibilities => reduction(allPossibilities, intersect));

// There should only be one possible arragement
// i.e. For each set of possibilities, there is a set one smaller than it which includes all possibilities except
// the true value
const fieldTitles = possibleFieldTitles.map(pfts => {
    if (pfts.length === 1) return pfts;
    const exclusionSet = possibleFieldTitles.find(fts => fts.length === pfts.length - 1);
    if (!exclusionSet) return pfts;
    return pfts.filter(ft => !exclusionSet.includes(ft));
}).map(ft => only(ft));

const relevantFields = myTicket.filter((_, i) => fieldTitles[i].startsWith('departure'));

console.log(prod(relevantFields)); // 964373157673
