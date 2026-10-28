/**
 * 省市区三级联动示意数据（仅用于原型演示）
 * 真实系统对接行政区划库，这里只保留少量样本支撑交互。
 */
export type RegionProvince = {
  name: string
  cities: Array<{
    name: string
    districts: string[]
  }>
}

export const REGION_CATALOG: readonly RegionProvince[] = [
  {
    name: "四川省",
    cities: [
      { name: "雅安市", districts: ["汉源县", "雨城区", "名山区"] },
      { name: "成都市", districts: ["锦江区", "武侯区", "金牛区"] },
    ],
  },
  {
    name: "广西壮族自治区",
    cities: [
      { name: "玉林市", districts: ["兴业县", "玉州区", "北流市"] },
      { name: "南宁市", districts: ["青秀区", "西乡塘区"] },
    ],
  },
  {
    name: "山东省",
    cities: [
      { name: "临沂市", districts: ["兰山区", "河东区", "沂水县"] },
      { name: "青岛市", districts: ["市南区", "黄岛区"] },
    ],
  },
  {
    name: "江苏省",
    cities: [
      { name: "苏州市", districts: ["姑苏区", "吴中区", "昆山市"] },
      { name: "南京市", districts: ["玄武区", "江宁区"] },
    ],
  },
]

export function citiesOf(province: string) {
  return REGION_CATALOG.find((item) => item.name === province)?.cities ?? []
}

export function districtsOf(province: string, city: string) {
  return citiesOf(province).find((item) => item.name === city)?.districts ?? []
}

/** 现场录入值统一存为「省/市/区」 */
export function parseRegion(value: string): [string, string, string] {
  const [province = "", city = "", district = ""] = value.split("/")
  return [province, city, district]
}

export function formatRegion(
  province: string,
  city: string,
  district: string
): string {
  return [province, city, district].filter(Boolean).join("/")
}
