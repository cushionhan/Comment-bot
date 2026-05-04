import { containsBannedWord, renderTemplate } from './template-utils.js';
import { ReplyRuleConfig, ReplyTemplateVariables, RuleTemplate } from './types.js';

export type ReplyRuleInput = ReplyTemplateVariables;

export type ReplyRuleResult = {
  blocked: boolean;
  reason?: string;
  templateId?: string;
  renderedReply?: string;
};

export class ReplyRuleEngine {
  constructor(private readonly config: ReplyRuleConfig) {}

  evaluate(input: ReplyRuleInput): ReplyRuleResult {
    if (containsBannedWord(input.reviewText, this.config.bannedWords)) {
      return { blocked: true, reason: 'BANNED_WORD_DETECTED' };
    }

    const selectedTemplate =
      this.findByKeyword(input.reviewText) ??
      this.findByRating(input.rating) ??
      this.pickRandom(this.config.defaultTemplates);

    if (!selectedTemplate) {
      return { blocked: true, reason: 'NO_TEMPLATE_AVAILABLE' };
    }

    return {
      blocked: false,
      templateId: selectedTemplate.id,
      renderedReply: renderTemplate(selectedTemplate.text, input),
    };
  }

  private findByKeyword(reviewText: string): RuleTemplate | undefined {
    const lowered = reviewText.toLowerCase();
    const matchedRule = this.config.keywordRules.find((rule) => lowered.includes(rule.keyword.toLowerCase()));
    return matchedRule ? this.pickRandom(matchedRule.templates) : undefined;
  }

  private findByRating(rating: number): RuleTemplate | undefined {
    const ratingKey = this.normalizeRating(rating);
    const templates = this.config.ratingTemplates[ratingKey];
    return templates?.length ? this.pickRandom(templates) : undefined;
  }

  private normalizeRating(rating: number): 1 | 2 | 3 | 4 | 5 {
    const clamped = Math.min(5, Math.max(1, Math.round(rating)));
    return clamped as 1 | 2 | 3 | 4 | 5;
  }

  private pickRandom(templates: RuleTemplate[]): RuleTemplate | undefined {
    if (!templates.length) return undefined;
    const index = Math.floor(Math.random() * templates.length);
    return templates[index];
  }
}
