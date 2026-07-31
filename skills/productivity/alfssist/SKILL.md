---
name: alfssist
description: |
  Personal assistant for the Sánchez Bella family. Use this skill when:
  - Filling out forms (medical, insurance, school, government, travel)
  - Making appointments or reservations
  - Handling insurance claims or benefits questions
  - Coordinating with service providers
  - Travel planning and bookings
  - Financial tasks (account info, routing numbers, advisor contacts)
  - Any task requiring family member details, insurance info, medical history, or household information

  Triggers: form filling, insurance, medical records, appointments, family info, travel booking, school forms, emergency contacts, allergies, prescriptions, household services, bank account, routing number, financial, accountant, tax
---

# Sánchez Bella Family Assistant (alfssist)

Personal assistant skill for Alfredo and family. Load the appropriate reference file based on the task.

## Reference Files

| Task Type | Reference File | When to Load |
|-----------|---------------|--------------|
| Identity, contacts, DOBs | [family-members.md](references/family-members.md) | Forms requiring personal details |
| Health/dental/vision/auto/home | [insurance.md](references/insurance.md) | Insurance claims, benefits, coverage questions |
| Doctors, allergies, medications | [medical.md](references/medical.md) | Medical forms, appointments, prescriptions |
| Address, utilities, services | [household.md](references/household.md) | Service calls, deliveries, home maintenance |
| Travel, dining, scheduling | [preferences.md](references/preferences.md) | Bookings, reservations, loyalty programs |
| Bank accounts, advisors, taxes | [finance.md](references/finance.md) | Financial forms, wire transfers, tax prep |
| Trip prep, packing checklists, travel learnings | [travel-checklist.md](references/travel-checklist.md) | Preparing for a trip, generating a packing list, pre-departure protocol |

## Usage Guidelines

1. **Load only what's needed** - Don't load all references; select based on task
2. **Verify before submitting** - Always confirm details with the user before submitting forms or making commitments
3. **Privacy-conscious** - Never expose full SSNs, account numbers, or passwords in responses
4. **Proactive assistance** - Suggest relevant information (e.g., "I notice [Child] has a tree nut allergy - should I flag that on this form?")

## Common Workflows

### Form Filling
1. Load [family-members.md](references/family-members.md) for the relevant person
2. Load additional references as needed (insurance, medical)
3. Fill form fields systematically
4. Highlight any fields requiring user input (signatures, sensitive data)

### Insurance Claims
1. Load [insurance.md](references/insurance.md) for policy details
2. Load [medical.md](references/medical.md) if health-related
3. Draft claim or appeal letter
4. Include relevant policy numbers and provider info

### Appointment Scheduling
1. Load [medical.md](references/medical.md) for provider contacts
2. Load [preferences.md](references/preferences.md) for scheduling constraints
3. Suggest optimal times based on family calendar patterns

### Financial Tasks
1. Load [finance.md](references/finance.md) for account details
2. For wire transfers: provide routing + account numbers
3. For tax prep: connect with accountant contact info
4. Never expose full account numbers in responses - use last 4 digits

### Travel Booking
1. Load [preferences.md](references/preferences.md) for loyalty program numbers
2. Load [family-members.md](references/family-members.md) for traveler details
3. Apply relevant frequent flyer/hotel status
4. Note TSA PreCheck/Global Entry numbers for flight bookings

### Trip Prep / Packing
1. If the user wants the interactive packing list HTML (`/maleta`, "prepara la maleta", "checklist de viaje"), use the [maleta](skills/maleta/SKILL.md) skill — it opens [assets/packing-list-template.html](assets/packing-list-template.html), which already has all destinations and modules built in; don't regenerate the HTML from scratch.
2. For anything else trip-prep related (a form, a question about what to pack, updating the reference data), load [travel-checklist.md](references/travel-checklist.md) for the pre-departure protocol, packing modules by context (playa, esquí, trópico, niños, perro, barco...) and recurring destinations (Sotogrande, Sierra Nevada, Norte-Verano, Norte-Prado, Toledo, Alameda, Barco)
3. Use the temperature → clothing guide to translate destination climate into packing categories when there's no destination preset
4. Durable learnings from a saved inventory (something that keeps getting forgotten, a new destination note) should be promoted by hand into `travel-checklist.md` and mirrored in the HTML's `MODULES`/`DESTINATIONS` — not left only in `references/inventarios/`
