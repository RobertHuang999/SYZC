import { Bell, ChevronDown, Download, Package, Search, Sparkles } from "lucide-react"

export function HeaderBar() {
  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Package size={20} strokeWidth={1.8} />
          </div>
          <div className="brand-copy">
            <div className="brand-title">强盛进销存</div>
            <div className="brand-subtitle">QIANGSHENG JXC</div>
          </div>
        </div>
        <div className="header-search" role="search">
          <Search className="header-search-icon" size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>搜索菜单</span>
          <span className="shortcut">快捷键 /</span>
        </div>
      </div>

      <div className="header-actions">
        <button className="header-action header-download" type="button" aria-label="下载">
          <Download size={16} strokeWidth={1.8} />
          <span>下载</span>
        </button>
        <button className="header-action icon-only notification-action" type="button" aria-label="通知">
          <Bell size={17} strokeWidth={1.8} />
          <span className="notification-dot" aria-hidden="true" />
        </button>
        <button className="header-action icon-only" type="button" aria-label="智能助手">
          <Sparkles size={17} strokeWidth={1.8} />
        </button>
        <button className="profile-button" type="button" aria-label="个人菜单">
          <span className="profile-avatar">维</span>
          <span>维他命</span>
          <ChevronDown size={13} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}
