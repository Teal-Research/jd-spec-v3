import OpenAI from 'openai'
import { readFileSync, writeFileSync } from 'fs'
import 'dotenv/config'

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
})

async function enrichJD(extractedPath: string) {
    const openroutermodel = 'openai/gpt-oss-safeguard-20b'
    const model = openroutermodel.split('/')[1]

    const extractedRaw = readFileSync(extractedPath, 'utf-8')
    const enrichmentSchema = readFileSync('types/enriched.ts', 'utf-8')
    const promptTemplate = readFileSync('prompts/enrich.md', 'utf-8')

    const prompt = promptTemplate
        .replace('{{ENRICHMENT_SCHEMA}}', enrichmentSchema)
        .replace('{{EXTRACTED_JD}}', extractedRaw)

    const start = Date.now()
    const response = await client.chat.completions.create({
        model: openroutermodel,
        messages: [{ role: 'user', content: prompt }],
    })
    const duration_ms = Date.now() - start

    const content = response.choices[0].message.content
    const cleaned = content!.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    const result = JSON.parse(cleaned)

    // update _meta with enrichment run info
    result._meta = {
        ...result._meta,
        enriched_with: openroutermodel,
        enriched_at: new Date().toISOString(),
        enrich_duration_ms: duration_ms,
        enrich_tokens_in: response.usage?.prompt_tokens ?? null,
        enrich_tokens_out: response.usage?.completion_tokens ?? null,
    }

    return { result, model }
}

const extractedPath = process.argv[2] ?? 'examples/openai-eng-gpt-oss-safeguard-20b.json'

enrichJD(extractedPath)
    .then(({ result, model }) => {
        const outPath = extractedPath.replace('.json', `-enriched.json`)
        writeFileSync(outPath, JSON.stringify(result, null, 2))
        console.log(`Saved to ${outPath}`)
        console.log(`  enriched_with: ${result._meta.enriched_with}`)
        console.log(`  duration: ${result._meta.enrich_duration_ms}ms`)
        console.log(`  tokens: ${result._meta.enrich_tokens_in} in / ${result._meta.enrich_tokens_out} out`)
    })
    .catch(err => console.error('Error:', err))
