import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({region: "us-east-1"});

const command = new ConverseCommand({
    modelId: "google.gemma-3-27b-it",

    messages: [
        {
            role: "user",
            content:[
                {text: "Hello"}
            ]
        }
    ]
});

const response = await client.send(command);

console.log(
  response.output?.message?.content?.[0]?.text
);