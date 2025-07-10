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
