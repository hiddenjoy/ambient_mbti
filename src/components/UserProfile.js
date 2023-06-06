const UserProfile = ({ user }) => {
  if (!user) {
    return null;
  }
  
  return (
  <div class="flex justify-center px-12 bg-white dark:bg-gray-950">
  <div class="h-50 w-50 rounded-3xl p-px bg-gradient-to-b from-green-300 to-yellow-300 dark:from-blue-800 dark:to-purple-800 ">
    <div class="rounded-[calc(1.5rem-1px)] p-10 bg-white dark:bg-gray-900">
      <p class="text-gray-700 dark:text-gray-300">"사전질문대답"</p>
      <div class="mt-4 flex gap-2 items-center">
        <img class="h-10 w-10 rounded-full" src="{user.photoURL}" alt="profile" />
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-white">{user.name}</h3>
          <span class="text-sm tracking-wide text-gray-600 dark:text-gray-400">{user.mbti}</span>
        </div>
      </div>
    </div>
  </div>
</div>
  )
};

export default UserProfile;