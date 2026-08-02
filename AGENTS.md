# AGENTS.md

## Ownership boundary (read before editing)

- **Daniel Gerovoy owns the Chicago pages/website and the Chicago Meta Pixel `1222147680976957`.** He may only modify Chicago pages/routes and Chicago-specific configuration/tracking.
- **Daniel Gerovoy is NOT authorized to modify Texas.** Do not change Texas pages, the Texas Meta Pixel `999550036295470`, or any Texas configuration. Texas is a separate business and its behavior must remain byte-for-byte unchanged.
- **Shared components/helpers may only be changed in ways that are strictly gated to the Chicago market and that leave Texas behavior unchanged.** Any code touching a shared file must be conditioned on the active market being Chicago (e.g. `market.id === 'chicago'` and/or `getMarketForPath(window.location.pathname).id === 'chicago'`) so the Texas code path is identical to before.

### Practical rules

- Never call, initialize, or fire the Texas pixel (`999550036295470`) from new code.
- Use `fbq('trackSingle...', '1222147680976957', ...)` / `trackSingleCustom` so Chicago events target only the Chicago pixel and can never reach the Texas pixel via the shared `fbq` singleton.
- `lib/trackTexasMetaLead.ts` is Texas-owned; do not modify it. Chicago tracking lives in `lib/trackChicagoFormSubmit.ts`.
- When editing a shared file, verify the Texas (and `national`) runtime path is unchanged before committing.
