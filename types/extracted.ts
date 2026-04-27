import { Skill, WorkSetting, Benefit } from './shared'

export interface ExtractedJD {
    // Job identity
    job_title: string
    department?: string
    seniority: 'intern' | 'entry' | 'mid' | 'senior' | 'director' | 'executive'
    employment_type: 'full_time' | 'part_time' | 'contract' | 'internship'
    is_management?: boolean             // true if role has direct reports
    
    // Company Information
    company_name: string
    company_url?: string                // company website — for Google Jobs hiringOrganization.sameAs
    company_industry?: string
    company_description?: string        // As described in the job description

    // Location & logistics
    work_setting: WorkSetting

    // The role itself
    role_summary?: string               // opening paragraph describing the position
    responsibilities: string[]          // what you'll do, as bullet points
    requirements: string[]              // must-haves, as bullet points
    preferred_qualifications?: string[] // nice-to-haves, as bullet points

    // Posting metadata
    job_identifier?: string             // ATS job ID (e.g. "REQ-12345") if present in JD
    date_posted?: string                // ISO date — from ATS or if stated in JD
    application_deadline?: string       // ISO date — "apply by" date if stated (Google: validThrough)

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