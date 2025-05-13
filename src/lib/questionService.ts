import { Question, LocalizedText, DisplayQuestion, LanguageCode, LocalizedAnswerOption } from '../types/question.types';

// Helper to resolve localized text, defaulting to English if the specified language or text itself is missing.
const resolveText = (localizedText: LocalizedText | undefined, lang: LanguageCode): string => {
  if (!localizedText) return '';
  return localizedText[lang] || localizedText.en || ''; // Default to English, then empty string
};

// Helper to resolve localized options
const resolveOptions = (
  localizedOptions: LocalizedAnswerOption[] | undefined,
  lang: LanguageCode
): { text: string; isCorrect: boolean }[] | undefined => {
  if (!localizedOptions) return undefined;
  return localizedOptions.map(opt => ({
    text: resolveText(opt.text, lang),
    isCorrect: opt.isCorrect,
  }));
};

/**
 * Fetches questions from the JSON data file and resolves their text fields
 * to the specified language.
 * Gracefully handles mixed data where some questions might be in the old single-language format.
 * @param lang The language code (e.g., 'en', 'he') to resolve texts to.
 * @returns A promise that resolves to an array of DisplayQuestion objects.
 */
export const fetchAndResolveQuestions = async (lang: LanguageCode): Promise<DisplayQuestion[]> => {
  try {
    const response = await fetch('/data/questions.json'); // Path relative to public directory
    if (!response.ok) {
      console.error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }
    // Assuming the JSON contains an array of objects that are either Question or an older format.
    const questionsData: any[] = await response.json();

    const resolvedQuestions: DisplayQuestion[] = questionsData.map((qData: any): DisplayQuestion => {
      // Type assertion to help with mixed structure access
      const question = qData as Question; 
      const oldFormatQuestion = qData as { text: string, options?: {text: string, isCorrect: boolean}[], explanation?: string };

      let resolvedText: string;
      // Check if text is an object and has 'en' property (new localized format)
      if (typeof question.text === 'object' && question.text !== null && 'en' in question.text) {
        resolvedText = resolveText(question.text as LocalizedText, lang);
      } else {
        // Assume old string format (or malformed), treat as English or fallback
        resolvedText = oldFormatQuestion.text || ''; 
      }

      let resolvedOptions: { text: string; isCorrect: boolean }[] | undefined = undefined;
      if (question.options && question.options.length > 0) {
        // Check if the first option's text is an object (new localized format)
        if (typeof question.options[0].text === 'object' && question.options[0].text !== null && 'en' in question.options[0].text) {
          resolvedOptions = resolveOptions(question.options as LocalizedAnswerOption[], lang);
        } else {
          // Assume old format: {text: string, isCorrect: boolean}[]
          resolvedOptions = (oldFormatQuestion.options || []).map(opt => ({
            text: opt.text || '', // Fallback for text
            isCorrect: !!opt.isCorrect, // Ensure boolean
          }));
        }
      } else if (oldFormatQuestion.options) { // Handle case where options might be an empty array in old format
         resolvedOptions = (oldFormatQuestion.options || []).map(opt => ({
            text: opt.text || '',
            isCorrect: !!opt.isCorrect,
          }));
      }

      let resolvedExplanation: string | undefined;
      if (question.explanation) {
        // Check if explanation is an object (new localized format)
        if (typeof question.explanation === 'object' && question.explanation !== null && 'en' in question.explanation) {
          resolvedExplanation = resolveText(question.explanation as LocalizedText, lang);
        } else {
          // Assume old string format
          resolvedExplanation = oldFormatQuestion.explanation;
        }
      }

      return {
        id: question.id,
        topic: question.topic, // Topic is not localized in this iteration
        type: question.type,
        text: resolvedText,
        options: resolvedOptions,
        explanation: resolvedExplanation,
      };
    });

    return resolvedQuestions;
  } catch (error) {
    console.error("Error fetching or processing questions:", error);
    return []; // Return empty array on error as a fallback
  }
};

// Example of how this might be used (primarily for testing/dev purposes):
/*
const loadQuestions = async () => {
  console.log('Loading Hebrew questions...');
  const heQuestions = await fetchAndResolveQuestions('he');
  console.log('HE Questions:', heQuestions);

  console.log('\nLoading English questions...');
  const enQuestions = await fetchAndResolveQuestions('en');
  console.log('EN Questions:', enQuestions);

  // Test with a question that might be in old format (if q2/q3 weren't updated)
  console.log('\nEnglish Question (potentially old format ID q2):', 
    enQuestions.find(q => q.id === 'q2')
  );
  console.log('\nHebrew Question (potentially old format ID q2 - would fallback to EN if text was string):', 
    heQuestions.find(q => q.id === 'q2') 
  );
};

loadQuestions();
*/ 