import type { InboundFormState } from "@/features/inbound-records/domain/form-types"

const KEY = "inbound-staging-reg-draft"
const KEY_EDIT = "inbound-staging-reg-edit-id"

export function saveInboundStagingForm(form: InboundFormState) {
  sessionStorage.setItem(KEY, JSON.stringify(form))
}

export function loadInboundStagingForm(): InboundFormState | null {
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as InboundFormState
  } catch {
    return null
  }
}

export function clearInboundStagingSession() {
  sessionStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY_EDIT)
}

export function saveStagingEditId(id: string | null) {
  if (id) sessionStorage.setItem(KEY_EDIT, id)
  else sessionStorage.removeItem(KEY_EDIT)
}

export function loadStagingEditId(): string | null {
  return sessionStorage.getItem(KEY_EDIT)
}
