import React, { createContext, useContext, useEffect, useState } from "react";

/*
 Central app data and persistence to localStorage:
 keys: cg_institutions, cg_faculties, cg_courses, cg_applications, cg_companies, cg_jobs, cg_users, cg_transcripts
*/

const ApplicationContext = createContext();

export function ApplicationProvider({ children }) {
  const [institutions, setInstitutions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_institutions")) || []; } catch { return []; }
  });

  const [faculties, setFaculties] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_faculties")) || []; } catch { return []; }
  });

  const [courses, setCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_courses")) || []; } catch { return []; }
  });

  const [applications, setApplications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_applications")) || []; } catch { return []; }
  });

  const [companies, setCompanies] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_companies")) || []; } catch { return []; }
  });

  const [jobs, setJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_jobs")) || []; } catch { return []; }
  });

  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_users")) || []; } catch { return []; }
  });

  // NEW: transcripts
  const [transcripts, setTranscripts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cg_transcripts")) || []; } catch { return []; }
  });

  // Persist all data
  useEffect(() => { localStorage.setItem("cg_institutions", JSON.stringify(institutions)); }, [institutions]);
  useEffect(() => { localStorage.setItem("cg_faculties", JSON.stringify(faculties)); }, [faculties]);
  useEffect(() => { localStorage.setItem("cg_courses", JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem("cg_applications", JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem("cg_companies", JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem("cg_jobs", JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem("cg_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("cg_transcripts", JSON.stringify(transcripts)); }, [transcripts]);

  // Institutions
  const addInstitution = (inst) => setInstitutions(prev => [...prev, inst]);
  const updateInstitution = (id, updates) => setInstitutions(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  const deleteInstitution = (id) => setInstitutions(prev => prev.filter(i => i.id !== id));

  // Faculties
  const addFaculty = (f) => setFaculties(prev => [...prev, f]);
  const deleteFaculty = (id) => setFaculties(prev => prev.filter(f => f.id !== id));

  // Courses
  const addCourse = (c) => setCourses(prev => [...prev, c]);
  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  // Applications
  const applyForCourse = (applicationData) => setApplications(prev => [...prev, applicationData]);
  const addApplication = (a) => setApplications(prev => [...prev, a]);
  const updateApplication = (id, updates) => setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  const deleteApplication = (id) => setApplications(prev => prev.filter(a => a.id !== id));

  // Companies
  const addCompany = (c) => setCompanies(prev => [...prev, c]);
  const updateCompany = (id, updates) => setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteCompany = (id) => setCompanies(prev => prev.filter(c => c.id !== id));

  // Jobs
  const addJob = (j) => setJobs(prev => [...prev, j]);
  const updateJob = (id, updates) => setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  const deleteJob = (id) => setJobs(prev => prev.filter(j => j.id !== id));

  // Users
  const addUser = (u) => setUsers(prev => [...prev, u]);
  const updateUserStatus = (id, status) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  // Admissions helpers
  const admitApplication = (id) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    setApplications(prev => prev.map(a => {
      if (a.studentId === app.studentId && a.institutionId === app.institutionId && a.id !== id && a.status === "admitted") {
        return { ...a, status: "rejected" };
      }
      return a.id === id ? { ...a, status: "admitted" } : a;
    }));
  };

  const finalizeStudentChoice = (studentId, chosenApplicationId) => {
    setApplications(prev => {
      const chosen = prev.find(a => a.id === chosenApplicationId);
      return prev.map(a => {
        if (a.studentId === studentId) {
          if (a.id === chosenApplicationId) return { ...a, status: "accepted_by_student" };
          if (a.status === "admitted" || a.status === "pending") return { ...a, status: "withdrawn" };
        }
        return a;
      });
    });
  };

  // NEW: Transcripts helpers
  const uploadTranscript = (studentId, file) => {
    const newTranscript = {
      id: `transcript_${Date.now()}`,
      studentId,
      fileName: file.name,
      uploadedDate: new Date().toISOString(),
      file
    };
    setTranscripts(prev => [...prev, newTranscript]);
  };

  const deleteTranscript = (id) => {
    setTranscripts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ApplicationContext.Provider value={{
      institutions, setInstitutions, addInstitution, updateInstitution, deleteInstitution,
      faculties, setFaculties, addFaculty, deleteFaculty,
      courses, setCourses, addCourse, deleteCourse,
      applications, setApplications, addApplication, updateApplication, deleteApplication, applyForCourse,
      companies, setCompanies, addCompany, updateCompany, deleteCompany,
      jobs, setJobs, addJob, updateJob, deleteJob,
      users, setUsers, addUser, updateUserStatus, deleteUser,
      transcripts, setTranscripts, uploadTranscript, deleteTranscript,
      admitApplication, finalizeStudentChoice
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useAppData() {
  return useContext(ApplicationContext);
}
