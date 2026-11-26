# Copy

Plain, short, non-technical. Read every line as a shop owner holding a phone between customers. Keys in brackets are suggested i18n keys so Arabic can be added later without rewriting.

## Screens

| Screen | Heading (`text-heading`) | Line under it (`text-body`, `muted`) | Main button |
|---|---|---|---|
| Home | Know what's on your shelves. | For minimarkets, cafés and barber shops. Count stock on your phone, see what's running low, and know what sells. | Set up your shop |
| Log in | Welcome back | Log in to see what is in stock. | Log in |
| Sign up | Set up your shop | It takes about a minute. | Create account |
| Forgot password | Reset your password | Enter your email and we'll send you a link to set a new one. | Send reset link |
| Verify email | Check your email | Enter the 6-digit code we sent to {email}. | Verify email |

The home button "Set up your shop" matches the sign-up heading it opens. The nav button stays "Get started" (from the brief).

Secondary links: "Forgot password?", "New to Daftr? Create your business account", "Already have an account? Log in", "Back to log in", "No email? Check spam, or send a new code."

## Field labels and hints

| Field | Label | Hint | Placeholder |
|---|---|---|---|
| Email | Email | (none) | you@yourshop.com |
| Password (sign up) | Password | At least 8 characters. | (none) |
| Password (log in) | Password | (none) | Your password |
| Organization name | **Business name** | The name your customers know. | Buzzy Beans |
| Code | Verification code | (none) | (none) |

Say "Business name", not "Organization name": owners don't call their shop an organization. Keep `organizationName` as the field key in code. The 8-character rule is a placeholder until the team sets the real password policy; the hint must match whatever the server enforces.

## Field errors (below the input, with `CircleAlert`)

| When | Message |
|---|---|
| Email empty | Enter your email. |
| Email badly formed | Check your email. It should look like name@example.com. |
| Email already has an account | This email already has an account. Log in instead. |
| Password empty | Enter your password. |
| Password too short | Use at least 8 characters. |
| Business name empty | Enter your business name. |
| Code incomplete | Enter all 6 digits. |
| Code wrong | That code doesn't match. Check the latest email from Daftr and try again. |
| Code expired | This code has expired. We've sent you a new one. |

## Form messages (top of the form, after submit)

| When | Message |
|---|---|
| Log in fails | Email or password is wrong. Try again, or reset your password. |
| No connection | No connection. Check your internet and try again. Nothing was lost. |
| Server error | Something went wrong on our side. Try again in a minute. |
| Too many attempts | Too many tries. Wait 5 minutes, then try again. |
| Reset link sent | Reset link sent. Check your email, including the spam folder. |
| Email verified | Email verified. Your shop is ready. |
| Password changed | Password changed. Log in with your new password. |

Never say which of email or password was wrong on log in; never reveal whether an email has an account on the reset screen (always show "Reset link sent").

## Loading labels (inside the busy button)

Logging in… · Creating account… · Sending… · Checking code… · Saving…

## Empty states (what it is + why it's empty + how to start)

| Where | Title | Line | Button |
|---|---|---|---|
| Products | No products yet | Add your first product to start tracking what's on your shelves. | Add product |
| Low stock | Nothing is running low | Every product is above its reorder level. | (none) |
| Top sellers | No sales yet | Your best sellers show up here after your first sales. | (none) |
| Search | No products match "{query}" | Check the spelling or try a shorter word. | Clear search |

## Status labels

Healthy · Low stock · Out of stock · Expired. Exactly these words, everywhere, so owners learn them once. Rule for which one shows: Expired beats Out of stock beats Low stock (quantity at or below the reorder level) beats Healthy.

## Alerts

| Kind | Title | Line | Action |
|---|---|---|---|
| Info | Verify your email | We sent a 6-digit code to {email}. | Enter code |
| Warning | {product} is running low | {qty} {unit} left. You reorder at {level}. | View product |
| Danger | Changes not saved | Check your internet connection and try again. | Try again |
| Success | Stock updated | {product} is now {qty} {unit}. | (none) |

## Words to use and avoid

| Use | Avoid |
|---|---|
| product | item, SKU, article |
| stock, what's on your shelves | inventory, stock-on-hand |
| business, shop | organization, company, tenant, workspace |
| reorder level | reorder point, par level, threshold |
| log in / log out | sign in / sign out (pick one; this is it) |
| create account | register, sign up (as a button) |
| code | OTP, token |
