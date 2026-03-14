# Real Estate CRM PRD — Must-Have (Phase 1) Features

Extracted from `RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx` — Sheet 3 "Feature Requirements" and Sheet 4 "UI-UX Screens"

---

## Part A: Feature Requirements (Sheet 3)

### Property Management — Aqar-Style Listings

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **PM-001** | Property Listing Creation (Arabic/English) | Create listing with address, price, photos, description in AR/EN. All Saudi property types supported |
| **PM-002** | Saudi Property Types Support | All 20+ Aqar property types available with type-specific fields (شقق، فلل، أراضي، عمائر، دور، محلات، مكاتب، استراحات، شاليهات، مزارع، مستودعات، غرف، مخيمات) |
| **PM-003** | Transaction Types | Each listing can be tagged with transaction type, price format adapts (SAR/yearly, SAR/monthly, SAR) |
| **PM-004** | Photo & Media Upload | WebP optimization, thumbnails auto-generated, drag-to-reorder, Matterport embed support |
| **PM-005** | Interactive Map View (خريطة) | Map renders <2sec, clickable pins with preview cards, neighborhood boundaries, cluster at zoom levels |
| **PM-006** | Advanced Search & Smart Filters | All filter combos work, results <2 sec, supports Arabic neighborhood names, saved searches |
| **PM-007** | City & Neighborhood Navigation | All Saudi cities listed, neighborhood hierarchy, listing counts per area, SEO-friendly URLs |
| **PM-008** | Property Status Tracking | Status changes trigger notifications, reflected across all views |
| **PM-009** | REGA Ad Licensing Integration | Listings require valid REGA ad license number, validation against REGA API |

### Request Matching Engine — DealApp Model

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **RM-001** | Property Request Submission (طلب عقاري) | Request form: location (city/neighborhood), type, budget range, rooms, area, timeline. Auto-notify matching brokers |
| **RM-002** | Broker Request Inbox | Filtered inbox by neighborhood, request type, budget. Real-time notifications for new requests |
| **RM-003** | Request-to-Offer Matching | Broker can attach listings to a request response, seeker sees all offers in one view, comparison enabled |
| **RM-005** | Broker Neighborhood Specialization | Broker profile includes active neighborhoods, requests only routed to brokers in those areas |
| **RM-006** | Request Status Tracking | Status visible to both seeker and broker, auto-expire after configurable period |

### CRM & Contact Management

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **CRM-001** | Contact Database (Arabic Names) | Contact types: Buyer, Seller, Tenant, Landlord, Vendor, Investor. Arabic name fields, Saudi ID storage |
| **CRM-002** | Lead Capture from Multiple Sources | Lead source tracked, auto-import from Aqar/DealApp APIs if available, manual entry for WhatsApp/walk-in |
| **CRM-004** | Activity Timeline | Chronological activity feed, auto-log from integrated channels, manual entry for offline activities |
| **CRM-005** | Task Management | Task list, calendar view, overdue alerts, assignment to team members |
| **CRM-006** | Pipeline / Kanban Board | Kanban columns per stage, drag between stages, stage conversion metrics |
| **CRM-008** | Contact Import / Export | Deduplication, Arabic name handling, field mapping, bulk import up to 10K |

### Transaction Management

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **TM-001** | Sale Transaction Pipeline (بيع) | Stage gates, required documents per stage, deadline tracking, all parties visible |
| **TM-002** | Lease Transaction Pipeline (إيجار) | Lease-specific stages, tenant screening integration, Ejar contract generation |
| **TM-003** | Purchase Transaction Pipeline (شراء) | Buyer-specific milestones, financing tracking, title deed verification |
| **TM-004** | Offer Management (العروض) | Multiple offers per property, counter history, expiry dates, comparison view |
| **TM-005** | Commission Calculator (حاسبة العمولة) | Supports %, flat, tiered. Configurable splits. GCI tracking. VAT calculation on commission |
| **TM-007** | Timeline & Milestone Tracker | Gantt-style, considers Saudi weekends (Fri-Sat), Ramadan schedule adjustments, deadline alerts |
| **TM-008** | Rent Roll Management (سجل الإيجار) | Multi-tenant support, renewal alerts, vacancy tracking, rent collection status |

