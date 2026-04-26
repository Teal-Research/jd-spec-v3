import { Skill } from './shared';


export interface ExtractedJD {
    job_title : string
    company_name : string
    seniority: 'intern' | 'entry' | 'mid' | 'senior' | 'director' | 'executive'
    work_setting: 'remote' | 'hybrid' | 'onsite'
    skills: Skill[]
}