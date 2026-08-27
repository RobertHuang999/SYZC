import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPageTitle } from "@/config/navigation"
import { useLocation } from "react-router-dom"

export function PlaceholderPage() {
  const { pathname } = useLocation()
  const pageTitle = getPageTitle(pathname)

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>当前路径：{pathname}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">页面正在构建中</p>
        </CardContent>
      </Card>
    </div>
  )
}
