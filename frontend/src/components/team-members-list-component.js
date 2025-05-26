import React from 'react';
import userIcon from '../img/user-icon.svg';
import adminIcon from '../img/admin-icon.svg';
import '../css/team-members-list-component.css'

export default function TeamMembersList({ team, className = '' }) {
    const sortedMembers = [...team.persons].sort((a, b) => {
        if (a.personId === team.adminId) return -1;
        if (b.personId === team.adminId) return 1;
        return 0;
    });
    return (
        <div className={`team-members ${className}`}>
            <h1 className="link team-title">{team.title}</h1>
            <ul className="team-members-list">
                {sortedMembers.map(member => (
                    <li key={member.personId} className="team-members-list-item">
                        <img
                            src={member.imageName ? `http://localhost:8080/uploads/${member.imageName}` : userIcon}
                            alt="Фото пользователя"
                            className="team-member-photo"
                        />
                        <div className="team-member-info-container">
                            <div className="team-member-name-container">
                                <h2 className="team-member-username">{member.username}</h2>
                                {member.personId === team.adminId && <img src={adminIcon} alt="Иконка админа" className="admin-icon" />}
                            </div>
                            {member.role && <h3 className="team-member-role">{member.role}</h3>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}