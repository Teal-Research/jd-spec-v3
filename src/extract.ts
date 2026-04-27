import OpenAI from 'openai'
import { readFileSync, writeFileSync } from 'fs'
import 'dotenv/config'

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
})

async function fetchCost(generationId: string): Promise<number | null> {
    const res = await fetch(`https://openrouter.ai/api/v1/generation?id=${generationId}`, {
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
    })
    const data = await res.json() as { data?: { total_cost?: number } }
    if (!res.ok) {
        console.error('fetchCost error:', JSON.stringify(data))
        return null
    }
    return data?.data?.total_cost ?? null
}

export async function extractJD(jdText: string, jdFile: string) {
    const openroutermodel = 'openai/gpt-oss-safeguard-20b'
    const model = openroutermodel.split('/')[1]

    const sharedSchema = readFileSync('types/shared.ts', 'utf-8')
    const extractedSchema = readFileSync('types/extracted.ts', 'utf-8')
    const promptTemplate = readFileSync('prompts/extract.md', 'utf-8')

    const prompt = promptTemplate
        .replace('{{SCHEMA}}', sharedSchema + '\n\n' + extractedSchema)
        .replace('{{JD_TEXT}}', jdText)

    const start = Date.now()
    const response = await client.chat.completions.create({
        model: openroutermodel,
        messages: [{ role: 'user', content: prompt }],
    })
    const duration_ms = Date.now() - start

    const content = response.choices[0].message.content
    const cleaned = content!.replace(/^```json\n?/, '').replace(/\n?```$/, '')

    const cost_usd = await fetchCost(response.id)

    const stats = {
        model: openroutermodel,
        jd_source: jdFile,
        timestamp: new Date().toISOString(),
        duration_ms,
        tokens_in: response.usage?.prompt_tokens ?? null,
        tokens_out: response.usage?.completion_tokens ?? null,
        tokens_total: response.usage?.total_tokens ?? null,
        cost_usd,
    }

    return { result: JSON.parse(cleaned), model, stats }
}

if (process.argv[1]?.endsWith('extract.ts')) {
    const jdFile = 'sample-jds/openai-engineer.md'
    const jdText = readFileSync(jdFile, 'utf-8')
    extractJD(jdText, jdFile)
        .then(({ result, model, stats }) => {
            const ts = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
            const file = `examples/${ts}-openai-eng-${model}.json`
            writeFileSync(file, JSON.stringify({ ...result, _meta: stats }, null, 2))
            console.log(`Saved to ${file}`)
            console.log(`  model:    ${stats.model}`)
            console.log(`  duration: ${stats.duration_ms}ms`)
            console.log(`  tokens:   ${stats.tokens_in} in / ${stats.tokens_out} out`)
            console.log(`  cost:     $${stats.cost_usd != null ? stats.cost_usd.toFixed(8) : 'unknown'}`)
        })
        .catch(err => console.error('Error:', err))
}
