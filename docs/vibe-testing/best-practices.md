# Best Practices

Guidelines for effective prototype testing and user feedback collection.

## Testing Fundamentals

### Start Early, Test Often

```
High Fidelity    ████████████████████████  Less useful early
                         ↓
                    Iterate
                         ↓
Low Fidelity     ░░░░░░░░░░░░░░░░░░░░░░░░  More useful early

Rule: Test with the lowest fidelity that answers your question
```

**Why low-fidelity first:**
- High-polish prototypes bias users toward visual feedback
- Users focus on aesthetics instead of usability
- Easier to throw away and iterate
- Faster to create and modify

### Sample Size Guidelines

| Test Type | Minimum Users | Why |
|-----------|---------------|-----|
| Usability (qualitative) | 5-8 | Saturation point for major issues |
| A/B test (quantitative) | Calculator-based | Statistical significance required |
| Guerrilla | 5-10 | Quick signal, not precision |
| NPS | 100+ | Reliable score calculation |

**The 5-User Rule:**
Jakob Nielsen's research shows 5 users find ~85% of usability problems.
Beyond 5, you get diminishing returns for qualitative insights.

---

## Avoiding Bias

### Question Phrasing

| Bad | Good | Why |
|-----|------|-----|
| "Don't you love this new design?" | "What are your thoughts on this design?" | Leading vs neutral |
| "Was that easy?" | "How would you describe that experience?" | Closed vs open |
| "Most users prefer A. Which do you prefer?" | "Which option do you prefer and why?" | Anchoring vs neutral |
| "Did you find the button?" | "Show me how you would do X" | Binary vs behavioral |

### Prototype Fidelity Bias

```
Problem: Polished UI → Users focus on colors, fonts, not flow
Solution: Use wireframes or grayscale for early testing

Problem: Broken prototype → Users report bugs, not insights
Solution: Tell users upfront: "This is a work-in-progress"
```

### Observer Effect

**Hawthorne Effect:** People behave differently when watched.

Mitigations:
- Use unmoderated tests when possible
- Record sessions, don't observe live
- Build rapport: "We're testing the design, not you"
- Normalize failure: "Many people struggle with this"

---

## Running Effective Tests

### The Think-Aloud Protocol

```
Facilitator: "Please think out loud as you use this.
             Tell me what you're looking at, what you're
             trying to do, and what you're thinking."

User: "Okay... I see a button that says 'Create'...
       I'm guessing that's where I start a new project...
       Let me click it... Hmm, now I see a blank canvas...
       I'm not sure what to do next..."

→ Insight: Onboarding needed after canvas creation
```

**Tips:**
- Remind users to keep talking if they go silent
- Don't interrupt or guide
- Ask "What are you thinking?" if they stop

### Task Design

**Good tasks:**
- Specific and measurable
- Realistic scenarios
- Don't give away the answer

**Examples:**

| Bad Task | Good Task |
|----------|-----------|
| "Click the Create button" | "Start a new project" |
| "Find the settings in the top right" | "Change your notification preferences" |
| "Use the search feature" | "Find a workflow that generates portraits" |

### Session Structure

```
1. Introduction (2 min)
   - Explain purpose
   - "Testing design, not you"
   - Get permission to record

2. Warm-up (3 min)
   - Background questions
   - Build rapport

3. Tasks (15-20 min)
   - 3-5 key tasks
   - Think-aloud protocol
   - Note struggles, successes

4. Follow-up (5 min)
   - Open-ended questions
   - Satisfaction rating
   - "What would you change?"

5. Debrief (2 min)
   - Thank them
   - Explain next steps
```

---

## Analyzing Results

### The "I Like, I Wish, What If" Framework

Organize feedback into three categories:

| Category | Question | Example |
|----------|----------|---------|
| I Like | What worked well? | "I like how fast it loads" |
| I Wish | What could be better? | "I wish the icons were labeled" |
| What If | New possibilities? | "What if there were templates?" |

### Severity Rating

| Severity | Definition | Action |
|----------|------------|--------|
| Critical | Users cannot complete task | Fix before launch |
| Major | Significant difficulty/frustration | Fix soon |
| Minor | Annoying but workaround exists | Add to backlog |
| Cosmetic | Preference, not usability | Consider later |

