import { IUser } from "../auth/types";
import {
  IMaterial,
  IEvent,
  IClassroomMember,
  IClassroom,
  ClassroomState,
  ClassroomRole,
} from "./types";

// ==================== Demo Users ====================
export const demoUsers = [
  {
    _id: "user-001-admin",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@university.edu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    _id: "user-002-coadmin",
    name: "Prof. James Anderson",
    email: "james.anderson@university.edu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    _id: "user-003-member",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@student.edu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    _id: "user-004-member",
    name: "Alex Chen",
    email: "alex.chen@student.edu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    _id: "user-005-member",
    name: "Maya Patel",
    email: "maya.patel@student.edu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    _id: "user-006-member",
    name: "Liam Johnson",
    email: "liam.johnson@student.edu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    _id: "user-007-member-blocked",
    name: "Sophia Lee",
    email: "sophia.lee@student.edu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
];

// ==================== Demo Materials ====================
export const demoMaterials: IMaterial[] = [
  {
    _id: "mat-001",
    name: "Lecture_Slides_Week_1.pdf",
    type: "pdf",
    url: "https://example.com/materials/lecture-slides-week-1.pdf",
  },
  {
    _id: "mat-002",
    name: "Assignment_Guidelines.docx",
    type: "docx",
    url: "https://example.com/materials/assignment-guidelines.docx",
  },
  {
    _id: "mat-003",
    name: "Diagram_Architecture.png",
    type: "image",
    url: "https://example.com/materials/diagram-architecture.png",
  },
  {
    _id: "mat-004",
    name: "Quiz_1_Solutions.pdf",
    type: "pdf",
    url: "https://example.com/materials/quiz-1-solutions.pdf",
  },
  {
    _id: "mat-005",
    name: "Lab_Manual.pdf",
    type: "pdf",
    url: "https://example.com/materials/lab-manual.pdf",
  },
  {
    _id: "mat-006",
    name: "CT_Sample_Questions.docx",
    type: "docx",
    url: "https://example.com/materials/ct-sample-questions.docx",
  },
];

// ==================== Demo Events ====================
export const demoEvents = [
  // Upcoming Events
  {
    _id: "event-001",
    type: "lecture",
    title: "Introduction to Software Architecture",
    date: "2026-02-10",
    startAt: "2026-02-10T10:00:00.000Z",
    endAt: "2026-02-10T11:30:00.000Z",
    location: "Room 301, Engineering Building",
    topics: "Overview of architectural patterns, MVC, MVVM, and Microservices. Discussion on scalability and maintainability.",
    materials: [demoMaterials[0], demoMaterials[2]],
    isCompleted: false,
    createdBy: demoUsers[0],
    createdAt: "2026-01-25T08:00:00.000Z",
    updatedAt: "2026-01-25T08:00:00.000Z",
  },
  {
    _id: "event-002",
    type: "quiz",
    title: "Quiz 1: Design Patterns",
    date: "2026-02-12",
    startAt: "2026-02-12T14:00:00.000Z",
    endAt: "2026-02-12T15:00:00.000Z",
    location: "Online - MS Teams",
    topics: "Singleton, Factory, Observer, and Strategy patterns. Multiple choice and short answer questions.",
    materials: [demoMaterials[3]],
    isCompleted: false,
    createdBy: demoUsers[0],
    createdAt: "2026-01-26T09:00:00.000Z",
    updatedAt: "2026-01-26T09:00:00.000Z",
  },
  {
    _id: "event-003",
    type: "assignment",
    title: "Assignment 1: Implement MVC Pattern",
    date: "2026-02-15",
    startAt: "2026-02-15T23:59:00.000Z",
    location: "Submit via Google Classroom",
    topics: "Build a simple web application using MVC architecture. Include models, views, controllers, and routing.",
    materials: [demoMaterials[1]],
    isCompleted: false,
    createdBy: demoUsers[1],
    createdAt: "2026-01-27T10:00:00.000Z",
    updatedAt: "2026-01-27T10:00:00.000Z",
  },
  {
    _id: "event-004",
    type: "ct",
    title: "Class Test 1: Architectural Concepts",
    date: "2026-02-18",
    startAt: "2026-02-18T09:00:00.000Z",
    endAt: "2026-02-18T10:30:00.000Z",
    location: "Exam Hall A",
    topics: "Comprehensive test covering Week 1-3 materials. Design patterns, SOLID principles, and system design.",
    materials: [demoMaterials[5]],
    isCompleted: false,
    createdBy: demoUsers[0],
    createdAt: "2026-01-28T08:00:00.000Z",
    updatedAt: "2026-01-28T08:00:00.000Z",
  },
  {
    _id: "event-005",
    type: "lab",
    title: "Lab 2: Database Design Patterns",
    date: "2026-02-20",
    startAt: "2026-02-20T13:00:00.000Z",
    endAt: "2026-02-20T16:00:00.000Z",
    location: "Computer Lab 4",
    topics: "Hands-on practice with Repository and Unit of Work patterns. Building data access layer with Entity Framework.",
    materials: [demoMaterials[4]],
    isCompleted: false,
    createdBy: demoUsers[1],
    createdAt: "2026-01-29T09:00:00.000Z",
    updatedAt: "2026-01-29T09:00:00.000Z",
  },
  {
    _id: "event-006",
    type: "presentation",
    title: "Student Presentations: System Design",
    date: "2026-02-22",
    startAt: "2026-02-22T10:00:00.000Z",
    endAt: "2026-02-22T12:00:00.000Z",
    location: "Seminar Hall",
    topics: "Groups present their system design proposals. Focus on scalability, security, and performance considerations.",
    materials: [],
    isCompleted: false,
    createdBy: demoUsers[0],
    createdAt: "2026-01-30T08:00:00.000Z",
    updatedAt: "2026-01-30T08:00:00.000Z",
  },
  {
    _id: "event-007",
    type: "seminar",
    title: "Guest Seminar: Cloud Architecture with AWS",
    date: "2026-02-25",
    startAt: "2026-02-25T15:00:00.000Z",
    endAt: "2026-02-25T17:00:00.000Z",
    location: "Auditorium",
    topics: "Industry expert discusses real-world cloud architecture challenges, AWS services, and best practices.",
    materials: [],
    isCompleted: false,
    createdBy: demoUsers[0],
    createdAt: "2026-01-31T10:00:00.000Z",
    updatedAt: "2026-01-31T10:00:00.000Z",
  },

  // Completed Events
  {
    _id: "event-008",
    type: "lecture",
    title: "Course Introduction & Syllabus",
    date: "2026-01-15",
    startAt: "2026-01-15T10:00:00.000Z",
    endAt: "2026-01-15T11:30:00.000Z",
    location: "Room 301, Engineering Building",
    topics: "Course overview, grading policy, project requirements, and expectations.",
    materials: [demoMaterials[0]],
    isCompleted: true,
    createdBy: demoUsers[0],
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-01-16T09:00:00.000Z",
  },
  {
    _id: "event-009",
    type: "quiz",
    title: "Pop Quiz: SOLID Principles",
    date: "2026-01-20",
    startAt: "2026-01-20T14:00:00.000Z",
    endAt: "2026-01-20T14:30:00.000Z",
    location: "Room 301",
    topics: "Quick assessment on Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
    materials: [],
    isCompleted: true,
    createdBy: demoUsers[1],
    createdAt: "2026-01-20T13:00:00.000Z",
    updatedAt: "2026-01-21T08:00:00.000Z",
  },
  {
    _id: "event-010",
    type: "lab",
    title: "Lab 1: Git & Version Control",
    date: "2026-01-22",
    startAt: "2026-01-22T13:00:00.000Z",
    endAt: "2026-01-22T16:00:00.000Z",
    location: "Computer Lab 4",
    topics: "Introduction to Git workflows, branching strategies, pull requests, and collaboration best practices.",
    materials: [demoMaterials[4]],
    isCompleted: true,
    createdBy: demoUsers[1],
    createdAt: "2026-01-18T09:00:00.000Z",
    updatedAt: "2026-01-23T10:00:00.000Z",
  },
];

// ==================== Demo Classroom Members ====================
export const demoClassroomMembers = [
  {
    user: demoUsers[0], // Admin
    role: "admin",
    isBlocked: false,
    joinedAt: "2026-01-01T08:00:00.000Z",
  },
  {
    user: demoUsers[1], // Co-Admin
    role: "co_admin",
    isBlocked: false,
    joinedAt: "2026-01-02T09:00:00.000Z",
  },
  {
    user: demoUsers[2], // Member
    role: "member",
    isBlocked: false,
    joinedAt: "2026-01-05T10:00:00.000Z",
  },
  {
    user: demoUsers[3], // Member
    role: "member",
    isBlocked: false,
    joinedAt: "2026-01-06T11:00:00.000Z",
  },
  {
    user: demoUsers[4], // Member
    role: "member",
    isBlocked: false,
    joinedAt: "2026-01-07T12:00:00.000Z",
  },
  {
    user: demoUsers[5], // Member
    role: "member",
    isBlocked: false,
    joinedAt: "2026-01-08T13:00:00.000Z",
  },
  {
    user: demoUsers[6], // Blocked Member
    role: "member",
    isBlocked: true,
    joinedAt: "2026-01-09T14:00:00.000Z",
  },
];

// ==================== Demo Classroom ====================
export const demoClassroom = {
  _id: "classroom-001",
  name: "Software Architecture & Design - Spring 2026",
  description:
    "Advanced course covering software architecture patterns, design principles, and system design. Focus on building scalable, maintainable applications.",
  institute: "University of Technology",
  department: "Computer Science & Engineering",
  intake: "Spring 2026",
  section: "A",
  joinCode: "CSE301-S26",
  isJoinCodeActive: true,
  createdBy: demoUsers[0]._id,
  members: demoClassroomMembers,
  events: demoEvents,
  isActive: true,
  isArchived: false,
  coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop",
  totalMembers: 7,
  totalEvents: 10,
  myRole: "admin", // This would be set based on logged-in user
};

// ==================== Demo Redux State ====================
export const demoClassroomState = {
  classroom: demoClassroom,
  loading: false,
  error: null,
  requestStatus: {
    // Classroom related statuses
    fetchClassroom: { loading: false, error: null },
    joinClassroom: { loading: false, error: null },
    leaveClassroom: { loading: false, error: null },
    createClassroom: { loading: false, error: null },
    // Event related statuses
    fetchEvents: { loading: false, error: null },
    updateEvent: { loading: false, error: null },
    deleteEvent: { loading: false, error: null },
    createEvent: { loading: false, error: null },
  },
};

// ==================== Helper Functions ====================

// Get active/upcoming events
export const getUpcomingEvents = (events: IEvent[]) => {
  const now = new Date();
  return events
    .filter((e) => !e.isCompleted && new Date(e.startAt) > now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
};

// Get completed events
export const getCompletedEvents = (events: IEvent[]) => {
  return events
    .filter((e) => e.isCompleted)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
};

// Get events by type
export const getEventsByType = (events: IEvent[], type: IEvent["type"]) => {
  return events.filter((e) => e.type === type);
};

// Get classroom admins
export const getClassroomAdmins = (members: IClassroomMember[]) => {
  return members.filter((m) => m.role === "admin" || m.role === "co_admin");
};

// Get classroom students
export const getClassroomStudents = (members: IClassroomMember[]) => {
  return members.filter((m) => m.role === "member");
};

// Get blocked members
export const getBlockedMembers = (members: IClassroomMember[]) => {
  return members.filter((m) => m.isBlocked);
};

// Get active members
export const getActiveMembers = (members: IClassroomMember[]) => {
  return members.filter((m) => !m.isBlocked);
};

// Check if user is admin
export const isUserAdmin = (role?: ClassroomRole) => {
  return role === "admin" || role === "co_admin";
};

// Format date
export const formatEventDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time
export const formatEventTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// ==================== Export All ====================
export default {
  users: demoUsers,
  materials: demoMaterials,
  events: demoEvents,
  members: demoClassroomMembers,
  classroom: demoClassroom,
  state: demoClassroomState,
  helpers: {
    getUpcomingEvents,
    getCompletedEvents,
    getEventsByType,
    getClassroomAdmins,
    getClassroomStudents,
    getBlockedMembers,
    getActiveMembers,
    isUserAdmin,
    formatEventDate,
    formatEventTime,
  },
};