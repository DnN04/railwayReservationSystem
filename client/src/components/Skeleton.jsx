import { motion } from 'framer-motion'

export const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatType: "reverse" }}
      className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear',
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(188, 19, 254, 0.1), transparent)',
        }}
      />
    </motion.div>
  )
}

export const TrainCardSkeleton = () => (
  <div className="rounded-3xl p-8 border border-white/10 relative" style={{ background: 'rgba(255,255,255,0.02)' }}>
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1 w-full">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 text-center">
            <Skeleton className="w-16 h-8 mx-auto" />
            <Skeleton className="w-12 h-3 mx-auto" />
          </div>
          <div className="flex-1 px-4 flex flex-col items-center">
            <Skeleton className="w-full h-0.5 rounded-full" />
            <Skeleton className="w-4 h-4 mt-2 rounded-full bg-[#ebb2ff]/20" />
          </div>
          <div className="space-y-2 text-center">
            <Skeleton className="w-16 h-8 mx-auto" />
            <Skeleton className="w-12 h-3 mx-auto" />
          </div>
        </div>
      </div>
      <div className="w-full md:w-72 md:border-l border-white/10 md:pl-8 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  </div>
)

export const TicketCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden flex flex-col border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
    <div className="p-6 flex-1">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <Skeleton className="w-12 h-3" />
          <Skeleton className="w-32 h-6" />
        </div>
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-12 h-3" />
        </div>
        <div className="space-y-2 flex flex-col items-end">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-12 h-3" />
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-3">
        <div className="space-y-1"><Skeleton className="w-8 h-2" /><Skeleton className="w-16 h-3" /></div>
        <div className="space-y-1"><Skeleton className="w-8 h-2" /><Skeleton className="w-12 h-3" /></div>
        <div className="space-y-1"><Skeleton className="w-10 h-2" /><Skeleton className="w-14 h-3" /></div>
        <div className="space-y-1"><Skeleton className="w-8 h-2" /><Skeleton className="w-20 h-3" /></div>
      </div>
    </div>
    <div className="bg-black/40 border-t border-white/5 p-4 flex justify-between items-center">
      <div className="space-y-1"><Skeleton className="w-12 h-2" /><Skeleton className="w-24 h-4" /></div>
      <div className="space-y-1 flex flex-col items-end"><Skeleton className="w-8 h-2" /><Skeleton className="w-16 h-4" /></div>
    </div>
  </div>
)
