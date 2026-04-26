import OpenAI from 'openai'
import { readFileSync, writeFileSync } from 'fs'
import 'dotenv/config'

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  })

async function extractJD(jdText: string){
    const model = 'anthropic/claude-sonnet-4-5'
    const promptTemplate = readFileSync('prompts/extract.md', 'utf-8');
    const prompt = promptTemplate.replace('{{JD_TEXT}}', jdText);

    const response = await client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
    })

    const content = response.choices[0].message.content
    const cleaned = content!.replace(/^```json\n?/, '').replace(/\n?```$/, '')

    return { result: JSON.parse(cleaned), model }
}

const jdText = readFileSync('sample-jds/openai-engineer.md', 'utf-8')

extractJD(jdText)
  .then(({ result, model }) => {
    const file = `examples/sample-output-${model.replace('anthropic/', '')}.json`
    writeFileSync(file, JSON.stringify(result, null, 2))
    console.log(`Saved to ${file}`)
  })
  .catch(err => console.error('Error:', err))
