import OpenAI from 'openai'
import { readFileSync, writeFileSync } from 'fs'
import 'dotenv/config'

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  })

async function extractJD(jdText: string){
    const openroutermodel = 'openai/gpt-oss-safeguard-20b'
    const model = openroutermodel.split('/')[1]
    
    //Get the Schemas
    const sharedSchema = readFileSync('types/shared.ts', 'utf-8');
    const extractedSchema = readFileSync('types/extracted.ts', 'utf-8');
    
    //Get Prompt
    const promptTemplate = readFileSync('prompts/extract.md', 'utf-8');

    //loads the JD
    const prompt = promptTemplate
        .replace('{{SCHEMA}}', sharedSchema + '\n\n' + extractedSchema)
        .replace('{{JD_TEXT}}', jdText)

    const response = await client.chat.completions.create({
        model: openroutermodel,
        messages: [{ role: 'user', content: prompt }],
    })

    const content = response.choices[0].message.content
    const cleaned = content!.replace(/^```json\n?/, '').replace(/\n?```$/, '')

    return { result: JSON.parse(cleaned), model }
}

const jdText = readFileSync('sample-jds/openai-engineer.md', 'utf-8')

extractJD(jdText)
  .then(({ result, model }) => {
    const file = `examples/openai-eng-${model}.json`
    writeFileSync(file, JSON.stringify(result, null, 2))
    console.log(`Saved to ${file}`)
  })
  .catch(err => console.error('Error:', err))
