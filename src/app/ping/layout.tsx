// import cn from 'classnames'

// // Thêm subsets: ['latin'] hoặc 'cyrillic', 'latin-ext' tùy nhu cầu
// const zenKakuGothicNew = Zen_Kaku_Gothic_New({
//   weight: ['300', '400', '500', '700', '900'],
//   subsets: ['latin'], // <= CHỈ ĐỊNH SUBSET
//   preload: true // preload mặc định = true, có thể tắt nếu không cần
// })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' dir='ltr'>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}
