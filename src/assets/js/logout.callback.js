
const cookies = ['userInfo', 'headers', 'crumbs']

export function clearLoginOut (params = {}) {
  const { $cookie } = params
  cookies.forEach(item => {
    $cookie.delete(item)
  })
  sessionStorage.clear()
  localStorage.clear()
}