### Saudi Government Integrations

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **GOV-002** | Nafath Authentication (نفاذ) | Login/verify via Nafath, verified badge on user profile, required for listing creation |
| **GOV-003** | REGA Compliance (الهيئة العامة للعقار) | License validation, display license # on listing, compliance reporting |
| **GOV-005** | VAT Compliance | Auto-calculate VAT, generate tax invoices, ZATCA e-invoicing format |

### Document Management

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **DOC-001** | Document Storage & Organization | Folder structure, version history, access control, Arabic file names |
| **DOC-003** | Arabic Template Library | Saudi-specific templates, auto-fill from transaction data, bilingual options |
| **DOC-005** | Compliance Document Checklist | Checklist: title deed, ID, REGA license, Ejar, power of attorney, NIN. Missing doc alerts |

### Financial & Accounting

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **FIN-001** | Commission Dashboard | By agent, period, transaction type. GCI, net, VAT columns. SAR currency |
| **FIN-002** | Rent Payment Tracking | Payment history, auto-reminders (SMS/WhatsApp), late fee calc, receipt generation |

### Communication

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **COM-001** | In-App Messaging | 1:1 chat, file sharing, read receipts, notification badges |
| **COM-003** | SMS Notifications (Arabic) | Arabic SMS templates, delivery tracking, configurable triggers |
| **COM-005** | Push Notifications | Configurable per event type, Arabic content, FCM integration |
| **COM-006** | Calendar Integration | Bi-directional sync, showing slots, appointment booking with Saudi timezone (AST) |

### Reporting & Analytics

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **RPT-001** | Broker Dashboard (لوحة التحكم) | Customizable widgets, real-time data, Arabic/English toggle, mobile responsive |

### Administration & Settings

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **ADM-001** | User Management with Saudi Roles | Role-based access, REGA license verification per broker, invite via SMS |
| **ADM-002** | Office / Team Structure | Define offices, teams, assign agents, org chart, permission inheritance |
| **ADM-003** | Commission Plan Config | Percentage, flat, tiered. Broker/office split. Cap per period. Referral tracking |
| **ADM-004** | Bilingual System Settings | Full Arabic UI, English fallback, persisted preference, RTL CSS throughout |
| **ADM-005** | Saudi Calendar Support | Date picker shows both calendars, reports can use either, Ramadan awareness |
| **ADM-006** | Data Import / Migration | CSV import, field mapping, Arabic data handling, deduplication |
| **ADM-007** | Audit Trail | Timestamp, user, action, before/after values. Tamper-proof log |

### Mobile Application

| ID | Feature Name | Acceptance Criteria |
|----|--------------|---------------------|
| **MOB-001** | Progressive Web App (PWA) | Offline-capable for cached data, add to homescreen, push notifications |
| **MOB-003** | Mobile Listing Creation | Camera access for photos, GPS auto-location, quick publish |

---

## Part B: UI-UX Screens (Sheet 4) — Phase 1 Linked

