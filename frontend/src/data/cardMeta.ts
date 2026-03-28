/**
 * Pillar cards are the highest-stakes compatibility topics per level.
 * They get a visual highlight (gold glow + ⭐) to nudge couples toward
 * the most important conversations first — without hiding or removing any card.
 *
 * depthPoints:
 *   10 — Pillar (dealbreaker territory, core compatibility)
 *    5 — Standard (important but refinement-level)
 *    2 — Light (fun, personality, icebreaker)
 */

type CardWeight = { isPillar: boolean; depthPoints: number };

/** levelId → cardId → weight */
export const cardMeta: Record<number, Record<number, CardWeight>> = {
  1: {
    //  Level 1 — Easy Warm-Up
    1: { isPillar: false, depthPoints: 5 }, // Your Story So Far
    2: { isPillar: false, depthPoints: 5 }, // Daily Personality
    3: { isPillar: false, depthPoints: 2 }, // Small Joys
    4: { isPillar: false, depthPoints: 2 }, // Food Culture at Home
    5: { isPillar: false, depthPoints: 5 }, // Weekend Vibes
    6: { isPillar: false, depthPoints: 2 }, // Hobbies & Passions
    7: { isPillar: false, depthPoints: 2 }, // Travel & Adventure
    8: { isPillar: false, depthPoints: 2 }, // Entertainment & Downtime
    9: { isPillar: false, depthPoints: 5 }, // How You Recharge
    10: { isPillar: true, depthPoints: 10 }, // Friendships ⭐
    11: { isPillar: false, depthPoints: 5 }, // What People Misunderstand
    12: { isPillar: false, depthPoints: 2 }, // Your Education Story
    13: { isPillar: true, depthPoints: 10 }, // Communication Style ⭐
    14: { isPillar: false, depthPoints: 5 }, // Personal Space
    15: { isPillar: true, depthPoints: 10 }, // Your Ideal Partner ⭐
    16: { isPillar: false, depthPoints: 5 }, // Why You Are Here
  },
  2: {
    //  Level 2 — Daily Life & Habits
    1: { isPillar: false, depthPoints: 5 }, // Post-Marriage Daily Life
    2: { isPillar: true, depthPoints: 10 }, // Weekday Evenings ⭐
    3: { isPillar: false, depthPoints: 5 }, // Household Responsibilities
    4: { isPillar: true, depthPoints: 10 }, // Mental Load Sharing ⭐
    5: { isPillar: false, depthPoints: 5 }, // Work-Life Balance
    6: { isPillar: false, depthPoints: 5 }, // Digital Habits
    7: { isPillar: false, depthPoints: 5 }, // Spending Style
    8: { isPillar: false, depthPoints: 5 }, // Social Life
    9: { isPillar: true, depthPoints: 10 }, // Hosting & Guests ⭐
    10: { isPillar: false, depthPoints: 2 }, // Health & Fitness
    11: { isPillar: false, depthPoints: 5 }, // How You Handle Stress
    12: { isPillar: false, depthPoints: 2 }, // Personal Growth
    13: { isPillar: false, depthPoints: 5 }, // Emotional Expression
    14: { isPillar: false, depthPoints: 5 }, // Personal Space vs. Togetherness
    15: { isPillar: false, depthPoints: 2 }, // Silence vs. Conversation
    16: { isPillar: true, depthPoints: 10 }, // Support Styles ⭐
    17: { isPillar: false, depthPoints: 5 }, // Cleanliness & Order
  },
  3: {
    //  Level 3 — Values, Money & Career
    1: { isPillar: true, depthPoints: 10 }, // Meaning of Marriage ⭐
    2: { isPillar: false, depthPoints: 5 }, // Career Journey & Learnings
    3: { isPillar: true, depthPoints: 10 }, // Financial Philosophy ⭐
    4: { isPillar: false, depthPoints: 5 }, // Family Financial Background
    5: { isPillar: false, depthPoints: 5 }, // Financial Expectations from Partner
    6: { isPillar: false, depthPoints: 5 }, // Career vs. Stability Priority
    7: { isPillar: false, depthPoints: 5 }, // Family Rhythm & Involvement
    8: { isPillar: true, depthPoints: 10 }, // In-Law Boundaries ⭐
    9: { isPillar: false, depthPoints: 5 }, // Religion & Ritual Comfort
    10: { isPillar: false, depthPoints: 2 }, // Festivals & Celebrations
    11: { isPillar: false, depthPoints: 2 }, // Language at Home
    12: { isPillar: true, depthPoints: 10 }, // Joint vs. Nuclear Family ⭐
    13: { isPillar: false, depthPoints: 5 }, // Family Approval
    14: { isPillar: false, depthPoints: 5 }, // Conflict Resolution
    15: { isPillar: false, depthPoints: 5 }, // Apologies & Forgiveness
    16: { isPillar: false, depthPoints: 5 }, // Earning Together or Apart
    17: { isPillar: true, depthPoints: 10 }, // Public Privacy as Couple ⭐
    18: { isPillar: true, depthPoints: 10 }, // Lifestyle Gap & Adjustment ⭐
  },
  4: {
    //  Level 4 — Marriage Mechanics & Future
    1: { isPillar: false, depthPoints: 5 }, // Home After Marriage
    2: { isPillar: false, depthPoints: 2 }, // Dream Wedding
    3: { isPillar: false, depthPoints: 5 }, // In-Laws in Everyday Life
    4: { isPillar: false, depthPoints: 5 }, // Extended Family Obligations
    5: { isPillar: true, depthPoints: 10 }, // Responsibility Towards Aging Parents ⭐
    6: { isPillar: true, depthPoints: 10 }, // Financial Goals Together ⭐
    7: { isPillar: false, depthPoints: 5 }, // Financial Difficulty Response
    8: { isPillar: false, depthPoints: 5 }, // Career Trade-offs
    9: { isPillar: true, depthPoints: 10 }, // Children — Timing & Expectations ⭐
    10: { isPillar: true, depthPoints: 10 }, // Parenting Philosophy ⭐
    11: { isPillar: false, depthPoints: 5 }, // Education for Children
    12: { isPillar: false, depthPoints: 5 }, // Passing Culture to Children
    13: { isPillar: false, depthPoints: 5 }, // Health as We Age
    14: { isPillar: false, depthPoints: 5 }, // Family Pressure vs. Personal Choice
    15: { isPillar: false, depthPoints: 2 }, // Legacy & Purpose
    16: { isPillar: false, depthPoints: 2 }, // Big Scary Dreams
    17: { isPillar: true, depthPoints: 10 }, // Support During Difficult Phases ⭐
  },
  5: {
    //  Level 5 — Emotional Depth
    1: { isPillar: false, depthPoints: 5 }, // Your Biggest Fear
    2: { isPillar: true, depthPoints: 10 }, // Anxiety & Overthinking ⭐
    3: { isPillar: false, depthPoints: 5 }, // Childhood & How It Shaped You
    4: { isPillar: false, depthPoints: 5 }, // Vulnerability
    5: { isPillar: true, depthPoints: 10 }, // Trauma & Healing ⭐
    6: { isPillar: false, depthPoints: 5 }, // Mental Health Awareness
    7: { isPillar: true, depthPoints: 10 }, // Jealousy & Trust ⭐
    8: { isPillar: false, depthPoints: 5 }, // Unspoken Needs
    9: { isPillar: false, depthPoints: 5 }, // Your Relationship With Yourself
    10: { isPillar: false, depthPoints: 5 }, // Repair After Conflict
    11: { isPillar: false, depthPoints: 5 }, // Intimacy & Emotional Closeness
    12: { isPillar: false, depthPoints: 5 }, // Physical Affection Comfort
    13: { isPillar: false, depthPoints: 2 }, // What You Regret
    14: { isPillar: false, depthPoints: 5 }, // Loneliness
    15: { isPillar: false, depthPoints: 5 }, // What Scares You About This Relationship
    16: { isPillar: true, depthPoints: 10 }, // Non-Negotiables ⭐
    17: { isPillar: true, depthPoints: 10 }, // Acceptance vs. Expectation ⭐
  },
  6: {
    //  Level 6 — Roots, Crisis & Long-Term Life
    1: { isPillar: false, depthPoints: 5 }, // Cultural Identity
    2: { isPillar: false, depthPoints: 5 }, // Traditions You Would Let Go
    3: { isPillar: false, depthPoints: 5 }, // Cross-Cultural Openness
    4: { isPillar: false, depthPoints: 5 }, // Community & Belonging
    5: { isPillar: true, depthPoints: 10 }, // Fertility & Conceiving Difficulty ⭐
    6: { isPillar: true, depthPoints: 10 }, // Difficult Medical Decisions ⭐
    7: { isPillar: false, depthPoints: 5 }, // Crisis Management
    8: { isPillar: true, depthPoints: 10 }, // Dealbreakers ⭐
    9: { isPillar: false, depthPoints: 5 }, // Finding Common Ground
    10: { isPillar: false, depthPoints: 5 }, // The Version of You in Five Years
    11: { isPillar: false, depthPoints: 5 }, // Your Definition of Success
    12: { isPillar: false, depthPoints: 5 }, // Meaningful Life Together
    13: { isPillar: false, depthPoints: 5 }, // How You Want to Be Remembered
    14: { isPillar: false, depthPoints: 5 }, // What Love Looks Like to You
    15: { isPillar: true, depthPoints: 10 }, // Your Expectations of This Relationship ⭐
    16: { isPillar: true, depthPoints: 10 }, // What I Can Consistently Offer ⭐
    17: { isPillar: false, depthPoints: 5 }, // Why You Are Here
    18: { isPillar: true, depthPoints: 10 }, // Wedding & Marriage Expectations ⭐
  },
};
