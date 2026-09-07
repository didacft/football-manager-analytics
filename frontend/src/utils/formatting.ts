export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `€${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `€${(amount / 1_000).toFixed(0)}K`;
  }

  return `€${amount.toLocaleString()}`;
}

export function formatFullCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatStat(
  value: number | undefined,
  decimals = 2
): string {
  if (value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return value.toFixed(decimals);
}

export function getClubBadge(clubName: string): string {
  const clubBadges: Record<string, string> = {
    'Manchester City': 'https://media.api-sports.io/football/teams/50.png',
    'Real Madrid': 'https://media.api-sports.io/football/teams/541.png',
    'FC Barcelona': 'https://media.api-sports.io/football/teams/529.png',
    'Arsenal FC': 'https://media.api-sports.io/football/teams/42.png',
    'Liverpool FC': 'https://media.api-sports.io/football/teams/40.png',
    'Bayern Munich': 'https://media.api-sports.io/football/teams/157.png',
    'Paris Saint-Germain': 'https://media.api-sports.io/football/teams/85.png',
    'Inter Milan': 'https://media.api-sports.io/football/teams/505.png',
    'Bayer Leverkusen': 'https://media.api-sports.io/football/teams/168.png',
    'Borussia Dortmund': 'https://media.api-sports.io/football/teams/165.png',
    'Real Sociedad': 'https://media.api-sports.io/football/teams/548.png',
  };

  return clubBadges[clubName] || '';
}

export function getValueCategory(): {
  label: string;
  badgeColor: string;
  description: string;
} {
  return {
    label: 'Scouting candidate',
    badgeColor:
      'bg-slate-700/40 text-slate-300 border-slate-600/40',
    description:
      'Automated valuation classification will be added once the model is implemented.',
  };
}