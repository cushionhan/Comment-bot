export type RuleTemplate = {
  id: string;
  text: string;
};

export type RatingTemplateMap = Partial<Record<1 | 2 | 3 | 4 | 5, RuleTemplate[]>>;

export type KeywordRule = {
  keyword: string;
  templates: RuleTemplate[];
};

export type ReplyRuleConfig = {
  ratingTemplates: RatingTemplateMap;
  keywordRules: KeywordRule[];
  defaultTemplates: RuleTemplate[];
  bannedWords: string[];
};

export type ReplyTemplateVariables = {
  customerName: string;
  storeName: string;
  rating: number;
  reviewText: string;
};
