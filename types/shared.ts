export interface Skill {
    name: string
    name_normalized : string 
    category : 'technology' | 'relational' | 'domain' | 'ability'
    mention : Array<'about_company' | 'about_position' | 'requirements' | 'responsibilities' | 'preferred_qualifications'>
    importance: 1 | 2 | 3 | 4 | 5  // 1 = nice to have, 5 = must have
}