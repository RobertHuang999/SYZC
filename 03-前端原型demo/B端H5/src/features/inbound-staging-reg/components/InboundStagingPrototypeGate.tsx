import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { INBOUND_STAGING_PROTOTYPE_RELEASED } from "@prototype/shared/inbound/inbound-633-delivery"

type Props = {
  children: ReactNode
  fallbackTo?: string
}

export function InboundStagingPrototypeGate({
  children,
  fallbackTo = "/m/workspace/inbound-records",
}: Props) {
  if (!INBOUND_STAGING_PROTOTYPE_RELEASED) {
    return <Navigate to={fallbackTo} replace />
  }
  return children
}
