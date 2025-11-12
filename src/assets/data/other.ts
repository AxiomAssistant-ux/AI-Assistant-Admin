import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import avatar7 from '@/assets/images/users/avatar-7.jpg'
import {
  Employee,
  PaginationType,
  SearchType,
  SortingType,
  LoadingType,
  HiddenType,
  PricingType,
  ProjectType,
  // TimelineType,
} from '@/types/data'

// export const timelineData: TimelineType = {
//   Today: [
//     {
//       title: "Completed UX design project for our client",
//       description:
//         "Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?",
//       important: true,
//     },
//     {
//       title: "Yes! We are celebrating our first admin release.",
//       description:
//         "Consectetur adipisicing elit. Iusto, optio, dolorum John deon provident.",
//     },
//     {
//       title: "We released new version of our theme Rasket.",
//       description: "3 new photo Uploaded on facebook fan page",
//     },
//   ],
//   Yesterday: [
//     {
//       title: "We have archieved 25k sales in our themes",
//       description:
//         "Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?",
//     },
//     {
//       title: "Yes! We are celebrating our first admin release.",
//       description:
//         "Outdoor visit at California State Route 85 with John Boltana & Harry Piterson.",
//     },
//   ],
// };

export const pricingData: PricingType[] = [
  {
    id: '1',
    name: 'Free Pack',
    price: 0,
    features: ['5 GB Storage', '100 GB Bandwidth', '1 Domain', 'No Support', '24x7 Support', '1 User'],
  },
  {
    id: '2',
    name: 'Professional Pack',
    price: 19,
    features: ['50 GB Storage', '900 GB Bandwidth', '1 Domain', 'Email Support', '24x7 Support', '5 User'],
    isPopular: true,
    subscribed: true,
  },
  {
    id: '3',
    name: 'Business Pack',
    price: 29,
    features: ['500 GB Storage', '2.5 TB Bandwidth', '5 Domain', 'Email Support', '24x7 Support', '10 User'],
  },
  {
    id: '4',
    name: 'EnterPrice Pack',
    price: 29,
    features: ['2 TB Storage', 'Unlimited Bandwidth', '50 Domain', 'Email Support', '24x7 Support', 'Unlimited User'],
  },
]

export const projectsData: ProjectType[] = [
  {
    id: '1',
    projectName: 'Zelogy',
    client: 'Daniel Olsen',
    teamMembers: [avatar2, avatar3, avatar4],
    deadlineDate: new Date('12/4/2024'),
    progressValue: 33,
    variant: 'primary',
  },
  {
    id: '2',
    projectName: 'Shiaz',
    client: 'Jack Roldan',
    teamMembers: [avatar1, avatar5],
    deadlineDate: new Date('10/4/2024'),
    progressValue: 74,
    variant: 'success',
  },
  {
    id: '3',
    projectName: 'Holderick',
    client: 'Betty Cox',
    teamMembers: [avatar5, avatar2, avatar3],
    deadlineDate: new Date('31/3/2024'),
    progressValue: 50,
    variant: 'warning',
  },
  {
    id: '4',
    projectName: 'Feyvux',
    client: 'Carlos Johnson',
    teamMembers: [avatar3, avatar7, avatar6],
    deadlineDate: new Date('25/3/2024'),
    progressValue: 92,
    variant: 'primary',
  },
  {
    id: '5',
    projectName: 'Xavlox',
    client: 'Lorraine Cox',
    teamMembers: [avatar7],
    deadlineDate: new Date('22/3/2024'),
    progressValue: 48,
    variant: 'danger',
  },
  {
    id: '6',
    projectName: 'Mozacav',
    client: 'Delores Young',
    teamMembers: [avatar3, avatar4, avatar2],
    deadlineDate: new Date('15/3/2024'),
    progressValue: 21,
    variant: 'primary',
  },
]

