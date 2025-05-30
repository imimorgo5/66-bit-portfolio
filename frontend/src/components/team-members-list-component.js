import React, { useContext } from 'react';
import { getFullName } from '../utils/file.js';
import { AuthContext } from '../context/AuthContext.js';
import userIcon from '../img/user-icon.svg';
import adminIcon from '../img/admin-icon.svg';
import '../css/team-members-list-component.css'

export default function TeamMembersList({ editable = false, team, editData, onRoleChange, onRemoveClick, className = '' }) {
    const { user } = useContext(AuthContext);
    const members = editable ? editData.members : team.persons;
    const sortedMembers = [...members].sort((a, b) => {
        if (a.id === team.adminId) return -1;
        if (b.id === team.adminId) return 1;
        return 0;
    });
    return (
        <div className={`team-members ${className} ${editable ? 'edit' : ''}`}>
            {!editable && <h1 className="link team-title">{team.title}</h1>}
            <ul className="team-members-list">
                {sortedMembers.map(member => (
                    <li key={member.id} className="team-members-list-item">
                        <div className='team-members-item-container'>
                            <img
                                src={member.imageName ? getFullName(member.imageName) : userIcon}
                                alt="Фото пользователя"
                                className="team-member-photo"
                            />
                            <div className="team-member-info-container">
                                <div className="team-member-name-container">
                                    <h2 className="team-member-username">{member.username}</h2>
                                    {member.id === team.adminId && <img src={adminIcon} alt="Иконка админа" className="admin-icon" />}
                                </div>
                                {member.role && <h3 className="team-member-role">{member.role}</h3>}
                            </div>
                        </div>
                        {editable &&
                            <div className="member-edit-role-container">
                                <input
                                    type="text"
                                    value={editData.roles[member.id] || ''}
                                    className={`text-input member-edit-role-input ${member.id === team.adminId ? 'my-role' : ''}`}
                                    onChange={e => onRoleChange(e, member)}
                                    maxLength={20}
                                    placeholder="Введите роль участника"
                                />
                                {member.id !== user.id && <button onClick={() => onRemoveClick(member)} className="remove-button">×</button>}
                            </div>
                        }
                    </li>
                ))}
            </ul>
            {(editable && editData.invited.length > 0) &&
                <div className="invited-persons-section">
                    <h1 className='team-invited-title'>Приглашенные пользователи</h1>
                    <ul className="team-invited-list">
                        {editData.invited.map(inv => (
                            <li key={inv.id} className="team-invited-item">
                                <img src={inv.imageName ? getFullName(inv.imageName) : userIcon} className="team-member-photo" alt="" />
                                <h2 className='team-member-username'>{inv.username}</h2>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}