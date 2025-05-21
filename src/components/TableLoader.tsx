import { useTranslations } from 'next-intl'

import { useSettings } from '@/@core/hooks/useSettings'

interface TableLoaderProps {
  isDarkMode?: boolean
  message?: string
}

const TableLoader = ({ isDarkMode: providedDarkMode, message }: TableLoaderProps) => {
  const t = useTranslations()

  // Get dark mode from settings if not provided as prop
  const { settings } = useSettings()
  const isDarkMode = providedDarkMode !== undefined ? providedDarkMode : settings.mode === 'dark'

  // Colors based on theme
  const colors = {
    sakura: isDarkMode ? '#ff8fab' : '#ffb7c5',
    sakuraDark: isDarkMode ? '#e67a94' : '#ff8fab',
    text: isDarkMode ? '#f8f8f8' : '#4b4b4b',
    background: isDarkMode ? 'rgba(16, 24, 40, 0.6)' : 'rgba(255, 255, 255, 0.6)'
  }

  return (
    <div
      className='absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50 backdrop-blur-[2px]'
      style={{ backgroundColor: colors.background }}
    >
      <div className='relative w-28 h-28 flex items-center justify-center'>
        {/* Rotating container with fixed center */}
        <div className='w-full h-full absolute animate-spin-slow'>
          {/* Sakura flower with petals in full bloom */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <div
              key={i}
              className='absolute left-1/2 top-1/2 origin-center animate-pulse'
              style={{
                width: '20px',
                height: '30px',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: `linear-gradient(145deg, ${colors.sakura}, ${colors.sakuraDark})`,
                transform: `rotate(${angle}deg) translateY(-25px)`,
                marginLeft: '-10px',
                marginTop: '-15px',
                animationDelay: `${i * 0.3}s`,
                boxShadow: `0 0 10px ${colors.sakura}40`
              }}
            />
          ))}
        </div>

        {/* Center circle - fixed position */}
        <div
          className='absolute rounded-full z-10'
          style={{
            width: '14px',
            height: '14px',
            background: `radial-gradient(circle, #ffff88, ${colors.sakuraDark})`,
            boxShadow: `0 0 10px ${colors.sakura}80`
          }}
        />
      </div>

      {/* Loading text with Japanese style */}
      <div className='mt-6 flex flex-col items-center'>
        <p className='text-base font-medium tracking-wider' style={{ color: colors.text }}>
          {message || t('Fetching')}
        </p>
        <p className='text-sm' style={{ color: colors.text, opacity: 0.8 }}>
          ロード中...
        </p>
      </div>

      {/* Add global keyframes for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pulse {
          animation: pulse 1.5s infinite;
        }

        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default TableLoader