export const dataTableRecords: Employee[] = [
  {
    id: '11',
    name: 'Alice',
    email: 'alice@example.com',
    position: 'Software Engineer',
    company: 'ABC Company',
    country: 'United States',
    actions: 'details',
  },
  {
    id: '12',
    name: 'Bob',
    email: 'bob@example.com',
    position: 'Product Manager',
    company: 'XYZ Inc',
    country: 'Canada',
    actions: 'details',
  },
  {
    id: '13',
    name: 'Charlie',
    email: 'charlie@example.com',
    position: 'Data Analyst',
    company: '123 Corp',
    country: 'Australia',
    actions: 'details',
  },
  {
    id: '14',
    name: 'David',
    email: 'david@example.com',
    position: 'UI/UX Designer',
    company: '456 Ltd',
    country: 'United Kingdom',
    actions: 'details',
  },
  {
    id: '15',
    name: 'Eve',
    email: 'eve@example.com',
    position: 'Marketing Specialist',
    company: '789 Enterprises',
    country: 'France',
    actions: 'details',
  },
  {
    id: '16',
    name: 'Frank',
    email: 'frank@example.com',
    position: 'HR Manager',
    company: 'ABC Company',
    country: 'Germany',
    actions: 'details',
  },
  {
    id: '17',
    name: 'Grace',
    email: 'grace@example.com',
    position: 'Financial Analyst',
    company: 'XYZ Inc',
    country: 'Japan',
    actions: 'details',
  },
  {
    id: '18',
    name: 'Hannah',
    email: 'hannah@example.com',
    position: 'Sales Representative',
    company: '123 Corp',
    country: 'Brazil',
    actions: 'details',
  },
  {
    id: '19',
    name: 'Ian',
    email: 'ian@example.com',
    position: 'Software Developer',
    company: '456 Ltd',
    country: 'India',
    actions: 'details',
  },
  {
    id: '20',
    name: 'Jane',
    email: 'jane@example.com',
    position: 'Operations Manager',
    company: '789 Enterprises',
    country: 'China',
    actions: 'details',
  },
]

export const dataTable: PaginationType[] = [
  {
    id: '#RB2320',
    name: 'Alice',
    date: '	07 Oct, 2024',
    total: '	$24.05',
    actions: 'details',
  },
  {
    id: '#RB8652',
    name: 'Bob',
    date: '	07 Oct, 2024',
    total: '	$26.15',
    actions: 'details',
  },
  {
    id: '#RB8520',
    name: 'Charlie',
    date: '	06 Oct, 2024',
    total: '		$21.25',
    actions: 'details',
  },
  {
    id: '#RB9512',
    name: 'David',
    date: '	05 Oct, 2024',
    total: '	$25.03',
    actions: 'details',
  },
  {
    id: '#RB7532',
    name: 'Eve',
    date: '	04 Oct, 2024',
    total: '	$22.61',
    actions: 'details',
  },
]

export const searchTableRecords: SearchType[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    position: 'Software Engineer	',
    company: 'ABC Company	',
    country: 'United States',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    position: 'Product Manager	',
    company: 'XYZ Inc	',
    country: 'Canada',
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    position: 'Data Analyst	',
    company: '123 Corp	',
    country: 'Australia',
  },
  {
    name: 'David',
    email: 'david@example.com',
    position: 'UI/UX Designer	',
    company: '456 Ltd	',
    country: 'United Kingdom',
  },
  {
    name: 'Eve',
    email: 'eve@example.com',
    position: 'Marketing Specialist		',
    company: '789 Enterprises		',
    country: 'France',
  },
  {
    name: 'Frank',
    email: 'frank@example.com',
    position: 'HR Manager',
    company: 'ABC Company',
    country: 'Germany',
  },
  {
    name: 'Grace',
    email: 'grace@example.com',
    position: 'Financial Analyst',
    company: 'XYZ Inc',
    country: 'Japan',
  },
  {
    name: 'Hannah',
    email: 'Hannah@example.com',
    position: 'Sales Representative	',
    company: '123 Corp	',
    country: 'Brazil',
  },
  {
    name: 'Ian',
    email: 'ian@example.com',
    position: 'Software Developer	',
    company: '456 Ltd	',
    country: 'India',
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    position: 'Operations Manager	',
    company: '789 Enterprises	',
    country: 'China',
  },
]

