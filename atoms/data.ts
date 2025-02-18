export const taskTypeValues: Record<string, string> = {
  Feature: `<task-title>Develop new functionality</task-title>

<context>
- Implement using established patterns
- Maintain strict type safety
- Follow secure coding practices
- Include comprehensive tests
- Document public APIs
</context>`,

  Fix: `<task-title>Resolve software defect</task-title>

<context>
- Analyze root cause
- Verify fix across edge cases
- Add regression tests
- Preserve API contracts
- Document fix rationale
</context>`,

  Refactor: `<task-title>Improve code structure</task-title>

<context>
- Maintain existing behavior
- Enhance maintainability
- Reduce technical debt
- Update documentation
- Verify test coverage
</context>`,

  Performance: `<task-title>Optimize performance</task-title>

<context>
- Profile current behavior
- Identify bottlenecks
- Measure improvements
- Consider trade-offs
- Document optimizations
</context>`,

  Security: `<task-title>Enhance security</task-title>

<context>
- Follow security best practices
- Analyze attack vectors
- Handle sensitive data
- Add security tests
- Document mitigations
</context>`,

  Migration: `<task-title>Migrate codebase</task-title>

<context>
- Plan migration strategy
- Handle compatibility
- Update dependencies
- Verify functionality
- Document changes
</context>`,

  Review: `<task-title>Code review feedback</task-title>

<context>
- Check design patterns
- Verify error handling
- Review performance
- Assess security
- Suggest improvements
</context>`,

  Question: `<task-title>Provide technical guidance</task-title>

<context>
- Compare approaches
- Explain trade-offs
- Reference docs
- Show examples
- Consider context
</context>`,

  Doc: `<task-title>Update documentation</task-title>

<context>
- Maintain accuracy
- Improve clarity
- Add examples
- Update diagrams
- Verify completeness
</context>`,

  Test: `<task-title>Improve test coverage</task-title>

<context>
- Add missing tests
- Cover edge cases
- Test error paths
- Measure coverage
- Document test cases
</context>`,

  Architecture: `<task-title>Design system architecture</task-title>

<context>
- Consider scalability
- Plan for maintenance
- Document decisions
- Evaluate trade-offs
- Define interfaces
</context>`,

  Research: `<task-title>Technical research</task-title>

<context>
- Analyze options
- Compare solutions
- Consider constraints
- Provide examples
- Document findings
</context>`,

  Blog: `<task-title>Create technical content</task-title>

<context>
- Target audience level
- Use clear examples
- Include visuals/code
- Follow progression
- Verify accuracy
</context>`,

  Others: `<task-title>Handle custom request</task-title>

<context>
- Clarify requirements
- Propose solutions
- Consider constraints
- Highlight risks
- Document approach
</context>`,
};

export const customInstructionValues: Record<string, string> = {
  Default: `<output-format>
- Production-grade code
- Essential comments
- Clear type annotations
- Error handling
- Usage examples
</output-format>

<reasoning-process>
- Analyze requirements
- Consider alternatives
- Validate assumptions
- Check security
- Handle edge cases
</reasoning-process>`,

  "React/Next.js": `<technical-stack>
- React 18+/Next.js 14+
- TypeScript 5+
- Tailwind CSS
- Component libraries
</technical-stack>

<development-constraints>
- Component architecture
- Client/server split
- Performance patterns
- Accessibility
</development-constraints>

<output-requirements>
- Reusable components
- State management
- Error boundaries
- Loading states
- Responsive design
</output-requirements>`,

  "Node.js API": `<technical-stack>
- Node.js LTS
- TypeScript 5+
- REST/GraphQL
- Database ORM
</technical-stack>

<development-constraints>
- API versioning
- Request validation
- Error handling
- Performance
</development-constraints>

<output-requirements>
- RESTful endpoints
- Input validation
- Error responses
- API documentation
- Security headers
</output-requirements>`,

  Database: `<technical-requirements>
- SQL standards
- Index optimization
- Transaction safety
- Data integrity
- Query performance
</technical-requirements>

<implementation-constraints>
- Schema design
- Query optimization
- Migration safety
- Backup strategy
</implementation-constraints>

<output-format>
- Clean queries
- Index definitions
- Performance notes
- Migration scripts
- Rollback plans
</output-format>`,

  "Cloud/DevOps": `<infrastructure-requirements>
- Cloud provider best practices
- Infrastructure as Code
- Security compliance
- Monitoring setup
</infrastructure-requirements>

<deployment-constraints>
- High availability
- Disaster recovery
- Cost optimization
- Performance metrics
</deployment-constraints>

<output-requirements>
- IaC templates
- Documentation
- Monitoring config
- Security controls
- Backup procedures
</output-requirements>`,

  Mobile: `<technical-stack>
- React Native/Flutter
- Native APIs
- State management
- Network handling
</technical-stack>

<development-constraints>
- Platform specifics
- Performance
- Offline support
- Battery usage
</development-constraints>

<output-requirements>
- Native features
- Error handling
- Loading states
- Responsive UI
- Platform builds
</output-requirements>`,

  Question: `<response-format>
- Clear explanation
- Code examples
- Best practices
- Common pitfalls
- Further reading
</response-format>

<depth-level>
- Fundamental concepts
- Practical usage
- Edge cases
- Performance implications
- Security considerations
</depth-level>

<output-requirements>
- Complete answers
- Visual examples
- Alternative approaches
- Reference links
- Follow-up steps
</output-requirements>`,
};

export const taskTypes = Object.keys(taskTypeValues);
export const customInstructionTypes = Object.keys(customInstructionValues);

export const ignoreFileSuffixesData = [
  ".env",
  ".log",
  ".gitignore",
  ".json",
  ".npmrc",
  ".prettierrc",
  ".eslintrc",
  ".babelrc",
  ".pyc",
  ".pyo",
  ".pyd",
  ".class",
];

export const ignoreFoldersData = [
  ".git/",
  ".svn/",
  ".vscode/",
  ".idea/",
  "node_modules/",
  "venv/",
  ".venv/",
  "build/",
  "dist/",
  "out/",
  ".next/",
  "coverage/",
];
