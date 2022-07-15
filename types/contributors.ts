export interface RawContributorData {
  author: string;
  total_contributions: number;
  first_contribution: string;
  last_contribution: string;
  clans_contributed_to: string;
}

export interface ProcessedContributorData {
  author: string;
  total_contributions: number;
  contribution_range: {
    start: Date;
    end: Date;
  };
  clans_contributed_to: string[];
}
