export interface University {
  id: string;
  name: string;
  shortName: string;
  conference: string;
  lmsProvider: 'canvas' | 'blackboard' | 'moodle' | 'brightspace';
  lmsLoginUrl: string;
  logoUrl: string;
}

// List of Division 1 universities in the US with their LMS information
export const universities: University[] = [
  {
    id: 'alabama',
    name: 'University of Alabama',
    shortName: 'Alabama',
    conference: 'SEC',
    lmsProvider: 'blackboard',
    lmsLoginUrl: 'https://ualearn.blackboard.com/ultra/institution-page',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'auburn',
    name: 'Auburn University',
    shortName: 'Auburn',
    conference: 'SEC',
    lmsProvider: 'canvas',
    lmsLoginUrl: 'https://auburn.instructure.com/',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  // ... (previous universities remain)
  {
    id: 'michigan-state',
    name: 'Michigan State University',
    shortName: 'Michigan State',
    conference: 'Big Ten',
    lmsProvider: 'brightspace',
    lmsLoginUrl: 'https://d2l.msu.edu/',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'penn-state',
    name: 'Penn State University',
    shortName: 'Penn State',
    conference: 'Big Ten',
    lmsProvider: 'canvas',
    lmsLoginUrl: 'https://canvas.psu.edu/',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'wisconsin',
    name: 'University of Wisconsin-Madison',
    shortName: 'Wisconsin',
    conference: 'Big Ten',
    lmsProvider: 'canvas',
    lmsLoginUrl: 'https://canvas.wisc.edu/',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'notre-dame',
    name: 'University of Notre Dame',
    shortName: 'Notre Dame',
    conference: 'ACC',
    lmsProvider: 'canvas',
    lmsLoginUrl: 'https://canvas.nd.edu/',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'clemson',
    name: 'Clemson University',
    shortName: 'Clemson',
    conference: 'ACC',
    lmsProvider: 'canvas',
    lmsLoginUrl: 'https://clemson.instructure.com/',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'florida-state',
    name: 'Florida State University',
    shortName: 'Florida State',
    conference: 'ACC',
    lmsProvider: 'canvas',
    lmsLoginUrl: 'https://canvas.fsu.edu/',
    logoUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  // Add more universities as needed...
];