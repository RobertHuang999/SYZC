# GitHub Copilot & Codex Instructions - SYZC 供应链金融存货监管系统

All project guidelines, business architecture rules, prototype annotation standards (benchmark templates), and technical/security constraints are maintained in the root file `AGENTS.md`.

## Key Rules for AI:
1. **Source of Truth**: Always refer to `AGENTS.md` for business logic, RBAC security, and prototype annotation standards.
2. **Benchmark Template Alignment (PC & H5)**:
   - For all prototype pages (list, form, detail), follow Section 4 of `AGENTS.md` (benchmark from Device Warning Events and Collateral Warning Events).
   - Must include `PrototypeDocument`三件套 (`prd`, `fields`, `rules`).
   - Page-level annotation MUST include Mermaid diagrams (`flowchart` or `stateDiagram-v2`).
   - Field annotations must specify field codes, types, validations, and mutual exclusion rules (e.g., R14 device online exclusivity, R04 1:1 order binding).
3. **Core Business Logic**:
   - Access control passwords: Dual-path matching (`matchUnlockApprovalConfig`). Face recognition MUST NOT call SMS API (R31).
   - Approval: Self-approval forbidden (P06/R11). Unlock apply runs on a dedicated track under Other Approval.
   - IoT Penetration: Device alerts penetrate into collateral orders when `sync_to_order_warn=true`; readonly on order side and resolved via device ledger.
