export interface Skill {
    name: string
    name_normalized: string     // lowercase, spaces — expand acronyms: "JS" → "javascript", "ML" → "machine learning"
    category: 'technology' | 'relational' | 'domain' | 'ability'
    mention: Array<'about_company' | 'about_position' | 'requirements' | 'responsibilities' | 'preferred_qualifications'>
    importance: 1 | 2 | 3 | 4 | 5  // 1 = nice to have, 5 = must have
}

export type BenefitCategory =
    'retirement' |       // 401k, pension, regional retirement plans
    'health' |           // bundled medical/healthcare package
    'dental' |           // dental coverage (when listed separately)
    'vision' |           // vision coverage (when listed separately)
    'pto' |              // vacation, sick leave, holidays, jury duty
    'bereavement' |      // bereavement / compassionate leave
    'parental_leave' |   // maternity, paternity, baby bonding
    'caregiver_leave' |  // leave to care for ill family member
    'fertility' |        // IVF, egg freezing, surrogacy, growing family support
    'adoption' |         // adoption assistance
    'childcare' |        // backup childcare, daycare support
    'eldercare' |        // elder care and support programs
    'equity' |           // stock options, RSUs, ESPP
    'bonus' |            // performance, sign-on, annual, commissions, referral
    'student_loan' |     // student loan reimbursement
    'wellness' |         // gym, mental health, EAP, massage, fitness classes
    'learning' |         // tuition, conferences, certifications, coaching
    'charitable_giving' |// donation matching, volunteer time off
    'legal' |            // legal services
    'remote_stipend' |   // home office cash allowance, internet reimbursement
    'equipment' |        // company-provided gear, laptop, peripherals
    'meals' |            // food, snacks, catering, on-site meals
    'commuter' |         // transit, parking
    'insurance' |        // life, disability, AD&D, pet, survivor income
    'other'

export interface Benefit {
    category: BenefitCategory
    description: string     // verbatim text from JD
}

export interface WorkSetting {
    policy: 'remote' | 'hybrid' | 'onsite' | 'remote_or_office'
    office_days_per_week_min?: number   // hybrid: "2-3 days/week" → 2
    office_days_per_week_max?: number   // hybrid: "2-3 days/week" → 3
    anchor_days?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'>  // required in-office days if specified
    location?: string                   // city/region as written in JD
    geo_restrictions?: string[]         // e.g. ["must reside in US", "EST timezone required"]
    relocation_required?: boolean
    travel_percent_max?: number         // e.g. 25 for "up to 25% travel"
    policy_text?: string                // verbatim work setting text from JD for reference
}