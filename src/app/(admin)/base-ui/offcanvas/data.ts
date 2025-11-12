export type BackdropOption = {
  name: string
  scroll: boolean
  backdrop: boolean
  variant: string
}

export type PlacementOption = {
  name: string
  placement?: 'start' | 'end' | 'top' | 'bottom'
  variant: string
}

export const backdropOptions: BackdropOption[] = [
  {
    name: 'Enable Body Scrolling',
    scroll: true,
    backdrop: false,
    variant: 'primary',
  },
  {
    name: 'Enable Backdrop (Default)',
    scroll: false,
    backdrop: true,
    variant: 'secondary',
  },
  {
    name: 'Enable Both Scrolling & Backdrop',
    scroll: true,
    backdrop: true,
    variant: 'success',
  },
]

export const placementOptions: PlacementOption[] = [
  {
    name: 'Left',
    placement: 'start',
    variant: 'primary',
  },
  {
    name: 'Right',
    placement: 'end',
    variant: 'secondary',
  },
  {
    name: 'Top',
    placement: 'top',
    variant: 'success',
  },
  {
    name: 'Bottom',
    placement: 'bottom',
    variant: 'info',
  },
]
