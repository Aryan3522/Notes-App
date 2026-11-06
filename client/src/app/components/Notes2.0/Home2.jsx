import React, { useContext, useEffect, useState } from "react";
import "./Home2.css";
import { ShowN } from "./ShowN";
import { Main } from "./Main";
import { Notes } from "./Notes";
import { AllNotes } from "./AllNotes";
import { AuthContext } from "@/app/context/AuthContext";
import Navbar from "../Auth/navbar";
import Sidebar from "../Sidebar/Sidebar";

export const Home2 = () => {
  const [showNote, SetShowNote] = useState(false);
  const [WriteNote,setWriteNote] = useState(false)
  const [ShowAllNotes,SetShowAllNotes] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const {AuthData} = useContext(AuthContext)

  // Remember whether the user collapsed the sidebar.
  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    } catch (error) {
      // localStorage can be unavailable (private mode); default is fine.
    }
  }, []);

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebarCollapsed", String(next));
      } catch (error) {
        // ignore
      }
      return next;
    });
  }

  // Each sidebar item shows exactly one view, so reset the others first.
  function goHome() {
    SetShowNote(false);
    setWriteNote(false);
    SetShowAllNotes(false);
  }

  function goAllNotes() {
    SetShowNote(false);
    setWriteNote(false);
    SetShowAllNotes(true);
  }

  function goNewNote() {
    SetShowNote(false);
    SetShowAllNotes(false);
    setWriteNote(true);
  }

  const activeView = WriteNote ? "new" : ShowAllNotes ? "all" : "home";

  return (
    <>
    <Navbar/>

      <div className="d-flex gap-3 px-4" style={{ height: "90vh" }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          activeView={activeView}
          onHome={goHome}
          onAllNotes={goAllNotes}
          onNewNote={goNewNote}
        />
        {/* The content fills whatever space the sidebar leaves free. */}
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          {showNote ? (
            <ShowN setWriteNote={setWriteNote} SetShowNote={SetShowNote}/>
          ) : WriteNote? <Notes setWriteNote={setWriteNote}/>
          :ShowAllNotes?<AllNotes SetShowNote={SetShowNote}/>:<Main SetShowNote={SetShowNote} setWriteNote={setWriteNote} SetShowAllNotes={SetShowAllNotes}/>
          }
        </div>
      </div>


    </>
  );
};