| Screen ID | Screen Name | Description / Key Elements | Linked Features |
|-----------|-------------|---------------------------|-----------------|
| **SCR-001** | Login Screen | Email/password + Nafath SSO button + OTP via Saudi mobile (+966). Arabic primary with EN toggle | ADM-001, GOV-002 |
| **SCR-002** | Registration | Role selection (Broker/Seeker/Owner), REGA license input for brokers, Nafath verification, office selection | ADM-001, GOV-002 |
| **SCR-003** | Onboarding Wizard | Profile setup, neighborhood selection, preferences, data import prompt | RM-005, ADM-006 |
| **SCR-010** | Main Dashboard (لوحة التحكم) | KPI cards, task list, calendar, recent activity feed | RPT-001 |
| **SCR-011** | Navigation Structure | Sidebar (desktop) / Bottom bar (mobile). RTL layout. Dashboard, Properties, Requests, Contacts, Transactions, Docs, Reports, Settings | All |
| **SCR-020** | Property List (قائمة العقارات) | Card grid: photo, price (SAR), area (م²), rooms, bathrooms, neighborhood, status badge. List/grid toggle, search, filters | PM-005, PM-006 |
| **SCR-021** | Property Map (الخريطة) | Full-screen interactive map with property pins, cluster markers, filter sidebar, property preview cards | PM-005 |
| **SCR-022** | Property Detail (تفاصيل العقار) | Photo gallery, price, specs grid, Arabic description, location map, agent contact card, REGA license # | PM-001 |
| **SCR-023** | Add/Edit Property (إضافة إعلان) | Multi-step form: Type & transaction → Location → Details & specs → Photos & media → Price & description → REGA license & publish | PM-001, GOV-003 |
| **SCR-030** | Submit Request (أضف طلب عقاري) | Form: city, neighborhood, property type, bedrooms, budget range, move-in date, special requirements. Arabic input | RM-001 |
| **SCR-031** | Broker Request Inbox | List of property requests in broker's neighborhoods: seeker details, requirements, budget, status, respond button | RM-002 |
| **SCR-032** | Request Detail & Offer Response | Request specs + matching properties from inventory to attach as offer. Side-by-side matching view | RM-003 |
| **SCR-033** | Seeker Offers View | All offers received: property cards, broker info, comparison table, accept/reject actions | RM-003 |
| **SCR-040** | Contact List (العملاء) | Search, filter by type/tag/status, Arabic name display, quick actions (call, WhatsApp, email) | CRM-001 |
| **SCR-041** | Contact Detail | Profile card, activity timeline, linked properties, transactions, notes, tags. WhatsApp quick action | CRM-001, CRM-004 |
| **SCR-042** | Lead Pipeline (Kanban) | Drag-and-drop: New → Contacted → Qualified → Showing → Offer → Closed/Lost | CRM-006 |
| **SCR-050** | Transaction Pipeline Board | Kanban columns per transaction type (Sale/Buy/Lease), deal cards with value, client, property, deadline | TM-001, TM-002, TM-003 |
| **SCR-051** | Transaction Detail | Tabs: Overview, Timeline, Parties, Documents, Financial, Notes. Commission breakdown. Closing checklist | TM-001 |
| **SCR-052** | Offer Comparison | Side-by-side: price, terms, contingencies, timeline. Accept/counter/reject actions | TM-004 |
| **SCR-053** | Rent Roll / Tenant Management | Table: units, tenants, rent amount, payment status, lease expiry. Vacancy highlighting. Payment history | TM-008 |
| **SCR-070** | Document Library | Folder tree per transaction/contact, search, upload, download, e-sign status badges | DOC-001 |
| **SCR-071** | Commission Dashboard | Earned/pending/paid totals, by-agent breakdown, trend chart, VAT column, period filter. SAR formatting | FIN-001 |
| **SCR-072** | Rent Tracker | Tenant list, payment history, overdue alerts, collection totals, receipt generation | FIN-002 |
| **SCR-080** | User Management | User list, role assignment (Arabic role names), REGA license verification, Nafath verification status | ADM-001 |
| **SCR-081** | Office / Team Setup | Office list, team builder, hierarchy view, neighborhood assignments per broker | ADM-002 |
| **SCR-082** | System Settings (الإعدادات) | Language (AR/EN), calendar (Hijri/Gregorian), timezone, commission plans, integration APIs, branding | ADM-004, ADM-005 |

---

## Summary

- **Total Phase 1 Features:** 44
- **Total Phase 1 UI Screens:** 26
- **Filter criteria:** Priority = Must, Phase = 1
