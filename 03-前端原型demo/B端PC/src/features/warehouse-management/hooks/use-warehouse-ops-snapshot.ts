import { useCallback, useEffect, useState } from "react"
import type { WarehouseOpsConfig } from "@/features/platform-basic-config/domain/types"
import { readWarehouseOpsSnapshot } from "@/shared/config/warehouse-ops-snapshot"

export function useWarehouseOpsSnapshot() {
  const [ops, setOps] = useState<WarehouseOpsConfig>(() =>
    readWarehouseOpsSnapshot()
  )

  const refresh = useCallback(() => {
    setOps(readWarehouseOpsSnapshot())
  }, [])

  useEffect(() => {
    window.addEventListener("focus", refresh)
    return () => window.removeEventListener("focus", refresh)
  }, [refresh])

  return { ops, refresh }
}
