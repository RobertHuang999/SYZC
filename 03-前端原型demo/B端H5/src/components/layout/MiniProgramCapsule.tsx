/**
 * 小程序胶囊按钮（原型示意）
 *
 * 微信小程序每个页面右上角都固定有这颗胶囊：左侧「···」打开更多菜单，
 * 右侧「⊙」关闭当前小程序。原型里只做视觉还原，不模拟系统级菜单。
 * 宽度 87px、高 32px，与微信真机比例一致，导航栏右侧必须为它让位。
 */
export function MiniProgramCapsule() {
  return (
    <div
      aria-hidden="true"
      title="小程序胶囊按钮（原型示意，不模拟系统菜单）"
      className="pointer-events-none flex h-8 w-[87px] shrink-0 items-center rounded-full border border-black/10 bg-white/60 backdrop-blur-sm"
    >
      <div className="flex flex-1 items-center justify-center gap-[3px]">
        {[0, 1, 2].map((index) => (
          <span key={index} className="size-[3px] rounded-full bg-gray-900/85" />
        ))}
      </div>
      <span className="h-4 w-px bg-black/10" />
      <div className="flex flex-1 items-center justify-center">
        <span className="flex size-[13px] items-center justify-center rounded-full border-[1.5px] border-gray-900/85">
          <span className="size-[3px] rounded-full bg-gray-900/85" />
        </span>
      </div>
    </div>
  )
}
