import { Skill, WorkSetting, Benefit } from './shared'

export interface ExtractedJD {
    // Job identity
    job_title: string
    company_name: string
    company_industry?: string
    department?: string
    seniority: 'intern' | 'entry' | 'mid' | 'senior' | 'director' | 'executive'
    employment_type: 'full_time' | 'part_time' | 'contract' | 'internship'
    is_management?: boolean             // true if role has direct reports

    // Location & logistics
    work_setting: WorkSetting

    // The role itself
    role_summary?: string               // opening paragraph describing the position
    responsibilities: string[]          // what you'll do, as bullet points
    requirements: string[]              // must-haves, as bullet points
    preferred_qualifications?: string[] // nice-to-haves, as bullet points

    // Hard requirements
    experience_years_min?: number       // "5+ years" → 5
    education?: 'high_school' | 'bachelors' | 'masters' | 'phd' | 'equivalent_accepted'
    visa_sponsorship: 'yes' | 'no' | 'unknown'

    // Compensation
    salary_min?: number
    salary_max?: number
    salary_currency?: string            // USD, GBP, EUR, etc.
    salary_interval?: 'hourly' | 'annual'
    equity_offered?: boolean

    // Benefits
    benefits?: Benefit[]

    // Skills
    skills: Skill[]
}