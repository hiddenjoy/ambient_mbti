import React from 'react';

function UserProfile({ user }) {
  return (
    <div className="p-4 bg-yellow-100 rounded shadow-lg m-4">
      <p><strong>Email: </strong>{user.email}</p>
      <p><strong>Name: </strong>{user.name || 'Not provided'}</p>
      <p><strong>MBTI: </strong>{user.mbti || 'Not provided'}</p>
      <p><strong>Interested MBTI: </strong>{user.interestedMbti || 'Not provided'}</p>
    </div>
  )
}

export default UserProfile;
