// Parse period strings or year
function parsePeriod(period) {
    const p = period.toString().trim();
    // Single year (e.g., '2018')
    if (/^\d{4}$/.test(p)) {
        const y = parseInt(p, 10);
        return { fromYear: y, toYear: y };
    }
    const lower = p.toLowerCase();
    // Decade (e.g., '2010s')
    const dec = lower.match(/(\d{4})s/);
    if (dec) {
        const y = parseInt(dec[1], 10);
        return { fromYear: y, toYear: y + 9 };
    }
    // Recent (last 5 years)
    if (lower.includes('recent') || lower.includes('lately')) {
        const now = new Date().getFullYear();
        return { fromYear: now - 5, toYear: now };
    }
    // Fallback: 2000 to current year
    const now = new Date().getFullYear();
    return { fromYear: 2000, toYear: now };
}


module.exports = parsePeriod;