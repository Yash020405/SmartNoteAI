import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' }, 
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey || openRouterApiKey.includes('your-') || openRouterApiKey === '') {
      console.log("No valid OpenRouter API key found, using fallback summarization");
      return generateFallbackSummary(text);
    }

    try {
      // Call OpenRouter API for summarization
      console.log("Calling OpenRouter API for summarization");
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', 
          'X-Title': 'Smart Notes App',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'system',
              content: `You are an expert summarizer that creates concise, insightful summaries of text content. 
              
Follow these guidelines when creating summaries:
1. Identify the most important concepts, arguments, or ideas in the text
2. Highlight any key conclusions or findings
3. Maintain objectivity and preserve the original meaning
4. Use clear, concise language that captures the essence of the text
5. Create a summary that would help someone quickly understand the main points
6. Aim for 2-4 sentences that provide a comprehensive overview
7. Include the most significant details without unnecessary information

Your summary should be informative, accurate, and reflect the original content's tone and purpose.`
            },
            {
              role: 'user',
              content: `Please provide a concise and insightful summary of the following text:

${text}

Focus on the key points and main ideas that someone would need to understand the content quickly.`
            }
          ],
          max_tokens: 200,
          temperature: 0.3,
        }),
        // Add timeout to avoid hanging requests
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenRouter API error:", errorData);
        return generateFallbackSummary(text);
      }

      const data = await response.json();
      
      // Extract the summary from OpenRouter response
      const summary = data.choices?.[0]?.message?.content || 'Unable to generate summary';

      return NextResponse.json({ summary });
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      return generateFallbackSummary(text);
    }
  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: 'Failed to summarize text' },
      { status: 500 }
    );
  }
}

// Backup function that generates a basic summary without external API
async function generateFallbackSummary(text: string) {
  console.log("Using fallback summary generation");
  
  try {
    // Generate a simple summary by extracting key sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let summary = '';
    
    if (sentences.length <= 3) {
      // If we have 3 or fewer sentences, use the first one
      summary = sentences[0].trim();
    } else {
      // Extract first sentence, a middle sentence, and the last sentence
      const firstSentence = sentences[0].trim();
      const middleSentence = sentences[Math.floor(sentences.length / 2)].trim();
      const lastSentence = sentences[sentences.length - 1].trim();
      
      summary = `${firstSentence}. ${middleSentence}. ${lastSentence}.`;
    }
    
    // Ensure the summary isn't too long
    if (summary.length > 300) {
      summary = summary.substring(0, 297) + '...';
    }
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in fallback summary generation:', error);
    // Return a generic message if everything fails
    return NextResponse.json({ 
      summary: 'This note contains important information. Review the full content for details.'
    });
  }
} 