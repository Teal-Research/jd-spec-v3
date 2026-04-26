import { ExtractedJD } from './extracted'

export interface EnrichedJD extends ExtractedJD {
    // Generated — not extracted from the JD text

    role_pitch: string              // 2-sentence compelling hook for the role
    ideal_candidate: string         // who this is really for, beyond the literal requirements

    role_synonyms: string[]         // other common titles for the same role at the same level
    typical_prior_roles: string[]   // titles people typically hold before this role
    typical_next_roles: string[]    // titles this role typically leads to

    comp_vs_market: 'above' | 'at' | 'below' | 'unknown'   // how compensation compares to market
    search_keywords: string[]       // terms a candidate would use to find this role
}
