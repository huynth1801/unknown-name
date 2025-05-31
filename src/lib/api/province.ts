const PROVICE_API = "https://api.vnappmob.com/api/v2/province/"

export const getAllProvince = async () => {
  try {
    const response = await fetch(PROVICE_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch provinces: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching provinces:", error)
    throw error
  }
}

export const getAllDistricts = async (provinceId: string) => {
  try {
    const response = await fetch(`${PROVICE_API}district/${provinceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch provinces: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching provinces:", error)
    throw error
  }
}

export const getAllWards = async (districtId: string) => {
  try {
    const response = await fetch(`${PROVICE_API}ward/${districtId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch provinces: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching provinces:", error)
    throw error
  }
}
