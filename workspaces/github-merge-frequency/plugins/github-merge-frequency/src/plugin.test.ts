import { githubMergeFrequencyPlugin } from './plugin';

describe('github-merge-frequency', () => {
  it('should export plugin', () => {
    expect(githubMergeFrequencyPlugin).toBeDefined();
  });
});
