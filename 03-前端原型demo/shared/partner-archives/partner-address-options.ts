/**
 * 合作方档案 · 证件登记地址选项（PC / H5 共用）
 * 仅用于快捷建档弹窗的省 / 市 / 区三级联动；正式环境由地址字典接口提供。
 */

export type PartnerAddressCity = {
  city: string
  districts: string[]
}

export type PartnerAddressProvince = {
  province: string
  cities: PartnerAddressCity[]
}

export const PARTNER_ADDRESS_OPTIONS: PartnerAddressProvince[] = [
  {
    province: "江苏省",
    cities: [
      { city: "无锡市", districts: ["滨湖区", "梁溪区", "新吴区", "惠山区"] },
      { city: "南京市", districts: ["鼓楼区", "玄武区", "建邺区", "江宁区"] },
      { city: "苏州市", districts: ["工业园区", "姑苏区", "吴中区"] },
    ],
  },
  {
    province: "浙江省",
    cities: [{ city: "杭州市", districts: ["西湖区", "滨江区", "萧山区"] }],
  },
  {
    province: "上海市",
    cities: [{ city: "上海市", districts: ["黄浦区", "浦东新区", "闵行区"] }],
  },
  {
    province: "安徽省",
    cities: [{ city: "合肥市", districts: ["蜀山区", "包河区"] }],
  },
]

export function partnerProvinceOptions(): string[] {
  return PARTNER_ADDRESS_OPTIONS.map((item) => item.province)
}

export function partnerCityOptions(province: string): string[] {
  return (
    PARTNER_ADDRESS_OPTIONS.find((item) => item.province === province)?.cities.map(
      (item) => item.city,
    ) ?? []
  )
}

export function partnerDistrictOptions(province: string, city: string): string[] {
  const cityItem = PARTNER_ADDRESS_OPTIONS.find(
    (item) => item.province === province,
  )?.cities.find((item) => item.city === city)
  return cityItem?.districts ?? []
}
