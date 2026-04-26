export interface Skill {
    name: string
    name_normalized: string     // lowercase, spaces — expand acronyms: "JS" → "javascript", "ML" → "machine learning"
    category: 'technology' | 'relational' | 'domain' | 'ability'
    mention: Array<'about_company' | 'about_position' | 'requirements' | 'responsibilities' | 'preferred_qualifications'>
    importance: 1 | 2 | 3 | 4 | 5  // 1 = nice to have, 5 = must have
}

export type BenefitCategory =
    'retirement' |      // 401k, pension
    'health' |          // medical, dental, vision
    'pto' |             // vacation, sick leave, holidays
    'parental_leave' |  // maternity, paternity, adoption
    'equity' |          // stock options, RSUs, ESPP
    'bonus' |           // performance, sign-on, annual
    'wellness' |        // gym, mental health, EAP
    'learning' |        // tuition, conferences, certifications
    'remote_stipend' |  // home office, internet allowance
    'meals' |           // food, snacks, catering
    'commuter' |        // transit, parking
    'insurance' |       // life, disability, pet
    'other'

export interface Benefit {
    category: BenefitCategory
    description: string     // verbatim text from JD
}

export interface WorkSetting {
    policy: 'remote' | 'hybrid' | 'onsite' | 'flexible'
    office_days_per_week_min?: number   // hybrid: "2-3 days/week" → 2
    office_days_per_week_max?: number   // hybrid: "2-3 days/week" → 3
    anchor_days?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'>  // required in-office days if specified
    location?: string                   // city/region as written in JD
    geo_restrictions?: string[]         // e.g. ["must reside in US", "EST timezone required"]
    relocation_required?: boolean
    travel_percent_max?: number         // e.g. 25 for "up to 25% travel"
    policy_text?: string                // verbatim work setting text from JD for reference
}