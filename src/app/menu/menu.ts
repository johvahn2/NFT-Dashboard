import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Overview',
    translate: 'MENU.DASHBOARD',
    type: 'item',
    icon: 'home',
    url: 'dashboard'
  },
  {
    id: 'apps',
    type: 'section',
    title: 'Apps',
    icon: 'package',
    children: [
      {
        id: 'proposal',
        title: 'Proposal',
        type: 'item',
        icon: 'message-circle',
        url: 'proposal',
        disabled: true
      },
      {
        id: 'message',
        title: 'Message',
        type: 'item',
        icon: 'message-square',
        url: 'message',
        disabled: true
      },
      {
        id: 'community-fund',
        title: 'Community Fund',
        type: 'item',
        icon: 'dollar-sign',
        url: 'community-fund',
        disabled: true
      },
      {
        id: 'my-ducks',
        title: 'My Ducks',
        type: 'item',
        icon: 'shopping-bag',
        url: 'my-ducks',
        disabled: true
      },
      {
        id: 'staking',
        title: 'Staking',
        type: 'item',
        icon: 'lock',
        url: 'staking',
        disabled: true
      },
    ]
  }
]
