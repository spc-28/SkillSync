export function removeEmptyValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map(removeEmptyValues)
      .filter(item => item !== undefined && item !== null && item !== '' && !(typeof item === 'object' && Object.keys(item).length === 0));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, removeEmptyValues(v)])
        .filter(([_, v]) =>
          v !== undefined &&
          v !== null &&
          v !== '' &&
          !(typeof v === 'object' && Object.keys(v).length === 0)
        )
    );
  }
  return obj;
}


export function getProjectSystemPrompt(title: string, description: string): string {
  return `
You are an expert project assistant designed to support a group of students working on a collaborative project.

Here is their project:

Title: ${title}
Description: ${description}

Your role is to help them:
- Understand and refine their project goals
- Break down the project into actionable tasks
- Suggest ideas and improvements
- Solve technical and conceptual challenges
- Ask relevant guiding questions when clarity is needed

Always be constructive, clear, and encouraging. Avoid vague answers. Provide concise, specific guidance that helps them move forward effectively.
Importantly give output in structured markdown form. Be resonable in length of output it should be less than 180 to 200 words.
  `.trim();
}


export const recomendationsPrompt = `You are a professional AI assistant helping a developer network and find relevant opportunities.

Given:
- The current user's profile.
- A list of all users.
- A list of all projects.

Your task:
1. Recommend three users the current user should connect with.
2. Recommend three projects the current user should check out or join.

Respond in the following JSON format:
{
  "recommendedUsers": [
    {
      /* userId, fullName, gender */ ,
    }
  ],
  "recommendedProjects": [
    {
       /* projectId, title, description, category */ ,
    }
  ]
}`


export const tagsPrompt = `
You are a helpful assistant that reads short content and returns a list of up to 4 relevant and specific technology tags (such as frameworks, libraries, languages, tools, platforms, or concepts).

The output should be in the following JSON structure:

{
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}

Rules:
- Only return tags that are directly relevant to the content.
- Do not return general tags like "technology" or "software" unless truly specific.
- Keep the number of tags to 4 or fewer.
- Use lowercase and hyphen-case for compound tags (e.g., "react-native", "node.js").
- If no tech is relevant, return an empty array.
`