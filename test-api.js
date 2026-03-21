#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n' + '='.repeat(60))
console.log('🔍 Google Gemini API - Model Tester')
console.log('='.repeat(60) + '\n')

// Load .env.local
let apiKey = process.env.GOOGLE_GEMINI_API_KEY

if (!apiKey) {
  try {
    const envPath = join(__dirname, '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key.trim() === 'GOOGLE_GEMINI_API_KEY') {
          apiKey = valueParts.join('=').trim()
          break
        }
      }
    }
  } catch (error) {
    console.error('Could not load .env.local:', error.message)
  }
}

if (!apiKey) {
  console.error('❌ ERROR: GOOGLE_GEMINI_API_KEY not found!')
  console.error('\nPlease set it in .env.local or environment')
  process.exit(1)
}

console.log('✅ API Key found\n')

// Test the API and list available models
async function testAPI() {
  try {
    console.log('📡 Connecting to Google Gemini API...\n')

    // Try listing models
    console.log('Fetching available models...\n')
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    )

    if (!listResponse.ok) {
      const error = await listResponse.json()
      console.error('❌ Failed to list models:', error.error.message)
      return
    }

    const modelsData = await listResponse.json()
    const models = modelsData.models || []

    console.log(`Found ${models.length} available models:\n`)

    models.forEach((model) => {
      const name = model.name.replace('models/', '')
      const supported = model.supportedGenerationMethods || []
      const hasGenerateContent = supported.includes('generateContent')
      const status = hasGenerateContent ? '✅' : '❌'
      console.log(`${status} ${name}`)
      if (hasGenerateContent) {
        console.log(`   Supports: generateContent`)
      } else {
        console.log(`   Methods: ${supported.join(', ') || 'none'}`)
      }
    })

    // Test with recommended model
    console.log('\n' + '='.repeat(60))
    console.log('Testing with recommended model...\n')

    const testModel = 'gemini-2.5-flash'
    console.log(`Testing: ${testModel}`)

    const testResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${testModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: 'Say "Hello" if you can read this.'
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.7
          }
        })
      }
    )

    if (testResponse.ok) {
      const result = await testResponse.json()
      const reply = result.candidates?.[0]?.content?.parts?.[0]?.text
      console.log('\n✅ API is working!')
      console.log(`Response: "${reply}"\n`)
      console.log('='.repeat(60))
      console.log('✨ Your setup is ready to use!')
      console.log('='.repeat(60))
    } else {
      const error = await testResponse.json()
      console.error(`\n❌ Model test failed:`)
      console.error(`Status: ${testResponse.status}`)
      console.error(`Message: ${error.error?.message}`)

      // Suggest alternative
      const workingModel = models.find(m => {
        const name = m.name.replace('models/', '')
        return m.supportedGenerationMethods?.includes('generateContent') &&
               name.includes('flash')
      })

      if (workingModel) {
        console.log(`\n💡 Try using: ${workingModel.name.replace('models/', '')}`)
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testAPI().then(() => {
  process.exit(0)
}).catch(() => {
  process.exit(1)
})
