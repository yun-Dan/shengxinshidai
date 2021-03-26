
const homeCookies = ['crumbs']

export function clearHome (params = {}) {
  const { $cookie } = params
  homeCookies.forEach(item => {
    $cookie.delete(item)
  })
  sessionStorage.clear()
}