export const sortingTableRecords: SortingType[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    position: 'Software Engineer	',
    company: 'ABC Company	',
    country: 'United States',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    position: 'Product Manager	',
    company: 'XYZ Inc	',
    country: 'Canada',
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    position: 'Data Analyst	',
    company: '123 Corp	',
    country: 'Australia',
  },
  {
    name: 'David',
    email: 'david@example.com',
    position: 'UI/UX Designer	',
    company: '456 Ltd	',
    country: 'United Kingdom',
  },
  {
    name: 'Eve',
    email: 'eve@example.com',
    position: 'Marketing Specialist		',
    company: '789 Enterprises		',
    country: 'France',
  },
  {
    name: 'Frank',
    email: 'frank@example.com',
    position: 'HR Manager',
    company: 'ABC Company',
    country: 'Germany',
  },
  {
    name: 'Grace',
    email: 'grace@example.com',
    position: 'Financial Analyst',
    company: 'XYZ Inc',
    country: 'Japan',
  },
  {
    name: 'Hannah',
    email: 'Hannah@example.com',
    position: 'Sales Representative	',
    company: '123 Corp	',
    country: 'Brazil',
  },
  {
    name: 'Ian',
    email: 'ian@example.com',
    position: 'Software Developer	',
    company: '456 Ltd	',
    country: 'India',
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    position: 'Operations Manager	',
    company: '789 Enterprises	',
    country: 'China',
  },
]

export const loadingTableRecords: LoadingType[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    position: 'Software Engineer	',
    company: 'ABC Company	',
    country: 'United States',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    position: 'Product Manager	',
    company: 'XYZ Inc	',
    country: 'Canada',
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    position: 'Data Analyst	',
    company: '123 Corp	',
    country: 'Australia',
  },
  {
    name: 'David',
    email: 'david@example.com',
    position: 'UI/UX Designer	',
    company: '456 Ltd	',
    country: 'United Kingdom',
  },
  {
    name: 'Eve',
    email: 'eve@example.com',
    position: 'Marketing Specialist		',
    company: '789 Enterprises		',
    country: 'France',
  },
  {
    name: 'Frank',
    email: 'frank@example.com',
    position: 'HR Manager',
    company: 'ABC Company',
    country: 'Germany',
  },
  {
    name: 'Grace',
    email: 'grace@example.com',
    position: 'Financial Analyst',
    company: 'XYZ Inc',
    country: 'Japan',
  },
  {
    name: 'Hannah',
    email: 'Hannah@example.com',
    position: 'Sales Representative	',
    company: '123 Corp	',
    country: 'Brazil',
  },
  {
    name: 'Ian',
    email: 'ian@example.com',
    position: 'Software Developer	',
    company: '456 Ltd	',
    country: 'India',
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    position: 'Operations Manager	',
    company: '789 Enterprises	',
    country: 'China',
  },
]

export const hiddenTableRecords: HiddenType[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    position: 'Software Engineer	',
    company: 'ABC Company	',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    position: 'Product Manager	',
    company: 'XYZ Inc	',
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    position: 'Data Analyst	',
    company: '123 Corp	',
  },
  {
    name: 'David',
    email: 'david@example.com',
    position: 'UI/UX Designer	',
    company: '456 Ltd	',
  },
  {
    name: 'Eve',
    email: 'eve@example.com',
    position: 'Marketing Specialist		',
    company: '789 Enterprises		',
  },
  {
    name: 'Frank',
    email: 'frank@example.com',
    position: 'HR Manager',
    company: 'ABC Company',
  },
  {
    name: 'Grace',
    email: 'grace@example.com',
    position: 'Financial Analyst',
    company: 'XYZ Inc',
  },
  {
    name: 'Hannah',
    email: 'Hannah@example.com',
    position: 'Sales Representative	',
    company: '123 Corp	',
  },
  {
    name: 'Ian',
    email: 'ian@example.com',
    position: 'Software Developer	',
    company: '456 Ltd	',
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    position: 'Operations Manager	',
    company: '789 Enterprises	',
  },
]
