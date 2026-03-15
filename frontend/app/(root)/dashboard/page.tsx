"use client";

import React from 'react'
import UserForm from "@/components/UserForm";
import UserList from "@/components/UserList";

const Dashboard = () => {

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/orario/upload", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.text();
      alert("Risposta dal server: " + result);
    } catch (error) {
      alert("Errore di connessione. Il backend è acceso?");
    }
  };

  return (
    <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Pannello Amministratore</h1>
        
        {/* ECCO IL BOTTONE CHE MANCAVA */}
        <div className="mb-10 p-6 bg-white rounded-xl shadow-md border border-blue-100">
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Carica Nuovo Orario (CSV)</h2>
            <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
        </div>

        <div className="flex flex-row gap-8">
            <div className="flex-1">
                <h2 className="font-bold mb-4">Gestione Utenti</h2>
                <UserForm />
            </div>
            <div className="flex-1">
                <UserList />
            </div>
        </div>
    </div>
  )
}

export default Dashboard;