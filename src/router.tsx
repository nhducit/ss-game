import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NavBar } from '@/games/NavBar'
import { SetupProfile } from '@/games/SetupProfile'
import { LockScreen } from '@/games/LockScreen'
import { getPlayer, getAppConfig, type AppConfig } from '@/games/convex-sync'
import { Menu } from '@/games/Menu'
import { Caro } from '@/games/caro/Caro'
import { TicTacToe } from '@/games/tic-tac-toe/TicTacToe'
import { OAnQuan } from '@/games/o-an-quan/OAnQuan'
import { ConnectFour } from '@/games/connect-four/ConnectFour'
import { DotsAndBoxes } from '@/games/dots-and-boxes/DotsAndBoxes'
import { Reversi } from '@/games/reversi/Reversi'
import { SpellingBee } from '@/games/spelling-bee/SpellingBee'
import { WordMatch } from '@/games/word-match/WordMatch'
import { ListenPick } from '@/games/listen-pick/ListenPick'
import { GamesMenu } from '@/games/GamesMenu'
import { PinyinSpell } from '@/games/pinyin-spell/PinyinSpell'
import { CharacterMatch } from '@/games/character-match/CharacterMatch'
import { ChineseListenPick } from '@/games/chinese-listen-pick/ChineseListenPick'
import { SentenceBuilder } from '@/games/sentence-builder/SentenceBuilder'
import { Hangman } from '@/games/hangman/Hangman'
import { Profile } from '@/games/Profile'
import { Admin } from '@/games/Admin'

function isWithinSchedule(schedule: AppConfig['schedule']): boolean {
  if (schedule.length === 0) return true // no schedule = always allowed
  const now = new Date()
  const day = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  return schedule.some(slot =>
    slot.day === day &&
    mins >= slot.startHour * 60 + slot.startMin &&
    mins < slot.endHour * 60 + slot.endMin
  )
}

function computeLocked(config: AppConfig): boolean {
  if (config.locked) return true
  return !isWithinSchedule(config.schedule)
}

function RootComponent() {
  const [state, setState] = useState<'loading' | 'setup' | 'ready'>('loading')
  const [locked, setLocked] = useState(true) // locked by default until proven otherwise
  const location = useLocation()

  useEffect(() => {
    Promise.all([getPlayer(), getAppConfig()])
      .then(([player, config]) => {
        setLocked(computeLocked(config))
        setState(player?.name ? 'ready' : 'setup')
      })
      .catch(() => setState('setup'))
  }, [])

  // Re-check lock state every 30 seconds + on route change
  const checkLock = useCallback(() => {
    getAppConfig().then(config => {
      setLocked(computeLocked(config))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    checkLock()
    const interval = setInterval(checkLock, 30_000)
    return () => clearInterval(interval)
  }, [checkLock, location.pathname])

  // Admin page bypasses lock
  const isAdminPage = location.pathname === '/admin'

  if (state === 'loading') {
    return (
      <TooltipProvider>
        <div className="flex min-h-svh items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </TooltipProvider>
    )
  }

  if (state === 'setup') {
    return (
      <TooltipProvider>
        <SetupProfile onComplete={() => setState('ready')} />
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      {locked && !isAdminPage && <LockScreen />}
      <NavBar />
      <Outlet />
    </TooltipProvider>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Menu,
})

const caroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/caro',
  component: Caro,
})

const ticTacToeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tic-tac-toe',
  component: TicTacToe,
})

const oAnQuanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/o-an-quan',
  component: OAnQuan,
})

const connectFourRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/connect-four',
  component: ConnectFour,
})

const dotsAndBoxesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dots-and-boxes',
  component: DotsAndBoxes,
})

const reversiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reversi',
  component: Reversi,
})

const spellingBeeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spelling-bee',
  component: SpellingBee,
})

const wordMatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/word-match',
  component: WordMatch,
})

const listenPickRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listen-pick',
  component: ListenPick,
})

const gamesMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GamesMenu,
})

const pinyinSpellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pinyin-spell',
  component: PinyinSpell,
})

const characterMatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character-match',
  component: CharacterMatch,
})

const chineseListenPickRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chinese-listen-pick',
  component: ChineseListenPick,
})

const sentenceBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sentence-builder',
  component: SentenceBuilder,
})

const hangmanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hangman',
  component: Hangman,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
})

const routeTree = rootRoute.addChildren([
  menuRoute,
  gamesMenuRoute,
  caroRoute,
  ticTacToeRoute,
  oAnQuanRoute,
  connectFourRoute,
  dotsAndBoxesRoute,
  reversiRoute,
  spellingBeeRoute,
  wordMatchRoute,
  listenPickRoute,
  pinyinSpellRoute,
  characterMatchRoute,
  chineseListenPickRoute,
  sentenceBuilderRoute,
  hangmanRoute,
  profileRoute,
  adminRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
