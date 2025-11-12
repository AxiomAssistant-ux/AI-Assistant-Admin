import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import { NotificationType } from '@/types/data'

export const notificationsData: NotificationType[] = [
  {
    from: 'Sally Bieber ',
    content: 'started following you. Check out their profile!"',
    icon: avatar1,
  },
  {
    from: 'Gloria Chambers',
    content: "mentioned you in a comment: '@admin, check this out!",
  },
  {
    from: 'Jacob Gines',
    content: "  Answered to your comment on the cash flow forecast's graph 🔔.",
    icon: avatar3,
  },
  {
    from: '',
    content: 'A new system update is available. Update now for the latest features',
    icon: avatar5,
  },
  {
    from: 'Shawn Bunch',
    content: " commented on your post: 'Great photo!",
  },
]
