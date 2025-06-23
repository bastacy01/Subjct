export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  meetingTimes: string;
  location: string;
}

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  courses: Course[];
}

export const semesters: Semester[] = [
  {
    id: 'fall-2025',
    name: 'Fall 2025',
    startDate: '2025-08-25',
    endDate: '2025-12-15',
    courses: [
      {
        id: 'cs210',
        code: 'CS 210',
        name: 'Introduction to Computer Science',
        instructor: 'Dr. Jane Smith',
        credits: 3,
        meetingTimes: 'MWF 10:00-10:50',
        location: 'Science Building 101'
      },
      {
        id: 'math241',
        code: 'MATH 241',
        name: 'Calculus III',
        instructor: 'Dr. Robert Johnson',
        credits: 4,
        meetingTimes: 'TTh 11:00-12:15',
        location: 'Math Building 305'
      },
      {
        id: 'phys211',
        code: 'PHYS 211',
        name: 'University Physics I',
        instructor: 'Dr. Michael Chen',
        credits: 4,
        meetingTimes: 'MWF 1:00-1:50, T 3:00-4:50 (Lab)',
        location: 'Physics Building 210'
      }
    ]
  },
  {
    id: 'spring-2026',
    name: 'Spring 2026',
    startDate: '2026-01-12',
    endDate: '2026-05-07',
    courses: [
      {
        id: 'cs201',
        code: 'CS 201',
        name: 'Data Structures and Algorithms',
        instructor: 'Dr. Thomas Lee',
        credits: 3,
        meetingTimes: 'MWF 11:00-11:50',
        location: 'Science Building 203'
      },
      {
        id: 'math242',
        code: 'MATH 242',
        name: 'Differential Equations',
        instructor: 'Dr. Emily Parker',
        credits: 3,
        meetingTimes: 'TTh 2:00-3:15',
        location: 'Math Building 202'
      },
      {
        id: 'phys212',
        code: 'PHYS 212',
        name: 'University Physics II',
        instructor: 'Dr. Michael Chen',
        credits: 4,
        meetingTimes: 'MWF 2:00-2:50, Th 3:00-4:50 (Lab)',
        location: 'Physics Building 210'
      },
      {
        id: 'hist101',
        code: 'HIST 101',
        name: 'World History I',
        instructor: 'Prof. David Thompson',
        credits: 3,
        meetingTimes: 'MWF 9:00-9:50',
        location: 'Humanities Hall 305'
      }
    ]
  },
  {
    id: 'summer-2026',
    name: 'Summer 2026',
    startDate: '2026-06-01',
    endDate: '2026-07-30',
    courses: [
      {
        id: 'cs215',
        code: 'CS 215',
        name: 'Database Systems',
        instructor: 'Dr. Amanda Garcia',
        credits: 3,
        meetingTimes: 'MTWTh 9:00-10:30',
        location: 'Science Building 105'
      },
      {
        id: 'psyc101',
        code: 'PSYC 101',
        name: 'Introduction to Psychology',
        instructor: 'Dr. James Wilson',
        credits: 3,
        meetingTimes: 'MTWTh 1:00-2:30',
        location: 'Social Sciences 203'
      }
    ]
  }
];