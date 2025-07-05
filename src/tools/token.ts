

export const getToken = (): string|null => {
  return localStorage.getItem("token");
}


export const setToken = (token: string) => {
  localStorage.setItem("token", token)
}
