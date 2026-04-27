import { readFileSync, writeFileSync } from 'fs'
import 'dotenv/config'
import { extractJD } from './extract'
import { enrichJD } from './enrich'

const jdFile = process.argv[2] ?? 'sample-jds/openai-engineer.md'
const jdText = readFileSync(jdFile, 'utf-8')

console.log(`Processing: ${jdFile}`)

extractJD(jdText, jdFile)
    .then(({ result: extracted, stats }) => {
        console.log(`  extracted  — ${stats.duration_ms}ms, ${stats.tokens_in} in / ${stats.tokens_out} out`)
        return enrichJD({ ...extracted, _meta: stats })
    })
    .then(({ result }) => {
        const ts = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
        const modelSlug = result._meta.model.split('/')[1]
        const jdSlug = jdFile.replace('sample-jds/', '').replace('.md', '')
        const file = `examples/${ts}-${jdSlug}-${modelSlug}-full.json`
        writeFileSync(file, JSON.stringify(result, null, 2))
        console.log(`  enriched   — ${result._meta.enrich_duration_ms}ms, ${result._meta.enrich_tokens_in} in / ${result._meta.enrich_tokens_out} out`)
        console.log(`Saved to ${file}`)
    })
    .catch(err => console.error('Error:', err))
