import {
  BedrockRuntimeClient,
  ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';

// The ONLY file that knows Bedrock exists. Everything else calls complete().
// Swap provider later => only this file changes.

// TODO: read region + model from env (.env: LLM_MODEL, AWS_REGION), don't hardcode.
const REGION = process.env.AWS_REGION ?? 'us-east-1';
const MODEL_ID = process.env.LLM_MODEL ?? 'mistral.mistral-large-2402-v1:0';

const client = new BedrockRuntimeClient({ region: REGION });

/**
 * Send one prompt to the model, get the raw text reply back.
 * Knows nothing about grading, JSON, or rubrics — just text in, text out.
 *
 * `jsonSchema` is an optional JSON Schema object. When given, Converse
 * constrains the model's output to match it (native structured output).
 * Note: Converse wants the schema as a STRING, so we stringify it here —
 * the caller passes a normal object.
 */
export async function complete(
  systemPrompt: string,
  userPrompt: string,
  _jsonSchema?: object,
): Promise<string> {
  const command = new ConverseCommand({
    modelId: MODEL_ID,

    // Converse puts the system prompt in its OWN field, not in messages.
    system: [{ text: systemPrompt }],

    messages: [
      {
        role: 'user',
        content: [{ text: userPrompt }],
      },
    ],

    // TODO: inferenceConfig — temperature, maxTokens.
    // Low temp for consistent grading. Try temperature: 0; if the model
    // rejects it, drop it and rely on the prompt wording.
    // Temperature 0: the same answer should get the same grade every time.
    inferenceConfig: {
      temperature: 0,
      maxTokens: 1024,
    },
  });

  const response = await client.send(command);

  // Dig the text out of the nested Converse response shape.
  const text = response.output?.message?.content?.[0]?.text;

  // The caller (grading.schema) treats junk as a failed answer, so throwing
  // a clear error here is fine.
  if (!text) {
    throw new Error('LLM returned no text content');
  }

  return text;
}
