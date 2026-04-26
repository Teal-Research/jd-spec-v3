You are a job description parser. 
Extract structured data from the job description below and return valid JSON matching this schema:

```typescript
export interface Skill {
    name: string
    name_normalized : string 
    category : 'technology' | 'relational' | 'domain' | 'ability'
    mention : Array<'about_company' | 'about_position' | 'requirements' | 'responsibilities' | 'preferred_qualifications'>
    importance: 1 | 2 | 3 | 4 | 5  // 1 = nice to have, 5 = must have
}

export interface ExtractedJD {
    job_title : string
    company_name : string
    seniority: 'intern' | 'entry' | 'mid' | 'senior' | 'director' | 'executive'
    work_setting: 'remote' | 'hybrid' | 'onsite'
    skills: Skill[]
}
```

Rules:
- Return only valid JSON, no explanation
- If a field cannot be determined from the JD, omit it
- For skills, extract every distinct skill mentioned anywhere in the JD

Job description:
{{JD_TEXT}}