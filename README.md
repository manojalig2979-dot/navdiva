# Navdiva Group — Production Website

A redesigned production-oriented corporate website for **Navdiva Group**, designed for:

- Frontend: GitHub Pages (static HTML/CSS/ES modules)
- Backend: Firebase Authentication + Firestore + Storage
- Admin: authenticated Firebase admin portal
- Public forms: Firestore-backed career applications and corporate enquiries

## 1. Frontend deployment on GitHub Pages

Push this repository to GitHub and enable **Settings → Pages → Deploy from branch**. The site uses `.html` URLs so it works directly on GitHub Pages without server-side rewrite rules.

If using a custom domain, keep the included `CNAME` file and point DNS to GitHub Pages.

## 2. Firebase setup

Install Firebase CLI locally, then from this folder:

```bash
npm install -g firebase-tools
firebase login
firebase use navdiva-de905
firebase deploy --only firestore:rules,storage
```

The Firebase web configuration is in `js/firebase-init.js`. Firebase Web API keys are identifiers, not passwords; access is controlled by Authentication and Security Rules.

## 3. Create the first administrator

1. Firebase Console → Authentication → Sign-in method → enable **Email/Password**.
2. Authentication → Users → Add the first admin user.
3. Copy that user's UID.
4. Firestore Database → create collection `users` → document ID = that UID.
5. Add:

```json
{
  "role": "admin"
}
```

6. Open `/admin.html` on the deployed website and sign in.

**Never put an admin email/password into JavaScript.**

## 4. Firestore collections

The site uses:

- `users` — authenticated users and roles
- `employees` — internal employee directory
- `applications` — public career submissions, admin-readable
- `inquiries` — public corporate enquiries, admin-readable

Public visitors can only create `applications` and `inquiries`. They cannot read, edit or delete submissions. Admin users can manage employee records and review submissions.

## 5. Recommended production hardening

Before a high-volume launch, enable Firebase App Check, configure an authorized-domain list, set up automated backups, add monitoring/alerts, and consider moving public form intake to a callable/HTTP Cloud Function with rate limiting and email notification.

## 6. Content

Replace the sample press copy and business descriptions with approved corporate/legal text before launch. Verify the legal entity name, registered address, registration numbers, leadership names/titles, and privacy/retention language with the company.
