import React, { useState, useEffect } from 'react';
import Events from './Events';
import AddMembers from './Addmember';
import AddStudentMembers from './Addstudents';

const EHaCs=() => {
    const [isCoordinator, setIsCoordinator] = useState(false);
    const email = localStorage.getItem("emailCont");
    useEffect(() => {
        const roles = localStorage.getItem('roles');
        setIsCoordinator((roles === "coordinator") && (email === ""));
    }, []);
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-black text-center">EHaCs</h1>
            <div className="space-y-6">
                <Events club={"E-HaCs"} />
                {isCoordinator && <AddMembers />}
                {isCoordinator && <AddStudentMembers />}

            </div>
        </div>
    );
};

export default EHaCs;