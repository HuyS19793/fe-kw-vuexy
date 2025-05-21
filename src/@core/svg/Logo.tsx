import type { Mode } from '../types'

const Logo = ({ mode = 'light', height = 70 }: { mode?: Mode; height?: number }) => {
  const src = mode === 'dark' ? '/images/logo-dark.png' : '/images/logo-white.png'

  return (
    <>
      <img src={src} alt='logo' height={height} />
    </>
  )
}

export default Logo
