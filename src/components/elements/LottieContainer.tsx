'use client'
import dynamic from 'next/dynamic'
import { Box } from '@mui/system'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function LottieContainer({ height, width, data } : {
  height: string,
  width: string,
  data: object
}) {
  return (
    <Box
      sx={{ height: { height }, width: { width } }}
      className={'lottie-container'}
    >
      <Lottie
        animationData={data}
        loop={true}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
        }}
      />
    </Box>
  )
}
