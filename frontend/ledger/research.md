# Research

The design system rests on assumptions nobody has tested with a shop owner yet. This plan tests the riskiest ones before the dashboard is built. Each assumption below has the cheapest test that would prove it wrong.

## Assumptions to test

| Assumption | Where it shows | Cheapest test |
|---|---|---|
| Owners can sign up, verify and log in on their own phone without help | Auth screens | Usability test, tasks 1–3 below |
| English UI is acceptable; Arabic / right-to-left can wait | Whole product | Ask in the screener which language their phone is set to; watch for hesitation on labels; show one screen in Arabic and ask which they'd keep |
| Owners say "business", "product", "reorder level" | Copy | Listen for their own words in the interview; note every word they use instead |
| An email code is a workable way to verify | Verify email | Ask if they read email on the phone; watch them switch apps and come back |
| "Days of stock left" answers the question behind "sales vs stock" | Dashboard | Show the chart preview; ask "What would you do after seeing this?" |
| Light theme is the right default; dark mode is nice to have | Theme | Note phone theme setting; ask about using the phone outdoors or at night |
| 52px buttons and 16px text are big enough | Every screen | Watch for mis-taps and zooming on their own device |

## Usability test

**Who.** 5–8 owners who track stock today on paper or in Excel, spread across minimarkets, cafés, snack shops and barber shops. Include at least two who use a low-end Android phone and at least two whose phone is set to Arabic. Exclude anyone who has used inventory software for more than a year.

**Where.** In their shop, on their own phone, during a quiet hour. Expect interruptions: note them, they are real use.

**Prototype.** Clickable screens built from this system: home, sign up, verify email, log in, forgot password, and the dashboard with Buzzy Beans sample data.

**Session (about 40 minutes).**

1. Warm-up (5 min): what they sell, how they track stock today, who else touches the notebook.
2. Context (10 min): show their current ledger or file. When did they last run out of something? How did they find out?
3. Tasks (15 min), thinking aloud:
   1. "You heard about Daftr from a friend. Set up an account for your shop."
   2. "You got an email. Finish setting up."
   3. "You forgot your password. Get back in."
   4. "Look at this dashboard. What needs your attention today?"
4. Reaction (5 min): which words were unclear; would they use this in Arabic or English.
5. Wrap-up (5 min): what would stop them using it next week.

**What to record per task.** Completed without help (yes / with a hint / no), time, wrong taps, words they stumbled on, and their own words for the things on screen.

**Pass bar.** Most owners complete tasks 1–3 without a hint. Task 4: they name Oat Milk as the thing to act on.

## Cognitive walkthrough: sign up to first log-in

A first pass from a newcomer's view, done on the design before testing. Four questions at each step: will they try to do the right thing, will they see the control, will they connect it to their goal, and will they see that it worked?

| Step | Risk found | Change made or open |
|---|---|---|
| Home: tap the main button | "Get started" (nav) and the hero button lead to the same place | Hero button is "Set up your shop", matching the sign-up heading it opens. Open: whether the nav button should say the same |
| Sign up: business name | "Organization name" is not their word | Label changed to "Business name" with an example hint |
| Sign up: password | Rules unknown until an error | Hint shows the rule up front; Show/Hide lets them check what they typed |
| Verify: find the code | They must leave the app for email and come back | Screen names the email address and says to check spam; the first box accepts autofill and paste |
| Verify: wrong code | Panic, retype everything | Digits stay; message says what to do; "send a new code" is right there |
| Log in after verify | Unclear whether they are already logged in | Open: decide whether verifying logs them in directly (recommended) |
EOF