### Quantitative Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Task Success Rate | Completions / Attempts | > 80% |
| Time on Task | Avg time to complete | Varies by task |
| Error Rate | Errors / Attempts | < 10% |
| Misclick Rate | Wrong clicks / Total clicks | < 15% |
| SUS Score | Standard questionnaire | > 68 (above avg) |
| NPS | Promoters - Detractors | > 30 (good) |

---

## Common Mistakes to Avoid

### 1. Testing Too Late

```
❌ Build complete feature → Test → Discover fundamental issues → Expensive rework

✅ Sketch idea → Test → Validate → Build → Test → Iterate
```

### 2. Asking for Opinions Instead of Observing Behavior

```
❌ "Would you use this feature?"
   (Users say yes to be polite, actual usage: 5%)

✅ Watch them try to use it
   (Observe: confusion at step 3, can't find button)
```

### 3. Testing with Colleagues

```
❌ Internal team: knows context, navigation, terminology
   → False positives, missed issues

✅ Real users: fresh eyes, actual confusion points
   → Authentic feedback
```

### 4. Ignoring Negative Feedback

```
❌ "Users just don't understand it yet"
   "They're not our target audience"
   "Edge case, won't happen often"

✅ Pattern = Problem
   3+ users struggle → Real issue
   Document it, fix it
```

### 5. Analysis Paralysis

```
❌ Collect feedback for months
   Analyze every data point
   Never ship anything

✅ Test quickly (5-8 users)
   Fix obvious issues
   Ship and iterate
```

---

## Closing the Feedback Loop

### Why It Matters

Users who give feedback and see action:
- 4x more likely to give feedback again
- Become advocates
- Higher retention

Users whose feedback goes into a void:
- Stop engaging
- Feel ignored
- Churn risk

### The Loop

```
User gives feedback
        ↓
Acknowledge receipt (immediate)
        ↓
Investigate/Triage (1-7 days)
        ↓
Update user on status
        ↓
Ship fix/feature
        ↓
Notify user it's live ← MOST IMPORTANT
        ↓
Ask for follow-up feedback
```

### Response Templates

**Immediate acknowledgment:**
```
Thanks for your feedback! We've logged this and our team will review it.
You'll be notified when we have an update.
```

**Status update:**
```
Hi [Name], we reviewed your suggestion about [X].
We're adding it to our roadmap for [timeframe].
Thanks for helping us improve!
```

**Shipped notification:**
```
Hi [Name]! Remember when you suggested [X]?
It's now live! Check it out: [link]
Would love to know if this hits the mark.
```

---

## Testing Checklist

### Before Testing

- [ ] Clear hypothesis defined
- [ ] Success metrics identified
- [ ] Prototype functional enough for tasks
- [ ] Test script prepared
- [ ] Participants recruited (5-8 minimum)
- [ ] Recording setup ready
- [ ] Note-taking template ready

### During Testing

- [ ] Introduce purpose, get consent
- [ ] Remind: testing design, not user
- [ ] Enable think-aloud
- [ ] Don't guide or help (let them struggle)
- [ ] Note quotes, behaviors, emotions
- [ ] Ask follow-up questions
- [ ] Thank participant

### After Testing

- [ ] Debrief while fresh
- [ ] Categorize findings (I Like/Wish/What If)
- [ ] Rate severity of issues
- [ ] Identify patterns (3+ = real problem)
- [ ] Prioritize fixes
- [ ] Share findings with team
- [ ] Update backlog/roadmap
- [ ] Schedule re-test after fixes

---

## Resources

### Books
- "Don't Make Me Think" - Steve Krug
- "Continuous Discovery Habits" - Teresa Torres
- "Lean UX" - Jeff Gothelf
- "The Mom Test" - Rob Fitzpatrick

### Tools Reference
- [Sample Size Calculator](https://www.evanmiller.org/ab-testing/sample-size.html)
- [SUS Questionnaire](https://www.usability.gov/how-to-and-tools/methods/system-usability-scale.html)
- [NPS Calculator](https://delighted.com/nps-calculator)

### Communities
- [ResearchOps Community](https://researchops.community/)
- [UXR Collective](https://www.userresearchcollective.com/)
- [Product Hunt](https://www.producthunt.com/) - Discover new tools
