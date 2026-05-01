import { ReplyTemplateVariables } from './types';

const TOKEN_REGEX = /{{\s*(customerName|storeName|rating|reviewText)\s*}}/g;

export function renderTemplate(template: string, variables: ReplyTemplateVariables): string {
  return template.replace(TOKEN_REGEX, (_, key: keyof ReplyTemplateVariables) => String(variables[key] ?? ''));
}

export function containsBannedWord(text: string, bannedWords: string[]): boolean {
  const lowered = text.toLowerCase();
  return bannedWords.some((word) => lowered.includes(word.toLowerCase()));
}
