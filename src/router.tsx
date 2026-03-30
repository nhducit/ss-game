import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Menu } from '@/games/Menu'
import { Caro } from '@/games/caro/Caro'
import { TicTacToe } from '@/games/tic-tac-toe/TicTacToe'
import { OAnQuan } from '@/games/o-an-quan/OAnQuan'
import { ConnectFour } from '@/games/connect-four/ConnectFour'
import { DotsAndBoxes } from '@/games/dots-and-boxes/DotsAndBoxes'
import { Reversi } from '@/games/reversi/Reversi'
import { SpellingBee } from '@/games/spelling-bee/SpellingBee'

const rootRoute = createRootRoute({
  component: () => (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  ),
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

const routeTree = rootRoute.addChildren([
  menuRoute,
  caroRoute,
  ticTacToeRoute,
  oAnQuanRoute,
  connectFourRoute,
  dotsAndBoxesRoute,
  reversiRoute,
  spellingBeeRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
