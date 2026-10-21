import { useCallback, useEffect, useState } from "react"
import type { WarehouseOpsConfig } from "@/features/platform-basic-config/domain/types"
import {
  readWarehouseOpsSnapshot,
  WAREHOUSE_OPS_SNAPSHOT_EVENT,
} from "@/shared/config/warehouse-ops-snapshot"

export function useWarehouseOpsSnapshot() {
  const [ops, setOps] = useState<WarehouseOpsConfig>(() =>
    readWarehouseOpsSnapshot()
  )

  const refresh = useCallback(() => {
    setOps(readWarehouseOpsSnapshot())
  }, [])

  useEffect(() => {
    window.addEventListener("focus", refresh)
    window.addEventListener(WAREHOUSE_OPS_SNAPSHOT_EVENT, refresh)
    return () => {
      window.removeEventListener("focus", refresh)
      window.removeEventListener(WAREHOUSE_OPS_SNAPSHOT_EVENT, refresh)
    }
  }, [refresh])

  return { ops, refresh }
}
